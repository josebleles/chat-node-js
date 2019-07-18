const express = require("express");
const os = require("os");
const read = require("readline");
const httpSender = require("http");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json({ extended: true }));

app.post("/receber-mensagem", (rq, rs) => {
  console.log("\nBruno: " + rq.body.mensagem);
  rs.end(JSON.stringify({ ok: true }));
});

var getLocalConnection = () => {
  let interfaces = os.networkInterfaces();
  return interfaces["Conexão local"][1]["address"];
};

const porta = 3332;
app.listen(porta, getLocalConnection(), () => {
  console.log("publicado no http://" + getLocalConnection() + ":" + porta);

  const ler = () => {
    const leitor = read.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    leitor.question("", mensagemAEnviar => {
      // TODO: Enviar
      let opcoes = {
        host: "172.28.10.28",
        port: 1242,
        path: "/receber-mensagem",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      };
      let requisicao = httpSender.request(opcoes);
      requisicao.write(JSON.stringify({ mensagem: mensagemAEnviar }));
      requisicao.end();
      leitor.close();
      ler();
    });
  };
  ler();
});
