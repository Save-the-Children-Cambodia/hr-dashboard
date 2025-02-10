import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import PrivateRoute from '../components/PrivateRoute';
import AssignTasks from '../pages/AssignTasks';
import Panhathun from '../components/Panhathun';

const MainRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
        <Route path='/assign' element={<AssignTasks />} />
        <Route path="/staff/:staffId" element={<Panhathun />} />
      </Route>
    </Routes>
  );
};

export default MainRoutes;