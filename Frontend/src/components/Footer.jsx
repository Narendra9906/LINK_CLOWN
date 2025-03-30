import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faLinkedin, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {


  return (
    <>
      <div className="bg-gray-800 text-white p-6 flex flex-col items-center justify-center">
        <div className="flex items-center space-x-4">
          <i className="fa-solid fa-cloud text-2xl"></i>
          <h1 className="text-xl font-bold">Travel Planner Pro</h1>
        </div>
        <p className="mt-4">Subscribe to our Newsletter</p>
        <div className="flex items-center mt-4">
          {/* Email Input Field */}
          <div className="flex items-center bg-gray-100 border border-gray-300 rounded-md px-3 py-2 w-64">
            <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 mr-2" />
            <input
              type="email"
              placeholder="Input your email"
              className="bg-gray-100 text-gray-500 text-sm outline-none flex-grow"
            />
          </div>

          {/* Subscribe Button */}
          <button className="ml-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
            Subscribe
          </button>
        </div>


        <div className="flex justify-center mt-6">
          <ul className="list-none mr-20">
            <h3 className="font-bold">Product</h3>
            <a href='#'><li className="text-gray-400">Features</li></a>
            <a href='#'><li className="text-gray-400">Pricing</li></a>
          </ul>
          <ul className="list-none mr-20">
            <h3 className="font-bold">Resources</h3>
            <a href='#'><li className="text-gray-400">Blog</li></a>
            <a href='#'><li className="text-gray-400">User Guides</li></a>
            <a href='#'><li className="text-gray-400">Webinars</li></a>
          </ul>
          <ul className="list-none mr-20">
            <h3 className="font-bold">Company</h3>
            <a href='#'><li className="text-gray-400">About us</li></a>
            <a href='#'><li className="text-gray-400">Contact us</li></a>
          </ul>
          <ul className="list-none">
            <h3 className="font-bold">Plans & Pricing</h3>
            <a href='#'><li className="text-gray-400">Normal</li></a>
            <a href='#'><li className="text-gray-400">Intermediate</li></a>
            <a href='#'><li className="text-gray-400">Premium</li></a>
          </ul>
        </div>


        <div className='flex justify-between items-center w-full mt-6'>

          <button className="bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-600">English</button>

          <div>© 2024 Brand, Inc. • Privacy • Terms • Sitemap</div>

          <div className='flex items-center justify-center space-x-4 ml-4'>
            <FontAwesomeIcon icon={faTwitter} />
            <FontAwesomeIcon icon={faFacebook} />
            <FontAwesomeIcon icon={faLinkedin} />
            <FontAwesomeIcon icon={faYoutube} />
          </div>

        </div>

      </div>
    </>
  );
};

export default Footer;