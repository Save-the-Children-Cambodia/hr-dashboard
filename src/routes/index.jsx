import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
<<<<<<< HEAD
=======
import Login from '../pages/Login';
import Register from '../pages/Register';
import PrivateRoute from '../components/PrivateRoute';
>>>>>>> refs/remotes/origin/main

const MainRoutes = () => {
  return (
    <Routes>
<<<<<<< HEAD
      <Route path="/react-gh-pages" element={<Home />} />
      <Route path="/react-gh-pages/about" element={<About />} />
      <Route path="/" element={<Home />} />
=======
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/react-gh-pages" element={<Home />} />
        <Route path="/react-gh-pages/about" element={<About />} />
        <Route path="/" element={<Home />} />
      </Route>
>>>>>>> refs/remotes/origin/main
    </Routes>
  );
};

export default MainRoutes;