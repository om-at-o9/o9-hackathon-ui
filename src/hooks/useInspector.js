import { useState, useEffect, useCallback } from 'react';

// This is the callback function that will be called when an element is selected
export const useInspector = ({ onElementSelected }) => {
  const [isInspecting, setIsInspecting] = useState(false);
  const [highlightedEl, setHighlightedEl] = useState(null);

  // Function to create a descriptive string for an element
  const getElementDescriptor = (el) => {
    // **This is the key part for your feature!**
    // Prioritize the custom data attribute for precise code mapping.
    const dataSourceLoc = el.getAttribute('data-source-loc');
    if (dataSourceLoc) {
      return `Element in: ${dataSourceLoc}`;
    }

    // Fallback to a generic descriptor if the attribute is not present
    const tagName = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : '';
    const classes = el.className ? `.${el.className.split(' ').join('.')}` : '';
    return `<${tagName}${id}${classes}>`;
  };

  const handleMouseMove = useCallback((e) => {
    const target = e.target;
    if (target === highlightedEl || target.id === 'react-select-2-listbox') return; // Avoid highlighting the inspector itself
    
    // Remove previous highlight
    if (highlightedEl) {
      highlightedEl.style.outline = '';
    }
    
    // Add new highlight
    target.style.outline = '2px solid #007BFF'; // Blue highlight
    setHighlightedEl(target);
  }, [highlightedEl]);

  const handleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (highlightedEl) {
      const descriptor = getElementDescriptor(highlightedEl);
      onElementSelected(descriptor); // Send the data back to the component
      highlightedEl.style.outline = ''; // Clean up
    }
    
    setIsInspecting(false); // Turn off inspect mode after selection
  }, [highlightedEl, onElementSelected]);

  useEffect(() => {
    if (isInspecting) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('click', handleClick, true); // Use capture phase to prevent default actions
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
      if (highlightedEl) {
          highlightedEl.style.outline = '';
      }
    }

    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
      if (highlightedEl) {
          highlightedEl.style.outline = '';
      }
    };
  }, [isInspecting, handleMouseMove, handleClick, highlightedEl]);

  return { 
    isInspecting, 
    startInspection: () => setIsInspecting(true) 
  };
};