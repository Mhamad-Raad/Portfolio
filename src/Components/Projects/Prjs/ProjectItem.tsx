import { FC, useRef } from 'react';
import { useInView } from 'framer-motion';

import Tech from './Tech';

import { FaShare, FaGithub } from 'react-icons/fa';
interface ProjectItemInterface {
  img: string;
  title: string;
  description: string;
  Llink: string;
  Glink: string;
  techs: string[];
}

const ProjectItem: FC<ProjectItemInterface> = ({
  img,
  title,
  description,
  Llink,
  Glink,
  techs,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  // get a random number between 1 and 4 no decimals
  const random = Math.floor(Math.random() * 4 + 1);

  let style = '';

  if (random === 1) style = 'translateX(-100%)';
  else if (random === 2) style = 'translateX(100%)';
  else if (random === 3) style = 'translateY(-100%)';
  else style = 'translateY(100%)';

  return (
    <div
      className='projects-section__projects__project column'
      ref={ref}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translate(0)' : style,
      }}
    >
      <img
        src={img}
        alt={title}
        className='projects-section__projects__project__img'
      />
      <a
        href={Glink}
        className='projects-section__projects__project__github'
        title='Visite Github Repository'
        target='_blank'
      >
        <FaGithub />
      </a>
      <h3 className='projects-section__projects__project__title'>{title}</h3>
      <p className='projects-section__projects__project__description'>
        {description}
      </p>

      <div className='projects-section__projects__project__techs row'>
        {techs.map((tech, index) => (
          <Tech key={index} tech={tech} />
        ))}
      </div>

      {Llink.length > 0 && (
        <div className='projects-section__projects__project__links row'>
          <a
            href={Llink}
            className='projects-section__projects__project__links__link'
            target='_blank'
            title='see it live'
          >
            <FaShare /> Live
          </a>
        </div>
      )}
    </div>
  );
};

export default ProjectItem;
