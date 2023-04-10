import { FC } from 'react';

interface CategoriesItemInterface {
  title: string;
  img: string;
  description: string;
}

const CategoriesItem: FC<CategoriesItemInterface> = ({
  img,
  title,
  description,
}) => {
  return (
    <div className='skills-categories__card'>
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
