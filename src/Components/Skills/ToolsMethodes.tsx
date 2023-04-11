import { FC, useRef } from 'react';
import { useInView } from 'framer-motion';

import CircleSkill from './Skill/CircleSkill';

import './CategorySkills.scss';

import AgileImg from '../../assets/ToolsMethodes/Agile.png';
import CDTImg from '../../assets/ToolsMethodes/CDT.png';
import GitImg from '../../assets/ToolsMethodes/Git.jpg';
import JiraImg from '../../assets/ToolsMethodes/Jira.png';
import Github from '../../assets/ToolsMethodes/GitHub.png';
import TrelloImg from '../../assets/ToolsMethodes/Trello.png';
import VSCodeImg from '../../assets/ToolsMethodes/VSCode.png';
import FirebaseImg from '../../assets/ToolsMethodes/Firebase.png';
import FigmaImg from '../../assets/ToolsMethodes/Figma.png';
import MFAImg from '../../assets/ToolsMethodes/MFA.png';
import TDDImg from '../../assets/ToolsMethodes/TDD.png';
import MongoImg from '../../assets/ToolsMethodes/Mongo.png';
import NetlifyImg from '../../assets/ToolsMethodes/Netlify.png';
import NPMImg from '../../assets/ToolsMethodes/Npm.png';
import YarnImg from '../../assets/ToolsMethodes/Yarn.png';
import PostmanImg from '../../assets/ToolsMethodes/Postman.png';
import RenderImg from '../../assets/ToolsMethodes/Render.png';
import VercelImg from '../../assets/ToolsMethodes/Vercel.jpg';

interface ToolsMethodesInterface {}

const ToolsMethodes: FC<ToolsMethodesInterface> = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView: boolean = useInView(ref, { once: true });

  return (
    <div className='category-skills column'>
      <h3 className='category-skills__title'>Tools & Methodes</h3>
      <div
        className={`category-skills__techs ${
          inView ? '' : 'tools-tech__framer'
        }`}
        ref={ref}
      >
        <CircleSkill img={AgileImg} title='Agile' />
        <CircleSkill img={CDTImg} title='CDT' />
        <CircleSkill img={GitImg} title='Git' />
        <CircleSkill img={JiraImg} title='Jira' />
        <CircleSkill img={Github} title='Github' />
        <CircleSkill img={TrelloImg} title='Trello' />
        <CircleSkill img={VSCodeImg} title='VSCode' />
        <CircleSkill img={FirebaseImg} title='Firebase' />
        <CircleSkill img={FigmaImg} title='Figma' />
        <CircleSkill img={MFAImg} title='Mobile First Approach' />
        <CircleSkill img={TDDImg} title='Test Driven Development' />
        <CircleSkill img={MongoImg} title='MongoDB' />
        <CircleSkill img={NetlifyImg} title='Netlify' />
        <CircleSkill img={NPMImg} title='Node Package Manager' />
        <CircleSkill img={YarnImg} title='Yarn Package Manager' />
        <CircleSkill img={PostmanImg} title='Postman' />
        <CircleSkill img={RenderImg} title='Render' />
        <CircleSkill img={VercelImg} title='Vercel' />
      </div>
    </div>
  );
};

export default ToolsMethodes;
