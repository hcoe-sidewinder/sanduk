var admin = require("firebase-admin");

var serviceAccount = require("../sanduk-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
