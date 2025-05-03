import React from 'react';
import Link from 'next/link';



const quickLinks01 = [
  { path: "/", display: "Home" },
  { path: "/about", display: "About Us" },
  { path: "/services", display: "Services" },
  { path: "/blog", display: "Blog" },
];

const quickLinks02 = [
  { path: "/drivers", display: "Find a Driver" },
  { path: "/book", display: "Book a Ride" },
  { path: "/locations", display: "Find a Location" },
  { path: "/support", display: "Get Support" },
];

const quickLinks03 = [
  { path: "/donate", display: "Donate" },
  { path: "/contact", display: "Contact Us" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className='pb-20 pt-14 bg-yellow-400 dark:bg-gray-800'>
      <div className='container mx-auto px-12'>
        <div className='flex justify-between flex-col md:flex-row flex-wrap gap-10'>
          
          {/* Brand Info */}
          <div className='max-w-[320px]'>
            <h2 className='text-[30px] font-bold text-headingColor dark:text-white mb-4'>
              Taxi Go
            </h2>
            <p className='text-md leading-8 font-normal text-textColor dark:text-gray-300'>
              Copyright © {year} Developed by Aditya Gangwar. All rights reserved.
            </p>
          </div>

          {/* Quick Sections */}
          <div>
            <h2 className='text-lg font-semibold mb-6 text-headingColor dark:text-white'>I want to:</h2>
            <ul>
              {quickLinks02.map((item, index) => (
                <li key={index} className='mb-3'>
                  <Link 
                    href={item.path} 
                    className='text-md font-medium text-textColor dark:text-gray-300 hover:text-primaryColor dark:hover:text-primaryColor transition-colors'
                  >
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className='text-lg font-semibold mb-6 text-headingColor dark:text-white'>Support</h2>
            <ul>
              {quickLinks03.map((item, index) => (
                <li key={index} className='mb-3'>
                  <Link 
                    href={item.path} 
                    className='text-md font-medium text-textColor dark:text-gray-300 hover:text-primaryColor dark:hover:text-primaryColor transition-colors'
                  >
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className='text-lg font-semibold mb-6 text-headingColor dark:text-white'>Quick Links</h2>
            <ul>
              {quickLinks01.map((item, index) => (
                <li key={index} className='mb-3'>
                  <Link 
                    href={item.path} 
                    className='text-md font-medium text-textColor dark:text-gray-300 hover:text-primaryColor dark:hover:text-primaryColor transition-colors'
                  >
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
