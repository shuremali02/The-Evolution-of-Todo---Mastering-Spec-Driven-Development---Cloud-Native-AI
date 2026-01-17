/**
 * Task: T032
 * Spec: 2.6 Testimonials Section Component (New)
 *
 * Customer testimonials with:
 * - Social proof avatars
 * - Star ratings
 * - Gradient accents
 */

'use client';

interface Testimonial {
  id: number;
  content: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
}

interface TestimonialsProps {
  sectionHeading?: string;
  sectionSubheading?: string;
  fullWidth?: boolean;
}

export default function Testimonials({
  sectionHeading = 'Loved by Productive Teams',
  sectionSubheading = 'See what our users are saying about Todo App',
  fullWidth = false,
}: TestimonialsProps) {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      content: 'Todo App has completely transformed how our team manages projects. The intuitive interface and powerful features have boosted our productivity by 40%.',
      author: 'Sarah Johnson',
      role: 'Product Manager',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      rating: 5,
    },
    {
      id: 2,
      content: 'As a freelancer, I juggle multiple projects. This app helps me stay organized and never miss a deadline. The mobile app is fantastic!',
      author: 'Michael Chen',
      role: 'Freelance Designer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      rating: 5,
    },
    {
      id: 3,
      content: 'The best task management tool I have ever used. Simple yet powerful. It has all the features I need without the clutter.',
      author: 'Emily Rodriguez',
      role: 'Startup Founder',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      rating: 5,
    },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-amber-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section
      id="testimonials"
      className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
      aria-labelledby="testimonials-heading"
    >
      <div className={`${fullWidth ? 'w-full' : 'max-w-7xl mx-auto'} px-4 sm:px-6 lg:px-8`}>
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            id="testimonials-heading"
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {sectionHeading}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {sectionSubheading}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                index === 1 ? 'md:-mt-4 md:mb-4' : ''
              }`}
              aria-label={`Testimonial from ${testimonial.author}`}
            >
              {/* Gradient accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-2xl" />

              {/* Quote icon */}
              <div className="mb-6">
                <svg
                  className="w-10 h-10 text-indigo-200 dark:text-gray-600 group-hover:text-indigo-300 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Content */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {testimonial.content}
              </p>

              {/* Rating */}
              <div className="mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt=""
                  className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700"
                  loading="lazy"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
            {/* Company logos (text-based for demo) */}
            <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 font-semibold text-lg">
              <span className="text-2xl">🏢</span>
              <span>Acme Corp</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 font-semibold text-lg">
              <span className="text-2xl">🚀</span>
              <span>StartUp Inc</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 font-semibold text-lg">
              <span className="text-2xl">💡</span>
              <span>TechFlow</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 font-semibold text-lg">
              <span className="text-2xl">🎯</span>
              <span>GoalCo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export type { TestimonialsProps, Testimonial };
