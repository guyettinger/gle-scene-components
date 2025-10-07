import { useLayoutEffect, useRef } from 'react';
import { Vector3 } from 'three';
import { LineProps } from './Line.types';

export const Line = ({ start, end }: LineProps) => {
  const ref = useRef<any>(null);
  useLayoutEffect(() => {
    ref.current.geometry.setFromPoints([start, end].map((point) => new Vector3().copy(point)));
  }, [start, end]);
  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color="hotpink" />
    </line>
  );
};
