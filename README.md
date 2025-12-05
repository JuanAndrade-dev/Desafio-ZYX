# ZYX Logística – Sistema de Controle de Pátio Inteligente

Este projeto foi desenvolvido para o desafio técnico da ZYX Logística.
A ideia é criar um sistema simples para registrar a entrada e saída de veículos no pátio, permitindo visualizar o status de cada veículo.

# Objetivo do Sistema

O sistema ajuda a controlar os veículos que chegam, os que estão em processo de descarga ou já finalizaram.
Ele permite registrar os dados básicos do motorista e do veículo para acompanhar o fluxo dentro da empresa.

# Principais Funcionalidades

*Cadastro de veículos*

- Placa
- Motorista
- CPF
- Tipo de carga
O sistema formata automaticamente o CPF e a placa enquanto o usuário digita.

*Lista de Veículos no Pátio*

Mostra todos os veículos cadastrados e o status de cada um:
- Aguardando
- Em descarga
- Finalizado
Quando o veículo é marcado como finalizado, o sistema registra automaticamente o horário de saída.

*Atualização e Exclusão*

É possível editar dados do caminhão ou excluir um registro.

*Filtro de busca*

Permite encontrar veículos rapidamente pelo nome ou placa.

*Exportar CSV*

O usuário pode exportar um arquivo CSV com todos os registros cadastrados.

# Tecnologias Utilizadas

*Frontend*

- Next.js
- React
- Tailwind CSS
- Axios

*Backend*

- Node.js
- Express

# Como Executar o Projeto

1. Rodar o Backend (API)

    cd server
    npm install
    node index.js

2. Rodar o Frontend

    cd ..
    cd client
    npm install
    npm run dev

A interface estará em http://localhost:3000

*Observações*

- Projeto sem banco de dados.
- Dados ficam armazenados em memória.
- Foco em mostrar organização e fluxo completo do sistema.