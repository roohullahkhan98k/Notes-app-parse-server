const { requireUser, getNoteById, requireAdmin } = require("./auth");
const { createNotification } = require("./notification");
const { sendMail } = require("./mailer");

Parse.Cloud.define("getNotes", async (request) => {
  const user = requireUser(request);

  const Note = Parse.Object.extend("Note");

  const ownNotesQuery = new Parse.Query(Note);
  ownNotesQuery.equalTo("user", user);

  const sharedNotesQuery = new Parse.Query(Note);
  sharedNotesQuery.equalTo("collaborators", user);

  const query = Parse.Query.or(ownNotesQuery, sharedNotesQuery);
  query.include("user");
  query.include("collaborators");
  query.descending("createdAt");

  return await query.find({ sessionToken: user.getSessionToken() });
});

Parse.Cloud.define("shareNote", async (request) => {
  const { noteId, email } = request.params;
  const user = requireUser(request);

  const note = await getNoteById(noteId, user);

  if (note.get("user").id !== user.id) {
    throw new Error("Only the owner can share notes.");
  }

  const userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo("email", email);
  const collaborator = await userQuery.first({ useMasterKey: true });

  if (!collaborator) throw new Error("Collaborator not found.");

  note.addUnique("collaborators", collaborator);

  const acl = note.getACL() || new Parse.ACL(user);
  acl.setReadAccess(collaborator, true);
  note.setACL(acl);

  await note.save(null, { sessionToken: user.getSessionToken() });
  const notificationMessage = `Note "${note.get("title")}" is shared with you by ${user.get("username")}`;
  await createNotification(collaborator, notificationMessage);

  return "Note shared successfully";
});

Parse.Cloud.define("saveNote", async (request) => {
  const { title, content, noteId } = request.params;
  const user = requireUser(request);

  const Note = Parse.Object.extend("Note");
  let note;
  let isUpdate = false;

  if (noteId) {
    note = await getNoteById(noteId, user);
    isUpdate = true;
  } else {
    note = new Note();
    note.set("user", user);
    note.setACL(new Parse.ACL(user));
  }

  note.set("title", title);
  note.set("content", content);
  await note.save(null, { sessionToken: user.getSessionToken() });

  const message = isUpdate ? `Note updated: ${title}` : `Note added: ${title}`;
  await createNotification(user, message);

  return note;
});

Parse.Cloud.define("deleteNote", async (request) => {
  const { noteId } = request.params;
  const user = requireUser(request);

  const note = await getNoteById(noteId, user);
  const title = note.get("title");
  await note.destroy({ sessionToken: user.getSessionToken() });

  await createNotification(user, `Note deleted: ${title}`);
  return "Deleted";
});






//admin module 
Parse.Cloud.define("adminFunction", async (request) => {
  const user = requireUser(request);
  requireAdmin(user);
});
//function to get all users for admin
Parse.Cloud.define("getAllUsers", async (request) => {
  const user = requireUser(request);
  requireAdmin(user);

  const query = new Parse.Query(Parse.User);
  query.notEqualTo("role", "admin");
  const users = await query.find({ useMasterKey: true });
  const totalCount = users.length;
  
  return {
    users: users.map((user) => ({
      id: user.id,
      username: user.get("username") || user.get("email"), 
      email: user.get("email"),
      suspended: user.get("suspended") || false,
    })),
    totalCount: totalCount
  };
});
//fucntion to get users notes for admin for specific user
Parse.Cloud.define("getUserNotes", async (request) => {
  const { userId } = request.params;
  const Note = Parse.Object.extend("Note");

  const ownNotesQuery = new Parse.Query(Note);
  ownNotesQuery.equalTo("user", { __type: "Pointer", className: "_User", objectId: userId });

  const sharedNotesQuery = new Parse.Query(Note);
  sharedNotesQuery.equalTo("collaborators", { __type: "Pointer", className: "_User", objectId: userId });

  const query = Parse.Query.or(ownNotesQuery, sharedNotesQuery);
  query.include("user"); 
  query.include("collaborators"); 
  query.descending("createdAt");

  return await query.find({ useMasterKey: true });
});

//function to get all notes for admin
Parse.Cloud.define("getTotalNotes", async (request) => {
  const noteQuery = new Parse.Query("Note");
  const totalNotesCount = await noteQuery.count({ useMasterKey: true });
  
  return totalNotesCount;
});


Parse.Cloud.define("suspendUser", async (request) => {
  const userId = request.params.userId;
  const user = await new Parse.Query(Parse.User).get(userId, { useMasterKey: true });
  user.set("suspended", true);
  await user.save(null, { useMasterKey: true });

  try {
    await sendMail(user.get("email"), 'Account Suspended', 'Your account has been suspended by the admin. Please contact admin to reactivate it.');
    return "User suspended successfully and email sent.";
  } catch (error) {
    return "User suspended successfully but email could not be sent.";
  }
});

Parse.Cloud.define("reactivateUser", async (request) => {
  const userId = request.params.userId;
  const user = await new Parse.Query(Parse.User).get(userId, { useMasterKey: true });
  user.set("suspended", false);
  await user.save(null, { useMasterKey: true });

  try {
    await sendMail(user.get("email"), 'Account Reactivated', 'Your account has been reactivated by the admin.');
    return "User reactivated successfully and email sent.";
  } catch (error) {
    return "User reactivated successfully but email could not be sent.";
  }
});

//grtting the number of suspended users and active users
Parse.Cloud.define("getUserStats", async (request) => {
  const user = requireUser(request);
  requireAdmin(user);

  const query = new Parse.Query(Parse.User);
  query.notEqualTo("role", "admin");

  const totalUsers = await query.count({ useMasterKey: true });
  const activeUsers = await query.equalTo("suspended", false).count({ useMasterKey: true });
  const suspendedUsers = await query.equalTo("suspended", true).count({ useMasterKey: true });

  return {
    totalUsers,
    activeUsers,
    suspendedUsers,
  };
});


//login sign up function
Parse.Cloud.define("signup", async (request) => {
  const { email, password } = request.params;

  const user = new Parse.User();
  user.set("username", email);
  user.set("email", email);
  user.set("password", password);
  user.set("role", "user"); 
  user.set("suspended", false);

  try {
    const newUser = await user.signUp();
    return {
      message: "Signup successful",
      sessionToken: newUser.getSessionToken(),
      user: {
        id: newUser.id,
        email: newUser.get("email"),
      },
    };
  } catch (err) {
    throw new Error("Signup failed: " + err.message);
  }
});
Parse.Cloud.define("login", async (request) => {
  const { email, password } = request.params;

  try {
    const user = await Parse.User.logIn(email, password);
    if (user.get("suspended")) {
      throw new Error("Your account is suspended. Please contact the admin to reactivate it.");
    }
    return {
      message: "Login successful",
      sessionToken: user.getSessionToken(),
      user: {
        id: user.id,
        email: user.get("email"),
        role: user.get("role"),
      },
    };
  } catch (err) {
    throw new Error("Login failed: " + err.message);
  }
});


