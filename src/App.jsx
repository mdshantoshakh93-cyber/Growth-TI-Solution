import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

// Public Layout & Pages
import { PublicLayout } from './public/PublicLayout';
import { Home } from './public/Home';
import { About } from './public/About';
import { PublicServices } from './public/PublicServices';
import { ServiceDetail } from './public/ServiceDetail';
import { PublicPortfolio } from './public/PublicPortfolio';
import { ProjectDetail } from './public/ProjectDetail';
import { PublicPricing } from './public/PublicPricing';
import { PublicBlog } from './public/PublicBlog';
import { BlogDetail } from './public/BlogDetail';
import { PublicCareers } from './public/PublicCareers';
import { JobDetail } from './public/JobDetail';
import { PublicContact } from './public/PublicContact';
import { PublicFaq } from './public/PublicFaq';
import { PrivacyPolicy } from './public/PrivacyPolicy';
import { TermsAndConditions } from './public/TermsAndConditions';
import { NotFound } from './public/NotFound';

// Admin Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Services } from './pages/Services';
import { Blogs } from './pages/Blogs';
import { Testimonials } from './pages/Testimonials';
import { Pricing } from './pages/Pricing';
import { Faqs } from './pages/Faqs';
import { Team } from './pages/Team';
import { Careers } from './pages/Careers';
import { Messages } from './pages/Messages';
import { Newsletter } from './pages/Newsletter';
import { Media } from './pages/Media';
import { Pages } from './pages/Pages';
import { Navigation } from './pages/Navigation';
import { Seo } from './pages/Seo';
import { Users } from './pages/Users';
import { ActivityLogs } from './pages/ActivityLogs';
import { Settings } from './pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* PUBLIC WEBSITE ROUTES */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<PublicServices />} />
              <Route path="services/:slug" element={<ServiceDetail />} />
              <Route path="projects" element={<PublicPortfolio />} />
              <Route path="projects/:slug" element={<ProjectDetail />} />
              <Route path="portfolio" element={<Navigate to="/projects" replace />} />
              <Route path="pricing" element={<PublicPricing />} />
              <Route path="blog" element={<PublicBlog />} />
              <Route path="blog/:slug" element={<BlogDetail />} />
              <Route path="careers" element={<PublicCareers />} />
              <Route path="careers/:slug" element={<JobDetail />} />
              <Route path="contact" element={<PublicContact />} />
              <Route path="faq" element={<PublicFaq />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="404" element={<NotFound />} />
            </Route>

            {/* UNPROTECTED LOGIN ROUTES */}
            <Route path="/login" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<Login />} />

            {/* PROTECTED ADMIN DASHBOARD ROUTES */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="services" element={<Services />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="testimonials" element={<Testimonials />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="faqs" element={<Faqs />} />
              <Route path="team" element={<Team />} />
              <Route path="careers" element={<Careers />} />
              <Route path="messages" element={<Messages />} />
              <Route path="newsletter" element={<Newsletter />} />
              <Route path="media" element={<Media />} />
              <Route path="pages" element={<Pages />} />
              <Route path="navigation" element={<Navigation />} />
              <Route path="seo" element={<Seo />} />
              <Route
                path="users"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route path="activity-logs" element={<ActivityLogs />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* 404 CATCH-ALL */}
            <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
