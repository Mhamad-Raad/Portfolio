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

  const handleSelect = (e: any) => {
    if (e) {
      const techs = e.map((data: any) => data.value);
      const filteredProjects = Prs.filter((project) => {
        return techs.every((tech: string) => project.techs.includes(tech));
      });
      setProjects(filteredProjects);
    } else {
      setProjects(Prs);
    }
  };

  return (
    <section className='projects-section column' id='projects'>
      
        <h2 className='projects-section__title'>Projects</h2>
        <Select
          options={options}
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          className='projects-section__select'
          placeholder='Search by Technology?'
          onChange={handleSelect}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              borderColor: state.isFocused ? '#8ab6f9' : 'none',
              borderRadius: '10px',
              height: '50px',
            }),
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
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: '#8ab6f9',
              color: 'white',
            },
          })}
        />
      <ProjectList Projects={projects} />
    </section>
  );
};

export default Projects;
