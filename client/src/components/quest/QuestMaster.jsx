import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, Bot } from 'lucide-react';

const QuestMaster = memo(({ aiPrompt, setAiPrompt, aiResponse, aiLoading, onAsk }) => {
  const [typing, setTyping] = useState(false);

  const handleAsk = async () => {
    setTyping(true);
    await onAsk();
    setTyping(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b border-brand-border">
        <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold font-heading text-brand-text">QuestMaster</h3>
          <p className="text-xs text-brand-muted">Your AI coding companion</p>
        </div>
        <motion.div
          className="ml-auto w-2 h-2 rounded-full bg-green-400"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {aiResponse ? (
            <motion.div
              key="response"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-4 border border-brand-border"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-brand" />
                <span className="text-xs font-semibold text-brand uppercase tracking-wider">QuestMaster</span>
              </div>
              <p className="text-sm text-brand-text leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center py-8"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-16 h-16 rounded-2xl bg-brand-accent flex items-center justify-center mb-4"
              >
                <Bot className="w-8 h-8 text-brand" />
              </motion.div>
              <p className="font-medium text-brand-text">Ask me anything!</p>
              <p className="text-sm text-brand-muted mt-1 max-w-xs">I can see your code and help you solve challenges.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 px-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-brand"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </motion.div>
        )}
      </div>

      <div className="p-4 border-t border-brand-border">
        <div className="relative">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !aiLoading && handleAsk()}
            placeholder="Ask QuestMaster..."
            className="w-full bg-brand-accent/50 border border-brand-border rounded-xl pl-4 pr-12 py-3 text-sm text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
          />
          <button
            onClick={handleAsk}
            disabled={aiLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-brand hover:bg-brand-accent transition-colors disabled:opacity-50"
          >
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
});

QuestMaster.displayName = 'QuestMaster';
export default QuestMaster;
