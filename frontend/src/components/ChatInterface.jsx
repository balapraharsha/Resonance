import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Clock, AlertCircle, X } from 'lucide-react';
import axios from 'axios';

const CHAT_DURATION = 15 * 60; // 15 minutes in seconds

const ChatInterface = ({ peer, emotionalData, onChatEnd }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(CHAT_DURATION);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const chatStartTime = useRef(Date.now());

  useEffect(() => {
    // Initial peer message
    setMessages([{
      id: '1',
      sender: 'peer',
      text: peer.opener,
      timestamp: new Date()
    }]);

    // Timer countdown
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - chatStartTime.current) / 1000);
      const remaining = Math.max(0, CHAT_DURATION - elapsed);
      setTimeRemaining(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        setTimeout(() => onChatEnd(), 2000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      // Generate peer response
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await axios.post(`${API_URL}/api/generate-response`, {
        userMessage: input.trim(),
        peer: peer,
        emotionalContext: emotionalData,
        conversationHistory: messages.slice(-4) // Last 4 messages for context
      });

      setTimeout(() => {
        const peerMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'peer',
          text: response.data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, peerMessage]);
        setIsSending(false);
      }, 1000 + Math.random() * 2000); // Random delay for natural feel

    } catch (error) {
      console.error('Error generating response:', error);
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const progressPercent = (timeRemaining / CHAT_DURATION) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with timer */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center text-white font-bold">
              {peer.bio[0]}
            </div>
            <div>
              <h3 className="font-serif font-semibold">Anonymous Peer</h3>
              <p className="text-sm text-neutral-500">{peer.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className={`w-5 h-5 ${timeRemaining < 60 ? 'text-accent-600' : 'text-neutral-500'}`} />
              <span className={`font-mono font-semibold ${timeRemaining < 60 ? 'text-accent-600' : 'text-neutral-700'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <button
              onClick={onChatEnd}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              title="End chat"
            >
              <X className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-4xl mx-auto mt-3">
          <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-accent-50 border-b border-accent-100 px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-accent-800">
          <AlertCircle className="w-4 h-4" />
          <span>This is peer support, not therapy. Both participants remain anonymous.</span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 bg-neutral-50">
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-neutral-900 shadow-sm border border-neutral-100'
                  }`}>
                    <p className="text-[15px] leading-relaxed">{message.text}</p>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 px-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isSending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-neutral-100">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce animation-delay-200" />
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce animation-delay-400" />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-neutral-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-primary-500 focus:outline-none transition-colors resize-none"
            rows={1}
            disabled={timeRemaining === 0}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSending || timeRemaining === 0}
            className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
