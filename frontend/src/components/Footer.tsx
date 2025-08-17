"use client";

import { Badge } from "@/components/ui/badge";
import { Mail, Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import { APP_CONSTANTS } from "@/lib/constants/app";
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations();

  const footerLinks = {
    company: [
      { name: t('footer.about'), href: "#about" },
      { name: t('footer.contactUs'), href: "#contact" }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border-t border-gray-700">
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center">
                {/* Inline SVG Logo */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31.56073 31" className="w-8 h-8">
                  <path d="M29.79845,3.68473h-.08013a1.7105,1.7105,0,0,0-1.76224,1.6822V16.74162a1.66182,1.66182,0,0,0,1.68215,1.76223h.16022a1.77791,1.77791,0,0,0,1.76228-1.76223V5.447A1.77792,1.77792,0,0,0,29.79845,3.68473Z" fill="#ed2647"/>
                  <rect x="14.01808" y="3.68473" width="3.60465" height="23.63048" rx="1.76228" fill="#ed2647"/>
                  <rect y="12.4961" width="3.60465" height="14.81912" rx="1.76228" fill="#ed2647"/>
                  <path d="M22.90953,0h-.16016a1.77792,1.77791,0,0,0-1.76229,1.76228V26.99483a1.71048,1.71048,0,0,0,1.68215,1.76229h.16022a1.77791,1.77791,0,0,0,1.76228-1.76229l.08009-25.23255A1.77792,1.77791,0,0,0,22.90953,0Z" fill="#ed2647"/>
                  <rect x="6.969" y="2.1628" width="3.60465" height="28.8372" rx="1.76228" fill="#ed2647"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">{APP_CONSTANTS.WEBSITE_NAME}</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              {t('footer.subtitle')}
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors duration-200 text-gray-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('footer.company')}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <div className="space-y-2">
              <a
                href="mailto:contact@giantylive.com"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                <span>contact@giantylive.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;