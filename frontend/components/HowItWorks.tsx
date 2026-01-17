/**
 * Task: T031
 * Spec: Professional How It Works Section with SVG Icons
 */

'use client';

import { FadeInWhenVisible, StaggerContainer, StaggerChild } from '@/components/ScrollAnimations';

interface Step {
  number: number;
  title: string;
  description: string;
  icon?: string;
}

interface HowItWorksProps {
  steps: Step[];
  sectionHeading?: string;
  fullWidth?: boolean;
}

export default function HowItWorks({
  steps,
  sectionHeading = 'How It Works',
  fullWidth = false,
}: HowItWorksProps) {
  const renderIcon = (iconName?: string) => {
    if (!iconName) return null;

    switch (iconName) {
      case 'user-add':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016 6zM1 4h10a1 1 0 011 1v10a1 1 0 01-1 1H1a1 1 0 01-1-1V5a1 1 0 011-1z" />
          </svg>
        );
      case 'plus':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        );
      case 'chart':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <section
      id="how-it-works"
      className="py-16 bg-white dark:bg-gray-900"
      aria-labelledby="how-it-works-heading"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className={`${fullWidth ? 'w-full' : 'max-w-7xl mx-auto'}`}>
          {/* Section Heading */}
          <FadeInWhenVisible
            className="text-center mb-12"
            distance={30}
          >
            <h2
              id="how-it-works-heading"
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              {sectionHeading}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get started with Todo App in just three simple steps
            </p>
          </FadeInWhenVisible>

          {/* Steps */}
          <StaggerContainer
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            staggerChildren={0.1}
          >
            {steps.map((step, index) => (
              <StaggerChild
                key={step.number}
                className="relative text-center"
                aria-label={`Step ${step.number}: ${step.title}`}
              >
                {/* Step Number Circle */}
                <FadeInWhenVisible
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl"
                  distance={30}
                  delay={index * 0.1}
                >
                  {step.number}
                </FadeInWhenVisible>

                {/* Icon */}
                {step.icon && (
                  <FadeInWhenVisible
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400"
                    distance={30}
                    delay={index * 0.1 + 0.1}
                  >
                    {renderIcon(step.icon)}
                  </FadeInWhenVisible>
                )}

                {/* Step Content */}
                <div className="pt-2">
                  <FadeInWhenVisible
                    className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
                    distance={30}
                    delay={index * 0.1 + 0.2}
                  >
                    {step.title}
                  </FadeInWhenVisible>
                  <FadeInWhenVisible
                    className="text-gray-600 dark:text-gray-300 leading-relaxed"
                    distance={30}
                    delay={index * 0.1 + 0.3}
                  >
                    {step.description}
                  </FadeInWhenVisible>
                </div>

                {/* Connector line (desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[62%] right-[62%] h-0.5 bg-gray-200 dark:bg-gray-700 -z-10" />
                )}
              </StaggerChild>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}

export type { HowItWorksProps, Step };
