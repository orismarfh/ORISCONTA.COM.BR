# Segurança e Privacidade

Este repositório é público e deve conter apenas código, estilos e ativos públicos do site.

## Nunca commitar

- documentos de clientes;
- informes de rendimento;
- recibos de declaração;
- PDFs, planilhas, extratos, OFX ou arquivos fiscais;
- senhas, tokens, chaves, certificados digitais ou arquivos `.env`;
- cópias de declarações, DARFs ou comprovantes.

O `.gitignore` bloqueia categorias comuns desses arquivos, mas a revisão humana antes de cada commit continua obrigatória.

## Medidas do MVP

- A triagem pública não coleta CPF, senha gov.br, endereço ou upload de documentos.
- A triagem roda no navegador e não envia dados automaticamente para backend, WhatsApp, analytics ou IA.
- O link do WhatsApp usa uma mensagem genérica para evitar vazamento de detalhes na URL.
- O checklist detalhado só vai para a área de transferência se o visitante clicar em "Copiar checklist".
- Qualquer documento fiscal deve ser tratado fora deste repositório, em canal autorizado pelo contribuinte.

## Antes de publicar mudanças

1. Rode `git status --short` e revise todos os arquivos alterados.
2. Rode `rg -n "CPF|senha|token|secret|api_key|BEGIN PRIVATE KEY|gov.br|recibo|DARF|cliente" .`.
3. Confirme que nenhum dado real de contribuinte aparece no código, histórico ou assets.
