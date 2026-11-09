console.log("===== PARTE 1 =====");

const pedidos = [
  { cliente: "Bia", valor: 120, status: "pago" },
  { cliente: "", valor: 50, status: "pago" },
  { cliente: "Caio", valor: -10, status: "pago" },
  { cliente: "Duda", valor: 80.5, status: "pendente" },
  { cliente: "Edu", valor: "abc", status: "pago" },
  { cliente: "Fabi", valor: 200, status: "pago" }
];

const pedidosValidos = pedidos.filter((pedido) => {
  return pedido.cliente.trim() !== "" && typeof pedido.valor === "number" && pedido.valor > 0;
});
console.log("Pedidos válidos:", pedidosValidos);

const pedidosPagos = pedidosValidos.filter((pedido) => pedido.status === "pago");
console.log("Pedidos pagos:", pedidosPagos);

const totalFaturado = pedidosPagos.reduce((total, pedido) => total + pedido.valor, 0);
console.log("Total faturado:", totalFaturado);

const textosPedidos = pedidosPagos.map((pedido) => {
  return `${pedido.cliente} — R$ ${pedido.valor.toFixed(2)}`;
});
textosPedidos.forEach((texto) => console.log(texto));

const formCep = document.querySelector("#form-cep");
const campoCep = document.querySelector("#cep");
const botaoCep = document.querySelector("#btn-cep");
const statusCep = document.querySelector("#status-cep");
const resultadoCep = document.querySelector("#resultado-cep");
const historicoCep = document.querySelector("#historico-cep");

const historico = [];

function mostrarStatus(elemento, mensagem, tipo = "") {
  elemento.textContent = mensagem;
  elemento.className = tipo ? `status ${tipo}` : "status";
}

function adicionarLinha(lista, titulo, valor) {
  const dt = document.createElement("dt");
  dt.textContent = titulo;
  const dd = document.createElement("dd");
  dd.textContent = valor;
  lista.append(dt, dd);
}

function atualizarHistorico() {
  historicoCep.replaceChildren();
  historico.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.cep} - ${item.cidade}/${item.uf}`;
    historicoCep.append(li);
  });
}

async function buscarCep(cep) {
  mostrarStatus(statusCep, "Buscando...");
  botaoCep.disabled = true;
  resultadoCep.replaceChildren();

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const dados = await response.json();

    if (dados.erro) {
      mostrarStatus(statusCep, "CEP não encontrado", "vazio");
      return;
    }

    resultadoCep.replaceChildren();
    adicionarLinha(resultadoCep, "Rua", dados.logradouro);
    adicionarLinha(resultadoCep, "Bairro", dados.bairro);
    adicionarLinha(resultadoCep, "Cidade", dados.localidade);
    adicionarLinha(resultadoCep, "UF", dados.uf);
    mostrarStatus(statusCep, "");

    historico.push({ cep: cep, cidade: dados.localidade, uf: dados.uf });
    atualizarHistorico();
  } catch (erro) {
    console.log("Erro na busca de CEP:", erro);
    if (erro.name === "TimeoutError") {
      mostrarStatus(statusCep, "A busca demorou demais. Tente novamente.", "erro");
    } else {
      mostrarStatus(statusCep, "Falha na conexão. Tente novamente.", "erro");
    }
  } finally {
    botaoCep.disabled = false;
  }
}

formCep.addEventListener("submit", (e) => {
  e.preventDefault();

  const cep = campoCep.value.trim();

  if (!/^\d{8}$/.test(cep)) {
    mostrarStatus(statusCep, "CEP inválido. Digite exatamente 8 números.", "erro");
    resultadoCep.replaceChildren();
    return;
  }

  buscarCep(cep);
});

const formPokemon = document.querySelector("#form-pokemon");
const campoPokemon = document.querySelector("#pokemon");
const botaoPokemon = document.querySelector("#btn-pokemon");
const statusPokemon = document.querySelector("#status-pokemon");
const resultadoPokemon = document.querySelector("#resultado-pokemon");

async function buscarPokemon(nome) {
  mostrarStatus(statusPokemon, "Buscando...");
  botaoPokemon.disabled = true;
  resultadoPokemon.replaceChildren();

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`, {
      signal: AbortSignal.timeout(5000)
    });

    if (response.status === 404) {
      mostrarStatus(statusPokemon, "Pokémon não encontrado", "vazio");
      return;
    }

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const dados = await response.json();

    const titulo = document.createElement("h3");
    titulo.textContent = dados.name;

    const imagem = document.createElement("img");
    imagem.src = dados.sprites.front_default;
    imagem.alt = dados.name;

    const tipos = document.createElement("p");
    const nomesTipos = dados.types.map((item) => item.type.name);
    tipos.textContent = `Tipos: ${nomesTipos.join(", ")}`;

    resultadoPokemon.replaceChildren(titulo, imagem, tipos);
    mostrarStatus(statusPokemon, "");
  } catch (erro) {
    console.log("Erro na busca de Pokémon:", erro);
    if (erro.name === "TimeoutError") {
      mostrarStatus(statusPokemon, "A busca demorou demais. Tente novamente.", "erro");
    } else {
      mostrarStatus(statusPokemon, "Falha na conexão. Tente novamente.", "erro");
    }
  } finally {
    botaoPokemon.disabled = false;
  }
}

formPokemon.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = campoPokemon.value.trim().toLowerCase();

  if (nome === "") {
    mostrarStatus(statusPokemon, "Digite o nome de um Pokémon.", "erro");
    resultadoPokemon.replaceChildren();
    return;
  }

  buscarPokemon(nome);
});
