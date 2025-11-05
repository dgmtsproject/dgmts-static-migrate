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
import LocationPage from './pages/LocationPage/LocationPage'; // Importing the LocationPage component
import ContactPage from './pages/ContactPage/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage/PrivacyPolicyPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage/TermsAndConditionsPage';
import PublishedPapersPage from './pages/PublishedPapersPage/PublishedPapersPage';
import GalleryPage from './pages/GalleryPage/GalleryPage';
import ChatBot from './components/ChatBot/ChatBot'; // Importing the ChatBot component
import ScrollToTop from './components/ScrollToTop';
import FloatingQuoteButton from './components/FloatingQuoteButton/FloatingQuoteButton';
import TeamMemberPage from './pages/TeamMemberPage/TeamMemberPage';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import SuccessPage from './pages/SuccessPage/SuccessPage';
import CancelPage from './pages/CancelPage/CancelPage';
import NewsletterModal from './components/Modal/NewsletterModal';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import ProjectsPage from './pages/ProjectsPage/ProjectsPage';
import ProjectDetailPage from './pages/ProjectsPage/ProjectDetailPage';
import ClientsPage from './pages/ClientsPage/ClientsPage';
function App() {
  return (
    <Router>
      <ScrollToTop />
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
            <Route path="/published-papers" element={<PublishedPapersPage />} />
            <Route path="/location" element={<LocationPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage/>}/>
            <Route path="/terms-and-conditions" element={<TermsAndConditionsPage/>}/>
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/team/:id" element={<TeamMemberPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/cancel" element={<CancelPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/clients" element={<ClientsPage />} />

            {/* Catch-all route for 404 errors - must be last */}
            <Route path="*" element={<NotFoundPage />} />
            
          </Routes>
        </main>
        <ChatBot />
        <FloatingQuoteButton />
        <NewsletterModal />
        <Footer />
      </div>
    </Router>
  );
}

export default App;