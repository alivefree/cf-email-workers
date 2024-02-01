# Cloudflare email sender worker
### Modify wrangler.toml
```toml
# Configure domain names to allow cros
ALLOWED_ORIGINS = "*"
# Address to receive mail
RECIPIENT_ADDRESS = "*"
# Address to send mail
SENDER_ADDRESS = "*"
# sender name
SENDER_NAME = "*"
```
### Deploy in Cloudflare
1. install wrangler
   ```bash
   npm install -g wrangler
   ```
2. login to cloudflare
   ```bash
   wrangler login
   ```
3. deploy
   ```bash
   wrangler deploy
   ```
### use yourself 'Send Email Binding'
```js
  try {
      await c.env.SEB.send(message)
  } catch (e) {
      c.status(500)
      return c.json({
          "status": "error",
          "message": "Email failed to send",
          "error_details": e.message
      });
  }
```
The SEB in the above code comes from the configuration in `wrangler.toml`:
```
send_email = [
    {type = "send_email", name = "SEB", destination_address = "xxx"},
]
```
