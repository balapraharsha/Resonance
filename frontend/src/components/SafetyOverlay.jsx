import { motion } from 'framer-motion';
import { AlertCircle, Phone, MessageCircle, X } from 'lucide-react';

const SafetyOverlay = ({ onClose }) => {
  const crisisResources = [
    {
      name: "National Suicide Prevention Lifeline",
      description: "24/7, free, confidential support",
      contact: "988",
      type: "call",
      urgent: true
    },
    {
      name: "Crisis Text Line",
      description: "Text with a crisis counselor",
      contact: "Text HOME to 741741",
      type: "text",
      urgent: true
    },
    {
      name: "International Crisis Lines",
      description: "Find help in your country",
      contact: "findahelpline.com",
      type: "web",
      urgent: false
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-neutral-900">
                We're concerned about you
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-neutral-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Message */}
          <div className="bg-accent-50 border border-accent-200 rounded-xl p-6">
            <p className="text-neutral-900 leading-relaxed mb-4">
              Based on what you've shared, we think you might benefit from immediate professional support. 
              You don't have to go through this alone.
            </p>
            <p className="text-neutral-700 font-medium">
              Please reach out to one of these crisis resources right now:
            </p>
          </div>

          {/* Crisis resources */}
          <div className="space-y-4">
            {crisisResources.map((resource, index) => (
              <div
                key={index}
                className={`rounded-xl p-6 border-2 transition-all ${
                  resource.urgent
                    ? 'bg-accent-50 border-accent-300 shadow-md'
                    : 'bg-white border-neutral-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    resource.urgent ? 'bg-accent-500' : 'bg-primary-500'
                  }`}>
                    {resource.type === 'call' && <Phone className="w-6 h-6 text-white" />}
                    {resource.type === 'text' && <MessageCircle className="w-6 h-6 text-white" />}
                    {resource.type === 'web' && <AlertCircle className="w-6 h-6 text-white" />}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-serif font-bold text-neutral-900 mb-1">
                      {resource.name}
                    </h3>
                    <p className="text-neutral-600 text-sm mb-3">
                      {resource.description}
                    </p>
                    <a
                      href={resource.type === 'call' ? `tel:${resource.contact}` : resource.type === 'text' ? `sms:741741` : `https://${resource.contact}`}
                      className={`inline-block px-6 py-2 rounded-lg font-medium transition-all ${
                        resource.urgent
                          ? 'bg-accent-600 hover:bg-accent-700 text-white'
                          : 'bg-primary-600 hover:bg-primary-700 text-white'
                      }`}
                    >
                      {resource.contact}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional information */}
          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
            <h4 className="font-serif font-semibold text-lg text-neutral-900 mb-3">
              What to expect:
            </h4>
            <ul className="space-y-2 text-neutral-700">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>Trained counselors available 24/7</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>Completely confidential and free</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>They'll listen without judgment and help you through this moment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 mt-1">•</span>
                <span>You can call or text - whatever feels more comfortable</span>
              </li>
            </ul>
          </div>

          {/* Emergency note */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <p className="text-red-900 font-semibold mb-2">
              If you're in immediate danger:
            </p>
            <p className="text-red-800">
              Call 911 or go to your nearest emergency room. Your safety is the priority.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-neutral-50 border-t border-neutral-200 px-6 py-4">
          <p className="text-center text-sm text-neutral-600">
            Resonance is peer support, not a substitute for professional mental health care
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SafetyOverlay;
