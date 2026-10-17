// Vercel serverless function: receives the contact form and emails it to you.
// Uses Resend (https://resend.com) through its REST API, so no packages are needed.
//
// Environment variables to add in Vercel → Project → Settings → Environment Variables:
//   RESEND_API_KEY    your Resend API key
//   CONTACT_TO_EMAIL  the inbox that should receive messages (e.g. usman.azhar6171@gmail.com)

const escapeHtml = (str = "") =>
  String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, service, message, company } = req.body || {};

  // Honeypot: real people never fill this hidden field
  if (company) return res.status(200).json({ ok: true });

  if (!name || !email || !service || !message) {
    return res.status(400).json({ error: "Please fill in all fields." });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email." });
  }
  if (message.length > 5000) {
    return res.status(400).json({ error: "Message is too long." });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `New message: ${service} from ${name}`,
        html: `
          <h2>New message from your portfolio</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(service)}</p>
          <p><strong>Project details:</strong><br>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
        `,
      }),
    });

    if (!response.ok) {
      console.error("Resend error:", await response.text());
      return res.status(502).json({ error: "Email service error. Please try again later." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error. Please try again later." });
  }
};
