import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader.js';
import { useRef, FC } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Mesh, Texture } from 'three';

interface ConnectionProps {
  img: string;
  clickHandler: () => void;
}

interface ItemProps {
  img: Texture;
  clickHandler: () => void;
}

const Item: FC<ItemProps> = ({ img, clickHandler }) => {
  const ref = useRef<Mesh | null>(null);

  useFrame(() => {
    if (ref.current === null) return;

    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={ref} onClick={(e) => clickHandler()}>
      <boxBufferGeometry
        attach='geometry'
        position={[-2, 0, 0]}
        radius={0}
        args={[2, 2, 2]}
      />
      <meshStandardMaterial map={img} attach='material' />
      <meshStandardMaterial map={img} attach='material' />
      <meshStandardMaterial map={img} attach='material' />
      <meshStandardMaterial map={img} attach='material' />
      <meshStandardMaterial map={img} attach='material' />
      <meshStandardMaterial map={img} attach='material' />
    </mesh>
  );
};

const Connection: FC<ConnectionProps> = ({ img, clickHandler }) => {
  const texture: Texture = useLoader(TextureLoader, img);
  return (
    <Canvas
      style={{
        width: '75px',
        height: '100px',
      }}
    >
      <OrbitControls enableZoom={false} enablePan={false} />
      <ambientLight intensity={0.4} />
        <Item img={texture} clickHandler={clickHandler} />
    </Canvas>
  );
};

export default Connection;
