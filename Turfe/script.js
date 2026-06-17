 function iniciar() {
    window.location.href = "./config.html";
  }

  let mensagem = "";

  let listaCavalos = [];

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
      if (qtdAdd == qtdCavalos) {
          window.location.href = "./corrida.html";
          return;
        } else if(qtdAdd < qtdCavalos){
            qtdAdd++;
            spanQtd.innerText = qtdAdd;
            let nomeCavalo = ipt_nomeC.value;
            listaCavalos.push({
            nome: nomeCavalo,
            tempo: 0,
            tempoTotal: 0,
          });
        }

    
  }

  function voltas() {
    let voltas = 0;

    for (let i = 0; i < 7; i++) {
      voltas++;

      mensagem += `Volta ${voltas} <br>`
      for (let y = 0; y < listaCavalos.length; y++) {
        let cavalo = listaCavalos[y];
        let tempo = tempoVolta();
        cavalo.tempo = tempo;
        cavalo.tempoTotal += Number(tempo);

        mensagem += `
    ${cavalo.nome} – ${cavalo.tempo} – ${cavalo.tempoTotal.toFixed(1)} <br>
    `;
      }
    }
    let lista = listaCavalos[0]

    let p1 = listaCavalos[0];
    let p2 = null;
    let p3 = null;

    for (let i = 1; i < listaCavalos.length; i++) {
      let atual = listaCavalos[i];

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
    mensagem += `
    P1: ${p1.nome} - Tempo: ${p1.tempoTotal.toFixed(1)}<br>
    P2: ${p2.nome} - Tempo: ${p2.tempoTotal.toFixed(1)}<br>
    P3: ${p3.nome} - Tempo: ${p3.tempoTotal.toFixed(1)}<br>`

    div_mensagem.innerHTML = mensagem;
  }

  function tempoVolta() {
    let numeroAleatorio = (Math.random() * 2 + 7).toFixed(1);
    return numeroAleatorio;
  }