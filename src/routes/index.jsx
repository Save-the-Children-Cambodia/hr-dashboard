import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Login from '../pages/Login';
import Register from '../pages/Register';
import PrivateRoute from '../components/PrivateRoute';
import AssignTasks from '../pages/AssignTasks';

const MainRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/react-gh-pages" element={<Home />} />
        <Route path="/react-gh-pages/about" element={<About />} />
        <Route path="/" element={<Home />} />
        <Route path='/assign' element={<AssignTasks />} />
      </Route>
    </Routes>
  );
};

export default MainRoutes;