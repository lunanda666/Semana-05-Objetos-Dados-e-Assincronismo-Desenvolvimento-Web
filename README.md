
# Semana 05 — Objetos, Dados e Assincronismo

Projeto acadêmico de Desenvolvimento Web para praticar objetos, arrays, DOM, Fetch API e programação assíncrona com Promises e async/await.

## Arquivos

- `index.html`: estrutura da página e formulários.
- `app.js`: validação de pedidos, buscador de CEP e Mini Pokédex.

## Como executar

1. Abra a pasta do projeto no VS Code.
2. Execute o arquivo `index.html` com a extensão Live Server.
3. Utilize o formulário para pesquisar um CEP ou Pokémon.
4. Para conferir os resultados da Parte 1, pressione F12 e abra o Console.
5. É necessária uma conexão com a internet para consultar as APIs.

## Parte 1 — Pedidos

O array `pedidos` contém objetos com cliente, valor e status.

- `filter()` seleciona os pedidos válidos e, depois, os pedidos pagos.
- `reduce()` soma os valores dos pedidos pagos.
- `map()` gera os textos com os valores formatados por `toFixed(2)`.

## Parte 2 — Buscador de CEP

O projeto valida se o CEP possui exatamente oito dígitos, consulta a API ViaCEP com `fetch` e `async/await` e exibe rua, bairro, cidade e UF.

A tela apresenta estados de carregamento, erro, CEP não encontrado e sucesso. O histórico é armazenado em um array de objetos enquanto a página está aberta.

## Parte 3 — Mini Pokédex

A busca converte o nome do Pokémon para minúsculo e consulta a PokéAPI. O resultado apresenta nome, imagem e tipos. O código verifica `response.ok` e trata o erro 404 como Pokémon não encontrado.

## Segurança

Os dados recebidos das APIs são inseridos usando `createElement()` e `textContent`, sem inserir dados externos por meio de `innerHTML`. Isso ajuda a evitar ataques de XSS.

## Reflexão: por que Promise.all pode ser mais rápido que vários await seguidos?

Quando vários `await` são usados em sequência, a próxima requisição só começa depois que a anterior termina. Isso pode aumentar o tempo total de espera.

Com `Promise.all()`, podemos iniciar várias requisições independentes antes de aguardar os resultados. Elas acontecem em paralelo, e o programa espera até que todas terminem ou que uma delas rejeite. Dessa forma, o tempo total pode ser menor.

Exemplo:

```javascript
// Sequencial: espera uma requisição para iniciar a próxima.
const respostaA = await fetch(urlA);
const respostaB = await fetch(urlB);

// Paralelo: inicia as duas requisições antes de esperar.
const [resposta1, resposta2] = await Promise.all([
    fetch(urlA),
    fetch(urlB)
]);
```

`Promise.all()` é útil quando as operações são independentes. Se uma das Promises rejeitar, a Promise combinada também rejeita, mas isso não cancela automaticamente as outras requisições.

## APIs utilizadas

- ViaCEP: https://viacep.com.br/
- PokéAPI: https://pokeapi.co/
