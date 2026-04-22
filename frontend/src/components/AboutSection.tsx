import React from 'react';
import { CheckCircle, Heart, Shield, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const values = [
  {
    icon: Shield,
    title: 'Secure & Confidential',
    description: 'Your personal and legal information is protected with enterprise-grade security.',
  },
  {
    icon: Heart,
    title: 'Student Verified',
    description: 'All law students are verified professionals committed to helping you.',
  },
  {
    icon: Zap,
    title: 'Fast Responses',
    description: 'Get timely responses to your legal questions from qualified students.',
  },
  {
    icon: CheckCircle,
    title: 'Quality Assured',
    description: 'Rating system ensures you get guidance from the best law students.',
  },
];

export const AboutSection = () => {
  const { translate } = useLanguage();

  return (
    <section id="about" className="relative py-20 md:pl-56 px-4 md:px-8 bg-gray-50">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {translate('About Legal Seva')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {translate('Bridging the gap between legal guidance and accessibility. Making legal expertise available to everyone.')}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
          {/* Left - Text */}
          <div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {translate(
                'Legal Seva is a platform designed to connect people with expert legal guidance from qualified law students. We believe everyone deserves access to affordable, reliable legal advice.'
              )}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {translate(
                'Our mission is to democratize legal services by connecting individuals with verified law students who can provide personalized guidance on various legal matters.'
              )}
            </p>
            <div className="space-y-3">
              {[
                'Verified Law Students',
                'Secure Communication',
                'Affordable Solutions',
                'Expert Guidance',
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{translate(item)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Values */}
          <div className="space-y-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        {translate(value.title)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {translate(value.description)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
