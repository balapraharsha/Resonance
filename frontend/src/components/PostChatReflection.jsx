import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, BookOpen, ExternalLink, Home } from 'lucide-react';
import axios from 'axios';

const PostChatReflection = ({ emotionalData, onComplete }) => {
  const [currentFeeling, setCurrentFeeling] = useState(5);
  const [reflection, setReflection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateReflection();
  }, []);

  const generateReflection = async () => {
    try {
      const response = await axios.post('/api/generate-reflection', {
        beforeEmotion: emotionalData,
        afterRating: currentFeeling
      });
      setReflection(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating reflection:', error);
      setReflection({
        prompt: "Take a moment to reflect on this conversation. What did sharing your feelings teach you about yourself?",
        resources: []
      });
      setIsLoading(false);
    }
  };

  const resources = [
    {
      title: "National Suicide Prevention Lifeline",
      description: "24/7 crisis support",
      link: "988",
      type: "crisis"
    },
    {
      title: "Crisis Text Line",
      description: "Text HOME to 741741",
      link: "sms:741741",
      type: "crisis"
    },
    {
      title: "BetterHelp",
      description: "Online therapy platform",
      link: "https://www.betterhelp.com",
      type: "therapy"
    },
    {
      title: "Mindfulness Resources",
      description: "Meditation and breathing exercises",
      link: "https://www.headspace.com",
      type: "wellness"
    }
  ];

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-serif font-bold text-neutral-900 mb-3">
              Thank you for connecting
            </h2>
            <p className="text-lg text-neutral-600">
              Your peer support conversation has ended
            </p>
          </div>

          {/* Emotional check-out */}
          <div className="card">
            <h3 className="text-xl font-serif font-semibold mb-4">How do you feel now?</h3>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-neutral-600">Worse</span>
              <input
                type="range"
                min="1"
                max="10"
                value={currentFeeling}
                onChange={(e) => setCurrentFeeling(Number(e.target.value))}
                className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <span className="text-sm text-neutral-600">Better</span>
            </div>
            <div className="text-center">
              <span className="text-4xl font-bold text-primary-600">{currentFeeling}</span>
              <span className="text-neutral-500">/10</span>
            </div>
          </div>

          {/* Reflection prompt */}
          {!isLoading && reflection && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card bg-primary-50 border-primary-100"
            >
              <div className="flex items-start gap-3 mb-3">
                <BookOpen className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-serif font-semibold text-neutral-900 mb-2">
                    Reflection prompt
                  </h3>
                  <p className="text-neutral-700 leading-relaxed">
                    {reflection.prompt}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Resources */}
          <div className="card">
            <h3 className="text-xl font-serif font-semibold mb-4">Professional resources</h3>
            <p className="text-neutral-600 mb-6">
              Peer support is valuable, but professional help is sometimes necessary. Here are trusted resources:
            </p>
            <div className="grid gap-4">
              {resources.map((resource, index) => (
                <motion.a
                  key={index}
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors border border-neutral-200 group"
                >
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-1">{resource.title}</h4>
                    <p className="text-sm text-neutral-600">{resource.description}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onComplete}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Return home
            </button>
          </div>

          {/* Footer note */}
          <div className="text-center text-sm text-neutral-500 pt-6 border-t border-neutral-200">
            <p>All conversation data has been permanently deleted for your privacy.</p>
            <p className="mt-2">Remember: You're not alone, and seeking help is a sign of strength.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PostChatReflection;
