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
  let show:string = '';
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
      className={`skills-categories__card ${inView ? '' : 'card__framer'}
        ${(title === 'Front-end' && !inView) ? 'card__framer--front' : ''}
        ${(title === 'Student' && !inView) ? 'card__framer--student' : ''}
        ${(title === 'Back-end' && !inView) ? 'card__framer--back' : ''}
        ${(title === 'Flutter' && !inView) ? 'card__framer--flutter' : ''}
      `}
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
