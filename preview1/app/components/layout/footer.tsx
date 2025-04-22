import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-8 w-8">
                <Image
                  src="/logo.svg"
                  alt="Bittive Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Bittive
              </span>
            </Link>
            <p className="text-gray-600 text-sm">
              Helping businesses and entrepreneurs bring their digital ideas to life.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Facebook size={18} />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Twitter size={18} />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Linkedin size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "Services", "About", "Team", "FAQ"].map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-600 hover:text-primary text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Services</h3>
            <ul className="space-y-2">
              {["Web Development", "Mobile Apps", "UI/UX Design", "Digital Strategy", "Consulting"].map((item) => (
                <li key={item}>
                  <Link
                    href="#services"
                    className="text-gray-600 hover:text-primary text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 text-sm">Kuopio, Finland</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <span className="text-gray-600 text-sm">+358 123 456 789</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <span className="text-gray-600 text-sm">info@bittive.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Bittive Oy. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-sm text-gray-500 hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;