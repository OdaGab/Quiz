# Quiz Backend (dev)

Este é um backend de desenvolvimento simples usado pelo app Quiz para "enviar" códigos de verificação.

Importante:
- Este servidor apenas simula envio: ele imprime o código no console e retorna sucesso.
- Em produção, substitua por integração real (SendGrid, SES, Mailgun, etc.) e não devolva o código na resposta.

Como rodar (Windows PowerShell):

```powershell
cd backend
npm install
npm run start
# ou em desenvolvimento com reinício automático:
# npx nodemon server.js
```

Testando manualmente:
- Faça uma requisição POST para `http://localhost:3000/send-code` com JSON:
  {
    "email": "seu@exemplo.com",
    "code": "123456"
  }

O servidor responderá com `{ success: true, message: 'Código enviado (simulado).', code }`.

Dicas para emuladores/devices:
- Android Emulator (AVD): use `10.0.2.2` no app para acessar `localhost` do host.
- iOS Simulator: `localhost` normalmente funciona.
- Dispositivo físico: use o IP local da sua máquina (ex: `http://192.168.1.42:3000`).

SendGrid (opcional)
-------------------
Você pode configurar o backend para enviar e-mails reais via SendGrid configurando a variável de ambiente `SENDGRID_API_KEY`.

1. Crie um arquivo `.env` na pasta `backend` (copie `./.env.example`).
2. Preencha `SENDGRID_API_KEY` com sua chave do SendGrid e ajuste `FROM_EMAIL`.
3. Instale dependências e rode o servidor:

```powershell
cd backend
npm install
npm run start
```

Se `SENDGRID_API_KEY` não estiver definido, o servidor continuará no modo de simulação e retornará o código no JSON (útil para desenvolvimento). Em produção, não retorne o código nas respostas.

Observação de segurança: nunca comite seu `.env` com chaves reais no controle de versão.
