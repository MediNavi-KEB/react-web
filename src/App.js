import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import RouteZip from './components/basis/RouteZip';
import Footer from './components/basis/Footer';
import Header from './components/basis/Header';

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

const Main = () => {
  const location = useLocation();
  const hideRoutes = ['/', '/login', '/join', '/chatbot'];
  const shouldHide = hideRoutes.includes(location.pathname);

  return (
    <div className='App'>
      {!shouldHide && <Header />}
      <RouteZip />
      {!shouldHide && <Footer />}
    </div>
  );
};

export default App;
