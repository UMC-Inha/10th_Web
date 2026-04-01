import { BrowserRouter as Router, Routes, Route } from 'react-router';

// import pages
import Home from './pages/Home';
import Popular from './pages/Popular';
import NowPlaying from './pages/NowPlaying';
import TopRated from './pages/TopRated';
import Upcoming from './pages/Upcoming';

// import layouts
import Layout from './layouts/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/popular" element={<Popular />} />
          <Route path="/now-playing" element={<NowPlaying />} />
          <Route path="/top-rated" element={<TopRated />} />
          <Route path="/upcoming" element={<Upcoming />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
