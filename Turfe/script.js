function iniciar() {
  localStorage.clear();
  window.location.href = "./config.html";
}

let listaCavalos = [];
let listaVencedores = []

let qtdCavalos = 0;

function continuar() {
  qtdCavalos = Number(select_qtdCavalo.value);

  divConfig.innerHTML = `<h3>Insira o nome <br>
        do <span id="spanQtd">1</span>° cavalo</h3>
        <input type="text" id="ipt_nomeC" placeholder="Insira o nome do cavalo" />
        `;
  divConfig.innerHTML += `<button onclick="adicionar()" id="btn_continuar">Adicionar Cavalo</button>`
  spanQtd.innerText = `${qtdAdd}`;
}


let qtdAdd = 1;
function adicionar() {
  let nomeCavalo = ipt_nomeC.value;

  listaCavalos.push({
    nome: nomeCavalo,
    tempo: 0,
    tempoTotal: 0,
    posicao: 0
  });

  qtdAdd++;
  
  if (qtdAdd > qtdCavalos) {
    localStorage.setItem("cavalos", JSON.stringify(listaCavalos));
    window.location.href = "./corrida.html";
    return;
  }
  ipt_nomeC.value = "";
  spanQtd.innerText = qtdAdd;
}

function tempoVolta() {
  let numeroAleatorio = (Math.random() * 2 + 7).toFixed(1);
  return numeroAleatorio;
}


listaCavalos = JSON.parse(localStorage.getItem("cavalos")) || [];

let pista = document.getElementById("pista");


for (let i = 0; i < listaCavalos.length; i++) {
  pista.innerHTML += `
      <div class="lane">
        <div class="cavalo" id="c${i}">
          <img src="./img/cavalo${i}.png">
          ${listaCavalos[i].nome}
        </div>
      </div>
    `;
}


var voltaAtual = 0;


document.getElementById("voltaAtual").innerText = voltaAtual;

const posicaoMaxima = window.innerWidth - 100;  // para nao deixar que os cavalos passem da tela deixando um gap de 100px

function proximaVolta() {
  if (voltaAtual >= 7) {
    atualizarPista()
    clearInterval(intervaloCorrida);
    localStorage.setItem("cavalos", JSON.stringify(listaCavalos));
    localStorage.setItem("vencedores", JSON.stringify(listaVencedores));
    alert("Corrida finalizada");
    setTimeout(() => {
      window.location.href = "./resultados.html";
    }, 3000);
    return;
  }

  voltaAtual++;
  document.getElementById("voltaAtual").innerText = voltaAtual;

  for (let i = 0; i < listaCavalos.length; i++) {
    let tempo = Number(tempoVolta());

    listaCavalos[i].tempo = tempo;
    listaCavalos[i].tempoTotal += tempo;

    let pista = document.getElementById("pista");
    /* a do pos basicamente transforma o tempo em posicao para qie ps cavalos andem na tela 
    pos = tempoTotal × largura total / partes da pista 
    (o "partes da pista" seria basicamente como dividir os 1920px de largura da pista por 60 que daria 32px, ou seja quanto maior a divisao menos o cavalo anda)
    */
    let pos = listaCavalos[i].tempoTotal * (pista.offsetWidth / 60);

    listaCavalos[i].posicao = Math.min(pos, posicaoMaxima); // pega o menor valor, estao se a pos passar de 1820px ele vai pegar a referencia o posicaoMaxima
  }

  atualizarPista();
}

function atualizarPista() {
  for (let i = 0; i < listaCavalos.length; i++) {
    document.getElementById(`c${i}`).style.left = `${listaCavalos[i].posicao}px`;
  }

  let menorTempo = listaCavalos[0].tempoTotal;

  for (let i = 1; i < listaCavalos.length; i++) {
    if (listaCavalos[i].tempoTotal < menorTempo) {
      menorTempo = listaCavalos[i].tempoTotal;
    }
  }

  for (let i = 0; i < listaCavalos.length; i++) {
    let diferenca = (
      listaCavalos[i].tempoTotal - menorTempo
    ).toFixed(1);
  }

  let p1 = listaCavalos[0];
  let p2 = null;
  let p3 = null;

  for (let i = 0; i < listaCavalos.length; i++) {
    let atual = listaCavalos[i];
    atual.id = i;

    if (atual.tempoTotal < p1.tempoTotal) {
      p3 = p2;
      p2 = p1;
      p1 = atual;
    }
    else if (p2 == null || atual.tempoTotal < p2.tempoTotal) {
      p3 = p2;
      p2 = atual;
    }
    else if (p3 == null || atual.tempoTotal < p3.tempoTotal) {
      p3 = atual;
    }
  }

  listaVencedores = [];
  listaVencedores.push({
    nome: p1.nome,
    tempoFeito: p1.tempoTotal.toFixed(1),
    id: p1.id
  },
    {
      nome: p2.nome,
      tempoFeito: p2.tempoTotal.toFixed(1),
      id: p2.id
    },
    {
      nome: p3.nome,
      tempoFeito: p3.tempoTotal.toFixed(1),
      id: p3.id
    },
  )
}

let contagem = 4;
let intervaloCorrida = null;

const intervalo = setInterval(() => {
  contagem--;

  const elemento = document.getElementById("contador");
  const container = document.getElementById("contagem");

  if (contagem > 0) {
    elemento.innerText = contagem;
  } else {
    elemento.style.left = "65%";
    elemento.innerText = "GO!";
    clearInterval(intervalo);

    setTimeout(() => {
      container.style.display = "none";
      proximaVolta();
      intervaloCorrida = setInterval(() => {
        proximaVolta();
      }, 2000);

    }, 1000);
  }

}, 1000);

function podio() {
  let posicaoPodio = JSON.parse(localStorage.getItem("vencedores"));

  let podioDiv = document.getElementById("podio");

  podioDiv.innerHTML = "";

  if (posicaoPodio.length > 0) {
    podioDiv.innerHTML += `
      <div id="p1">
        <img src="img/cavalo${posicaoPodio[0].id}.png" width="350px">
        <div id="textoP1">
        <span>Nome: ${posicaoPodio[0].nome}</span>
        <span>Tempo: ${posicaoPodio[0].tempoFeito}</span>
        </div>
      </div>
      <div id="p2">
        <img src="img/cavalo${posicaoPodio[1].id}.png" width="350px">
        <div id="textoP2">
        <span>Nome: ${posicaoPodio[1].nome}</span>
        <span>Tempo: ${posicaoPodio[1].tempoFeito}</span>
        </div>
      </div>
      <div id="p3">
        <img src="img/cavalo${posicaoPodio[2].id}.png" width="350px">
        <div id="textoP3">
        <span>Nome: ${posicaoPodio[2].nome}</span>
        <span>Tempo: ${posicaoPodio[2].tempoFeito}</span>
        </div>
      </div>
    `;
  }

  let listaCavalos = JSON.parse(localStorage.getItem("cavalos")) || [];

  let tabelaDiv = document.getElementById("tabelaResultados");

  let tabelaHTML = `
  <h2>Resumo da corrida</h2>
  <table>
    <tr>
      <th>Posição</th>
      <th>Nome</th>
      <th>Tempo total</th>
    </tr>
`;

  for (let i = 0; i < listaCavalos.length; i++) {
    tabelaHTML += `
    <tr>
      <td>${i + 1}</td>
      <td>${listaCavalos[i].nome}</td>
      <td>${Number(listaCavalos[i].tempoTotal).toFixed(1)}</td>
    </tr>
  `;
  }

  tabelaHTML += `
  </table>
`;

  tabelaDiv.innerHTML = tabelaHTML;
}