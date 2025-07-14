import { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';

const GhostModel = (props) => {
  const ref = useRef();
  const { scene, animations } = useGLTF('/models/DestinyGhost.glb');
  const { actions } = useAnimations(animations, ref);

  useEffect(() => {
    if (actions && animations.length > 0) {
      const action = actions[animations[0].name];
      action?.reset().play();
    }
  }, [actions, animations]);

  return (
    <group
      ref={ref}
      {...props}
      dispose={null}
      scale={0.09}
      position={[0, -0.15, -1]}
      rotation={[0, 0, 0]}
    >
      <primitive object={scene} />
    </group>
  );
};

export default GhostModel;
useGLTF.preload('/models/DestinyGhost.glb');
