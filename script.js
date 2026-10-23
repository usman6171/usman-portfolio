// ===== Mobile menu =====
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", isOpen);
});

navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

// ===== Navbar border on scroll =====
const nav = document.querySelector(".nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 10);
});

// ===== Reveal sections on scroll =====
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ===== FAQ accordion (one open at a time) =====
document.querySelectorAll(".faq").forEach((faq) => {
  const btn = faq.querySelector(".faq__q");
  btn.addEventListener("click", () => {
    const willOpen = !faq.classList.contains("open");
    document.querySelectorAll(".faq.open").forEach((f) => {
      f.classList.remove("open");
      f.querySelector(".faq__q").setAttribute("aria-expanded", "false");
    });
    if (willOpen) {
      faq.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

// ===== Contact form =====
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = "form-status " + (type || "");
}


// Fallback: open the visitor's email app with the message filled in.
// Used when the backend isn't available (e.g. the page is opened from a computer, not Vercel).
function openEmailFallback(data) {
  const to = form.getAttribute("data-email");
  const subject = `New inquiry: ${data.service || "Project"} from ${data.name}`;
  const body = `Name: ${data.name}\nEmail: ${data.email}\nService: ${data.service}\n\n${data.message}`;
  window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

if (form) form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Simple validation
  let valid = true;
  form.querySelectorAll("[required]").forEach((field) => {
    const empty = !field.value.trim();
    const badEmail = field.type === "email" && !/^\S+@\S+\.\S+$/.test(field.value);
    const invalid = empty || badEmail;
    field.classList.toggle("invalid", invalid);
    if (invalid) valid = false;
  });

  if (!valid) {
    setStatus("Please fill in all fields with a valid email.", "error");
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  setStatus("");

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 400) {
      // the server rejected the input (e.g. invalid email): show its message
      setStatus(data.error || "Please check your details.", "error");
      return;
    }
    if (!res.ok) throw new Error(data.error || "Something went wrong.");

    form.reset();
    setStatus("Thanks! Your message has been sent. I'll get back to you soon.", "success");
  } catch (err) {
    // Backend not reachable or not set up yet: send through the visitor's email app instead
    openEmailFallback(Object.fromEntries(new FormData(form)));
    setStatus("Opening your email app to send this message...", "success");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
  }
});

// ===== Footer year =====
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Highlight the nav link of the section on screen =====
const navAnchors = document.querySelectorAll(".nav__pill a");
const sectionIds = ["home", "services", "projects", "about", "contact"];
window.addEventListener("scroll", () => {
  let current = "home";
  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top < 140) current = id;
  });
  // only on the main page (sub-pages keep "Projects" highlighted)
  if (document.getElementById("home")) navAnchors.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
});
