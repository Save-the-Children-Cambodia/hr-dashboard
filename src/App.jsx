import { BrowserRouter as Router } from 'react-router-dom';
import MainRoutes from './routes';
import './App.css';

function App() {
  const basename = process.env.NODE_ENV === 'production' ? '/react-gh-pages' : '';

  return (
    <Router basename={basename}>
      <div className="App">
        <nav>
          {/* Your navigation components */}
        </nav>
        <MainRoutes />
      </div>
    </Router>
  );
}

export default App;