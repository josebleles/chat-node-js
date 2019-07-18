const express = require("express");
const os = require("os");
const bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

let chat = [];

app.post("/receber-mensagem", (rq, rs) => {
  rs.setHeader("Access-Control-Allow-Origin", "*");
  var d = new Date();
  chat.push({
    mensagem: rq.body.mensagem,
    remetente: rq.body.nome,
    datahora:
      addZero(d.getDate()) +
      "/" +
      addZero(d.getMonth()) +
      "/" +
      d.getFullYear() +
      " " +
      addZero(d.getHours()) +
      ":" +
      addZero(d.getMinutes())
  });
  console.log(rq.body.nome + ": " + rq.body.mensagem);
  rs.end(JSON.stringify({ ok: true, mensagem: "sem erros" }));
});

function addZero(numer) {
  return numer < 10 ? "0" + numer : numer;
}

app.get("/listar-mensagem", (rq, rs) => {
  rs.setHeader("Access-Control-Allow-Origin", "*");
  rs.end(JSON.stringify(chat));
});

var getLocalConnection = () => {
  let interfaces = os.networkInterfaces();
  return interfaces["Conexão local"][1]["address"];
};

const porta = 6661;
app.listen(porta, getLocalConnection(), () => {
  console.log("publicado no http://" + getLocalConnection() + ":" + porta);
});
