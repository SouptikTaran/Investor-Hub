import React, { useEffect, useState } from 'react';
import { SearchBox } from '../components/SearchBox'; // Mock this component if necessary
import { CircleUser, TrendingUp, Users, Briefcase, LineChart, Building, Target, BarChart as ChartBar } from 'lucide-react';
interface DashboardPageProps {
  user: { email: string };
  onSignOut: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, onSignOut }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [isSignedOut, setIsSignedOut] = useState<boolean>(false);



  const industries = [
    {
      name: "Technology",
      icon: <ChartBar className="w-8 h-8 text-blue-500" />,
      description: "Software, AI, Cloud Computing",
      activeInvestors: 150,
      avgDealSize: "$2.5M"
    },
    {
      name: "Healthcare",
      icon: <Building className="w-8 h-8 text-green-500" />,
      description: "Biotech, Medical Devices, Digital Health",
      activeInvestors: 120,
      avgDealSize: "$3.2M"
    },
    {
      name: "Fintech",
      icon: <Target className="w-8 h-8 text-purple-500" />,
      description: "Payments, Banking, Insurance",
      activeInvestors: 100,
      avgDealSize: "$2.8M"
    }
  ];

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
      title: "Smart Matching",
      description: "AI-powered algorithm finds the perfect investor match for your startup."
    },
    {
      icon: <Users className="w-8 h-8 text-green-500" />,
      title: "Verified Investors",
      description: "Connect with pre-vetted investors who are actively looking for opportunities."
    },
    {
      icon: <Briefcase className="w-8 h-8 text-purple-500" />,
      title: "Industry Focus",
      description: "Specialized matching based on your industry and stage."
    },
    {
      icon: <LineChart className="w-8 h-8 text-orange-500" />,
      title: "Growth Support",
      description: "Find investors who provide both capital and strategic guidance."
    }
  ];


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-900">
            <span className="text-blue-600">Investor Dashboard</span>
          </h1>
          <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-full shadow-lg">
            <CircleUser className="w-8 h-8 text-blue-600" />
            <span className="text-gray-700 font-medium">{user.email}</span>
            <button
              onClick={onSignOut}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition duration-200"
            >
              {isSignedOut ? 'Signed Out' : 'Sign Out'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect <span className="text-blue-600">Investor Match</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Describe your startup and investment needs, and we'll connect you with the most suitable investors.
          </p>
        </div>

        {/* Industry Selection */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8">Select Your Industry</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {industries.map((industry) => (
              <button
                key={industry.name}
                onClick={() => setSelectedIndustry(industry.name)}
                className={`p-8 rounded-xl text-left transition-all hover:shadow-lg ${selectedIndustry === industry.name ? 'bg-blue-50 border-2 border-blue-500' : 'bg-white border-2 border-transparent hover:border-blue-300'}`}
              >
                <div className="mb-4">{industry.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{industry.name}</h4>
                <p className="text-gray-600 mb-4">{industry.description}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600">{industry.activeInvestors} Active Investors</span>
                  <span className="text-green-600">Avg. Deal: {industry.avgDealSize}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white p-10 rounded-xl shadow-lg mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Describe Your Startup</h3>
          <SearchBox /> {/* Mocked SearchBox component */}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
