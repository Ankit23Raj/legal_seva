import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const ContactSection = () => {
  const { translate } = useLanguage();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission - you can integrate with your backend here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section id="contact" className="relative py-20 md:pl-56 px-4 md:px-8 bg-white">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {translate('Get in Touch')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {translate('Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.')}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            {/* Email */}
            <div className="flex gap-4">
              <div className="p-3 bg-blue-100 rounded-lg h-fit">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{translate('Email')}</h3>
                <p className="text-gray-600">info@legalseva.com</p>
                <p className="text-sm text-gray-500 mt-1">{translate('We reply within 24 hours')}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <div className="p-3 bg-blue-100 rounded-lg h-fit">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{translate('Phone')}</h3>
                <p className="text-gray-600">+91 (123) 456-7890</p>
                <p className="text-sm text-gray-500 mt-1">{translate('Mon - Fri, 9am - 6pm IST')}</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex gap-4">
              <div className="p-3 bg-blue-100 rounded-lg h-fit">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{translate('Location')}</h3>
                <p className="text-gray-600">Legal Seva Office</p>
                <p className="text-sm text-gray-500 mt-1">{translate('India')}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {translate('Full Name')}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={translate('Your name')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {translate('Email Address')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={translate('your@email.com')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {translate('Subject')}
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder={translate('What is this about?')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {translate('Message')}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder={translate('Your message here...')}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {translate('Send Message')}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
