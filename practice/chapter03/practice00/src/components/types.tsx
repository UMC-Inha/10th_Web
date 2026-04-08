import type { ReactNode, ComponentType } from 'react';

//Link 컴포넌트
export interface LinkProps {
  to: string;
  children: ReactNode;
}

// Route 컴포넌트
export interface RouteProps {
  path: string;
  component: ComponentType;
}

// Routes 컴포넌트
export interface RoutesProps {
  children: ReactNode;
}