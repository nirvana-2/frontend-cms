import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <div className="mb-4 md:mb-0">
          <p>&copy; {new Date().getFullYear()} <span className="font-bold text-primary font-fredoka">Hamro Canteen</span>. All rights reserved.</p>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Help Center</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
