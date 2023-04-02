import { FC } from 'react';

interface TechInterface {
  tech: string;
}

const Tech: FC<TechInterface> = ({ tech }) => {
  return (
    <p className='projects-section__projects__project__techs__tech'>{tech}</p>
  );
};

export default Tech;
