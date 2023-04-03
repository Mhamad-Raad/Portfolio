import { FC } from 'react';

import './Recommendations.scss';

import img1 from '../../assets/ToolsMethodes/GitHub.png';

interface RecommentationsInterface {}

const Recommentations: FC<RecommentationsInterface> = () => {
  return (
    <section className='recommendation-section column'>
      <h2 className='recommendation-section__title'>Recommentations</h2>
      <div className='recommendation-section__slideshow column'>
        <div className='recommendation-section__slideshow__slide'>
          <img
            src={img1}
            title='img'
            alt='img'
            className='recommendation-section__slideshow__slide__image'
          />
          <p className='recommendation-section__slideshow__slide__name'>
            John Doe
          </p>
          <p className='recommendation-section__slideshow__slide__position'>
            CEO, Company
          </p>
          <div className='recommendation-section__slideshow__slide__seperator' />
          <p className='recommendation-section__slideshow__slide__description'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            tincidunt, nisl eget ultricies tincidunt, nisl elit lacinia nisl, a
            lacinia nisl lorem non nisl. Sed tincidunt, nisl eget ultricies
            tincidunt, nisl elit lacinia nisl, a lacinia nisl lorem non nisl.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Recommentations;
