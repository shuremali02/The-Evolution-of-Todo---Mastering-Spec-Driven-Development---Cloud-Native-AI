/**
 * Task: T-007
 * Spec: Landing Page Composition (Professional Theme)
 */

'use client';

import { PublicPageLayout } from '@/components/PublicPageLayout';
import Hero from '@/components/Hero';
import FeatureCard from '@/components/FeatureCard';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';
import { FadeInWhenVisible } from '@/components/ScrollAnimations';

export default function LandingPage() {
  // Feature cards data with professional icon names
  const features = [
    {
      icon: 'check',
      title: 'Easy Task Management',
      description: 'Create, organize, and track your tasks with an intuitive interface. Never miss a deadline again.',
    },
    {
      icon: 'bolt',
      title: 'Lightning Fast',
      description: 'Built for speed with modern architecture. Add tasks in seconds, find them instantly.',
    },
    {
      icon: 'shield',
      title: 'Secure and Private',
      description: 'Your tasks are encrypted and private. Enterprise-grade security keeps your data safe.',
    },
    {
      icon: 'phone',
      title: 'Works Everywhere',
      description: 'Access your tasks from any device. Your productivity follows you wherever you go.',
    },
    {
      icon: 'target',
      title: 'Stay Focused',
      description: 'Prioritize what matters most. Smart features help you concentrate on important tasks.',
    },
    {
      icon: 'users',
      title: 'Team Collaboration',
      description: 'Share tasks, assign responsibilities, and work together seamlessly with your team.',
    },
  ];

  // How it works steps
  const steps = [
    {
      number: 1,
      title: 'Create Account',
      description: 'Sign up in seconds with just your email. No credit card required to get started.',
      icon: 'user-add',
    },
    {
      number: 2,
      title: 'Add Tasks',
      description: 'Quickly add tasks with titles and descriptions. Organize them into categories.',
      icon: 'plus',
    },
    {
      number: 3,
      title: 'Stay Productive',
      description: 'Track progress, complete tasks, and celebrate your achievements. Watch your productivity soar!',
      icon: 'chart',
    },
  ];

  return (
    <PublicPageLayout breadcrumbs={[]} showBreadcrumbs={false} fullWidth={false}>
      {/* Hero Section */}
      <Hero
        headline="Transform Your Productivity"
        subheadline="Manage tasks efficiently, stay organized, and achieve your goals with our modern task management app. Join thousands of productive users today."
        primaryCTA={{
          label: 'Sign Up Free',
          href: '/signup',
          type: 'primary',
        }}
        secondaryCTA={{
          label: 'Learn More',
          href: '#features',
        }}
        fullWidth={true}
      />

      {/* Features Section */}
      <section
        id="features"
        className="py-16 bg-gray-50 dark:bg-gray-800"
        aria-labelledby="features-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible
            className="text-center mb-4"
            distance={30}
          >
            <h2
              id="features-heading"
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white"
            >
              Powerful Features
            </h2>
          </FadeInWhenVisible>

          <FadeInWhenVisible
            className="text-lg text-gray-600 dark:text-gray-300 text-center mb-12 max-w-2xl mx-auto"
            distance={30}
            delay={0.1}
          >
            Everything you need to stay organized and get things done
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks
        steps={steps}
        sectionHeading="How It Works"
        fullWidth={true}
      />

      {/* Testimonials Section */}
      <Testimonials fullWidth={true} />

      {/* CTA Section */}
      <CTASection
        headline="Ready to Get Started?"
        subtext="Join thousands of productive users and transform the way you manage your tasks. It's free to try."
        ctaButton={{
          label: 'Start Your Free Trial',
          href: '/signup',
        }}
        fullWidth={true}
      />
    </PublicPageLayout>
  );
}
