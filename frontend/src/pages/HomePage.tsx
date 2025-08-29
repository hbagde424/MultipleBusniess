import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to Tifine</h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Your one-stop platform for all business needs
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Food & Tiffin Services</h3>
            <p className="text-gray-600">
              Discover homemade food and tiffin services near you
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Local Products</h3>
            <p className="text-gray-600">
              Find local pickles, cakes, and artisanal products
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Business Solutions</h3>
            <p className="text-gray-600">
              Start your online business with our platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;