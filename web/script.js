var listaNaTela = [];
var nome = prompt("qual seu nome?");

$(document).ready(() => {
  $("#container-escreva input").keydown(evento => {
    if (evento.keyCode == 13) $("#send-message").click();
  });
  $("#send-message").click(() => {
    var enviar = $("#container-escreva input").val();
    if (enviar != "") {
      $("#container-escreva input").val("");
      $.ajax({
        url: "http://172.28.10.112:6661/receber-mensagem",
        type: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify({
          mensagem: enviar,
          nome: nome
        })
      });
    }
  });
  setInterval(lerMensagens, 500);
});

function filtrarPorMensagem(campo) {
  setTimeout(() => {
    console.log("aaaa");
    if ($(campo).val() == "") {
      console.log("aaaa if");
      $("#chatzao").html("");
      $.each(listaNaTela, (pos, mensagem) => {
        adicionarMensagemNaTela(
          mensagem.remetente,
          mensagem.mensagem,
          mensagem.datahora,
          mensagem.remetente == nome
        );
      });
      $("#chatzao").scrollTop($("#chatzao")[0].scrollHeight);
    } else {
      console.log("aaaa else");
      var ultimoElementoEncontrado = null;
      $("#chatzao .mensagem .texto").each((pos0, element0) => {
        if (
          $(element0)
            .text()
            .includes($(campo).val())
        ) {
          //scroll ate o elemento
          ultimoElementoEncontrado = { element: element0, pos: pos0 };
        }
      });
      if (ultimoElementoEncontrado != null) {
        $(ultimoElementoEncontrado.element).html(
          ($(ultimoElementoEncontrado.element).html() + "").replace(
            $(campo).val(),
            "<b>" + $(campo).val() + "</b>"
          )
        );
        $("#chatzao")
          .stop()
          .scrollTo(
            "div.mensagem:eq(" + ultimoElementoEncontrado.pos + ")",
            {}
          );
      }
    }
  }, 300);
}

function adicionarMensagemNaTela(nome, mensagem, hora, ehMinha) {
  if (!ehMinha) {
    $("#chatzao").append(
      "<div class='mensagem'> <div class='head'>" +
        nome +
        "</div><div class='texto'>" +
        mensagem +
        "</div><div class='hora'>" +
        hora +
        " </div>" +
        "</div>"
    );
  } else {
    $("#chatzao").append(
      "<div class='mensagem minha-mensagem'> <div class='head'>" +
        nome +
        "</div><div class='texto'>" +
        mensagem +
        "</div><div class='hora'>" +
        hora +
        " </div>" +
        "</div>"
    );
  }
}

function lerMensagens() {
  $.ajax({
    url: "http://172.28.10.112:6661/listar-mensagem",
    dataType: "json",
    success: retorno => {
      if (JSON.stringify(retorno) != JSON.stringify(listaNaTela)) {
        $("#chatzao").html("");
        listaNaTela = retorno;
        $.each(retorno, (pos, mensagem) => {
          adicionarMensagemNaTela(
            mensagem.remetente,
            mensagem.mensagem,
            mensagem.datahora,
            mensagem.remetente == nome
          );
        });
        $("#chatzao").scrollTop($("#chatzao")[0].scrollHeight);
      }
    }
  });
}
