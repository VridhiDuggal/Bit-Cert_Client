import { lazy, Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LandingNavbar } from './components/LandingNavbar';
import { HeroSection } from './components/HeroSection';
import { FeatureGrid } from './components/FeatureGrid';
import { VerifyCtaSection } from './components/VerifyCtaSection';
import { OrgLoginModal } from '../../components/auth/OrgLoginModal';
import { OrgOnboardModal } from '../../components/auth/OrgOnboardModal';
import { RecipientLoginModal } from '../../components/auth/RecipientLoginModal';

const LandingFooter = lazy(() => import('./components/LandingFooter'));

export default function LandingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isOnboardOpen, setIsOnboardOpen] = useState(false);
  const [isRecipientLoginOpen, setIsRecipientLoginOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('openRecipientLogin') === 'true') {
      setIsRecipientLoginOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const openLogin = () => setIsLoginOpen(true);
  const openOnboard = () => setIsOnboardOpen(true);
  const switchToLogin = () => { setIsOnboardOpen(false); setIsLoginOpen(true); };
  const switchToOnboard = () => { setIsLoginOpen(false); setIsOnboardOpen(true); };

  return (
    <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', color: '#1a202c', backgroundColor: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>
      <LandingNavbar onLoginOpen={openLogin} onOnboardOpen={openOnboard} onRecipientLoginOpen={() => setIsRecipientLoginOpen(true)} />
      <main>
        <HeroSection onLoginOpen={openLogin} onOnboardOpen={openOnboard} />
        <FeatureGrid onLoginOpen={openLogin} />
        <VerifyCtaSection />
      </main>
      <Suspense fallback={null}>
        <LandingFooter />
      </Suspense>

      <OrgLoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onSwitchToOnboard={switchToOnboard} />
      <RecipientLoginModal isOpen={isRecipientLoginOpen} onClose={() => setIsRecipientLoginOpen(false)} />
      <OrgOnboardModal
        isOpen={isOnboardOpen}
        onClose={() => setIsOnboardOpen(false)}
        onSuccessOpenLogin={switchToLogin}
        onSwitchToLogin={switchToLogin}
      />
    </div>
  );
}
