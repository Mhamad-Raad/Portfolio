import { FC, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import ProjectList from './Prjs/ProjectList';

import Prs, { Techs } from '../../Constants';

import './Projects.scss';

interface ProjectsInterface {}

const animatedComponents = makeAnimated();

const Projects: FC<ProjectsInterface> = () => {
  const [projects, setProjects] = useState(Prs);

  const options = Techs.map((data) => {
    return {
      value: data,
      label: data,
    };
  });

  return (
    <section className='projects-section column' id='projects'>
      <div className='projects-section__header row'>
        <h2 className='projects-section__header__title'>Projects</h2>
        <Select
          options={options}
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          className='projects-section__header__select'
          placeholder='Search by Technology?'
          styles={{
            multiValue: (styles) => {
              return {
                ...styles,
                backgroundColor: '#193155',
              };
            },
            multiValueLabel: (styles) => ({
              ...styles,
              color: '#8ab6f9',
            }),
          }}
        />
      </div>
      <ProjectList />
    </section>
  );
};

export default Projects;
