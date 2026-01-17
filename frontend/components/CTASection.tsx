/**
 * Task: T033
 * Spec: Professional CTA Section
 */

'use client';

import Link from 'next/link';

interface CTAButton {
  label: string;
  href: string;
  type?: 'primary' | 'large';
}

interface CTASectionProps {
  headline: string;
  subtext?: string;
  ctaButton: CTAButton;
  fullWidth?: boolean;
}

export default function CTASection({
  headline,
  subtext,
  ctaButton,
  fullWidth = false,
}: CTASectionProps) {
  return (
    <section
      id="cta"
      className="bg-gray-900 py-16 sm:py-20"
      aria-labelledby="cta-heading"
    >
      <div className={`${fullWidth ? 'w-full' : 'max-w-4xl mx-auto'} px-4 sm:px-6 lg:px-8 text-center`}>
        {/* Headline */}
        <h2
          id="cta-heading"
          className="text-3xl sm:text-4xl font-bold text-white mb-6"
        >
          {headline}
        </h2>

        {/* Subtext (optional) */}
        {subtext && (
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            {subtext}
          </p>
        )}

        {/* CTA Button */}
        <Link
          href={ctaButton.href}
          className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors"
          aria-label={ctaButton.label}
        >
          {ctaButton.label}
        </Link>

        {/* Trust indicators */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Free to start
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            No credit card required
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Cancel anytime
          </div>
        </div>
      </div>
    </section>
  );
}

export type { CTASectionProps, CTAButton };
