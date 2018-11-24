const admin = require('firebase-admin');
var serviceAccount = require('./keyFile.json');

function ConfiguracaoFirestore() {
  if (admin.apps.length == 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    admin.firestore().settings({ timestampsInSnapshots: true });
  }

  const db = admin.firestore();
  return db;
}

module.exports = function() {
  return ConfiguracaoFirestore;
};
