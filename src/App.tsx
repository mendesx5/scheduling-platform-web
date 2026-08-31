import {BrowserRouter,Route,Routes} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import {TenantProtected,PlatformProtected} from './components/ProtectedRoute';
import LandingPage from './pages/landing/LandingPage';
import PrivacyPage from './pages/legal/PrivacyPage';
import TermsPage from './pages/legal/TermsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PlatformLoginPage from './pages/auth/PlatformLoginPage';
import PublicBookingPage from './pages/public/PublicBookingPage';
import AdminLayout from './layouts/AdminLayout';
import PlatformLayout from './layouts/PlatformLayout';
import DashboardPage from './pages/admin/DashboardPage';
import AgendaPage from './pages/admin/AgendaPage';
import BookingsPage from './pages/admin/BookingsPage';
import VenuesPage from './pages/admin/VenuesPage';
import VenueFormPage from './pages/admin/VenueFormPage';
import VenueSchedulePage from './pages/admin/VenueSchedulePage';
import CustomersPage from './pages/admin/CustomersPage';
import TeamPage from './pages/admin/TeamPage';
import SubscriptionPage from './pages/admin/SubscriptionPage';
import SettingsPage from './pages/admin/SettingsPage';
import PageEditorPage from './pages/admin/PageEditorPage';
import OnboardingPage from './pages/onboarding/OnboardingPage';
import PlatformDashboard from './pages/platform/PlatformDashboard';
import TenantsPage from './pages/platform/TenantsPage';

export default function App(){return <BrowserRouter><AuthProvider><Routes>
  <Route path="/" element={<LandingPage/>}/>
  <Route path="/privacidade" element={<PrivacyPage/>}/><Route path="/termos" element={<TermsPage/>}/>
  <Route path="/login" element={<LoginPage/>}/><Route path="/register" element={<RegisterPage/>}/>
  <Route path="/p/:slug" element={<PublicBookingPage/>}/><Route path="/platform/login" element={<PlatformLoginPage/>}/>
  <Route element={<TenantProtected/>}><Route path="/app/onboarding" element={<OnboardingPage/>}/><Route path="/app" element={<AdminLayout/>}>
    <Route index element={<DashboardPage/>}/><Route path="agenda" element={<AgendaPage/>}/><Route path="bookings" element={<BookingsPage/>}/>
    <Route path="venues" element={<VenuesPage/>}/><Route path="venues/new" element={<VenueFormPage/>}/><Route path="venues/:id/edit" element={<VenueFormPage/>}/><Route path="venues/:id" element={<VenueSchedulePage/>}/>
    <Route path="customers" element={<CustomersPage/>}/><Route path="team" element={<TeamPage/>}/>
    <Route path="page" element={<PageEditorPage/>}/><Route path="settings" element={<SettingsPage/>}/><Route path="subscription" element={<SubscriptionPage/>}/>
  </Route></Route>
  <Route element={<PlatformProtected/>}><Route path="/platform" element={<PlatformLayout/>}><Route index element={<PlatformDashboard/>}/><Route path="tenants" element={<TenantsPage/>}/></Route></Route>
  <Route path="/:slug" element={<PublicBookingPage/>}/>
  <Route path="*" element={<div className="notfound"><h1>404</h1><p>Página não encontrada.</p><a className="btn primary" href="/">Voltar para o início</a></div>}/>
</Routes></AuthProvider></BrowserRouter>}
