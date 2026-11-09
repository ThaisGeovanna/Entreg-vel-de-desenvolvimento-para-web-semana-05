# Semana 05 - Objetos, Dados e Assincronismo

Mini projeto da disciplina de Desenvolvimento Web com manipulação de objetos e arrays, consumo de APIs com `fetch` e `async/await` e renderização dinâmica no DOM. Para ver o resultado, abra o `index.html` no navegador e pressione `F12` para abrir o Console.

## Arquivos

- `index.html`: página com o buscador de CEP e a Mini Pokédex.
- `app.js`: código JavaScript das três partes da atividade.
- `README.md`: este documento.

## Parte 1 - Manipulação e validação de dados

A partir de um array de objetos `pedidos`, o código valida cada pedido (cliente não vazio e valor numérico maior que 0), filtra os pedidos pagos, calcula o total faturado com `reduce` e gera textos no formato `Bia — R$ 120.00` usando `toFixed(2)`. O resultado aparece no Console.

## Parte 2 - Buscador de CEP

O formulário recebe o CEP, limpa os espaços com `.trim()` e valida com a expressão regular `/^\d{8}$/` (apenas dígitos, exatamente 8 caracteres). A consulta é feita na API ViaCEP com `fetch` e `async/await`, usando `AbortSignal.timeout(5000)` para não deixar a requisição pendurada.

A tela trata os quatro estados:

- **Carregando:** mostra "Buscando..." e desabilita o botão.
- **Erro:** erros de rede, de timeout e erros HTTP (`!response.ok`) mostram uma mensagem de falha na conexão.
- **Vazio:** se a API retornar a chave `erro`, aparece "CEP não encontrado".
- **Sucesso:** o resultado anterior é limpo com `replaceChildren()` e os dados (Rua, Bairro, Cidade e UF) são exibidos com `createElement` e `textContent`.

Como bônus, os CEPs encontrados são guardados em um array de objetos e listados na tela como histórico.

## Parte 3 - Mini Pokédex

O campo de busca é validado (não pode ser vazio) e convertido para minúsculo. A consulta é feita na PokéAPI e a tela mostra o nome, a imagem (`sprites.front_default`) e os tipos do Pokémon. Os quatro estados também são tratados, incluindo o erro 404, exibido como "Pokémon não encontrado". Como o `fetch` não rejeita a Promise em erros HTTP, é necessário checar `response.ok` (ou `response.status`) manualmente.

## Segurança

Os dados vindos das APIs são inseridos na página com `createElement` e `textContent`, nunca com `innerHTML`, para evitar ataques de XSS.

## Parte 4 - Reflexão

**Por que `Promise.all` pode ser mais rápido que vários `await` seguidos?**

Com `await` em sequência, o código espera cada Promise terminar antes de iniciar a próxima. Se três requisições levam 1 segundo cada, o total é de cerca de 3 segundos. Já o `Promise.all` dispara todas as requisições ao mesmo tempo (em paralelo) e espera todas terminarem juntas, então o tempo total fica próximo ao da requisição mais lenta (cerca de 1 segundo). Assim, o tempo de espera da rede é melhor aproveitado.

```js
const [cep1, cep2] = await Promise.all([
  fetch("https://viacep.com.br/ws/01001000/json/"),
  fetch("https://viacep.com.br/ws/20040020/json/")
]);
```

Isso só vale quando as requisições são independentes entre si. Se uma depende do resultado da outra, é preciso usar `await` em sequência.
