import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import NewsSection from '@/components/NewsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import AuthDialog from '@/components/AuthDialog';
import AttendanceDialog from '@/components/AttendanceDialog';
import ApplicationDialog from '@/components/ApplicationDialog';

const Index = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50 to-cyan-50">
      <Header 
        onAuthClick={() => setIsAuthOpen(true)}
        onAttendanceClick={() => setIsAttendanceOpen(true)}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
      />
      
      <Hero onJoinClick={() => setIsApplicationOpen(true)} />
      
      <NewsSection isAdmin={isAdmin} />
      
      <ContactSection />
      
      <Footer />

      <AuthDialog 
        open={isAuthOpen} 
        onOpenChange={setIsAuthOpen}
        onLogin={(admin) => {
          setIsLoggedIn(true);
          setIsAdmin(admin);
        }}
      />

      <AttendanceDialog
        open={isAttendanceOpen}
        onOpenChange={setIsAttendanceOpen}
        isAdmin={isAdmin}
      />

      <ApplicationDialog
        open={isApplicationOpen}
        onOpenChange={setIsApplicationOpen}
      />
    </div>
  );
};

export default Index;
