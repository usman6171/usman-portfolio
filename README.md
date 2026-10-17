# Usman Azhar — Portfolio

Static site (HTML, CSS, JavaScript) with a Vercel serverless function for the contact form.

## Files
- `index.html` — page content
- `style.css` — styles and hover effects
- `script.js` — mobile menu, FAQ, scroll animations, contact form
- `api/contact.js` — backend that emails form messages (via Resend)
- `assets/` — images (already included and named correctly)

## Contact form setup (on Vercel)
Add these in Vercel → Project → Settings → Environment Variables, then redeploy:
- `RESEND_API_KEY` = your key from resend.com
- `CONTACT_TO_EMAIL` = usman.azhar6171@gmail.com

## Social links
In `index.html`, search for `href="#"` and replace each `#` with the real Instagram, LinkedIn and X profile links.
