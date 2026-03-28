import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Mail, FileText, BookOpen, MessageSquare, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Help = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();

  const faqItems = [
    {
      question: translate('How to post a legal issue?'),
      answer: translate(
        'Navigate to "Share Issue" from your dashboard. Fill in the issue details, category, and upload any supporting documents. Our network of law students will review and respond to your query.'
      ),
    },
    {
      question: translate('How to connect with law students?'),
      answer: translate(
        'Once you post an issue, verified law students will see your case. You can communicate with them through our secure messaging platform in real-time.'
      ),
    },
    {
      question: translate('Is this platform free?'),
      answer: translate(
        'Yes! Legal Seva provides free legal guidance through our community of law students. Basic features are available to all users at no cost.'
      ),
    },
    {
      question: translate('How to upload documents?'),
      answer: translate(
        'When posting an issue or in chat, use the upload button to attach documents. Supported formats include PDF, DOC, DOCX, and images (JPG, PNG).'
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-20 md:pt-0 pb-12 md:ml-56">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle size={32} />
              <h1 className="text-4xl font-bold">{translate('Help & Support')}</h1>
            </div>
            <p className="text-lg text-blue-100">
              {translate('Get help regarding legal guidance and platform usage')}
            </p>
          </div>
        </section>

        {/* Main Content Container */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Quick Actions */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{translate('Quick Actions')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => navigate('/share-issue')}
                className="h-auto py-6 flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <FileText size={24} />
                <span className="text-center">{translate('Post a Legal Issue')}</span>
              </Button>
              <Button
                onClick={() => navigate('/legal-modules')}
                className="h-auto py-6 flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <BookOpen size={24} />
                <span className="text-center">{translate('Browse Legal Modules')}</span>
              </Button>
              <Button
                onClick={() => navigate('/messages')}
                className="h-auto py-6 flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <MessageSquare size={24} />
                <span className="text-center">{translate('View Messages')}</span>
              </Button>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{translate('Frequently Asked Questions')}</h2>
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left hover:text-blue-600">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </section>

          {/* Features/Highlights Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{translate('Platform Features')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <Zap size={20} />
                    {translate('Real-time Communication')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  {translate('Get instant responses from verified law students through our secure messaging platform.')}
                </CardContent>
              </Card>

              <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <FileText size={20} />
                    {translate('Document Support')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  {translate('Upload and share legal documents securely to support your case.')}
                </CardContent>
              </Card>

              <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <BookOpen size={20} />
                    {translate('Learning Modules')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  {translate('Access comprehensive guides on Indian law covering various legal domains.')}
                </CardContent>
              </Card>

              <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <MessageSquare size={20} />
                    {translate('Expert Guidance')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  {translate('Connect with verified law students and get guidance on your legal concerns.')}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Contact Support Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{translate('Contact Support')}</h2>
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle>{translate('Need Additional Help?')}</CardTitle>
                <CardDescription>
                  {translate('Reach out to our support team for any questions or concerns.')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="text-blue-600" size={20} />
                  <div>
                    <p className="font-semibold">{translate('Email Support')}</p>
                    <p className="text-sm text-gray-600">support@legalseva.com</p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    // Fallback to messages for now
                    navigate('/messages');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {translate('Contact Us')}
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Chat Support Placeholder */}
          <section className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{translate('Live Chat Support')}</h3>
            <p className="text-gray-600 mb-4">
              {translate('Our support team is available during business hours. Use the chat button on the bottom right to connect.')}
            </p>
            <p className="text-sm text-gray-500">
              {translate('Available: Monday - Friday, 9:00 AM - 6:00 PM IST')}
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Help;
