'use client';

import Link from 'next/link';

const FOOTER_LINKS = {
  Product: ['Features', 'Knowledge Graph', 'Browser Extension', 'API', 'Changelog'],
  Company:  ['About', 'Blog', 'Careers', 'Press', 'Contact'],
  Legal:    ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'],
};

const SOCIALS = [
  {
    label: 'Twitter / X',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M12.9 1.5h2.3L9.9 7.1 16 14.5h-4.3l-3.4-4.4-3.9 4.4H2l5.6-6.4L0 1.5h4.4l3.1 4 3.6-4H12.9zM12 13.2h1.3L4.1 2.8H2.7l9.3 10.4z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer
      aria-label="Site footer"
      className="relative bg-[var(--bg-warm)] border-t border-[var(--border-cream)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5 group">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--amber-primary)] to-[var(--amber-light)] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--amber-primary)] to-[var(--amber-light)] flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M4 4h10v10H4V4z" stroke="white" strokeWidth="1.5" fill="rgba(255,255,255,0.25)" />
                    <path d="M2 2h4v4H2V2z" stroke="white" strokeWidth="1.2" fill="rgba(255,255,255,0.15)" />
                    <path d="M12 12h4v4h-4v-4z" stroke="white" strokeWidth="1.2" fill="rgba(255,255,255,0.15)" />
                  </svg>
                </div>
              </div>
              <span className="font-bold text-[var(--text-primary)] text-lg">
                Mnemo<span className="text-gradient-gold">AI</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-[200px]">
              Your intelligent second brain for the internet.
            </p>
            {/* Socials */}
            <div className="flex gap-2 mt-6">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--amber-primary)] bg-white hover:bg-amber-50 border border-[var(--border-light)] hover:border-[var(--border-warm)] transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <p className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-widest mb-5">
                {category}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[var(--text-muted)] hover:text-[var(--amber-primary)] transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="border-t border-[var(--border-cream)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-muted)]">
            © {new Date().getFullYear()} MnemoAI Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-[var(--text-muted)]">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
