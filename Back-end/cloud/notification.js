async function createNotification(user, message) {
    const Notification = Parse.Object.extend("Notification");
    const notification = new Notification();
  
    notification.set("user", user);
    notification.set("message", message);
    notification.set("read", false);
  
    const acl = new Parse.ACL(user);
    notification.setACL(acl);
  
    return await notification.save(null, { sessionToken: user.getSessionToken() });
  }
  
  module.exports = { createNotification };