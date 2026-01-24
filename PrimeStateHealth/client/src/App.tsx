import { Switch, Route, useLocation } from "wouter";
import { useCallback, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import Home from "@/pages/Home";
import Screener from "@/pages/Screener";
import FullAssessment from "@/pages/FullAssessment";
import Dashboard from "@/pages/Dashboard";
import HowItWorks from "@/pages/HowItWorks";
import BloodTesting from "@/pages/BloodTesting";
import BloodTestingWaitlist from "@/pages/BloodTestingWaitlist";
import CognitiveTesting from "@/pages/CognitiveTesting";
import Metabolomics from "@/pages/Metabolomics";
import ExampleMetabolomicsReport from "@/pages/ExampleMetabolomicsReport";
import About from "@/pages/About";
import TermsOfUse from "@/pages/TermsOfUse";
import ClinicDemo from "@/pages/ClinicDemo";
import ClinicIntegration from "@/pages/ClinicIntegration";
import ClinicReport, { type ClinicReportProps } from "@/pages/ClinicReport";
import ClinicLogin from "@/pages/ClinicLogin";
import Contact from "@/pages/Contact";
import ForPatientsPage from "@/pages/ForPatients";
import SampleReportPage from "@/pages/SampleReport";
import NotFound from "@/pages/not-found";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SafeRender } from "@/components/SafeRender";
import { CookieConsent } from "@/components/CookieConsent";
import { DisclaimerBar } from "@/components/DisclaimerBar";
import {
  canTrack,
  initGA4,
  initMetaPixel,
  storeUTMsFromLocation,
  trackPageView,
} from "@/lib/tracking";

function App() {
  const [location] = useLocation();
  const lastTrackedPathRef = useRef<string | null>(null);
  const ga4Id = import.meta.env.VITE_GA4_ID;
  const metaPixelId = import.meta.env.VITE_META_PIXEL_ID;
  const hideDisclaimer =
    location.startsWith("/dashboard") ||
    location.startsWith("/clinic/login") ||
    location.startsWith("/sample-report") ||
    location.startsWith("/blood-testing/metabolomics/example");

  const trackCurrentPage = useCallback(() => {
    storeUTMsFromLocation();
    if (!canTrack()) return;

    initGA4(ga4Id);
    initMetaPixel(metaPixelId);

    const path = `${window.location.pathname}${window.location.search}`;
    if (lastTrackedPathRef.current === path) return;
    trackPageView(path);
    lastTrackedPathRef.current = path;
  }, [ga4Id, metaPixelId]);

  useEffect(() => {
    trackCurrentPage();
  }, [location, trackCurrentPage]);

  useEffect(() => {
    const handleConsent = () => {
      trackCurrentPage();
    };

    window.addEventListener("nv-consent-changed", handleConsent);
    return () => window.removeEventListener("nv-consent-changed", handleConsent);
  }, [trackCurrentPage]);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      {!hideDisclaimer && <DisclaimerBar />}
      <Switch>
        <Route path="/" component={Home} />
        <Route
          path="/screener"
          component={() => (
            <SafeRender context="screener">
              <Screener />
            </SafeRender>
          )}
        />
        <Route
          path="/full-assessment"
          component={() => (
            <SafeRender context="full-assessment">
              <FullAssessment />
            </SafeRender>
          )}
        />
        <Route
          path="/clinic-demo"
          component={() => (
            <SafeRender context="clinic-demo">
              <ClinicDemo />
            </SafeRender>
          )}
        />
        <Route path="/solutions/clinic-integration" component={ClinicIntegration} />
        <Route path="/contact" component={Contact} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/clinic/login" component={ClinicLogin} />
        <Route path="/for-patients" component={ForPatientsPage} />
        <Route path="/sample-report" component={SampleReportPage} />
        <Route
          path="/dashboard"
          component={() => (
            <RequireAuth>
              <ErrorBoundary context="dashboard">
                <Dashboard />
              </ErrorBoundary>
            </RequireAuth>
          )}
        />
        <Route
          path="/dashboard/report/:id"
          component={(props: ClinicReportProps) => (
            <RequireAuth>
              <ErrorBoundary context="clinic-report">
                <ClinicReport {...props} />
              </ErrorBoundary>
            </RequireAuth>
          )}
        />
        <Route path="/blood-testing" component={BloodTesting} />
        <Route path="/solutions/cognitive-testing" component={CognitiveTesting} />
        <Route path="/blood-testing/metabolomics" component={Metabolomics} />
        <Route
          path="/blood-testing/metabolomics/example"
          component={() => (
            <ErrorBoundary context="example-report">
              <ExampleMetabolomicsReport />
            </ErrorBoundary>
          )}
        />
        <Route path="/blood-testing/waitlist" component={BloodTestingWaitlist} />
        <Route path="/about" component={About} />
        <Route path="/terms-of-use" component={TermsOfUse} />
        <Route component={NotFound} />
      </Switch>
      <CookieConsent />
      <Toaster />
    </div>
  );
}

export default App;
