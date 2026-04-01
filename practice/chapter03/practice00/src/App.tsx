import { Link } from './components/Link';
import { Route } from './components/Route';
import { Routes } from './components/Router';

const MatthewPage = () => <h1>매튜 페이지</h1>;
const AeongPage = () => <h1>애옹 페이지</h1>;
const DongDongPage = () => <h1>동동 페이지</h1>;
const NotFoundPage = () => <h1>404</h1>;

const Header = () => {
  return (
    <nav style={{ display: 'flex', gap: '15px' }}>
      <Link to='/matthew'>MATTHEW</Link>
      <Link to='/aeong'>AEONG</Link>
      <Link to='/dongdong'>DONGDONG</Link>
      <Link to='/not-found'>NOT FOUND</Link>
    </nav>
  );
};

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/matthew' component={MatthewPage} />
        <Route path='/aeong' component={AeongPage} />
        <Route path='/dongdong' component={DongDongPage} />
        <Route path='/not-found' component={NotFoundPage} />
      </Routes>
    </>
  );
}

export default App;