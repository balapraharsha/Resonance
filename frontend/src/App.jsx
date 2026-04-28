import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import EmotionalCheckIn from './components/EmotionalCheckIn';
import MatchingAnimation from './components/MatchingAnimation';
import ChatInterface from './components/ChatInterface';
import PostChatReflection from './components/PostChatReflection';
import SafetyOverlay from './components/SafetyOverlay';

const STAGES = {
  LANDING: 'landing',
  CHECK_IN: 'check_in',
  MATCHING: 'matching',
  CHAT: 'chat',
  REFLECTION: 'reflection',
};

function App() {
  const [currentStage, setCurrentStage] = useState(STAGES.LANDING);
  const [emotionalData, setEmotionalData] = useState(null);
  const [matchedPeer, setMatchedPeer] = useState(null);
  const [showSafety, setShowSafety] = useState(false);

  const handleStart = () => {
    setCurrentStage(STAGES.CHECK_IN);
  };

  const handleEmotionalSubmit = async (data) => {
    setEmotionalData(data);
    setCurrentStage(STAGES.MATCHING);
  };

  const handleMatchComplete = (peer) => {
    setMatchedPeer(peer);
    setCurrentStage(STAGES.CHAT);
  };

  const handleChatEnd = () => {
    setCurrentStage(STAGES.REFLECTION);
  };

  const handleReflectionComplete = () => {
    setCurrentStage(STAGES.LANDING);
    setEmotionalData(null);
    setMatchedPeer(null);
  };

  const handleCrisisDetected = () => {
    setShowSafety(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <AnimatePresence mode="wait">
        {currentStage === STAGES.LANDING && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage onStart={handleStart} />
          </motion.div>
        )}

        {currentStage === STAGES.CHECK_IN && (
          <motion.div
            key="checkin"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <EmotionalCheckIn 
              onSubmit={handleEmotionalSubmit}
              onCrisisDetected={handleCrisisDetected}
            />
          </motion.div>
        )}

        {currentStage === STAGES.MATCHING && (
          <motion.div
            key="matching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MatchingAnimation 
              emotionalData={emotionalData}
              onMatchComplete={handleMatchComplete}
            />
          </motion.div>
        )}

        {currentStage === STAGES.CHAT && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <ChatInterface 
              peer={matchedPeer}
              emotionalData={emotionalData}
              onChatEnd={handleChatEnd}
            />
          </motion.div>
        )}

        {currentStage === STAGES.REFLECTION && (
          <motion.div
            key="reflection"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <PostChatReflection 
              emotionalData={emotionalData}
              onComplete={handleReflectionComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {showSafety && (
        <SafetyOverlay onClose={() => setShowSafety(false)} />
      )}
    </div>
  );
}

export default App;
