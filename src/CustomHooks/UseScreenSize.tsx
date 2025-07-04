import { useState, useEffect } from 'react';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<{ width: number }>({ width: 0 });

  const handleSize = () => {
    setWindowSize({
      width: window.innerWidth,
    });
  };

  useEffect(() => {
    handleSize();

    window.addEventListener('resize', handleSize);

    return () => window.removeEventListener('resize', handleSize);
  }, [window.screen.width]);

  return windowSize;
};

export default useWindowSize;
