import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ light = false }) => (
  <Link to="/" className="flex items-center gap-2" aria-label="Miraa home">
    <img src="/favicon.svg" alt="" className="h-8 w-8" />
    <span className={`font-display text-xl font-extrabold ${light ? 'text-white' : 'text-gray-900'}`}>
      Miraa
    </span>
  </Link>
);

export default Logo;
