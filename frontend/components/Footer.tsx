/**
 * Task: T040
 * Spec: Professional Footer Component
 */

'use client';

import Link from 'next/link';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  appName?: string;
  year?: number;
}

export default function Footer({
  appName = 'Todo App',
  year = new Date().getFullYear(),
}: FooterProps) {
  const productLinks: FooterLink[] = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Login', href: '/login' },
    { label: 'Sign Up', href: '/signup' },
  ];

  const companyLinks: FooterLink[] = [
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ];

  const socialLinks: FooterLink[] = [
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'Twitter', href: 'https://twitter.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
  ];

  return (
    <footer
      className="bg-gray-900 text-white"
      role="contentinfo"
      aria-label="Footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand section */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <span className="text-xl font-bold tracking-tight">
                {appName}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Transform your productivity with our modern task management app. Built for individuals and teams.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-medium text-white mb-4">
              Product
            </h4>
            <nav aria-label="Product links">
              <ul className="space-y-2">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                      aria-label={link.label}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-medium text-white mb-4">
              Company
            </h4>
            <nav aria-label="Company links">
              <ul className="space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                      aria-label={link.label}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-sm font-medium text-white mb-4">
              Connect
            </h4>
            <nav aria-label="Social links">
              <ul className="space-y-2">
                {socialLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                      aria-label={link.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {year} {appName}. All rights reserved.
              </p>
            </div>

            {/* Made with love */}
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>Built for productive people</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export type { FooterProps, FooterLink };
