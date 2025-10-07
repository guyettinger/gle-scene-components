import { Fragment } from 'react';
import { SceneContentProps } from './SceneContent.types';

export const SceneContent = ({ children }: SceneContentProps) => {
  return <Fragment>{children}</Fragment>;
};
