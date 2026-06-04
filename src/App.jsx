import './styles/global.scss';

import { Suspense, lazy } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import BackToTop from './components/layout/BackToTop/BackToTop';
import RouteScrollManager from './components/layout/RouteScrollManager/RouteScrollManager';
import PageLoader from './components/layout/PageLoader/PageLoader';
import NextServiceBanner from './components/layout/NextServiceBanner/NextServiceBanner';
import RouteLoader from './components/layout/RouteLoader/RouteLoader';

// Home is the entry point — keep it eagerly imported so the first
// paint isn't gated on a chunk fetch.
import Home from './components/pages/Home/Home';

// The other routes are heavy (Gallery pre-loads ~200 images,
// Departments owns its own page chrome). Code-split them so visitors
// who never click into Gallery don't pay for it on first load.
// Suspense shows RouteLoader while the chunk arrives.
const GalleryPage     = lazy(() => import('./components/pages/Gallery/GalleryPage'));
const DepartmentsPage = lazy(() => import('./components/pages/Departments/DepartmentsPage'));
const NotFound        = lazy(() => import('./components/pages/NotFound/NotFound'));

const AppInner = () => (
  <BrowserRouter>
    <RouteScrollManager />
    <NextServiceBanner />
    <Navbar />
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/gallery"     element={<GalleryPage />} />
        <Route path="*"            element={<NotFound />} />
      </Routes>
    </Suspense>
    <Footer />
    <BackToTop />
  </BrowserRouter>
);

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PageLoader />
        <AppInner />
      </LanguageProvider>
    </ThemeProvider>
  );
}
