import { FC } from 'react';

import './CategorySkills.scss';

import AgileImg from '../../assets/ToolsMethodes/Agile.png';
import CDTImg from '../../assets/ToolsMethodes/CDT.png';
import GitImg from '../../assets/ToolsMethodes/Git.png';
import JiraImg from '../../assets/ToolsMethodes/Jira.png';
import Github from '../../assets/ToolsMethodes/Github.png';
import TrelloImg from '../../assets/ToolsMethodes/Trello.png';
import VSCodeImg from '../../assets/ToolsMethodes/VSCode.png';
import FirebaseImg from '../../assets/ToolsMethodes/Firebase.png';
import FigmaImg from '../../assets/ToolsMethodes/Figma.png';
import MFAImg from '../../assets/ToolsMethodes/MFA.png';
import TDDImg from '../../assets/ToolsMethodes/TDD.png';
import MongoImg from '../../assets/ToolsMethodes/Mongo.png';
import NetlifyImg from '../../assets/ToolsMethodes/Netlify.png';
import NPMImg from '../../assets/ToolsMethodes/NPM.png'
import PostmanImg from '../../assets/ToolsMethodes/Postman.png'
import RenderImg from '../../assets/ToolsMethodes/Render.png';
import VercelImg from '../../assets/ToolsMethodes/Vercel.jpg';

interface ToolsMethodesInterface {}

const ToolsMethodes: FC<ToolsMethodesInterface> = () => {
  return (
    <div className='category-skills column'>
      <h3 className='category-skills__title'>Tools & Methodes</h3>
      <div className='category-skills__techs'></div>
    </div>
  );
};

export default ToolsMethodes;
