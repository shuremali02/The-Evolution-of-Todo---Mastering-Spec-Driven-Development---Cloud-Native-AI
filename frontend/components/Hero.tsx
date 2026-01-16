/**
 * Task: T029
 * Spec: Professional Hero Section with Task Management Image
 */

'use client';

import Link from 'next/link';
import { FadeInWhenVisible, StaggerContainer, StaggerChild, ScaleInWhenVisible } from '@/components/ScrollAnimations';

interface CTAButton {
  label: string;
  href: string;
  type?: 'primary' | 'secondary';
}

interface HeroProps {
  headline: string;
  subheadline: string;
  primaryCTA?: CTAButton;
  secondaryCTA?: CTAButton;
}

export default function Hero({
  headline,
  subheadline,
  primaryCTA = {
    label: 'Sign Up Free',
    href: '/signup',
    type: 'primary',
  },
  secondaryCTA = {
    label: 'Learn More',
    href: '#features',
    type: 'secondary',
  },
}: HeroProps) {
  const getButtonClasses = (button: CTAButton) => {
    const baseClasses = 'px-6 py-3 rounded-lg font-medium transition-colors';

    if (button.type === 'primary') {
      return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800`;
    }
    return `${baseClasses} bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600`;
  };

  return (
    <section
      id="hero"
      className="bg-white dark:bg-gray-900 py-16 sm:py-20 lg:py-24"
      aria-labelledby="hero-headline"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Content - with scroll animations */}
          <FadeInWhenVisible
            className="flex-1 text-center lg:text-left max-w-2xl"
            direction="left"
            distance={30}
          >
            <FadeInWhenVisible
              id="hero-headline"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6"
              direction="left"
              distance={30}
              delay={0.1}
            >
              {headline}
            </FadeInWhenVisible>

            <FadeInWhenVisible
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
              direction="left"
              distance={30}
              delay={0.2}
            >
              {subheadline}
            </FadeInWhenVisible>

            {/* CTA Buttons */}
            <FadeInWhenVisible
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              direction="left"
              distance={30}
              delay={0.3}
            >
              {primaryCTA && (
                <Link
                  href={primaryCTA.href}
                  className={getButtonClasses(primaryCTA)}
                  aria-label={primaryCTA.label}
                >
                  {primaryCTA.label}
                </Link>
              )}
              {secondaryCTA && (
                <Link
                  href={secondaryCTA.href}
                  className={getButtonClasses(secondaryCTA)}
                  aria-label={secondaryCTA.label}
                >
                  {secondaryCTA.label}
                </Link>
              )}
            </FadeInWhenVisible>

            {/* Social proof */}
            <FadeInWhenVisible
              className="mt-10 flex items-center justify-center lg:justify-start gap-4"
              direction="left"
              distance={30}
              delay={0.4}
            >
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs font-medium">S</div>
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs font-medium">M</div>
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs font-medium">E</div>
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs font-medium">+</div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">2,000+</span> users
              </p>
            </FadeInWhenVisible>
          </FadeInWhenVisible>

          {/* Hero Image - Task Management Illustration - with scroll animations */}
          <ScaleInWhenVisible
            className="flex-1 flex justify-center lg:justify-end max-w-xl lg:max-w-none"
            delay={0.2}
            scaleFrom={0.9}
          >
            <div className="relative w-full max-w-lg">
              {/* Main image placeholder with task management theme */}
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <img
                  src="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&q=80"
                  alt="Task management dashboard with organized tasks and progress tracking"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating card decoration */}
              <FadeInWhenVisible
                className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-600"
                direction="up"
                distance={20}
                delay={0.5}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Tasks Completed</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">1,234 today</p>
                  </div>
                </div>
              </FadeInWhenVisible>

              {/* Progress decoration */}
              <ScaleInWhenVisible
                className="absolute -top-3 -right-3 bg-white dark:bg-gray-700 rounded-lg shadow-md p-3 border border-gray-200 dark:border-gray-600"
                delay={0.6}
                scaleFrom={0.8}
              >
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '75%' }} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">75%</span>
                </div>
              </ScaleInWhenVisible>
            </div>
          </ScaleInWhenVisible>
        </div>
      </div>
    </section>
  );
}

export type { HeroProps, CTAButton };
