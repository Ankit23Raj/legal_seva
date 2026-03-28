import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const CTASection = () => {
  const { translate } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="relative py-20 md:pl-56 px-4 md:px-8 bg-gradient-to-r from-blue-600 to-indigo-600 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          {translate('Ready to Get Legal Guidance?')}
        </h2>

        <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
          {translate('Join our community today and connect with law students who can help you navigate your legal concerns. Get expert advice when you need it most.')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => navigate('/sign-up')}
            className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            {translate('Create Your Account')}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/sign-in')}
            className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-lg transition-all"
          >
            {translate('Sign In')}
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/20">
          <div>
            <div className="text-3xl font-bold text-white mb-2">500+</div>
            <div className="text-sm text-blue-100">{translate('Law Students')}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">5K+</div>
            <div className="text-sm text-blue-100">{translate('Issues Resolved')}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">✓</div>
            <div className="text-sm text-blue-100">{translate('Verified & Trusted')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
