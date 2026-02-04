/**
 * Task: T020, T021, T022, T023, T024, T025, T026
 * Spec: 012-AI-Powered UI Enhancements
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiZap, FiCpu, FiActivity } from 'react-icons/fi';

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
  fullWidth?: boolean;
}

export default function Hero({
  headline,
  subheadline,
  primaryCTA = {
    label: 'Experience AI Power',
    href: '/dashboard',
    type: 'primary',
  },
  secondaryCTA = {
    label: 'Meet the AI Assistant',
    href: '#ai-assistant',
    type: 'secondary',
  },
  fullWidth = false,
}: HeroProps) {
  const getButtonClasses = (button: CTAButton) => {
    const baseClasses = 'px-6 py-3 rounded-lg font-medium transition-all duration-300';

    if (button.type === 'primary') {
      return `${baseClasses} bg-gradient-to-r from-[hsl(217,91%,60%)] to-[hsl(280,65%,60%)] text-white hover:from-[hsl(217,91%,50%)] hover:to-[hsl(280,65%,50%)] shadow-lg hover:shadow-[hsl(217,91%,60%)/25] border border-white/20`;
    }
    return `${baseClasses} bg-white/20 text-white backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300`;
  };

  // Animation variants for floating task cards
  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      x: [0, 5, 0],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 6,
        repeat: Infinity
      }
    }
  };

  // Animation variants for AI assistant bubble
  const bounceVariants = {
    animate: {
      y: [0, -8, 0],
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity
      }
    }
  };

  // Animation variants for pulse background elements
  const pulseVariants = {
    animate: {
      opacity: [0.4, 0.8, 0.4],
      scale: [1, 1.05, 1],
      transition: {
        duration: 4,
        repeat: Infinity
      }
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-headline"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-ai-animated opacity-80"></div>

      {/* Animated background elements */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`bg-${i}`}
          className="absolute rounded-full bg-gradient-ai w-64 h-64 blur-3xl opacity-20"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          variants={pulseVariants}
          animate="animate"
          transition={{
            duration: Math.random() * 4 + 4,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Floating task cards */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-40 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl"
        variants={floatingVariants}
        animate="animate"
      >
        <div className="p-4">
          <div className="w-8 h-8 rounded-full bg-gradient-ai flex items-center justify-center mb-2">
            <FiZap className="text-white text-sm" />
          </div>
          <div className="h-2 bg-white/20 rounded mb-1"></div>
          <div className="h-2 bg-white/20 rounded w-3/4 mb-1"></div>
          <div className="h-2 bg-white/10 rounded w-1/2"></div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-16 w-40 h-32 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl"
        variants={floatingVariants}
        animate="animate"
        transition={{
          ...floatingVariants.animate.transition,
          delay: 1
        }}
      >
        <div className="p-4">
          <div className="w-8 h-8 rounded-full bg-gradient-ai flex items-center justify-center mb-2">
            <FiActivity className="text-white text-sm" />
          </div>
          <div className="h-2 bg-white/20 rounded mb-1"></div>
          <div className="h-2 bg-white/20 rounded w-5/6"></div>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-1/4 w-28 h-36 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl"
        variants={floatingVariants}
        animate="animate"
        transition={{
          ...floatingVariants.animate.transition,
          delay: 2
        }}
      >
        <div className="p-4">
          <div className="w-8 h-8 rounded-full bg-gradient-ai flex items-center justify-center mb-2">
            <FiCpu className="text-white text-sm" />
          </div>
          <div className="h-2 bg-white/20 rounded mb-1"></div>
          <div className="h-2 bg-white/20 rounded w-4/5 mb-1"></div>
          <div className="h-2 bg-white/10 rounded w-3/4"></div>
        </div>
      </motion.div>

      {/* AI Assistant Bubble */}
      <motion.div
        id="ai-assistant"
        className="absolute top-10 right-10 w-16 h-16 rounded-full bg-gradient-ai flex items-center justify-center shadow-lg glow"
        variants={bounceVariants}
        animate="animate"
      >
        <FiActivity className="text-white text-2xl animate-pulse" />
      </motion.div>

      {/* Main content */}
      <div className={`${fullWidth ? 'w-full' : 'max-w-7xl mx-auto'} px-4 sm:px-6 lg:px-8 relative z-10`}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1
                id="hero-headline"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent [text-shadow:_0_2px_4px_rgb(0_0_0_/_40%)] dark:[text-shadow:_0_2px_4px_rgb(0_0_0_/_20%)]"
              >
                {headline}
              </h1>

              <motion.p
                className="text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed [text-shadow:_0_1px_2px_rgb(0_0_0_/_60%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {subheadline}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
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
              </motion.div>

              {/* Social proof */}
              <motion.div
                className="mt-10 flex items-center justify-center lg:justify-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-ai border-2 border-white flex items-center justify-center text-white text-xs font-medium">S</div>
                  <div className="w-8 h-8 rounded-full bg-gradient-ai border-2 border-white flex items-center justify-center text-white text-xs font-medium">M</div>
                  <div className="w-8 h-8 rounded-full bg-gradient-ai border-2 border-white flex items-center justify-center text-white text-xs font-medium">E</div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[hsl(217,91%,40%)] to-[hsl(280,65%,40%)] border-2 border-white flex items-center justify-center text-white text-xs font-medium">+</div>
                </div>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-white">2,000+</span> users powered by AI
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* AI Visualization Area */}
          <motion.div
            className="flex-1 flex justify-center lg:justify-end max-w-xl lg:max-w-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative w-full max-w-lg">
              {/* Main AI visualization */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-ai p-1">
                <div className="w-full h-full bg-black/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-ai mb-4">
                      <FiActivity className="text-white text-3xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">AI Assistant</h3>
                    <p className="text-gray-200 text-sm">Always learning, always improving</p>
                  </div>
                </div>

                {/* Animated grid pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                    backgroundSize: '50px 50px'
                  }}></div>
                </div>
              </div>

              {/* Floating AI indicators */}
              <motion.div
                className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                variants={floatingVariants}
                animate="animate"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-ai flex items-center justify-center">
                    <FiZap className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">AI Optimized</p>
                    <p className="text-xs text-gray-300">98% efficiency</p>
                  </div>
                </div>
              </motion.div>

              {/* AI progress indicator */}
              <motion.div
                className="absolute -top-3 -right-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
                variants={floatingVariants}
                animate="animate"
                transition={{
                  ...floatingVariants.animate.transition,
                  delay: 1.5
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-ai rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '95%' }}
                      transition={{ duration: 1.5, delay: 1 }}
                    />
                  </div>
                  <span className="text-xs font-medium text-white">Smart</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export type { HeroProps, CTAButton };
