var express = require('./config/express');
var app = express();
var porta = process.env.PORT || 3000;

app.listen(porta, function() {
  console.log('Servidor rorando na porta ' + this.porta);
});
