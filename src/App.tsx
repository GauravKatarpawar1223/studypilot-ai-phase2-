import { useState } from 'react';
import BottomNav, { type Tab } from '@/components/BottomNav';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import { useStudyData } from '@/hooks/useStudyData';
import { TOPIC_BANK, isSatSubject } from '@/data/questionBank';
import { generateStudyPlan, adaptPlan } from '@/lib/agent';
import { recommendedDifficulty } from '@/lib/mastery';
import type {
  DiagnosticAnswer,
  PracticeSession,
  SkillDifficulty,
  StudentProfile,
  TopicInfo,
} from '@/types';
import WelcomeScreen from '@/screens/WelcomeScreen';
import SetupScreen from '@/screens/SetupScreen';
import LearningHome from '@/screens/LearningHome';
import LearnScreen from '@/screens/LearnScreen';
import ScanScreen from '@/screens/ScanScreen';
import TopicDetails from '@/screens/TopicDetails';
import TopicLessonScreen from '@/screens/TopicLessonScreen';
import ProgressScreen from '@/screens/ProgressScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import DiagnosticScreen from '@/screens/DiagnosticScreen';
import DiagnosticResultsScreen from '@/screens/DiagnosticResultsScreen';
import StudyPlanScreen from '@/screens/StudyPlanScreen';
import PracticeScreen from '@/screens/PracticeScreen';

type Scope = 'general' | 'sat';

type Overlay =
  | null
  | { name: 'scan' }
  | { name: 'topic'; topic: TopicInfo }
  | { name: 'lesson'; topic: TopicInfo }
  | { name: 'diagnostic'; scope: Scope }
  | { name: 'diagnosticResults'; scope: Scope }
  | { name: 'studyPlan'; scope: Scope }
  | { name: 'practice'; topicCode: string; mode: 'practice' | 'quiz' };

