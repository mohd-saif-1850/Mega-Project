import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-yellow-500">About Notform</h1>
      
      <p className="text-lg text-gray-700 leading-relaxed text-justify">
        <strong>Notform</strong> is a modern platform built to empower creators, writers, and thinkers to share their voice with the world. Whether you're posting a quick update or publishing a long-form article, Notform helps you create, connect, and grow — effortlessly.
      </p>

      <p className="text-lg text-gray-700 leading-relaxed text-justify">
        We believe in simplicity, freedom of expression, and accessibility for everyone. Our mission is to remove all barriers between your ideas and your audience by providing a clean, distraction-free writing and sharing experience.
      </p>

      <p className="text-lg text-gray-700 leading-relaxed text-justify">
        From students and professionals to artists and entrepreneurs, <strong>Notform</strong> is for everyone. Our platform is continuously evolving to give you more power, more control, and more ways to shine.
      </p>

      <div className="text-center pt-6">
        <p className="text-gray-600 text-sm">Got questions? Feel free to <Link to="/contact" className="text-blue-500 underline">contact us</Link>.</p>
      </div>
    </div>
  );
};

export default About;
