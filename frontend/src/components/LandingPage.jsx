import { motion } from 'framer-motion';
import { Heart, Shield, Users, Sparkles } from 'lucide-react';

const LandingPage = ({ onStart }) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 opacity-60" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-200 rounded-full blur-3xl opacity-20 animate-breathe" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200 rounded-full blur-3xl opacity-20 animate-breathe animation-delay-400" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Logo/Title */}
        <motion.div
          {...fadeInUp}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-neutral-900 mb-4 tracking-tight">
            Resonance
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 font-light max-w-2xl mx-auto">
            Connect with someone who understands, exactly when you need it
          </p>
        </motion.div>

        {/* Value propositions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto"
        >
          <div className="glass-effect rounded-xl p-6 transform hover:scale-105 transition-transform duration-300">
            <Shield className="w-10 h-10 text-primary-600 mx-auto mb-3" strokeWidth={1.5} />
            <h3 className="font-serif font-semibold text-lg mb-2">Anonymous & Safe</h3>
            <p className="text-neutral-600 text-sm">Complete privacy with real-time moderation</p>
          </div>

          <div className="glass-effect rounded-xl p-6 transform hover:scale-105 transition-transform duration-300">
            <Users className="w-10 h-10 text-primary-600 mx-auto mb-3" strokeWidth={1.5} />
            <h3 className="font-serif font-semibold text-lg mb-2">Human Connection</h3>
            <p className="text-neutral-600 text-sm">Real people who've been where you are</p>
          </div>

          <div className="glass-effect rounded-xl p-6 transform hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-10 h-10 text-primary-600 mx-auto mb-3" strokeWidth={1.5} />
            <h3 className="font-serif font-semibold text-lg mb-2">AI-Matched</h3>
            <p className="text-neutral-600 text-sm">Intelligent emotional proximity matching</p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          <button
            onClick={onStart}
            className="btn-primary text-lg px-12 py-4 shadow-xl hover:shadow-2xl"
          >
            Begin Your Journey
          </button>
          <p className="text-sm text-neutral-500">
            This is peer support, not therapy. Free, confidential, and available 24/7.
          </p>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 pt-8 border-t border-neutral-200"
        >
          <p className="text-xs text-neutral-400 mb-3">POWERED BY</p>
          <div className="flex items-center justify-center gap-8">
            <div className="text-neutral-500 font-medium">Claude AI</div>
            <div className="h-4 w-px bg-neutral-300" />
            <div className="text-neutral-500 font-medium">CBC Hackathon 2026</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
