import { useState } from 'react';
import BottomNav, { type Tab } from '@/components/BottomNav';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import { useStudyData } from '@/hooks/useStudyData';
import { TOPIC_BANK } from '@/data/questionBank';
import { generateStudyPlan, adaptPlan } from '@/lib/agent';
import type { DiagnosticAnswer, PracticeSession, StudentProfile, TopicInfo } from '@/types';
import WelcomeScreen from '@/screens/WelcomeScreen';
import SetupScreen from '@/screens/SetupScreen';
import LearningHome from '@/screens/LearningHome';
import ScanScreen from '@/screens/ScanScreen';
import TopicDetails from '@/screens/TopicDetails';
import ProgressScreen from '@/screens/ProgressScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import DiagnosticScreen from '@/screens/DiagnosticScreen';
import DiagnosticResultsScreen from '@/screens/DiagnosticResultsScreen';
import StudyPlanScreen from '@/screens/StudyPlanScreen';
import PracticeScreen from '@/screens/PracticeScreen';

type Overlay =
  | null
  | { name: 'scan' }
  | { name: 'topic'; topic: TopicInfo }
  | { name: 'diagnostic' }
  | { name: 'diagnosticResults' }
  | { name: 'studyPlan' }
  | { name: 'practice'; topicCode: string; mode: 'practice' | 'quiz' };

export default function App() {
  const { profile, save, clear } = useStudentProfile();
  const studyData = useStudyData();
  const [tab, setTab] = useState<Tab>('home');
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [editingSetup, setEditingSetup] = useState(false);
  const [buildingPlan, setBuildingPlan] = useState(false);

  const goHome = () => {
    setOverlay(null);
    setTab('home');
  };

  const handleSetupComplete = (p: StudentProfile) => {
    save(p);
    setEditingSetup(false);
    setTab('home');
  };

  const handleTab = (t: Tab) => {
    setOverlay(null);
    setTab(t);
  };

  const handleReset = () => {
    clear();
    studyData.resetAll();
    setOverlay(null);
    setEditingSetup(false);
    setTab('home');
  };

  const handleTopic = (topic: TopicInfo) => setOverlay({ name: 'topic', topic });
  const handleScan = () => setOverlay({ name: 'scan' });

  // Not set up yet: welcome screen or setup wizard
  if (!profile) {
    return (
      <div className="mx-auto min-h-screen max-w-md bg-ink-50">
        {editingSetup ? (
          <SetupScreen
            existing={null}
            onComplete={handleSetupComplete}
            onCancel={() => setEditingSetup(false)}
          />
        ) : (
          <WelcomeScreen
            profile={null}
            onStart={() => setEditingSetup(true)}
            onContinue={() => setEditingSetup(true)}
          />
        )}
      </div>
    );
  }

  // From this point on, `profile` is narrowed to StudentProfile for the rest
  // of the component, including the closures defined below.

  const handleStartDiagnostic = () => setOverlay({ name: 'diagnostic' });

  const handleDiagnosticComplete = (answers: DiagnosticAnswer[]) => {
    studyData.recordDiagnostic(answers);
    setOverlay({ name: 'diagnosticResults' });
  };

  const handleBuildPlan = async () => {
    setBuildingPlan(true);
    try {
      const plan = await generateStudyPlan(profile, studyData.progress.masteries);
      studyData.savePlan(plan);
      setOverlay({ name: 'studyPlan' });
    } finally {
      setBuildingPlan(false);
    }
  };

  const handleOpenPlanTopic = (topicCode: string) => {
    const info = TOPIC_BANK[topicCode];
    if (info) setOverlay({ name: 'topic', topic: info });
  };

  const handleMakeStudyPlanFromTopic = async () => {
    if (!studyData.diagnostic) {
      alert('Take your diagnostic assessment from Home first so StudyPilot can build a plan for you.');
      return;
    }
    if (!studyData.plan) {
      await handleBuildPlan();
    } else {
      setOverlay({ name: 'studyPlan' });
    }
  };

  const handlePracticeComplete = async (session: PracticeSession) => {
    const updatedProgress = studyData.recordPracticeSession(session);
    if (studyData.plan) {
      const { plan: adaptedPlan, nudge } = await adaptPlan(
        studyData.plan,
        updatedProgress.masteries,
        session,
        profile.language
      );
      studyData.savePlan(adaptedPlan);
      studyData.saveNudge(nudge);
    }
    goHome();
  };

  // Editing setup from profile
  if (editingSetup) {
    return (
      <div className="mx-auto min-h-screen max-w-md bg-ink-50">
        <SetupScreen
          existing={profile}
          onComplete={handleSetupComplete}
          onCancel={() => setEditingSetup(false)}
        />
      </div>
    );
  }

  const showBottomNav = overlay === null;

  const renderTab = () => {
    switch (tab) {
      case 'home':
      case 'learn':
        return (
          <LearningHome
            profile={profile}
            diagnosticDone={!!studyData.diagnostic}
            plan={studyData.plan}
            nudge={studyData.nudge}
            buildingPlan={buildingPlan}
            onScan={handleScan}
            onProgress={() => setTab('progress')}
            onTopic={handleTopic}
            onStartDiagnostic={handleStartDiagnostic}
            onBuildPlan={handleBuildPlan}
            onViewPlan={() => setOverlay({ name: 'studyPlan' })}
            onDismissNudge={() => studyData.saveNudge(null)}
          />
        );
      case 'progress':
        return (
          <ProgressScreen
            profile={profile}
            progress={studyData.progress}
            onStartDiagnostic={handleStartDiagnostic}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            profile={profile}
            onEditSetup={() => setEditingSetup(true)}
            onSignOut={handleReset}
          />
        );
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-md bg-ink-50">
      <main className="min-h-screen" style={{ paddingBottom: showBottomNav ? '5rem' : 0 }}>
        {overlay === null && renderTab()}
        {overlay?.name === 'scan' && <ScanScreen onBack={goHome} onTopic={handleTopic} />}
        {overlay?.name === 'topic' && (
          <TopicDetails
            topic={overlay.topic}
            onBack={goHome}
            onPractice={(mode) =>
              setOverlay({ name: 'practice', topicCode: overlay.topic.code, mode })
            }
            onMakeStudyPlan={handleMakeStudyPlanFromTopic}
          />
        )}
        {overlay?.name === 'diagnostic' && (
          <DiagnosticScreen
            subjects={profile.subjects}
            onComplete={handleDiagnosticComplete}
            onBack={goHome}
          />
        )}
        {overlay?.name === 'diagnosticResults' && (
          <DiagnosticResultsScreen
            masteries={studyData.progress.masteries}
            onBuildPlan={handleBuildPlan}
            onBack={goHome}
          />
        )}
        {overlay?.name === 'studyPlan' && studyData.plan && (
          <StudyPlanScreen plan={studyData.plan} onOpenTopic={handleOpenPlanTopic} onBack={goHome} />
        )}
        {overlay?.name === 'practice' && (
          <PracticeScreen
            topicCode={overlay.topicCode}
            mode={overlay.mode}
            onComplete={handlePracticeComplete}
            onBack={goHome}
          />
        )}
      </main>
      {showBottomNav && <BottomNav active={tab} onChange={handleTab} />}
    </div>
  );
}
