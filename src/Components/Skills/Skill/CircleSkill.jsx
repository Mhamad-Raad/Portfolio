import './CircleSkill.scss';

const BallSkill = ({ img, title }) => {
  const animationDelay = Math.random();

  return (
    <img
      className='circle-skill'
      style={{
        animationDelay: `${animationDelay}s`,
      }}
      src={img}
      title={title}
    />
  );
};

export default BallSkill;
