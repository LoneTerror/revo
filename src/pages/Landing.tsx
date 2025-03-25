import React from 'react';
import { Link } from 'react-router-dom';
import { Vote, Shield, CheckCircle, Lock, Clock, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex justify-center items-center gap-3 text-blue-600 mb-4">
            <Vote size={40} />
            <Shield size={40} />
          </div>
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Secure Automated</span>
            <span className="block text-blue-600">Voter Verification</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Revolutionizing the electoral process with faster, more secure, and automated verification systems.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                to="/dashboard"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Access Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="relative p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Fast Verification</h3>
              <p className="mt-2 text-gray-500">
                Streamlined verification process reduces waiting times and improves voter experience.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="relative p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-4">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Enhanced Security</h3>
              <p className="mt-2 text-gray-500">
                Advanced biometric verification ensures the highest level of security and prevents fraud.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="relative p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Real-time Monitoring</h3>
              <p className="mt-2 text-gray-500">
                Live tracking and instant updates on verification status and voter turnout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;