import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white py-12">
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="text-3xl font-bold text-blue-700 tracking-wider mb-6 md:mb-0">RIFÁCIL</div>
          <div className="flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Inicio</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Nosotros</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Blog</a>
          </div>
          <div className="flex space-x-6 mt-6 md:mt-0">
            <Facebook className="w-8 h-8 text-gray-600 cursor-pointer hover:text-gray-900" />
            <Twitter className="w-8 h-8 text-gray-600 cursor-pointer hover:text-gray-900" />
            <Instagram className="w-8 h-8 text-gray-600 cursor-pointer hover:text-gray-900" />
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm">
          © 2024 Rifácil. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;