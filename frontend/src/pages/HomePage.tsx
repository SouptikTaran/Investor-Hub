import React from 'react';
import { LoginButton } from '../components/LoginButton';
import { Shield, Award, Globe, Zap } from 'lucide-react';
import NavBar from '../components/NavBar';
interface HomePageProps {
  onSignIn: (email: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSignIn }  ) => {
  const trustFactors = [
    {
      icon: <Shield className="w-12 h-12 text-blue-600 transition-transform hover:scale-110" />,
      title: 'Secure & Confidential',
      description:
        'Your data is protected with enterprise-grade security. We never share your information without consent.',
    },
    {
      icon: <Award className="w-12 h-12 text-green-600 transition-transform hover:scale-110" />,
      title: 'Proven Track Record',
      description:
        'Over $2B in successful investments facilitated through our platform since 2020.',
    },
    {
      icon: <Globe className="w-12 h-12 text-purple-600 transition-transform hover:scale-110" />,
      title: 'Global Network',
      description:
        'Access to 500+ verified investors across 30+ countries and diverse industries.',
    },
    {
      icon: <Zap className="w-12 h-12 text-yellow-600 transition-transform hover:scale-110" />,
      title: 'Fast Results',
      description: '93% of startups find their ideal investor match within 30 days.',
    },
  ];

  const successStories = [
    {
      company: 'TechFlow',
      funding: '$5M Series A',
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=400',
      quote: 'InvestorMatch connected us with the perfect investor who understood our vision.',
    },
    {
      company: 'GreenEnergy',
      funding: '$3M Seed',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400',
      quote: 'Found our ideal investor within two weeks. The platform exceeded our expectations.',
    },
    {
      company: 'HealthTech',
      funding: '$8M Series B',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400',
      quote: 'The quality of investor matches and the speed of connection was impressive.',
    },
  ];

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/* Hero Section */}
        <div className="w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in">
              Welcome to <span className="text-blue-600">InvestorMatch</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay">
              Connect with the right investors for your startup. Our intelligent matching system helps you find the
              perfect investment partner to fuel your growth.
            </p>
            <div className="animate-fade-in-delay-2">
              <LoginButton onSignIn={onSignIn} />
            </div>

            <div className="mt-16 grid md:grid-cols-3 gap-8 animate-fade-in-delay-3">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm transform hover:scale-105 transition-transform">
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">500+</h3>
                <p className="text-gray-600">Active Investors</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm transform hover:scale-105 transition-transform">
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">$2B+</h3>
                <p className="text-gray-600">Total Investments</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm transform hover:scale-105 transition-transform">
                <h3 className="text-3xl font-semibold text-gray-900 mb-2">1000+</h3>
                <p className="text-gray-600">Successful Matches</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Factors Section */}
        <div className="w-full bg-white py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Why Choose InvestorMatch?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trustFactors.map((factor, index) => (
                <div key={index} className="p-6 rounded-xl bg-gray-50 transform hover:-translate-y-1 transition-transform">
                  <div className="mb-4">{factor.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{factor.title}</h3>
                  <p className="text-gray-600">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Success Stories Section */}
        <div className="w-full bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Success Stories</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={story.image}
                    alt={story.company}
                    className="w-full h-48 object-cover transition-transform transform hover:scale-105"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{story.company}</h3>
                    <p className="text-blue-600 font-medium mb-4">{story.funding}</p>
                    <p className="text-gray-600 italic">"{story.quote}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
