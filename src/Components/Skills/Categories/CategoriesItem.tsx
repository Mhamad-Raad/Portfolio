import { FC } from 'react';

interface CategoriesItemInterface {
  title: string;
  img: string;
  description: string;
}

const CategoriesItem:FC<CategoriesItemInterface> = ({img, title, description}) => {
  return (
    <div className='skills-categories__card column'>
      <h3 className='skills-categories__card__title'>title</h3>
      <img
        src={img}
        alt={title}
        className='skills-categories__card__img'
      />
      <p className='skills-categories__card__description'>
        {description}
      </p>
    </div>
  );
}

export default CategoriesItem;
