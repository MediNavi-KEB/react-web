import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import RouteZip from './components/basis/RouteZip';
import Footer from './components/basis/Footer';

function App() {
  return (
    <Router>
        <Main />
    </Router>
  );
}

const Main = () => {
  const location = useLocation();
  const hideRoutes = ['/', '/login', '/join', '/chatbot', '/description'];
  const shouldHide = hideRoutes.includes(location.pathname);

  return (
    <div className='App'>
      <RouteZip />
      {!shouldHide && <Footer />}
    </div>
  );
};

export default App;
