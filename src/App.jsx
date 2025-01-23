<<<<<<< HEAD
import { BrowserRouter as Router } from 'react-router-dom';
=======
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
>>>>>>> refs/remotes/origin/main
import MainRoutes from './routes';
import './App.css';

function App() {
  const basename = process.env.NODE_ENV === 'production' ? '/react-gh-pages' : '';

  return (
<<<<<<< HEAD
    <Router basename={basename}>
      <div className="App">
        <nav>
          {/* Your navigation components */}
        </nav>
        <MainRoutes />
      </div>
    </Router>
=======
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <div className="App">
          <nav>
            {/* Your navigation components */}
          </nav>
          <MainRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
>>>>>>> refs/remotes/origin/main
  );
}

export default App;