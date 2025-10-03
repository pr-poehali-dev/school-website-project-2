import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import SchoolHeader from '@/components/SchoolHeader';
import AuthModal from '@/components/AuthModal';
import HomeSection from '@/components/HomeSection';
import NewsListSection from '@/components/NewsListSection';
import AttendanceSection from '@/components/AttendanceSection';
import ApplicationSection from '@/components/ApplicationSection';
import ContactsSection from '@/components/ContactsSection';
import MembersSection from '@/components/MembersSection';
import RoleHistorySection from '@/components/RoleHistorySection';
import DeletedMembersSection from '@/components/DeletedMembersSection';
import GradesSection from '@/components/GradesSection';
import MemberGradesModal from '@/components/MemberGradesModal';
import SchoolFooter from '@/components/SchoolFooter';
import { useAuth } from '@/hooks/useAuth';
import { useNews } from '@/hooks/useNews';
import { useApplications } from '@/hooks/useApplications';
import { useAttendance } from '@/hooks/useAttendance';
import { useMembers } from '@/hooks/useMembers';
import { API_URLS } from '@/config/api';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<{ id: number; name: string } | null>(null);
  const { toast } = useToast();

  const { user, handleLogin, handleRegister, handleLogout, loadUserFromStorage } = useAuth();
  const { news, loadNews, handleCreateNews } = useNews();
  const { applications, loadApplications, handleApplicationSubmit, handleApproveApplication, handleRejectApplication } = useApplications();
  const { attendance, attendanceDate, setAttendanceDate, loadAttendance, handleAttendanceToggle } = useAttendance();
  const { 
    members, 
    deletedMembers, 
    roleHistory, 
    loadMembers, 
    loadDeletedMembers, 
    loadRoleHistory,
    handleRemoveMember,
    handleRestoreMember,
    handlePromoteToAdmin,
    handleDemoteToMember
  } = useMembers();

  useEffect(() => {
    loadNews();
    const userData = loadUserFromStorage();
    if (userData?.role === 'admin') {
      loadApplications();
    }
  }, []);

  useEffect(() => {
    if (activeSection === 'attendance') {
      loadAttendance();
    }
    if (activeSection === 'members' && user?.role === 'admin') {
      loadMembers();
      loadDeletedMembers();
      loadRoleHistory();
    }
  }, [activeSection, attendanceDate, user]);

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    const result = await handleLogin(e);
    if (result.success) {
      setIsAuthModalOpen(false);
      if (result.user?.role === 'admin') loadApplications();
    }
  };

  const onRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    const result = await handleRegister(e);
    if (result.success) {
      setIsAuthModalOpen(false);
    }
  };

  const onLogout = () => {
    handleLogout();
    setActiveSection('home');
  };

  const onCreateNews = (newsData: { title: string; content: string; image_url?: string; video_url?: string }) => {
    handleCreateNews(newsData, user?.id);
  };

  const onPromoteToAdmin = (id: number) => {
    handlePromoteToAdmin(id, user?.id);
  };

  const onDemoteToMember = (id: number) => {
    handleDemoteToMember(id, user?.id);
  };

  const handleViewGrades = (id: number, name: string) => {
    setSelectedMember({ id, name });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <SchoolHeader
        user={user}
        onNavigate={setActiveSection}
        onLogout={onLogout}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={onLogin}
        onRegister={onRegister}
      />

      <main className="container mx-auto px-4 py-8">
        {activeSection === 'home' && (
          <HomeSection news={news} onNavigate={setActiveSection} />
        )}

        {activeSection === 'news' && (
          <NewsListSection 
            news={news} 
            isAdmin={user?.role === 'admin'} 
            onCreateNews={onCreateNews}
          />
        )}

        {activeSection === 'attendance' && user?.role === 'admin' && (
          <AttendanceSection
            attendance={attendance}
            attendanceDate={attendanceDate}
            onDateChange={setAttendanceDate}
            onToggle={handleAttendanceToggle}
          />
        )}

        {activeSection === 'application' && (
          <ApplicationSection
            applications={applications}
            isAdmin={user?.role === 'admin'}
            onSubmit={handleApplicationSubmit}
            onApprove={handleApproveApplication}
            onReject={handleRejectApplication}
          />
        )}

        {activeSection === 'members' && user?.role === 'admin' && (
          <>
            <MembersSection
              members={members}
              onRemoveMember={handleRemoveMember}
              onPromoteToAdmin={onPromoteToAdmin}
              onDemoteToMember={onDemoteToMember}
              onViewGrades={handleViewGrades}
            />
            <DeletedMembersSection
              deletedMembers={deletedMembers}
              onRestoreMember={handleRestoreMember}
            />
            <RoleHistorySection history={roleHistory} />
          </>
        )}

        {activeSection === 'grades' && user && (
          <GradesSection
            user={user}
            apiUrl={API_URLS.members}
            onGradeAdded={() => toast({ title: 'Оценка добавлена!' })}
          />
        )}

        {activeSection === 'contacts' && <ContactsSection />}
      </main>

      <SchoolFooter onNavigate={setActiveSection} />

      {selectedMember && (
        <MemberGradesModal
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          userId={selectedMember.id}
          userName={selectedMember.name}
          apiUrl={API_URLS.members}
        />
      )}

      <Toaster />
    </div>
  );
}

export default App;
