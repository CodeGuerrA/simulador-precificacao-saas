# Simulador de precificação SaaS

Trabalho de **Engenharia Econômica** — Faculdade SENAI FATESG, Curso Superior de Engenharia de Software.
**Opção 2:** simulador que ajuda a decidir qual preço mensal e qual quantidade de clientes sustentam um serviço por assinatura.

**Integrantes:** Carlos Garcia, Yuri Dourado e Guilherme Rubatto. **Turma:** a definir.

> Dados fictícios, identificados na tela como simulação. A taxa de tributos é hipotética e editável; não representa alíquota legal.

## Requisitos para rodar

| Ferramenta | Versão usada |
|---|---|
| Node.js | 24.18 (mínimo 20.9, exigido pelo Next.js 16) |
| npm | o que acompanha o Node |

Não precisa de internet depois da instalação, nem de banco de dados, login ou chave de API.

## Como rodar

```bash
npm install
```

```bash
npm run dev
```

Depois, abra http://localhost:3000 no navegador.

## Como testar

```bash
npm test
```

Roda os testes automatizados das funções de cálculo com o Vitest.

## Tecnologia

| Item | Escolha | Motivo |
|---|---|---|
| Framework | Next.js 16 (App Router), uma página | Escolha da equipe; forma mais simples, sem API nem banco |
| Linguagem | TypeScript | Tipos ajudam a revisar as fórmulas |
| Estilo | CSS próprio com tokens (`app/globals.css`) | Sem Tailwind nem biblioteca de componentes, para não ter cara de template |
| Fonte | Familjen Grotesk (`next/font`) | Algarismos de largura igual: colunas de R$ alinhadas |
| Testes | Vitest | Recomendado pela documentação do Next.js |

## Estrutura

| Pasta ou arquivo | Conteúdo |
|---|---|
| `app/` | Página e layout do Next.js |
| `lib/` | Funções de cálculo, leitura de números e exportação (Passo 5) |
| `components/` | Partes da interface (Passo 6) |
| `problema.md` | Passo 1: usuário, decisão e caso de teste |
| `requisitos.md` | Passo 2: requisitos e critérios de aceitação |
| `modelo_calculos.md` | Passo 3: variáveis, fórmulas e caso resolvido |
| `registro_ia.md` | Interações com a IA e decisões da equipe |
| `referencias/` | Enunciado da atividade |

## Andamento

| Passo | Situação |
|---|---|
| 1 a 3 — problema, requisitos e modelo | Feito; falta a solução independente da equipe (seção 8 do `modelo_calculos.md`) |
| 4 — estrutura e execução | Feito |
| 5 — núcleo de cálculo e testes | A fazer |
| 6 — interface | A fazer |
| 7 — cenários e interpretação | A fazer |
| 8 — revisão e entrega | A fazer |
