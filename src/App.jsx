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
import NewsletterSubscribersList from './pages/NewsletterSubscribersList/NewsletterSubscribersList';
import EmailConfigurationPage from './pages/EmailConfigurationPage/EmailConfigurationPage';
import BlogAdminPage from './pages/BlogAdminPage/BlogAdminPage';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import CredentialsManagement from './pages/CredentialsManagement/CredentialsManagement';
function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Header />
        <main>
          <Routes> {/* Added Fallback routes for old php routes*/}
            <Route path="/" element={<HomePage />} />


            <Route path="/page/our-services" element={<HomePage />} /> {/* Fallback route for old our-services page */}


            <Route path="/services/geotechnical" element={<GeotechnicalEngineeringPage />} />
            <Route path="/page/geotechnical-engineering" element={<GeotechnicalEngineeringPage />} />


            <Route path="/services/construction-inspection-testing" element={<ConstructionInspectionPage />} />
            <Route path="/page/construction-materials-testing" element={<ConstructionInspectionPage />} /> {/* Fallback route for old construction materials testing page */}
            <Route path="/service/construction-materials-testing" element={<ConstructionInspectionPage />} /> {/* Fallback route for old construction materials testing page */}


            <Route path="/services/drilling-in-situ-testing" element={<DrillingInSituTestingPage />} />
            <Route path="/page/drilling" element={<DrillingInSituTestingPage />} /> {/* Fallback route for old drilling page */}




            <Route path="/services/laboratory-testing" element={<LaboratoryTestingPage />} />
            <Route path="/page/laboratory-testing" element={<LaboratoryTestingPage />} /> {/* Fallback route for old laboratory testing page */}


            <Route path="/services/instrumentation-condition-surveys" element={<InstrumentationConditionSurveysPage />} />
            <Route path="/page/instrumentation" element={<InstrumentationConditionSurveysPage />} /> {/* Fallback route for old instrumentation page */}
            
            
            <Route path="/about" element={<AboutPage />} />
            <Route path="/page/meet-the-team" element={<AboutPage />} /> {/* Fallback route for old meet-the-team page */}
            <Route path="/page/who-we-are" element={<AboutPage />} /> {/* Fallback route for old who-we-are page */}



            <Route path="/careers" element={<CareerPage />} />
            <Route path="/page/careers" element={<CareerPage />} /> {/* Fallback route for old careers page */}




            <Route path="/contact" element={<ContactPage />} />
            <Route path="/page/contact" element={<ContactPage />} /> {/* Fallback route for old contact page */}



            <Route path="/geo5-software" element={<Geo5Page />} />
            <Route path="/page/geo5" element={<Geo5Page />} /> {/* Fallback route for old geo5 page */}



            <Route path="/it-services" element={<ITDigitalServicesPage />} />
            <Route path="/page/it-digital-services" element={<ITDigitalServicesPage />} /> {/* Fallback route for old it-digital-services page */}

            <Route path="/blog" element={<BlogPage />} />
            <Route path="/page/blog" element={<BlogPage />} /> {/* Fallback route for old blog page */}

            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/legacy" element={<AdminPage />} />
            <Route path="/admin/email_configuration" element={<EmailConfigurationPage />} />
            <Route path="/admin/newsletter-subscribers-list" element={<NewsletterSubscribersList />} />
            <Route path="/admin/blog-management" element={<BlogAdminPage />} />
            <Route path="/admin/credentials" element={<CredentialsManagement />} />
            <Route path="/published-papers" element={<PublishedPapersPage />} />
            <Route path="/location" element={<LocationPage />} />
            <Route path="/page/location" element={<LocationPage />} /> {/* Fallback route for old location page */}


            <Route path="/privacy-policy" element={<PrivacyPolicyPage/>}/>
            <Route path="/privacy-policy.php" element={<PrivacyPolicyPage/>}/> {/* Fallback route for old privacy policy page */}

            <Route path="/terms-and-conditions" element={<TermsAndConditionsPage/>}/>
            <Route path="/terms-and-conditions.php" element={<TermsAndConditionsPage/>}/> {/* Fallback route for old terms and conditions page */}


            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/page/gallery" element={<GalleryPage />} /> {/* Fallback route for old gallery page */}

            <Route path="/team/:id" element={<TeamMemberPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/pay" element={<PaymentPage />} />
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