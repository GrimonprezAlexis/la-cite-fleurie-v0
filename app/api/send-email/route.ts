import { NextRequest, NextResponse } from 'next/server';
const nodemailer = require('nodemailer');

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nouveau message de contact - L'R de Ré</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f0; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">

                <!-- Header avec couleur sombre élégante -->
                <tr>
                  <td style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 300; letter-spacing: 2px;">
                      L'R DE RÉ
                    </h1>
                    <div style="margin-top: 10px; height: 2px; width: 80px; background-color: #d4af37; margin-left: auto; margin-right: auto;"></div>
                  </td>
                </tr>

                <!-- Bande dorée subtile -->
                <tr>
                  <td style="background: linear-gradient(90deg, #d4af37 0%, #f4e4b0 50%, #d4af37 100%); height: 3px;"></td>
                </tr>

                <!-- Contenu principal -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 22px; font-weight: 400;">
                      Nouveau message de contact
                    </h2>
                    <p style="margin: 0 0 30px 0; color: #7f8c8d; font-size: 14px; line-height: 1.6;">
                      Vous avez reçu un nouveau message via le formulaire de contact de votre site web.
                    </p>

                    <!-- Informations du contact -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                      <tr>
                        <td style="padding: 15px; background-color: #f8f9fa; border-left: 3px solid #d4af37;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 8px 0;">
                                <strong style="color: #2c3e50; font-size: 14px;">Nom :</strong>
                                <span style="color: #555; font-size: 14px; margin-left: 10px;">${name}</span>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0;">
                                <strong style="color: #2c3e50; font-size: 14px;">Email :</strong>
                                <a href="mailto:${email}" style="color: #d4af37; text-decoration: none; margin-left: 10px;">${email}</a>
                              </td>
                            </tr>
                            ${phone ? `
                            <tr>
                              <td style="padding: 8px 0;">
                                <strong style="color: #2c3e50; font-size: 14px;">Téléphone :</strong>
                                <span style="color: #555; font-size: 14px; margin-left: 10px;">${phone}</span>
                              </td>
                            </tr>
                            ` : ''}
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Message -->
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 3px solid #2c3e50;">
                      <strong style="color: #2c3e50; font-size: 14px; display: block; margin-bottom: 10px;">Message :</strong>
                      <p style="margin: 0; color: #555; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${message}</p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #2c3e50; padding: 30px; text-align: center;">
                    <p style="margin: 0 0 10px 0; color: #ecf0f1; font-size: 12px;">
                      <strong>L'R de Ré</strong> - Restaurant, Lounge Bar & Terrasse
                    </p>
                    <p style="margin: 0 0 15px 0; color: #95a5a6; font-size: 11px;">
                      2 Quai de la Criée, 17590 Ars-en-Ré
                    </p>
                    <div style="height: 1px; width: 60px; background-color: #d4af37; margin: 15px auto;"></div>
                    <p style="margin: 0; color: #95a5a6; font-size: 10px;">
                      Cet email a été envoyé automatiquement depuis le formulaire de contact de votre site web.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"L'R de Ré - Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `Nouveau message de ${name} - L'R de Ré`,
      html: htmlContent,
      text: `
Nouveau message de contact

Nom: ${name}
Email: ${email}
${phone ? `Téléphone: ${phone}` : ''}

Message:
${message}
      `.trim(),
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Email envoyé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}
