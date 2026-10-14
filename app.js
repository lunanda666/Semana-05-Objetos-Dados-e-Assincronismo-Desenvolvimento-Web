
/* =========================================
   PARTE 1 - MANIPULAÇÃO E VALIDAÇÃO DE DADOS
========================================= */

const pedidos = [
    { cliente: "Bia", valor: 120, status: "pago" },
    { cliente: "Caio", valor: 75.50, status: "pago" },
    { cliente: "Duda", valor: 0, status: "pago" },
    { cliente: "", valor: 40, status: "pago" },
    { cliente: "Rafa", valor: 35, status: "pendente" },
    { cliente: "Léo", valor: 210, status: "pago" }
];

// Valida os pedidos: cliente preenchido e valor maior que zero.
const pedidosValidos = pedidos.filter((pedido) => {
    return pedido.cliente.trim() !== ""
        && typeof pedido.valor === "number"
        && Number.isFinite(pedido.valor)
        && pedido.valor > 0;
});

// Seleciona somente os pedidos que foram pagos.
const pedidosPagos = pedidosValidos.filter((pedido) => {
    return pedido.status === "pago";
});

// Soma o valor dos pedidos pagos.
const totalFaturado = pedidosPagos.reduce((total, pedido) => {
    return total + pedido.valor;
}, 0);

// Formata o nome e o valor de cada pedido.
const resumoPedidos = pedidosPagos.map((pedido) => {
    return `${pedido.cliente.trim()} — R$ ${pedido.valor.toFixed(2)}`;
});

console.log("Pedidos válidos:", pedidosValidos);
console.log("Pedidos pagos:", pedidosPagos);
console.log("Total faturado: R$", totalFaturado.toFixed(2));
console.log("Resumo:", resumoPedidos);


/* =========================================
   PARTE 2 - BUSCADOR DE CEP
========================================= */

const formularioCep = document.querySelector("#formulario-cep");
const campoCep = document.querySelector("#cep");
const botaoCep = document.querySelector("#botao-cep");
const statusCep = document.querySelector("#status-cep");
const resultadoCep = document.querySelector("#resultado-cep");
const historicoCep = document.querySelector("#historico-cep");

// Guarda os CEPs pesquisados enquanto a página estiver aberta.
const historicoDeCeps = [];

formularioCep.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Remove espaços no início e no fim.
    const cep = campoCep.value.trim();

    // O CEP deve ter exatamente oito dígitos.
    if (!/^\d{8}$/.test(cep)) {
        resultadoCep.replaceChildren();
        statusCep.textContent =
            "Digite um CEP válido com exatamente 8 números.";
        return;
    }

    botaoCep.disabled = true;
    resultadoCep.replaceChildren();
    statusCep.textContent = "Buscando...";

    try {
        const resposta = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`,
            { signal: AbortSignal.timeout(5000) }
        );

        // O fetch não lança erro automaticamente para respostas HTTP.
        if (!resposta.ok) {
            throw new Error("Falha HTTP na consulta do CEP.");
        }

        const endereco = await resposta.json();

        // A ViaCEP retorna a propriedade erro para CEP inexistente.
        if (endereco.erro) {
            statusCep.textContent = "CEP não encontrado.";
            return;
        }

        // Cria os campos do endereço sem usar innerHTML.
        resultadoCep.replaceChildren();

        const dados = [
            ["Rua:", endereco.logradouro],
            ["Bairro:", endereco.bairro],
            ["Cidade:", endereco.localidade],
            ["UF:", endereco.uf]
        ];

        dados.forEach(([rotulo, valor]) => {
            const dt = document.createElement("dt");
            const dd = document.createElement("dd");

            dt.textContent = rotulo;
            dd.textContent = valor || "Não informado";

            resultadoCep.append(dt, dd);
        });

        // Limpa o aviso após uma busca bem-sucedida.
        statusCep.textContent = "";

        // Guarda a pesquisa no histórico.
        historicoDeCeps.push({
            cep: cep,
            cidade: endereco.localidade || "Cidade não informada",
            uf: endereco.uf || "UF não informada"
        });

        renderizarHistorico();

    } catch (erro) {
        console.error(erro);

        if (erro.name === "TimeoutError") {
            statusCep.textContent =
                "A consulta demorou demais. Tente novamente.";
        } else {
            statusCep.textContent =
                "Falha na conexão. Verifique sua internet e tente novamente.";
        }
    } finally {
        // Reativa o botão mesmo se acontecer algum erro.
        botaoCep.disabled = false;
    }
});

function renderizarHistorico() {
    historicoCep.replaceChildren();

    historicoDeCeps.forEach((pesquisa) => {
        const item = document.createElement("li");

        item.textContent =
            `${pesquisa.cep} — ${pesquisa.cidade}/${pesquisa.uf}`;

        historicoCep.append(item);
    });
}


/* =========================================
   PARTE 3 - MINI POKÉDEX
========================================= */

const formularioPokemon =
    document.querySelector("#formulario-pokemon");

const campoPokemon = document.querySelector("#pokemon");
const botaoPokemon = document.querySelector("#botao-pokemon");
const statusPokemon = document.querySelector("#status-pokemon");
const resultadoPokemon = document.querySelector("#resultado-pokemon");

formularioPokemon.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Remove espaços e converte o nome para minúsculo.
    const nomePokemon = campoPokemon.value.trim().toLowerCase();

    if (nomePokemon === "") {
        resultadoPokemon.replaceChildren();
        statusPokemon.textContent = "Digite o nome de um Pokémon.";
        return;
    }

    botaoPokemon.disabled = true;
    resultadoPokemon.replaceChildren();
    statusPokemon.textContent = "Buscando Pokémon...";

    try {
        const resposta = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(nomePokemon)}`,
            { signal: AbortSignal.timeout(5000) }
        );

        // Trata especificamente o erro 404.
        if (resposta.status === 404) {
            throw new Error("POKEMON_NOT_FOUND");
        }

        if (!resposta.ok) {
            throw new Error("Falha HTTP na consulta do Pokémon.");
        }

        const pokemon = await resposta.json();

        // Cria o cartão de resultado.
        const cartao = document.createElement("article");

        const nome = document.createElement("h3");
        nome.textContent =
            pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

        const imagem = document.createElement("img");
        imagem.src = pokemon.sprites.front_default || "";
        imagem.alt = `Imagem de ${pokemon.name}`;

        const tituloTipos = document.createElement("p");
        tituloTipos.textContent = "Tipos:";

        const listaTipos = document.createElement("ul");

        pokemon.types.forEach((item) => {
            const tipo = document.createElement("li");
            tipo.textContent = item.type.name;
            listaTipos.append(tipo);
        });

        cartao.append(nome, imagem, tituloTipos, listaTipos);
        resultadoPokemon.replaceChildren(cartao);

        statusPokemon.textContent = "Pokémon encontrado!";

    } catch (erro) {
        console.error(erro);
        resultadoPokemon.replaceChildren();

        if (erro.message === "POKEMON_NOT_FOUND") {
            statusPokemon.textContent =
                "Pokémon não encontrado. Confira o nome.";
        } else if (erro.name === "TimeoutError") {
            statusPokemon.textContent =
                "A consulta demorou demais. Tente novamente.";
        } else {
            statusPokemon.textContent =
                "Falha na conexão. Verifique sua internet e tente novamente.";
        }
    } finally {
        botaoPokemon.disabled = false;
    }
});

console.log("Semana 05 carregada com sucesso!");
