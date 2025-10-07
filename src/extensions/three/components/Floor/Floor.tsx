import { FloorProps } from './Floor.types';

export const Floor = ({ ...meshProps }: FloorProps) => {
  return (
    <mesh rotation-x={-Math.PI / 2} {...meshProps}>
      <circleGeometry args={[10]} />
      <meshStandardMaterial />
    </mesh>
  );
};
