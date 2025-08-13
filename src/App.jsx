import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import GeotechnicalEngineeringPage from './pages/GeotechnicalEngineeringPage/GeotechnicalEngineeringPage';
import './App.css';
import AboutPage from './pages/AboutPage/AboutPage'; // Importing the AboutPage component
import Geo5Page from './pages/Geo5Page/Geo5Page'; // Importing the Geo5Page component
import ITDigitalServicesPage from './pages/ITDigitalServicesPage/ITDigitalServicesPage'; // Importing the IT & Digital Services page component

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services/geotechnical" element={<GeotechnicalEngineeringPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/geo5-software" element={<Geo5Page />} />
            <Route path="/it-services" element={<ITDigitalServicesPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;