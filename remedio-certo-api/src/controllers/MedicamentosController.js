module.exports = function(app) {
  app.get('/', (request, response) => {
    response.send('API Remédio Certo online 1.0');
  });

  app.post('/medicamentos', (request, response) => {
    const medicamento = request.body;
    const database = app.src.firestore.ConfiguracaoFirestore();
    const firestore = new app.src.firestore.Firestore(
      database,
      medicamento.nome
    );

    firestore.salvar(medicamento);

    response.status(201).json({ msg: 'criado com sucesso' });
  });

  app.get('/medicamentos', (request, response) => {
    const database = app.src.firestore.ConfiguracaoFirestore();
    const firestore = new app.src.firestore.Firestore(null, null);

    var arrayRetorno = [];

    firestore.listar(database, dados => {
      dados.forEach(doc => {
        arrayRetorno.push(doc.data());
      });

      response.status(200).json(arrayRetorno);
    });
  });

  app.get('/medicamentos/:documento', (request, response) => {
    const documento = request.params.documento;
    const database = app.src.firestore.ConfiguracaoFirestore();
    const firestore = new app.src.firestore.Firestore(database, documento);

    firestore.consultar(firestore, documento, dado => {
      var retorno = [];
      if (dado.exists) {
        retorno = dado.data();
      }

      response.status(200).json(retorno);
    });
  });

  app.get('/validos', (request, response) => {
    const database = app.src.firestore.ConfiguracaoFirestore();
    const firestore = new app.src.firestore.Firestore(null, null);
    const utils = new app.src.services.Utils();

    firestore.listarComFiltroDeStatus(database, dados => {
      var arrayRetorno = [];
      dados.forEach(doc => {
        let dadosFirestore = doc.data();
        const firestore = new app.src.firestore.Firestore(
          database,
          dadosFirestore.nome
        );
        const now = new Date();
        const dataAtual = new Date(
          `${now.getFullYear()}-${parseInt(now.getMonth()) +
            1}-${now.getDate()}`
        );
        let dataFim = new Date(dadosFirestore.dataFim);
        let dataInicio = new Date(dadosFirestore.dataInicio);
        let horaAtual = utils.formatarHoras(now.getHours(), now.getMinutes());

        if (dataAtual >= dataInicio && dataAtual <= dataFim) {
          if (horaAtual == dadosFirestore.proximoHorario) {
            let resultado = utils.somarHora(
              dadosFirestore.horaInicio,
              dadosFirestore.intervaloHoras
            );

            firestore.atualizarHorarioDocumento(database, resultado);
            arrayRetorno.push(dadosFirestore);
          }
        } else {
          firestore.atualizarStatusDocumento(database, 'false');
        }
      });

      response.status(200).json(arrayRetorno);
    });
  });
};
