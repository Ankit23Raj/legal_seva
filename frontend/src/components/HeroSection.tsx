import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export const HeroSection = () => {
  const { translate } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen md:pl-56 pt-20 md:pt-0 md:flex items-center bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 py-12 md:py-0">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {translate('Get Legal Guidance from Law Students')}
              </h1>
            </div>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
              {translate('Connect with law students for advice on legal matters. Ask questions, get guidance, and learn about your rights.')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/sign-up')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                {isAuthenticated ? translate('Go to Dashboard') : translate('Get Started')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/role-selection')}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-6 text-lg rounded-lg transition-all"
              >
                {translate('Sign In')}
              </Button>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              {[
                { icon: '✓', text: 'Expert Guidance' },
                { icon: '✓', text: 'Verified Students' },
                { icon: '✓', text: 'Secure Chat' },
                { icon: '✓', text: '24/7 Support' },
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-700">
                  <span className="text-blue-600 font-bold text-lg">{feature.icon}</span>
                  <span className="text-sm md:text-base">{translate(feature.text)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image/Illustration */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* Placeholder for Hero Image */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
                <div className="space-y-6">
                  {/* Book Stack Illustration */}
                  <div className="flex justify-center">
                    <div className="relative w-48 h-48">
                      {/* Stylized books */}
                      <div className="absolute top-0 left-4 w-24 h-32 bg-blue-600 rounded-lg transform rotate-2 shadow-lg"></div>
                      <div className="absolute top-2 left-10 w-24 h-32 bg-blue-500 rounded-lg transform -rotate-3 shadow-lg"></div>
                      <div className="absolute top-4 left-16 w-24 h-32 bg-blue-400 rounded-lg transform rotate-1 shadow-lg"></div>

                      {/* Scales of Justice */}
                      <div className="absolute bottom-0 right-0">
                        <div className="text-6xl">⚖️</div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center pt-8">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">500+</div>
                      <div className="text-xs text-gray-600">{translate('Students')}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">5K+</div>
                      <div className="text-xs text-gray-600">{translate('Cases Solved')}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">4.9★</div>
                      <div className="text-xs text-gray-600">{translate('Rating')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
