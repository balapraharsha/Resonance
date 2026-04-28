import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Send, AlertCircle } from 'lucide-react';
import axios from 'axios';

const EmotionalCheckIn = ({ onSubmit, onCrisisDetected }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setError('Voice input is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = () => {
        setError('Voice recognition error. Please try typing instead.');
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) {
      setError('Please share how you\'re feeling');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
   const response = await axios.post(`${API_URL}/api/analyze-emotion`, {
        input: input.trim()
      });

      const { emotionalState } = response.data;

      // Check for crisis
      if (emotionalState.crisis_level === 'crisis') {
        onCrisisDetected();
        return;
      }

      onSubmit(emotionalState);
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Unable to analyze. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-4">
              How are you feeling?
            </h2>
            <p className="text-lg text-neutral-600">
              Take a moment to express what's on your mind. Your words are private and safe.
            </p>
          </div>

          {/* Input area */}
          <div className="card mb-6">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="I'm feeling..."
                className="w-full min-h-[200px] px-4 py-4 rounded-lg border-2 border-neutral-200 focus:border-primary-500 focus:outline-none transition-colors duration-200 resize-none text-lg"
                disabled={isAnalyzing}
              />
              
              <button
                onClick={handleVoiceToggle}
                className={`absolute bottom-4 right-4 p-3 rounded-full transition-all duration-300 ${
                  isListening 
                    ? 'bg-accent-500 text-white animate-pulse-soft' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
                disabled={isAnalyzing}
              >
                {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center gap-2 text-accent-600"
              >
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}
          </div>

          {/* Submit button */}
          <motion.button
            onClick={handleSubmit}
            disabled={isAnalyzing || !input.trim()}
            className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing your emotional state...
              </>
            ) : (
              <>
                Continue
                <Send className="w-5 h-5" />
              </>
            )}
          </motion.button>

          {/* Privacy note */}
          <p className="text-center text-sm text-neutral-500 mt-6">
            Your response is analyzed securely and never stored permanently
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default EmotionalCheckIn;
