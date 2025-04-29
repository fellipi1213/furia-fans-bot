# furia-fans-bot

📚 Sobre o Projeto

Este projeto é um bot de WhatsApp desenvolvido usando a biblioteca [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys).  
O foco é interagir com fãs da equipe FURIA Esports no cenário de CS:GO/CS2, respondendo automaticamente a perguntas, trazendo curiosidades, históricos de campeonatos, informações de utilidades (granadas), entre outros.

🚀 Funcionalidades

- Conexão automática com QR Code.
- Reconexão automática caso a conexão caia (exceto logout).
- Classificação de intenções usando NLP (via classifier).
- Respostas temáticas sobre:
  - História da FURIA
  - Equipamentos usados
  - Próximos jogos
  - Jogadores e elencos por ano
  - Explicação de gírias do CS
  - Curiosidades da organização
- Sistema de detecção e resposta a palavrões.
- Respostas amigáveis a cumprimentos.
- Comandos especiais com prefixo ! (ex: !setup, !drip, !live).

⚙️ Como executar

1. Instalação de dependências

npm install

Bibliotecas necessárias:
- @whiskeysockets/baileys
- fs (nativo do Node.js)

2. Estrutura esperada dos arquivos

Certifique-se que na raiz do projeto existam os seguintes arquivos:

- auth/ — Pasta que será gerada automaticamente para armazenar credenciais.
- furiaData.json — Contém dados como história, lineups e curiosidades da FURIA.
- palavrasProibidas.json — Lista de palavras a serem censuradas no chat.
- intents.js — Script para classificar intenções do usuário.

3. Inicializar o bot

node bot.js

O terminal exibirá um QR Code.  
Escaneie com seu WhatsApp para conectar o bot.

📦 Estrutura de Resposta

O bot analisa a mensagem recebida e responde de acordo com:

- Correspondência exata de intenções
- Palavras-chave específicas (granadas, cumprimentos, históricos)
- Reconhecimento de anos para consultas de elencos
- Comandos prefixados com !

Se nenhuma intenção for reconhecida, o bot responde de forma genérica para manter a interação.

🛡️ Proteção de Conteúdo

O bot detecta palavrões e responde educadamente solicitando respeito no grupo/chat.

✨ Futuras melhorias a serem implementadas

- Implementar contexto de múltiplas interações sequenciais (multi-turn).
- Melhorar a classificação de intenções usando IA (ex: TensorFlow.js, transformers).
- Integrar API HLTV para buscar jogos atualizados sem depender de link fixo.
