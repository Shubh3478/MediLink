import React, { useState, useEffect } from 'react';
import '../styles/scrollButton.css'; // make sure this is correct path
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    isVisible && (
      <button className="scroll-to-top-button" onClick={scrollToTop}>
        <FaArrowUp className='"scroll-to-top-button'/>
      </button>
    )
  );
};

export default ScrollToTopButton;
