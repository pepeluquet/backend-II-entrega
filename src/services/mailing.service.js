const nodemailer = require('nodemailer');
const config = require('../config/config');

class MailingService {
  constructor() {
    // Configurar el transporter usando credenciales del .env
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.MAILING_USER,
        pass: config.MAILING_PASS
      }
    });
  }

  async sendResetPasswordEmail(toEmail, resetLink) {
    const mailOptions = {
      from: config.MAILING_USER,
      to: toEmail,
      subject: 'Reset de contraseña',
      html: `
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Si no solicitaste este cambio, ignora este correo.</p>
      `
    };

    return this.transporter.sendMail(mailOptions);
  }
}

module.exports = new MailingService();
