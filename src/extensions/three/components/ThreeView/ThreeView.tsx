import { Canvas } from '@react-three/fiber';
import { ThreeViewProps } from './ThreeView.types';

export const ThreeView = ({ children, ...canvasProps }: ThreeViewProps) => {
  return (
    <Canvas
      style={{ top: 0, bottom: 0, left: 0, right: 0, position: 'absolute' }}
      frameloop="demand"
      {...canvasProps}
    >
      {children}
    </Canvas>
  );
};
