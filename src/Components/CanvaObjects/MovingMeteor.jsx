import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const MovingMeteor = () => {
  const ref = useRef();
  const [reverse, setReverse] = useState(false);

  const { scene } = useGLTF('./models/meteor.glb');

  useFrame((state, delta) => {
    if (ref.current.position.x < -5 && ref.current.position.y < -5) {
      setReverse(true);
    } else if (ref.current.position.x > 5 && ref.current.position.y > 5) {
      setReverse(false);
    }

    if (!reverse) {
      ref.current.position.x -= delta / 2;
      ref.current.position.y -= delta / 2;
    } else if (reverse) {
      ref.current.position.x += delta / 2;
      ref.current.position.y += delta / 2;
    }
  });

  return (
    <group position={[-5, -5, 0]} ref={ref} scale={0.1}>
      <primitive object={scene} />;
    </group>
  );
};

export default MovingMeteor;
