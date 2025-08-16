import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import GeotechnicalEngineeringPage from './pages/GeotechnicalEngineeringPage/GeotechnicalEngineeringPage';
import './App.css';
import AboutPage from './pages/AboutPage/AboutPage'; // Importing the AboutPage component
import Geo5Page from './pages/Geo5Page/Geo5Page'; // Importing the Geo5Page component
import ITDigitalServicesPage from './pages/ITDigitalServicesPage/ITDigitalServicesPage'; // Importing the IT & Digital Services page component
import ConstructionInspectionPage from './pages/ConstructionInspectionPage/ConstructionInspectionPage';
import DrillingInSituTestingPage from './pages/DrillingInSituTestingPage/DrillingInSituTestingPage';
import LaboratoryTestingPage from './pages/LaboratoryTestingPage/LaboratoryTestingPage';
import InstrumentationConditionSurveysPage from './pages/InstrumentationConditionSurveysPage/InstrumentationConditionSurveysPage';
import AdminPage from './pages/AdminPage/AdminPage';
import BlogPage from './pages/BlogPage/BlogPage';
import BlogPostPage from './pages/BlogPostPage/BlogPostPage';
import CareerPage from './pages/CareerPage/CareerPage';
import ContactPage from './pages/ContactPage/ContactPage';
import ChatBot from './components/ChatBot/ChatBot'; // Importing the ChatBot component
function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services/geotechnical" element={<GeotechnicalEngineeringPage />} />
            <Route path="/services/construction-inspection-testing" element={<ConstructionInspectionPage />} />
            <Route path="/services/drilling-in-situ-testing" element={<DrillingInSituTestingPage />} />
            <Route path="/services/laboratory-testing" element={<LaboratoryTestingPage />} />
            <Route path="/services/instrumentation-condition-surveys" element={<InstrumentationConditionSurveysPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/careers" element={<CareerPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/geo5-software" element={<Geo5Page />} />
            <Route path="/it-services" element={<ITDigitalServicesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <ChatBot />
        <Footer />
      </div>
    </Router>
  );
}

export default App;