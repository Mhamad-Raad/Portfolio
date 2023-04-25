import { FC } from 'react';

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
  return (
    <div className='projects-section__projects__project column'>
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
    </div>
  );
};

export default ProjectItem;
