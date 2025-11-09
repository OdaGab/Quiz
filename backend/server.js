const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Optional SendGrid integration
let sgMail = null;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || null;
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@example.com';

if (SENDGRID_API_KEY) {
  try {
    sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(SENDGRID_API_KEY);
    console.log('SendGrid habilitado no backend.');
  } catch (err) {
    console.error('Falha ao inicializar @sendgrid/mail:', err);
    sgMail = null;
  }
}

app.use(cors());
app.use(express.json());

// Endpoint para receber email e código e enviar (ou simular) envio
app.post('/send-code', async (req, res) => {
  const { email, code } = req.body || {};
  const emailRegex = /\S+@\S+\.\S+/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'E-mail inválido.' });
  }

  if (!code) {
    return res.status(400).json({ success: false, message: 'Código ausente.' });
  }

  // If SendGrid is configured, send a real email
  if (sgMail) {
    const msg = {
      to: email,
      from: FROM_EMAIL,
      subject: 'Código de verificação - Quiz',
      text: `Seu código de verificação do Quiz é: ${code}`,
      html: `<p>Seu código de verificação do Quiz é: <strong>${code}</strong></p>`,
    };

    try {
      await sgMail.send(msg);
      console.log(`Código enviado via SendGrid para ${email}`);
      return res.json({ success: true, message: 'Código enviado via SendGrid.' });
    } catch (err) {
      console.error('Erro ao enviar via SendGrid:', err);
      // Em desenvolvimento, envie detalhes do erro para facilitar depuração
      if (process.env.NODE_ENV !== 'production') {
        const details = {
          message: err && err.message ? err.message : String(err),
          stack: err && err.stack ? err.stack : undefined,
        };
        // Alguns erros do SendGrid expõem err.response.body
        if (err && err.response && err.response.body) details.response = err.response.body;
        return res.status(500).json({ success: false, message: 'Erro ao enviar e-mail via SendGrid.', error: details });
      }

      return res.status(500).json({ success: false, message: 'Erro ao enviar e-mail via SendGrid.' });
    }
  }

  // Fallback: simulate (development)
  console.log(`(Simulação) Enviando código para ${email}: ${code}`);
  return res.json({ success: true, message: 'Código enviado (simulado).', code });
});

app.listen(port, () => {
  console.log(`Quiz backend rodando em http://localhost:${port}`);
});
