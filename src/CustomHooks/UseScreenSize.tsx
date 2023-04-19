import { useLayoutEffect, useState } from 'react';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({ width: 0 });

  const handleSize = () => {
    setWindowSize({
      width: window.screen.width,
    });
  };

  useLayoutEffect(() => {
    handleSize();

    window.addEventListener('resize', handleSize);

    return () => window.removeEventListener('resize', handleSize);
  }, []);

  return windowSize;
};

export default useWindowSize;
