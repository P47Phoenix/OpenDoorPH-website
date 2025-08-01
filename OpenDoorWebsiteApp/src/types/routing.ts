import { ComponentType, ReactElement } from 'react';

export interface RouteConfig {
  path: string;
  component: ComponentType;
  exact?: boolean;
  title?: string;
}

export type PageComponent = () => ReactElement;
