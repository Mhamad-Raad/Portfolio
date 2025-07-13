import { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';

const GhostModel = (props) => {
  const ref = useRef();
  const { scene, animations } = useGLTF('/models/DestinyGhost.glb');

  const { actions } = useAnimations(animations, ref);

  useEffect(() => {
    // Play the first available animation
    if (actions && animations.length > 0) {
      const firstAction = actions[animations[0].name];
      firstAction?.reset().play();
    }
  }, [actions, animations]);

  return (
    <group
      ref={ref}
      {...props}
      dispose={null}
      scale={0.1}
      position={[0, 0, -1]}
    >
      <primitive object={scene} />
    </group>
  );
};

export default GhostModel;

useGLTF.preload('/models/DestinyGhost.glb');
