import { Resend } from 'resend';
import nodemailer from 'nodemailer';

type ContactPayload = { name: string; email: string; message: string };

/**
 * Envía el mensaje del form: Resend primero, Gmail SMTP de fallback.
 * Lanza error si ningún proveedor está configurado o ambos fallan.
 */
export async function sendContactEmail({ name, email, message }: ContactPayload): Promise<void> {
  const to = process.env.CONTACT_TO_EMAIL;
  if (!to) throw new Error('CONTACT_TO_EMAIL no configurado');

  const subject = `Portfolio: mensaje de ${name}`;
  const text = `De: ${name} <${email}>\n\n${message}`;

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev',
      to,
      replyTo: email,
      subject,
      text,
    });
    if (!error) return;
    console.error('contact: Resend falló, probando SMTP', error.message);
  }

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({ from: process.env.SMTP_USER, to, replyTo: email, subject, text });
    return;
  }

  throw new Error('Sin proveedor de email configurado');
}
