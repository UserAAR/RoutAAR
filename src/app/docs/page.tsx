import { TypographyH1, TypographyH2, TypographyH3, TypographyP, TypographyListUl, TypographyListOl } from "@/ui/typography";
import { Card } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { cn } from "@/utils";

const DocsPage = () => {
  return (
    <div className={cn("container", "py-8 lg:py-12")}>
      <div className="flex items-center gap-2">
        <TypographyH1 className="mt-0">Routaar Documentation</TypographyH1>
        <Badge>v3</Badge>
      </div>
      <TypographyP>Routaar is a central control tower for managing branded subdomains and smart redirects. This document explains how to run it locally, configure environments, and deploy to production.</TypographyP>

      <TypographyH2>Quick Start</TypographyH2>
      <Card className="p-4">
        <TypographyListOl>
          <li>Clone the repo: <code>git clone https://github.com/UserAAR/RoutAAR.git</code></li>
          <li>Install deps: <code>pnpm install</code></li>
          <li>Copy env: <code>cp .env.example .env.local</code> and fill required variables</li>
          <li>Generate Prisma client: <code>pnpm db:generate</code></li>
          <li>Run dev server: <code>pnpm dev</code></li>
        </TypographyListOl>
      </Card>

      <TypographyH2>Environment Variables</TypographyH2>
      <TypographyP>Define the following variables. See <code>src/env.mjs</code> for the schema.</TypographyP>
      <Card className="p-4">
        <TypographyListUl>
          <li><b>PRIMARY_HOST</b>: Control panel host (e.g., <code>rout.aars.works</code>)</li>
          <li><b>CONTROL_HOST</b>: Same as <b>PRIMARY_HOST</b> (kept for clarity)</li>
          <li><b>PUBLIC_ROOT_HOST</b>: Public domain for subdomains/links (e.g., <code>aars.works</code>)</li>
          <li><b>AUTH_SECRET</b>: NextAuth secret</li>
          <li><b>GOOGLE_CLIENT_ID</b>, <b>GOOGLE_CLIENT_SECRET</b>: OAuth credentials</li>
          <li><b>GITHUB_ID</b>, <b>GITHUB_CLIENT_SECRET</b>: (optional) GitHub OAuth</li>
          <li><b>TURSO_DATABASE_URL</b>, <b>TURSO_AUTH_TOKEN</b>: Turso connection</li>
          <li><b>DATABASE_URL</b>: Local SQLite fallback (e.g., <code>file:dev.db</code>)</li>
        </TypographyListUl>
      </Card>

      <TypographyH2>Database (Turso)</TypographyH2>
      <TypographyP>Production uses Turso (libSQL). Locally, SQLite is supported. Ensure Prisma client is generated after schema changes.</TypographyP>
      <Card className="p-4">
        <TypographyListOl>
          <li>Create a Turso database and set <code>TURSO_DATABASE_URL</code> and <code>TURSO_AUTH_TOKEN</code>.</li>
          <li>Run <code>pnpm db:generate</code> to sync Prisma client.</li>
          <li>Use <code>prisma migrate</code> or your preferred migration flow when changing schema.</li>
        </TypographyListOl>
      </Card>

      <TypographyH2>Domains and Wildcards</TypographyH2>
      <TypographyP>Configure wildcard DNS so that all unknown subdomains resolve to the app. Typical setup on Vercel:</TypographyP>
      <Card className="p-4">
        <TypographyListUl>
          <li>Project domains: <code>rout.aars.works</code> (primary), <code>*.aars.works</code></li>
          <li>DNS: CNAME for <code>rout</code> and <code>*</code> pointing to <code>cname.vercel-dns.com.</code></li>
        </TypographyListUl>
      </Card>

      <TypographyH2>Middleware and Resolution</TypographyH2>
      <TypographyP>Subdomain resolution is handled in middleware via internal API routes to remain Edge-compatible.</TypographyP>
      <TypographyListUl>
        <li>Subdomains: <code>/api/resolve-subdomain</code> → redirect or render mode (reverse proxy)</li>
        <li>Links (path-based): <code>/api/resolve-slug</code> works on both control and root hosts</li>
        <li>Render mode uses <code>/api/_proxy</code> to stream external content under your subdomain</li>
      </TypographyListUl>

      <TypographyH2>Deployment (Vercel)</TypographyH2>
      <Card className="p-4">
        <TypographyListOl>
          <li>Set env variables on Vercel (see above).</li>
          <li>Ensure <code>PRIMARY_HOST</code> and <code>CONTROL_HOST</code> point to <code>rout.aars.works</code>, and <code>PUBLIC_ROOT_HOST</code> to <code>aars.works</code>.</li>
          <li>Push to <code>main</code>; Vercel will build with <code>pnpm build</code>. Lint/typecheck must pass.</li>
          <li>Login with Google; create subdomain/link rules; verify redirect and render flows.</li>
        </TypographyListOl>
      </Card>

      <TypographyH2>Security & Limits</TypographyH2>
      <TypographyListUl>
        <li>Authentication via OAuth providers (NextAuth).</li>
        <li>All DB access removed from Edge middleware; only API routes and server actions use Prisma.</li>
        <li>Optional rate limiting can be added in API routes.</li>
      </TypographyListUl>

      <TypographyH2>Exports</TypographyH2>
      <TypographyP>From Settings, export all links or subdomains as JSON files (<code>routaar-links.json</code>, <code>routaar-subdomains.json</code>).</TypographyP>

      <TypographyH2>Support</TypographyH2>
      <TypographyP>Issues: <a href="https://github.com/UserAAR/RoutAAR/issues">github.com/UserAAR/RoutAAR/issues</a>. Sponsorship: GitHub Sponsors <code>@UserAAR</code> or <a href="https://www.buymeacoffee.com/devaar">Buy Me a Coffee</a>.</TypographyP>
    </div>
  );
};

export default DocsPage; 