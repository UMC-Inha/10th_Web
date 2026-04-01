import {
  useState,
  useEffect,
  useMemo,
  Children,
  isValidElement,
  cloneElement,
  type ReactNode,
} from 'react';

const HomePage = () => <h1>홈페이지</h1>;
const AboutPage = () => <h1>소개페이지</h1>;
const ContactPage = () => <h1>연락처페이지</h1>;
const NotFoundPage = () => <h1>404페이지</h1>;

// ─────────────────────────────────────────────
// Link
// ─────────────────────────────────────────────

const PUSHSTATE_EVENT = 'pushstate';

interface LinkProps {
  to: string;
  children: ReactNode;
}

const Link = ({ to, children }: LinkProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.history.pushState(null, '', to);
    window.dispatchEvent(new CustomEvent(PUSHSTATE_EVENT));
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
};

// ─────────────────────────────────────────────
// useCurrentPath
// ─────────────────────────────────────────────

const useCurrentPath = () => {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handleChange = () => setPathname(window.location.pathname);

    window.addEventListener(PUSHSTATE_EVENT, handleChange);
    window.addEventListener('popstate', handleChange);

    return () => {
      window.removeEventListener(PUSHSTATE_EVENT, handleChange);
      window.removeEventListener('popstate', handleChange);
    };
  }, []);

  return pathname;
};

// ─────────────────────────────────────────────
// Route / Router
// ─────────────────────────────────────────────

interface RouteProps {
  path: string;
  component: () => ReactNode;
}

const Route = ({ component: Component }: RouteProps) => {
  return <Component />;
};

interface RouterProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const isRouteElement = (child: unknown): child is React.ReactElement<RouteProps> => {
  return isValidElement(child) && 'path' in (child.props as object);
};

const Router = ({ children, fallback = <NotFoundPage /> }: RouterProps) => {
  const pathname = useCurrentPath();

  const matched = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement);
    return routes.find((route) => route.props.path === pathname);
  }, [children, pathname]);

  return <>{matched ? cloneElement(matched) : fallback}</>;
};

// ─────────────────────────────────────────────
// App
// ─────────────────────────────────────────────

const Header = () => {
  return (
    <header style={{ display: 'flex', gap: '10px' }}>
      <Link to="/">홈</Link>
      <Link to="/about">소개</Link>
      <Link to="/contact">연락처</Link>
    </header>
  );
};

function App() {
  return (
    <>
      <Header />
      <Router>
        <Route path="/" component={HomePage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/contact" component={ContactPage} />
      </Router>
    </>
  );
}

export default App;
