import { FC, useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SwipeableHandlers, useSwipeable } from 'react-swipeable';

import useWindowSize from '../../CustomHooks/UseScreenSize';

import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import Slide from './Slide';

import './Recommendations.scss';

interface RecommentationsInterface {}

const Recommentations: FC<RecommentationsInterface> = () => {
  const { width } = useWindowSize();
  const ref = useRef<HTMLElement | null>(null);
  const [index, setIndex] = useState<number>(0);

  const inView: boolean = useInView(ref, { once: true });

  const clickRightHandle = () => {
    setIndex(index + 1);
  };

  const clickLeftHandle = () => {
    setIndex(index - 1);
  };

  const handlers: SwipeableHandlers = useSwipeable({
    onSwipedLeft: () => {
      clickRightHandle();
    },
    onSwipedRight: () => {
      clickLeftHandle();
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
        {width > 600 && (
          <motion.button
            type='button'
            className='recommendation-section__slideshow__left-scroll-button'
            animate={{ x: inView ? 0 : -200 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
            onClick={clickLeftHandle}
          >
            <FaAngleLeft />
          </motion.button>
        )}
        <motion.div
          className='recommendation-section__slideshow__slide row'
          initial={{
            x: 0,
          }}
          animate={{
            x: inView ? -index * 100 + '%' : 100 + '%',
          }}
          transition={{ duration: 1.5, type: 'spring' }}
        >
          <Slide />
          <Slide />
          <Slide />
        </motion.div>
        {width > 600 && (
          <motion.button
            type='button'
            className='recommendation-section__slideshow__right-scroll-button'
            animate={{ x: inView ? 0 : 200 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
            onClick={clickRightHandle}
          >
            <FaAngleRight />
          </motion.button>
        )}
        <motion.div
          className='recommendation-section__slideshow__dots row'
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
