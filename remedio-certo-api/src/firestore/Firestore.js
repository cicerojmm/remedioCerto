function Firestore(documento, nome) {
  if (documento && nome) {
    this.referenciaDocumento = documento.collection('medicamentos').doc(nome);
  } else if (documento) {
    this.referenciaDocumento = documento.collection('medicamentos');
  }
}

Firestore.prototype.salvar = function(dados) {
  this.referenciaDocumento.set(dados);
};

Firestore.prototype.listar = function(db, callback) {
  db.collection('medicamentos')
    .get()
    .then(snapshot => {
      callback(snapshot);
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
};

Firestore.prototype.consultar = function(db, documento, callback) {
  this.referenciaDocumento
    .get()
    .then(doc => {
      callback(doc);
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
};

Firestore.prototype.listarComFiltroDeStatus = function(db, callback) {
  db.collection('medicamentos')
    .where('status', '==', 'true')
    .get()
    .then(doc => {
      callback(doc);
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
};

Firestore.prototype.atualizarStatusDocumento = function(db, valor) {
  return this.referenciaDocumento
    .update({
      status: valor,
    })
    .then(function() {
      console.log('Document successfully updated!');
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error('Error updating document: ', error);
    });
};

Firestore.prototype.atualizarHorarioDocumento = function(db, novoHorario) {
  return this.referenciaDocumento
    .update({
      proximoHorario: novoHorario,
    })
    .then(function() {
      console.log('Document successfully updated!');
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error('Error updating document: ', error);
    });
};
module.exports = function() {
  return Firestore;
};
