import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) return json({ error: 'Configuración incompleta en el servidor.' }, 500);

  const data    = await request.formData();
  const nombre  = data.get('nombre')?.toString().trim();
  const email   = data.get('email')?.toString().trim();
  const mensaje = data.get('mensaje')?.toString().trim();

  if (!nombre || !email || !mensaje)
    return json({ error: 'Todos los campos son requeridos.' }, 400);

  try {
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      // Para testing usá onboarding@resend.dev (el mail llega al email de tu cuenta Resend).
      // En producción reemplazá por tu dominio verificado: 'noreply@agenciaweb.ar'
      from: 'Agencia Web <onboarding@resend.dev>',
      to: [import.meta.env.CONTACT_EMAIL ?? 'agus.demalde@gmail.com'],
      replyTo: email,
      subject: `Nuevo contacto de ${nombre}`,
      html: `
        <h2 style="font-family:sans-serif;margin-bottom:16px">Nuevo mensaje de contacto</h2>
        <p style="font-family:sans-serif"><strong>Nombre:</strong> ${nombre}</p>
        <p style="font-family:sans-serif"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p style="font-family:sans-serif"><strong>Mensaje:</strong></p>
        <p style="font-family:sans-serif;white-space:pre-wrap;background:#f4f4f4;padding:12px;border-radius:4px">${mensaje}</p>
      `,
    });

    if (error) return json({ error: error.message }, 500);

    return json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error inesperado.';
    return json({ error: msg }, 500);
  }
};
