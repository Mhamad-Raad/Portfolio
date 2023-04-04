import img1 from '../../assets/ToolsMethodes/GitHub.png';

export default function Slide() {
  return (
    <div className='recommendation-section__slideshow__slide row'>
      <div className='recommendation-section__slideshow__slide__slider-item column'>
        <img
          src={img1}
          title='img'
          alt='img'
          className='recommendation-section__slideshow__slide__slider-item__image'
        />
        <p className='recommendation-section__slideshow__slide__slider-item__name'>
          John Doe
        </p>
        <p className='recommendation-section__slideshow__slide__slider-item__position'>
          CEO, Company
        </p>
        <div className='recommendation-section__slideshow__slide__slider-item__seperator' />
        <p className='recommendation-section__slideshow__slide__slider-item__description'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
          tincidunt, nisl eget ultricies tincidunt, nisl elit lacinia nisl, a
          lacinia nisl lorem non nisl. Sed tincidunt, nisl eget ultricies
          tincidunt, nisl elit lacinia nisl, a lacinia nisl lorem non nisl.
        </p>
      </div>
    </div>
  );
}
