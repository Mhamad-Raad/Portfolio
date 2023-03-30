import { FC, } from 'react';


import CircleSkill from './Skill/CircleSkill';

import './CategorySkills.scss';

import HtmlImg from '../../assets/Html.png';
import CssImg from '../../assets/Css.png';
import JsImg from '../../assets/JavaScript.png';
import TsImg from '../../assets/TypeScript.png';
import JqueryImg from '../../assets/Jquery.png';
import ReactImg from '../../assets/React.png';
import NextImg from '../../assets/Next.png';
import RemixImg from '../../assets/Remix.png';
import RTFImg from '../../assets/RthreeF.png';
import ReduxImg from '../../assets/Redux.jpg';
import SassImg from '../../assets/Sass.png';
import BootstrapImg from '../../assets/Bootstrap5.jpg';
import Framer from '../../assets/Framer.png';
import TailwindImg from '../../assets/Tailwind.png';
import MaterialUiImg from '../../assets/MaterialUi.png';
import JestImg from '../../assets/Jest.png';
import ReactTestingLibraryImg from '../../assets/ReactTestingLibrary.jpg';
import Flutter from '../../assets/Flutter.jpg';

interface FrontEndSkillsInterface {}

const FrontEndSkills: FC<FrontEndSkillsInterface> = () => {
  return (
    <div className='category-skills column'>
      <h3 className='category-skills__title'>Front-End</h3>
      <div className='category-skills__techs'>
        <CircleSkill img={HtmlImg} title='HTML 5' />
        <CircleSkill img={CssImg} title='CSS 3' />
        <CircleSkill img={SassImg} title='Sass' />
        <CircleSkill img={JsImg} title='JavaScript' />
        <CircleSkill img={TsImg} title='TypeScript' />
        <CircleSkill img={JestImg} title='Jest' />
        <CircleSkill img={JqueryImg} title='Jquery' />
        <CircleSkill img={ReactImg} title='React.js' />
        <CircleSkill img={NextImg} title='Next.js' />
        <CircleSkill img={RemixImg} title='Remix.js' />
        <CircleSkill img={RTFImg} title='React Three Fiber' />
        <CircleSkill img={ReduxImg} title='Redux' />
        <CircleSkill img={BootstrapImg} title='Bootstrap 5' />
        <CircleSkill img={Framer} title='Framer Motion' />
        <CircleSkill img={TailwindImg} title='Tailwind' />
        <CircleSkill img={MaterialUiImg} title='Material UI' />
        <CircleSkill
          img={ReactTestingLibraryImg}
          title='React Testing Library'
        />
        <CircleSkill img={Flutter} title='Flutter' />
      </div>
    </div>
  );
};

export default FrontEndSkills;