export default function App() {
  const { profile, save, clear } = useStudentProfile();
  const studyData = useStudyData(profile?.studyTime ?? null);
  const [tab, setTab] = useState<Tab>('home');
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [editingSetup, setEditingSetup] = useState(false);
  const [buildingPlan, setBuildingPlan] = useState(false);
  const [buildingSatPlan, setBuildingSatPlan] = useState(false);

  const goHome = () => {
    setOverlay(null);
    setTab('home');
  };

  const handleSetupComplete = (p: StudentProfile) => {
    save(p);
    studyData.ensureDailyGoals(p.studyTime);
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

  const handleTopic = (topic: TopicInfo) => {
    studyData.markTopicStudied(profile.studyTime);
    setOverlay({ name: 'topic', topic });
  };
  const handleScan = () => setOverlay({ name: 'scan' });

  const handleStartDiagnostic = () => setOverlay({ name: 'diagnostic', scope: 'general' });
  const handleStartSatDiagnostic = () => setOverlay({ name: 'diagnostic', scope: 'sat' });

  const handleDiagnosticComplete = (answers: DiagnosticAnswer[]) => {
    studyData.recordDiagnostic(answers);
    setOverlay({ name: 'diagnosticResults', scope: 'general' });
  };

  const handleSatDiagnosticComplete = (answers: DiagnosticAnswer[]) => {
    studyData.recordSatDiagnostic(answers);
    setOverlay({ name: 'diagnosticResults', scope: 'sat' });
  };

  const handleBuildPlan = async () => {
    setBuildingPlan(true);
    try {
      const generalMasteries = studyData.progress.masteries.filter((m) => !isSatSubject(m.subject));
      const plan = await generateStudyPlan(profile, generalMasteries);
      studyData.savePlan(plan);
      setOverlay({ name: 'studyPlan', scope: 'general' });
    } finally {
      setBuildingPlan(false);
    }
  };

  const handleBuildSatPlan = async () => {
    setBuildingSatPlan(true);
    try {
      const satMasteries = studyData.progress.masteries.filter((m) => isSatSubject(m.subject));
      const plan = await generateStudyPlan(profile, satMasteries);
      studyData.saveSatPlan(plan);
      setOverlay({ name: 'studyPlan', scope: 'sat' });
    } finally {
      setBuildingSatPlan(false);
    }
  };

  const handleOpenPlanTopic = (topicCode: string) => {
    const info = TOPIC_BANK[topicCode];
    if (info) {
      studyData.markTopicStudied(profile.studyTime);
      setOverlay({ name: 'topic', topic: info });
    }
  };

  const handleMakeStudyPlanFromTopic = async (topic: TopicInfo) => {
    const scope: Scope = isSatSubject(topic.subject) ? 'sat' : 'general';
    const hasDiagnostic = scope === 'sat' ? !!studyData.satDiagnostic : !!studyData.diagnostic;
    const hasPlan = scope === 'sat' ? !!studyData.satPlan : !!studyData.plan;

    if (!hasDiagnostic) {
      alert(
        scope === 'sat'
          ? 'Take your SAT diagnostic from Home first so StudyPilot can build an SAT plan for you.'
          : 'Take your diagnostic assessment from Home first so StudyPilot can build a plan for you.'
      );
      return;
    }
    if (!hasPlan) {
      await (scope === 'sat' ? handleBuildSatPlan() : handleBuildPlan());
    } else {
      setOverlay({ name: 'studyPlan', scope });
    }
  };

  const handlePracticeComplete = async (session: PracticeSession) => {
    const topicInfo = TOPIC_BANK[session.topicCode];
    const scope: Scope = topicInfo && isSatSubject(topicInfo.subject) ? 'sat' : 'general';

    const wasWeak =
      studyData.progress.masteries.find((m) => m.topicCode === session.topicCode)?.status === 'weak';
    const updatedProgress = studyData.recordPracticeSession(session);
    studyData.recordDailyPractice(profile.studyTime, session.answers.length, wasWeak);

    const relevantPlan = scope === 'sat' ? studyData.satPlan : studyData.plan;
    if (relevantPlan) {
      const { plan: adaptedPlan, nudge } = await adaptPlan(
        relevantPlan,
        updatedProgress.masteries,
        session,
        profile.language
      );
      if (scope === 'sat') {
        studyData.saveSatPlan(adaptedPlan);
        studyData.saveSatNudge(nudge);
      } else {
        studyData.savePlan(adaptedPlan);
        studyData.saveNudge(nudge);
      }
    }
    goHome();
  };

  /** Deterministic difficulty suggestion for a topic, based on its current
   * mastery. Never depends on the AI endpoint. Harmless no-op for topics
   * whose questions aren't difficulty-tagged (general subjects). */
  const getSuggestedDifficulty = (topicCode: string): SkillDifficulty | undefined => {
    const m = studyData.progress.masteries.find((mm) => mm.topicCode === topicCode);
    return m ? recommendedDifficulty(m.scorePct) : undefined;
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
        return (
          <LearningHome
            profile={profile}
            diagnosticDone={!!studyData.diagnostic}
            plan={studyData.plan}
            nudge={studyData.nudge}
            dailyGoals={studyData.dailyGoals}
            buildingPlan={buildingPlan}
            satDiagnosticDone={!!studyData.satDiagnostic}
            satPlan={studyData.satPlan}
            satNudge={studyData.satNudge}
            buildingSatPlan={buildingSatPlan}
            onScan={handleScan}
            onProgress={() => setTab('progress')}
            onTopic={handleTopic}
            onStartDiagnostic={handleStartDiagnostic}
            onBuildPlan={handleBuildPlan}
            onViewPlan={() => setOverlay({ name: 'studyPlan', scope: 'general' })}
            onDismissNudge={() => studyData.saveNudge(null)}
            onStartSatDiagnostic={handleStartSatDiagnostic}
            onBuildSatPlan={handleBuildSatPlan}
            onViewSatPlan={() => setOverlay({ name: 'studyPlan', scope: 'sat' })}
            onDismissSatNudge={() => studyData.saveSatNudge(null)}
          />
        );
      case 'learn':
        return (
          <LearnScreen
            plan={studyData.plan}
            satPlan={studyData.satPlan}
            diagnosticDone={!!studyData.diagnostic}
            satDiagnosticDone={!!studyData.satDiagnostic}
            onOpenTopic={handleOpenPlanTopic}
            onGoHome={() => setTab('home')}
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
            language={profile.language}
            mastery={studyData.progress.masteries.find((m) => m.topicCode === overlay.topic.code)}
            planReason={
              studyData.plan?.items.find((i) => i.topicCode === overlay.topic.code)?.reason ??
              studyData.satPlan?.items.find((i) => i.topicCode === overlay.topic.code)?.reason
            }
            onBack={goHome}
            onOpenLesson={() => setOverlay({ name: 'lesson', topic: overlay.topic })}
            onPractice={(mode) =>
              setOverlay({ name: 'practice', topicCode: overlay.topic.code, mode })
            }
            onMakeStudyPlan={() => handleMakeStudyPlanFromTopic(overlay.topic)}
          />
        )}
        {overlay?.name === 'lesson' && (
          <TopicLessonScreen
            topic={overlay.topic}
            language={profile.language}
            onBack={goHome}
            onPractice={() =>
              setOverlay({ name: 'practice', topicCode: overlay.topic.code, mode: 'practice' })
            }
          />
        )}
        {overlay?.name === 'diagnostic' && (
          <DiagnosticScreen
            subjects={profile.subjects}
            language={profile.language}
            mode={overlay.scope === 'sat' ? 'sat' : 'subjects'}
            title={overlay.scope === 'sat' ? 'SAT Diagnostic' : 'Diagnostic Assessment'}
            onComplete={overlay.scope === 'sat' ? handleSatDiagnosticComplete : handleDiagnosticComplete}
            onBack={goHome}
          />
        )}
        {overlay?.name === 'diagnosticResults' && (
          <DiagnosticResultsScreen
            masteries={studyData.progress.masteries.filter((m) =>
              overlay.scope === 'sat' ? isSatSubject(m.subject) : !isSatSubject(m.subject)
            )}
            language={profile.language}
            title={overlay.scope === 'sat' ? 'Your SAT Results' : 'Your Results'}
            onBuildPlan={overlay.scope === 'sat' ? handleBuildSatPlan : handleBuildPlan}
            onBack={goHome}
          />
        )}
        {overlay?.name === 'studyPlan' &&
          (() => {
            const activePlan = overlay.scope === 'sat' ? studyData.satPlan : studyData.plan;
            if (!activePlan) return null;
            return <StudyPlanScreen plan={activePlan} onOpenTopic={handleOpenPlanTopic} onBack={goHome} />;
          })()}
        {overlay?.name === 'practice' && (
          <PracticeScreen
            topicCode={overlay.topicCode}
            mode={overlay.mode}
            language={profile.language}
            recommendedDifficulty={getSuggestedDifficulty(overlay.topicCode)}
            onComplete={handlePracticeComplete}
            onBack={goHome}
          />
        )}
      </main>
      {showBottomNav && <BottomNav active={tab} onChange={handleTab} />}
    </div>
  );
}
