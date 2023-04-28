import { FC } from 'react';

interface SlideProps {
  name: string;
  position: string;
  text: string;
  img: string;
}

const Slide: FC<SlideProps> = ({ name, position, text, img }) => {
  return (
    <div className='container column'>
      <div className='recommendation-section__slideshow__slide__slider-item column'>
        <img
          src={img}
          title={`${name}`}
          alt={`${name}'s image`}
          className='recommendation-section__slideshow__slide__slider-item__image'
        />
        <p className='recommendation-section__slideshow__slide__slider-item__name'>
          {name}
        </p>
        <p className='recommendation-section__slideshow__slide__slider-item__position'>
          {position}
        </p>
        <div className='recommendation-section__slideshow__slide__slider-item__seperator' />
        <p className='recommendation-section__slideshow__slide__slider-item__description'>
          {text}
        </p>
      </div>
    </div>
  );
};

export default Slide;
