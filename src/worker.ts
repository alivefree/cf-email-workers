import { Hono } from "hono"
import { cors } from "hono/cors"
import { EmailMessage } from "cloudflare:email"
import { createMimeMessage } from "mimetext"

const worker = new Hono();

worker.use('*', (c, next) => {
  const origins = c.env.ALLOWED_ORIGINS == '*' ? '*' : c.env.ALLOWED_ORIGINS.split(',');
  const corsMiddleware = cors(origins);
  return corsMiddleware(c, next);
});

worker.post('/send', async (c) => {
  const text = await c.req.text();
  const body = JSON.parse(text);
  if (!body['subject'] || !body['body']) {
    c.status(400)
    return c.json({
        "status": "error",
        "message": "Missing subject or body"
    })
  }

  const msg = createMimeMessage()
  msg.setSender({ name: c.env.SENDER_NAME, addr: c.env.SENDER_ADDRESS })
  msg.setRecipient(c.env.RECIPIENT_ADDRESS)
  msg.setSubject(body['subject'])
  msg.addMessage({
      contentType: 'text/html',
      data: body['body']
  })

  var message = new EmailMessage(
      c.env.SENDER_ADDRESS,
      c.env.RECIPIENT_ADDRESS,
      msg.asRaw()
  );

  try {
      await c.env.CatLulu.send(message)
  } catch (e) {
      c.status(500)
      return c.json({
          "status": "error",
          "message": "Email failed to send",
          "error_details": e.message
      });
  }

  return c.json({
      "status": "success",
      "message": "Email sent successfully"
  });
  
});

export default worker;
