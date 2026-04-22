import React from 'react';
import { MessageSquare, Users, Award, BrainCircuit, BookMarked, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const features = [
  {
    icon: MessageSquare,
    title: 'Share Legal Issues',
    description:
      'Post your legal problems and get personalized advice. Describe your situation, upload documents, and connect with law students who can help you understand your options.',
  },
  {
    icon: Users,
    title: 'Connect with Students',
    description:
      'Engage with verified law students through our secure messaging system and schedule video calls for complex issues.',
  },
  {
    icon: Award,
    title: 'Prime Student Access',
    description:
      'Students with exceptional ratings become Prime Users, offering premium advice for those with complex legal needs.',
  },
  {
    icon: BrainCircuit,
    title: 'Interactive Quizzes',
    description:
      'Challenge yourself with quizzes covering different legal topics and difficulty levels to increase your understanding.',
  },
  {
    icon: BookMarked,
    title: 'Legal Modules',
    description:
      'Explore comprehensive guides on Indian constitution, criminal law, family law, cyber law, property rights, and consumer rights.',
  },
  {
    icon: Zap,
    title: 'Expert Guidance',
    description:
      'Get instant answers and detailed explanations from experienced law students on any legal topic.',
  },
];

export const FeaturesSection = () => {
  const { translate } = useLanguage();

  return (
    <section id="features" className="relative py-20 md:pl-56 px-4 md:px-8 bg-white">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {translate('Key Features')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {translate('Everything you need to get professional legal guidance in one place')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white border border-gray-200 rounded-xl p-8 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Background Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>

                {/* Icon */}
                <div className="mb-6 inline-block p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {translate(feature.title)}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {translate(feature.description)}
                </p>

                {/* Bottom Border */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-b-xl scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </div>
            );
          })}
        </div>

        {/* Scroll Animation */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    </section>
  );
};
