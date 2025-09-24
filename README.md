<div align="center">
  <a href="https://rout.aars.works">
    <img
      src="public/images/logo_svg.svg"
      alt="Routaar Logo"
      height="64"
    />
  </a>
  <p></p>
  <p>
    <b>
      Routaar – Central control tower for branded subdomains, smart redirects, and masked rendering.
    </b>
  </p>

<a href="https://rout.aars.works/dashboard">Dashboard</a>
<span>&nbsp;&nbsp;❖&nbsp;&nbsp;</span>
<a href="https://rout.aars.works/docs">Docs</a>
<span>&nbsp;&nbsp;❖&nbsp;&nbsp;</span>
<a href="https://github.com/UserAAR/RoutAAR">Repository</a>
<span>&nbsp;&nbsp;❖&nbsp;&nbsp;</span>
<a href="https://links.aars.works">Social Links</a>

<div align="center">
<a href="https://rout.aars.works">
<img src="public/images/screenshot_png.png" alt="Routaar Screenshot">
</a>
<p></p>
</div>

<img alt="Next.js" src="https://img.shields.io/badge/Next.js%2014-000?logo=nextdotjs&logoColor=fff&style=flat" />
<img alt="Turso" src="https://img.shields.io/badge/Turso-4FF8D2?logo=turso&logoColor=000&style=flat" />
<img alt="License" src="https://img.shields.io/badge/License-GPL--3.0-blue.svg" />

</div>

## 👨‍🚀 Overview

Routaar is a unified control panel to manage branded subdomains and smart links for the `aars.works` ecosystem (or your own domain). It supports:

- Redirect mode: short, branded subdomains that forward to long URLs, with optional path/query passthrough.
- Render mode: reverse-proxy masking to show external content (e.g., Notion, Figma) under your subdomain without changing the browser URL.
- Centralized dashboard: create, edit, delete rules for both links and subdomains.
- Basic analytics: clicks and visit details.

Built with:

- Next.js 14 App Router
- Prisma + Turso (libSQL)
- Auth.js (NextAuth)
- Tailwind CSS + Radix UI

## 📚 Documentation

All setup and operations are documented at `https://rout.aars.works/docs`.

- Local development
- Environment variables
- Turso database setup
- Wildcard DNS and domains
- Vercel deployment and runtime notes
- Subdomain rules (redirect/render)
- Path-based slugs
- Security, analytics, and exports

> The application UI does not add a Docs link intentionally; navigate directly to `https://rout.aars.works/docs`.

## 🧭 Roadmap

- Enhanced analytics (top referrers, countries)
- Rate limiting and abuse prevention
- Team/multi-user workspaces
- Webhooks and API tokens

## 🤝 Contributing

Issues and feature requests are welcome. Please open an issue at `https://github.com/UserAAR/RoutAAR/issues`.

## 💖 Sponsorship

If you find Routaar useful, consider supporting development:

- GitHub Sponsors: `@UserAAR`
- Buy Me a Coffee: `https://www.buymeacoffee.com/devaar`

## 📬 Contact

- Email: `amil.abdullazada@gmail.com`
- LinkedIn: `https://www.linkedin.com/in/aar-amil/`
- Website: `https://aar.is-a.dev/` and `https://dev.aars.works/`

## 📝 License

GPL-3.0. See `LICENSE` for details.
