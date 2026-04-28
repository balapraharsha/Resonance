import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle } from 'lucide-react';

// Predefined personas for matching
const PERSONAS = [
  {
    id: 'p1',
    emotionalState: 'recovered_anxiety',
    themes: ['career', 'uncertainty', 'future'],
    bio: 'Graduate student who navigated career uncertainty',
    opener: "I understand how overwhelming career decisions can feel...",
    location: 'California'
  },
  {
    id: 'p2',
    emotionalState: 'recovered_stress',
    themes: ['academic', 'pressure', 'burnout'],
    bio: 'Final year student who overcame academic burnout',
    opener: "I've been there with the academic pressure...",
    location: 'New York'
  },
  {
    id: 'p3',
    emotionalState: 'recovered_loneliness',
    themes: ['social', 'isolation', 'connection'],
    bio: 'Working professional who dealt with social isolation',
    opener: "Loneliness can feel so heavy, I remember that feeling...",
    location: 'Texas'
  },
  {
    id: 'p4',
    emotionalState: 'recovered_anxiety',
    themes: ['relationships', 'communication', 'conflict'],
    bio: 'Someone who learned to navigate difficult relationships',
    opener: "Relationship challenges are tough, I've been through similar...",
    location: 'Washington'
  },
  {
    id: 'p5',
    emotionalState: 'recovered_overwhelm',
    themes: ['life_changes', 'transition', 'uncertainty'],
    bio: 'Recent grad who handled major life transitions',
    opener: "Big changes can feel overwhelming, I get it...",
    location: 'Oregon'
  }
];

const MatchingAnimation = ({ emotionalData, onMatchComplete }) => {
  const [stage, setStage] = useState(0);
  const [matchedPeer, setMatchedPeer] = useState(null);

  const stages = [
    'Analyzing your emotional state...',
    'Finding someone who understands...',
    'Matching emotional proximity...',
    'Connection established'
  ];

  useEffect(() => {
    const timings = [1500, 2000, 1500, 1000];
    
    const advanceStage = (currentStage) => {
      if (currentStage < stages.length - 1) {
        setTimeout(() => {
          setStage(currentStage + 1);
          advanceStage(currentStage + 1);
        }, timings[currentStage]);
      } else {
        // Find best match
        setTimeout(() => {
          const match = findBestMatch(emotionalData);
          setMatchedPeer(match);
          
          setTimeout(() => {
            onMatchComplete(match);
          }, 2000);
        }, 500);
      }
    };

    advanceStage(0);
  }, []);

  const findBestMatch = (emotionData) => {
    if (!emotionData || !emotionData.themes) {
      return PERSONAS[0];
    }

    const matches = PERSONAS.filter(persona => 
      persona.themes.some(theme => 
        emotionData.themes.includes(theme)
      )
    );

    return matches.length > 0 
      ? matches[Math.floor(Math.random() * matches.length)]
      : PERSONAS[0];
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-30 animate-breathe" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-200 rounded-full blur-3xl opacity-30 animate-breathe animation-delay-400" />
        </div>
      </div>

      <div className="relative w-full max-w-2xl text-center">
        {/* Orbital animation */}
        <div className="relative h-64 mb-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-24 h-24 bg-gradient-primary rounded-full shadow-2xl flex items-center justify-center"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {stage < 3 ? (
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              ) : (
                <CheckCircle className="w-12 h-12 text-white" />
              )}
            </motion.div>
          </div>

          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary-400 rounded-full"
              animate={{
                rotate: 360,
                x: Math.cos((i * 120 * Math.PI) / 180) * 100,
                y: Math.sin((i * 120 * Math.PI) / 180) * 100,
              }}
              transition={{
                rotate: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.2
                },
                x: { duration: 0 },
                y: { duration: 0 }
              }}
              style={{
                marginLeft: '-6px',
                marginTop: '-6px'
              }}
            />
          ))}
        </div>

        {/* Status messages */}
        <div className="space-y-6">
          <motion.h2
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-3xl md:text-4xl font-serif font-bold text-neutral-900"
          >
            {stages[stage]}
          </motion.h2>

          {matchedPeer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="card max-w-md mx-auto"
            >
              <div className="text-left space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {matchedPeer.bio[0]}
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-lg">Connected</h3>
                    <p className="text-sm text-neutral-500">{matchedPeer.location}</p>
                  </div>
                </div>
                <p className="text-neutral-700">{matchedPeer.bio}</p>
                <div className="pt-3 border-t border-neutral-100">
                  <p className="text-sm text-neutral-600 italic">
                    "{matchedPeer.opener}"
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mt-12">
          {stages.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i <= stage 
                  ? 'w-12 bg-primary-500' 
                  : 'w-8 bg-neutral-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchingAnimation;
