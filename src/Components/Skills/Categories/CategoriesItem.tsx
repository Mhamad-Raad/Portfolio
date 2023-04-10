import { FC } from 'react';

interface CategoriesItemInterface {
  title: string;
  img: string;
  description: string;
  inView: boolean;
}

const CategoriesItem: FC<CategoriesItemInterface> = ({
  img,
  title,
  description,
  inView,
}) => {
  let show = '';
  if (title === 'Front-end') {
    show = 'translateX(-100%)';
  } else if (title === 'Student') {
    show = 'translateY(100%)';
  } else if (title === 'Back-end') {
    show = 'translateY(-100%)';
  } else if (title === 'Flutter') {
    show = 'translateX(100%)';
  }

  return (
    <div
      className='skills-categories__card'
      style={{
        transform: inView ? 'none' : `${ show }`,
        opacity: inView ? 1 : 0,
        transition: 'all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s',
      }}
    >
      <span className='skills-categories__card__hover-point'></span>
      <span className='skills-categories__card__hover-point'></span>
      <span className='skills-categories__card__hover-point'></span>
      <span className='skills-categories__card__hover-point'></span>
      <span className='skills-categories__card__hover-point'></span>
      <span className='skills-categories__card__hover-point'></span>
      <span className='skills-categories__card__hover-point'></span>
      <span className='skills-categories__card__hover-point'></span>
      <div className='skills-categories__card__content column'>
        <h3 className='skills-categories__card__content__title'>{title}</h3>
        <img
          src={img}
          alt={title}
          className='skills-categories__card__content__img'
        />
        <p className='skills-categories__card__content__description'>
          {description}
        </p>
      </div>
    </div>
  );
};

export default CategoriesItem;
