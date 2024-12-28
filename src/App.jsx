import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainRoutes from './routes';
import './App.css';

function App() {
  const basename = process.env.NODE_ENV === 'production' ? '/react-gh-pages' : '';

  return (
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
  );
}

export default App;