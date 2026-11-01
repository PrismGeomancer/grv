import Link from "next/link";
import { Logo } from "@/components/brand";
import { copy, SOCIAL } from "@/data";

const f = copy.footer;

/** §8.10 Footer. The risk notice is verbatim, always visible, never collapsed. */
export function Footer() {
  return (
    <footer className="border-t border-line pt-16 pb-10">
      <div className="container-groove">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <Link href="/" aria-label="Groove, home" className="inline-block rounded-md">
              <Logo />
            </Link>
            <p className="mt-5 max-w-[48ch] text-paper-dim">{f.tagline}</p>
          </div>
          <nav aria-label={f.navLabel}>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 font-mono text-[0.75rem] tracking-[0.1em] uppercase sm:grid-cols-3 md:grid-cols-2">
              {f.links.map((l) => (
                <li key={l.label}>
                  {l.href.startsWith("/") ? (
                    <Link
                      href={l.href}
                      className="text-paper-dim transition-colors hover:text-paper"
                    >
                      {l.label}
                    </Link>
                  ) : (
                    <a href={l.href} className="text-paper-dim transition-colors hover:text-paper">
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
              <li>
                <a
                  href={SOCIAL.x.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={SOCIAL.x.a11y}
                  className="text-paper-dim normal-case transition-colors hover:text-paper"
                >
                  {SOCIAL.x.label} · {SOCIAL.x.handle} <span aria-hidden>↗</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 grid gap-6 border-t border-line pt-8 text-[0.875rem] md:grid-cols-[1.2fr_1fr] md:gap-12">
          <p className="border-l-2 border-onair pl-4 text-paper/85">{f.risk}</p>
          <p className="text-paper-dim italic">{f.platformNote}</p>
        </div>

        <p className="mt-10 font-mono text-[0.75rem] text-paper-dim">
          © {new Date().getFullYear()} Groove
        </p>
      </div>
    </footer>
  );
}
