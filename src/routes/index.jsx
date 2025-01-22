import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/react-gh-pages" element={<Home />} />
      <Route path="/react-gh-pages/about" element={<About />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default MainRoutes;