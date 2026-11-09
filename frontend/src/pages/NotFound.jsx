import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
    <p className="font-display text-6xl font-extrabold text-primary-600">404</p>
    <h1 className="mt-4 text-2xl font-bold text-gray-900">This page doesn&apos;t exist</h1>
    <p className="mt-2 text-gray-600">Let&apos;s get you back to studying.</p>
    <div className="mt-6 flex gap-3">
      <Link to="/" className="btn-secondary">Home</Link>
      <Link to="/solve" className="btn-primary">Ask Miraa</Link>
    </div>
  </div>
);

export default NotFound;
