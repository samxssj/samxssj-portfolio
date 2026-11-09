import { Resend } from 'resend';
import nodemailer from 'nodemailer';

type ContactPayload = { name: string; email: string; message: string };

const DEFAULT_FROM_NAME = 'Portfolio samxssj';
const SMTP_TIMEOUT_MS = 10_000;

/**
 * Envía el mensaje del form: Resend si hay API key, Gmail SMTP si no (o si Resend falla).
 * Lanza error si ningún proveedor está configurado o el último disponible falla.
 */
export async function sendContactEmail({ name, email, message }: ContactPayload): Promise<void> {
  const to = process.env.CONTACT_TO_EMAIL;
  if (!to) throw new Error('CONTACT_TO_EMAIL no configurado');

  const fromName = process.env.CONTACT_FROM_NAME ?? DEFAULT_FROM_NAME;
  const subject = `Portfolio: mensaje de ${name}`;
  const text = `De: ${name} <${email}>\n\n${message}`;

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: `${fromName} <${process.env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev'}>`,
      to,
      replyTo: email,
      subject,
      text,
    });
    if (!error) return;
    console.error('contact: Resend falló, probando SMTP', error.message);
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (smtpUser && smtpPass) {
    // Gmail solo acepta como remitente la propia cuenta autenticada: el visitante va en replyTo.
    // Timeouts acotados para que una caída de SMTP no deje colgada la Server Action.
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: (process.env.SMTP_PORT ?? '465') === '465',
      auth: { user: smtpUser, pass: smtpPass.replace(/\s+/g, '') },
      connectionTimeout: SMTP_TIMEOUT_MS,
      greetingTimeout: SMTP_TIMEOUT_MS,
      socketTimeout: SMTP_TIMEOUT_MS,
    });
    await transporter.sendMail({
      from: { name: fromName, address: smtpUser },
      to,
      replyTo: { name, address: email },
      subject,
      text,
    });
    return;
  }

  throw new Error('Sin proveedor de email configurado');
}
