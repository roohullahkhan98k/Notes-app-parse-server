function requireUser(request) {
    const user = request.user;
    if (!user) throw new Error("Unauthorized");
    return user;
  }

  function requireAdmin(user) {
    if (user.get("role") !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }
  }
  
  async function getNoteById(noteId, user) {
    
    const Note = Parse.Object.extend("Note");
    const query = new Parse.Query(Note);
    const note = await query.get(noteId, { sessionToken: user.getSessionToken() });
  
    const owner = note.get("user");
    const collaborators = note.get("collaborators") || [];
  
    const isOwner = owner.id === user.id;
    const isCollaborator = collaborators.some((c) => c.id === user.id);
  
    if (!isOwner && !isCollaborator) {
      throw new Error("Not authorized to view this note!");
    }
  
    return note;
  }  


  module.exports = {
    requireUser,
    getNoteById,
    requireAdmin,
  };
  

