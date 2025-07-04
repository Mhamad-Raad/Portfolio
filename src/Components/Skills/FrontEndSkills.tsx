import { FC } from 'react';

import CircleSkill from './Skill/CircleSkill';

import './CategorySkills.scss';

import HtmlImg from '../../assets/frontend/Html.png';
import CssImg from '../../assets/frontend/Css.png';
import JsImg from '../../assets/frontend/JavaScript.png';
import TsImg from '../../assets/frontend/TypeScript.png';
import JqueryImg from '../../assets/frontend/Jquery.png';
import ReactImg from '../../assets/frontend/React.png';
import NextImg from '../../assets/frontend/Next.png';
import RemixImg from '../../assets/frontend/Remix.png';
import RTFImg from '../../assets/frontend/RthreeF.png';
import ReduxImg from '../../assets/frontend/Redux.jpg';
import SassImg from '../../assets/frontend/Sass.png';
import BootstrapImg from '../../assets/frontend/Bootstrap5.jpg';
import Framer from '../../assets/frontend/Framer.png';
import TailwindImg from '../../assets/frontend/Tailwind.png';
import MaterialUiImg from '../../assets/frontend/MaterialUi.png';
import JestImg from '../../assets/frontend/Jest.png';
import ReactTestingLibraryImg from '../../assets/frontend/ReactTestingLibrary.jpg';
import Flutter from '../../assets/frontend/Flutter.jpg';
import ReactN from '../../assets/frontend/ReactN.png';
import Electron from '../../assets/frontend/Electron.png';
import Vue from '../../assets/frontend/Vue.png';
import Angular from '../../assets/frontend/Angular.png';

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
        <CircleSkill img={ReactN} title='React Native' />
        <CircleSkill img={Electron} title='ElectronJS' />
        <CircleSkill img={Vue} title='VueJs' />
        <CircleSkill img={Angular} title='AngularJs' />
      </div>
    </div>
  );
};

export default FrontEndSkills;
