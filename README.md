# Simulador de precificação SaaS

Trabalho de **Engenharia Econômica**, Faculdade SENAI FATESG, Curso Superior de Engenharia de Software.

**Opção 2 do enunciado:** aplicação que ajuda a decidir qual preço mensal e qual quantidade de clientes sustentam um serviço por assinatura.

**Integrantes:** Carlos Garcia, Yuri Dourado e Guilherme Rubatto. **Turma:** a definir.

> Dados fictícios, identificados na tela como simulação. A taxa de tributos é hipotética e editável; não representa alíquota legal.

## O que a aplicação faz

1. Recebe custo fixo mensal, custo variável por cliente, preço, clientes, taxa hipotética de tributos e o benefício percebido pelo cliente.
2. Mostra a **conta do mês**: receita menos custo fixo, custo variável e tributos, com a fórmula e os números de cada linha.
3. Calcula margem, contribuição por cliente e clientes de equilíbrio.
4. Compara dois preços, desenha o resultado por quantidade de clientes e monta três cenários.
5. Mostra a sensibilidade (uma entrada por vez) e uma interpretação com critério, preço favorecido e condição que mudaria a conclusão.

Também exporta tudo em CSV ou JSON.

## Requisitos para rodar

| Ferramenta | Versão |
|---|---|
| Node.js | 20.9 ou superior (usado: 24.18) |
| npm | o que acompanha o Node |

Não precisa de banco de dados, login, chave de API nem internet depois da instalação.

## Como rodar

1. Instalar as dependências:

```bash
npm install
```

2. Rodar em modo de desenvolvimento:

```bash
npm run dev
```

3. Abrir http://localhost:3000 no navegador.

Se a porta 3000 estiver ocupada, use outra porta:

```bash
npm run dev -- -p 3001
```

Versão de produção:

```bash
npm run build
```

```bash
npm start
```

## Como testar

```bash
npm test
```

Roda 108 testes automatizados das funções de cálculo com o Vitest. As verificações feitas na tela, com entrada, resultado esperado, resultado obtido e situação, estão em [evidencias_testes.md](evidencias_testes.md).

## Exemplo de uso

1. Clique em **Carregar exemplo do enunciado**. Os campos recebem custo fixo R$ 3.000,00, custo variável R$ 10,00, preço R$ 50,00, 100 clientes, taxa de 10% e segundo preço de R$ 60,00.
2. A conta do mês mostra resultado de **R$ 500,00**, margem de **10,00%** e equilíbrio em **86 clientes**, os mesmos valores do teste de referência do enunciado (p.3).
3. Troque o preço para 60 e aperte Tab. As linhas que mudaram recebem uma marcação amarela, e o resultado passa a R$ 1.400,00.
4. Role até **O que os números dizem** para ler a interpretação e exporte em CSV ou JSON.

Os valores são digitados no formato brasileiro: ao digitar `10000`, o campo mostra `10.000` e completa para `10.000,00` ao sair.

## Indicadores

| Indicador | Fórmula | Observação |
|---|---|---|
| Receita | preço × clientes | Por mês |
| Tributos | receita × taxa | Taxa hipotética, sobre a receita |
| Resultado do mês | receita − custo fixo − custo variável × clientes − tributos | Saldo operacional do modelo, não lucro contábil |
| Margem | 100 × resultado ÷ receita | Só existe quando há receita |
| Contribuição por cliente | preço × (1 − taxa) − custo variável | Quanto cada cliente deixa para cobrir o custo fixo |
| Clientes de equilíbrio | custo fixo ÷ contribuição, arredondado para cima | Não existe se a contribuição for zero ou negativa |
| Preço que zera o resultado | (custo fixo + custo variável × clientes) ÷ (clientes × (1 − taxa)) | Usado na sensibilidade |

Detalhes, unidades e casos-limite em [modelo_calculos.md](modelo_calculos.md).

## Dados de exemplo

| Arquivo | Conteúdo |
|---|---|
| Botão "Carregar exemplo do enunciado" | Caso de referência da Opção 2 (p.3) |
| [dados/exportacao-exemplo.json](dados/exportacao-exemplo.json) | Arquivo exportado pela aplicação com esse caso |
| [dados/exportacao-exemplo.csv](dados/exportacao-exemplo.csv) | O mesmo, em CSV (abre no Excel em português) |

## Limitações

- Modelo de um mês típico: sem cancelamentos, sem custo de aquisição de clientes, sem sazonalidade e com um único plano.
- A taxa de tributos é uma hipótese editável, não um regime tributário.
- O resultado é saldo operacional, não lucro contábil, e o equilíbrio do mês não é recuperação de investimento.
- Os cenários variam só a quantidade de clientes (−30%, informado, +30%); outras combinações exigem alterar as entradas.
- Premissa da equipe fora do enunciado: com custo fixo zero, o equilíbrio é 0 cliente.

## Tecnologia

| Item | Escolha | Motivo |
|---|---|---|
| Framework | Next.js 16 (App Router), uma página | Escolha da equipe; forma mais simples, sem API nem banco |
| Linguagem | TypeScript | Tipos ajudam a revisar as fórmulas |
| Estilo | CSS próprio com tokens (`app/globals.css`) | Sem biblioteca de componentes |
| Gráfico | SVG próprio | Sem dependência extra |
| Fonte | Familjen Grotesk (`next/font`) | Algarismos de largura igual: colunas de R$ alinhadas |
| Testes | Vitest | Recomendado pela documentação do Next.js |

## Estrutura

| Pasta ou arquivo | Conteúdo |
|---|---|
| `app/` | Página e layout do Next.js |
| `components/` | Partes da interface |
| `lib/` | Cálculo, leitura e formatação de números, cenários, sensibilidade, interpretação, exportação e testes |
| `dados/` | Arquivos exportados pela aplicação |
| `problema.md` | Passo 1: usuário, decisão e caso de teste |
| `requisitos.md` | Passo 2: requisitos, critérios de aceitação e armadilhas de cálculo |
| `modelo_calculos.md` | Passo 3: variáveis, fórmulas, caso resolvido e conferência da equipe |
| `registro_ia.md` | Interações com a IA e decisões da equipe |
| `evidencias_testes.md` | Verificações na tela e testes automatizados |
| `relatorio_decisao.md` | Relatório de decisão (até duas páginas) |
| `referencias/` | Enunciado da atividade |
