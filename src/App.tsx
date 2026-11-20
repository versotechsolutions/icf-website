import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { SiteLayout } from '@/layouts/SiteLayout';
import { EventSiteLayout } from '@/layouts/EventSiteLayout';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ConferencesPage from '@/pages/ConferencesPage';
import TopicsPage from '@/pages/TopicsPage';
import ConferenceDetailsPage from '@/pages/ConferenceDetailsPage';
import CallForPapersPage from '@/pages/CallForPapersPage';
import PaperSubmissionPage from '@/pages/PaperSubmissionPage';
import SubmissionGuidelinesPage from '@/pages/SubmissionGuidelinesPage';
import AboutConferencePage from '@/pages/AboutConferencePage';
import RegistrationBenefitsPage from '@/pages/RegistrationBenefitsPage';
import RegistrationPage from '@/pages/RegistrationPage';
import InvitationLetterPage from '@/pages/InvitationLetterPage';
import AwardsPage from '@/pages/AwardsPage';
import FaqPage from '@/pages/FaqPage';
import ProgrammePage from '@/pages/ProgrammePage';
import VenuePage from '@/pages/VenuePage';
import TravelPage from '@/pages/TravelPage';
import VideoConferencingPage from '@/pages/VideoConferencingPage';
import GalleryPage from '@/pages/GalleryPage';
import ContactPage from '@/pages/ContactPage';
import PolicyPage from '@/pages/PolicyPage';
import NotFoundPage from '@/pages/NotFoundPage';

// The admin area is code-split so public visitors never download it.
const AdminLayout = lazy(() => import('@/admin/AdminLayout'));
const AdminLogin = lazy(() => import('@/admin/pages/LoginPage'));
const AdminDashboard = lazy(() => import('@/admin/pages/DashboardPage'));
const AdminConferences = lazy(() => import('@/admin/pages/ConferencesPage'));
const AdminConferenceForm = lazy(() => import('@/admin/pages/ConferenceFormPage'));
const AdminRegistrations = lazy(() => import('@/admin/pages/RegistrationsPage'));
const AdminPayments = lazy(() => import('@/admin/pages/PaymentsPage'));
const AdminEmails = lazy(() => import('@/admin/pages/EmailsPage'));
const AdminReports = lazy(() => import('@/admin/pages/ReportsPage'));
const AdminContent = lazy(() => import('@/admin/pages/ContentPage'));

const load = (node: ReactNode) => <Suspense fallback={<div className="p-10 text-muted">Loading…</div>}>{node}</Suspense>;

export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/conferences', element: <ConferencesPage /> },
      { path: '/conferences/:country', element: <ConferencesPage /> },
      { path: '/topics', element: <TopicsPage /> },
      { path: '/call-for-papers', element: <CallForPapersPage /> },
      { path: '/paper-submission', element: <PaperSubmissionPage /> },
      { path: '/registration', element: <RegistrationPage /> },
      { path: '/invitation-letter', element: <InvitationLetterPage /> },
      { path: '/awards', element: <AwardsPage /> },
      { path: '/faq', element: <FaqPage /> },
      { path: '/programme', element: <ProgrammePage /> },
      { path: '/venue', element: <VenuePage /> },
      { path: '/travel', element: <TravelPage /> },
      { path: '/video-conferencing', element: <VideoConferencingPage /> },
      { path: '/gallery', element: <GalleryPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/policies/:slug', element: <PolicyPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    // Each conference's own event site (menu from Event Details page.docx).
    path: '/event/:slug',
    element: <EventSiteLayout />,
    children: [
      { index: true, element: <ConferenceDetailsPage /> },
      { path: 'about-icf', element: <AboutPage /> },
      { path: 'about', element: <AboutConferencePage /> },
      { path: 'programme', element: <ProgrammePage /> },
      { path: 'call-for-papers', element: <CallForPapersPage /> },
      { path: 'paper-submission', element: <PaperSubmissionPage /> },
      { path: 'submission-guidelines', element: <SubmissionGuidelinesPage /> },
      { path: 'registration', element: <RegistrationPage /> },
      { path: 'registration-benefits', element: <RegistrationBenefitsPage /> },
      { path: 'awards', element: <AwardsPage /> },
      { path: 'gallery', element: <GalleryPage /> },
      { path: 'venue', element: <VenuePage /> },
      { path: 'travel', element: <TravelPage /> },
      { path: 'video-conferencing', element: <VideoConferencingPage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'invitation-letter', element: <InvitationLetterPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  { path: '/admin/login', element: load(<AdminLogin />) },
  {
    path: '/admin',
    element: load(<AdminLayout />),
    children: [
      { index: true, element: load(<AdminDashboard />) },
      { path: 'conferences', element: load(<AdminConferences />) },
      { path: 'conferences/new', element: load(<AdminConferenceForm />) },
      { path: 'conferences/:id/edit', element: load(<AdminConferenceForm />) },
      { path: 'registrations', element: load(<AdminRegistrations />) },
      { path: 'payments', element: load(<AdminPayments />) },
      { path: 'emails', element: load(<AdminEmails />) },
      { path: 'reports', element: load(<AdminReports />) },
      { path: 'content', element: load(<AdminContent />) },
      // Unknown admin addresses (including the removed /admin/access) go back to the dashboard.
      { path: '*', element: <Navigate to="/admin" replace /> },
    ],
  },
]);
