function Utils() {}

Utils.prototype.somarHora = function(hrA, hrB) {
  if (hrA.length != 5 || hrB.length != 5) return '00:00';

  temp = 0;
  nova_h = 0;
  novo_m = 0;

  hora1 = hrA.substr(0, 2) * 1;
  hora2 = hrB.substr(0, 2) * 1;
  minu1 = hrA.substr(3, 2) * 1;
  minu2 = hrB.substr(3, 2) * 1;

  temp = minu1 + minu2;
  while (temp > 59) {
    nova_h++;
    temp = temp - 60;
  }
  novo_m = temp.toString().length == 2 ? temp : '0' + temp;

  temp = hora1 + hora2 + nova_h;
  while (temp > 23) {
    temp = temp - 24;
  }
  nova_h = temp.toString().length == 2 ? temp : '0' + temp;

  return nova_h + ':' + novo_m;
};

Utils.prototype.formatarHoras = function(horas, minutos) {
  let novaHoras = horas;
  let novoMinutos = minutos;
  if (horas < 12) {
    novaHoras = `0${novaHoras}`;
  }

  if (minutos < 10) {
    novoMinutos = `0${novoMinutos}`;
  }

  return novaHoras + ':' + novoMinutos;
};

module.exports = function() {
  return Utils;
};
