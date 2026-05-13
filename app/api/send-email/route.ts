import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const bodySchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[\d\s+()\-./]*$/)
    .optional()
    .or(z.literal("")),
  subject: z.string().trim().min(1).max(80).optional(),
  message: z.string().trim().min(10).max(2000),
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );

const generateEmailTemplate = (ctx: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) => {
  const { name, email, phone, subject, message } = ctx;
  return `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nouveau message - La Cité Fleurie</title>
  </head>
  <body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,sans-serif;background-color:#f5f5f0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f0;padding:40px 20px;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1);">
          <tr><td style="background:linear-gradient(135deg,#2c3e50,#34495e);padding:40px 30px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:28px;font-weight:300;letter-spacing:2px;">La Cité Fleurie</h1>
            <div style="margin-top:10px;height:2px;width:80px;background-color:#d4af37;margin-left:auto;margin-right:auto;"></div>
          </td></tr>
          <tr><td style="background:linear-gradient(90deg,#d4af37,#f4e4b0,#d4af37);height:3px;"></td></tr>
          <tr><td style="padding:40px 30px;">
            <h2 style="margin:0 0 8px 0;color:#2c3e50;font-size:22px;font-weight:400;">Nouveau message de contact</h2>
            ${
              subject
                ? `<p style="margin:0 0 24px 0;color:#d4af37;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">${escapeHtml(
                    subject
                  )}</p>`
                : ""
            }
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr><td style="padding:15px;background-color:#f8f9fa;border-left:3px solid #d4af37;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr><td style="padding:8px 0;"><strong style="color:#2c3e50;font-size:14px;">Nom :</strong> <span style="color:#555;font-size:14px;margin-left:10px;">${escapeHtml(
                    name
                  )}</span></td></tr>
                  <tr><td style="padding:8px 0;"><strong style="color:#2c3e50;font-size:14px;">Email :</strong> <a href="mailto:${escapeHtml(
                    email
                  )}" style="color:#d4af37;text-decoration:none;margin-left:10px;">${escapeHtml(
    email
  )}</a></td></tr>
                  ${
                    phone
                      ? `<tr><td style="padding:8px 0;"><strong style="color:#2c3e50;font-size:14px;">Téléphone :</strong> <span style="color:#555;font-size:14px;margin-left:10px;">${escapeHtml(
                          phone
                        )}</span></td></tr>`
                      : ""
                  }
                </table>
              </td></tr>
            </table>
            <div style="background-color:#f8f9fa;padding:20px;border-radius:8px;border-left:3px solid #2c3e50;">
              <strong style="color:#2c3e50;font-size:14px;display:block;margin-bottom:10px;">Message :</strong>
              <p style="margin:0;color:#555;font-size:14px;line-height:1.8;white-space:pre-wrap;">${escapeHtml(
                message
              )}</p>
            </div>
          </td></tr>
          <tr><td style="background-color:#2c3e50;padding:30px;text-align:center;">
            <p style="margin:0 0 10px 0;color:#ecf0f1;font-size:12px;"><strong>La Cité Fleurie</strong> - Restaurant, Lounge Bar &amp; Terrasse</p>
            <p style="margin:0 0 15px 0;color:#95a5a6;font-size:11px;">Chemin de l'Echo 3, 1213 Onex</p>
            <div style="height:1px;width:60px;background-color:#d4af37;margin:15px auto;"></div>
            <p style="margin:0;color:#95a5a6;font-size:10px;">Email envoyé depuis le formulaire de contact du site.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>`;
};

export async function POST(request: NextRequest) {
  try {
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      console.error("SMTP env vars missing");
      return NextResponse.json(
        { error: "Service indisponible" },
        { status: 500 }
      );
    }

    const json = await request.json().catch(() => null);
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = parsed.data;
    const subjectLine = subject
      ? `[${subject}] Message de ${name} - La Cité Fleurie`
      : `Nouveau message de ${name} - La Cité Fleurie`;

    const recipient = process.env.CONTACT_EMAIL || "info@lacitefleurie.ch";

    await transporter.sendMail({
      from: `"La Cité Fleurie - Contact" <${process.env.SMTP_USER}>`,
      to: recipient,
      replyTo: email,
      subject: subjectLine,
      html: generateEmailTemplate({ name, email, phone, subject, message }),
      text: [
        `Nouveau message de contact`,
        subject ? `Type : ${subject}` : null,
        ``,
        `Nom: ${name}`,
        `Email: ${email}`,
        phone ? `Téléphone: ${phone}` : null,
        ``,
        `Message:`,
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    await transporter.sendMail({
      from: `"La Cité Fleurie" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Confirmation de votre demande - La Cité Fleurie",
      html: `
        <div style="font-family:'Segoe UI',Tahoma,sans-serif;max-width:600px;margin:auto;padding:24px;color:#2c3e50;">
          <h2 style="font-weight:400;">Bonjour ${escapeHtml(name)},</h2>
          <p>Merci de nous avoir contactés. Nous avons bien reçu votre message${
            subject ? ` concernant <strong>${escapeHtml(subject)}</strong>` : ""
          } et nous vous répondrons dans les plus brefs délais.</p>
          <p>Cordialement,<br/>L'équipe de La Cité Fleurie</p>
        </div>`,
      text: `Bonjour ${name},\n\nMerci de nous avoir contactés. Nous avons bien reçu votre message${
        subject ? ` concernant ${subject}` : ""
      } et nous vous répondrons dans les plus brefs délais.\n\nCordialement,\nL'équipe de La Cité Fleurie`,
    });

    return NextResponse.json(
      { message: "Email envoyé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("send-email error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}
