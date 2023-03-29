import { FC, } from 'react';
import { useInView } from 'framer-motion';


import BallSkill from '../CanvaObjects/BallSkill';

import './FrontEndSkills.scss';

import HtmlImg from '../../assets/Html.jpg';
import CssImg from '../../assets/Css.png';
import JsImg from '../../assets/JavaScript.jpg';
import TsImg from '../../assets/TypeScript.png';
import JqueryImg from '../../assets/Jquery.png';
import ReactImg from '../../assets/React.png';
import NextImg from '../../assets/Next.png';
import RemixImg from '../../assets/Remix.jpg';
import RTFImg from '../../assets/RthreeF.png';
import ReduxImg from '../../assets/Redux.png';
import SassImg from '../../assets/Sass.png';
import BootstrapImg from '../../assets/Bootstrap5.jpg';
import TailwindImg from '../../assets/Tailwind.png';
import MaterialUiImg from '../../assets/MaterialUi.png';
import JestImg from '../../assets/Jest.png';
import ReactTestingLibraryImg from '../../assets/ReactTestingLibrary.png';
import Flutter from '../../assets/Flutter.jpg';

interface FrontEndSkillsInterface {}

const FrontEndSkills: FC<FrontEndSkillsInterface> = () => {
  return (
    <div className='front-end-skills column'>
      <h3 className='front-end-skills__title'>Front-End</h3>
      <div className='front-end-skills__techs'>
        <BallSkill img={HtmlImg} />
        <BallSkill img={CssImg} />
        <BallSkill img={SassImg} />
        <BallSkill img={JsImg} />
        <BallSkill img={TsImg} />
        <BallSkill img={JestImg} />
        <BallSkill img={JqueryImg} />
        <BallSkill img={ReactImg} />
        <BallSkill img={NextImg} />
        <BallSkill img={RemixImg} />
        <BallSkill img={RTFImg} />
        <BallSkill img={ReduxImg} />
        <BallSkill img={BootstrapImg} />
        <BallSkill img={TailwindImg} />
        <BallSkill img={MaterialUiImg} />
        <BallSkill img={ReactTestingLibraryImg} />
      </div>
    </div>
  );
};

export default FrontEndSkills;
