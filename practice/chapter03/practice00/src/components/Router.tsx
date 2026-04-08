import { useMemo, Children, cloneElement, type FC, type ReactElement } from "react";
import type { RoutesProps, RouteProps } from "./types";
import { useCurrentPath } from "./utils";

const isRouteElement = (child: any): child is ReactElement<RouteProps> => {
  return child.props && child.props.path !== undefined;
};

export const Routes: FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();

  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement);

    return routes.find((route) => route.props.path === currentPath);
  }, [children, currentPath]);

  if (!activeRoute) return null;

  return cloneElement(activeRoute as ReactElement);
};