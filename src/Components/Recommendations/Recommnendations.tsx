import { FC, useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import Slide from './Slide';

import './Recommendations.scss';

interface RecommentationsInterface {}

const Recommentations: FC<RecommentationsInterface> = () => {
  const ref = useRef(null);
  const [index, setIndex] = useState(0);

  const inView = useInView(ref);

  const clickRightHandle = () => {
    setIndex(index + 1);
  };

  const clickLeftHandle = () => {
    setIndex(index - 1);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      clickRightHandle();
      console.log('here');
    },
    onSwipedRight: () => {
      clickLeftHandle();
      console.log('here');
    },
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });
  useEffect(() => {
    if (index < 0) {
      setIndex(2);
    } else if (index > 2) {
      setIndex(0);
    }

    const slideTimer = setTimeout(() => {
      setIndex((prevState) => prevState + 1);
    }, 5000);

    return () => clearTimeout(slideTimer);
  }, [index]);

  return (
    <section className='recommendation-section column' ref={ref}>
      <h2 className='recommendation-section__title'>Recommentations</h2>

      <div {...handlers} className='recommendation-section__slideshow column'>
        <motion.button
          type='button'
          className='recommendation-section__slideshow__left-scroll-button'
          animate={{ x: inView ? 0 : -200 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
          onClick={clickLeftHandle}
        >
          <FaAngleLeft />
        </motion.button>
        <motion.div
          className='recommendation-section__slideshow__slide row'
          initial={{
            x: 0,
          }}
          animate={{
            x: inView? -index * 100 + '%' : 100 + '%',
          }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        >
          <Slide />
          <Slide />
          <Slide />
        </motion.div>
        <motion.button
          type='button'
          className='recommendation-section__slideshow__right-scroll-button'
          animate={{ x: inView ? 0 : 200 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
          onClick={clickRightHandle}
        >
          <FaAngleRight />
        </motion.button>
        <motion.div className='recommendation-section__slideshow__dots row'
          animate={{ y: inView ? 0 : 200 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        >
          {[0, 1, 2].map((item, i) => (
            <button
              type='button'
              key={i}
              className={`recommendation-section__slideshow__dots__dot ${
                index === i ? 'active' : ''
              }`}
              onClick={() => setIndex(i)}
            >
              .
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Recommentations;
