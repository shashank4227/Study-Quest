import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { BookOpen, ArrowRight, TerminalSquare, Database, ArrowLeft, Code2, TriangleAlert, HelpCircle, CheckCircle2, XCircle, RefreshCw, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { theoryData, cTheoryData } from '../data/theoryData';
import Editor from '@monaco-editor/react';
import WorldSidebar from '../components/quest/WorldSidebar';

// ─── Component ─────────────────────────────────────────────────────────────────
const Theory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const worldId = searchParams.get('world') || 1;
  const course = searchParams.get('course') || 'javascript';
  const initialSection = parseInt(searchParams.get('section') || '0', 10);
  const [activeSection, setActiveSection] = useState(initialSection);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    setActiveSection(parseInt(searchParams.get('section') || '0', 10));
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(false);
  }, [searchParams]);

  const handleSectionChange = (newSection) => {
    setActiveSection(newSection);
    setSearchParams({ world: worldId, section: newSection, course: course });
  };

  const worldData = course === 'c'
    ? (cTheoryData[worldId] || { title: `C World ${worldId}`, description: 'C theory coming soon!', sections: [] })
    : (theoryData[worldId] || { title: `World ${worldId}`, description: 'Theory for this world is currently being forged by the elders.', sections: [] });

  const renderTheoryText = (text) => {
    if (!text) return null;
    const parts = text.split(/(`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return <span key={i} className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md font-mono text-sm border border-indigo-500/30 font-bold">{part.slice(1, -1)}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="h-screen bg-[#050505] text-white font-sans overflow-hidden relative selection:bg-indigo-500/30 flex">
      <WorldSidebar
        worldId={worldId}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        course={course}
      />

      <div className="flex-1 relative h-full overflow-y-auto custom-scrollbar">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 blur-[150px] rounded-full mix-blend-screen opacity-50" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen opacity-50" />
        </div>

        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
          <div className="flex items-center gap-6">
            <Link to={`/map?course=${course}`} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h1 className="font-bold text-xl tracking-tight">{worldData.title}</h1>
              </div>
              <p className="text-white/40 text-xs mt-1">{worldData.description}</p>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
          {worldData.sections.length === 0 ? (
            <div className="text-center text-white/50 py-12">More content arriving soon!</div>
          ) : (
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              {(() => {
                const section = worldData.sections[activeSection] || worldData.sections[0];
                if (!section) return null;
                return (
                  <div className="relative group">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <Database className="w-5 h-5 text-indigo-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">{section.title}</h3>
                    </div>

                    <div className="prose prose-invert max-w-none lg:ml-14">
                      <p className="text-white/80 leading-relaxed font-light text-[15px] whitespace-pre-wrap mb-6">
                        {renderTheoryText(section.content)}
                      </p>

                      {section.codeSnippet && (
                        <div className="mt-6 mb-8 relative rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/10">
                          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 z-10 pointer-events-none" />
                          <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex items-center gap-2 text-white/50 text-xs font-mono relative z-10">
                            <Code2 className="w-4 h-4" /> Example
                          </div>
                          <div style={{ height: `${Math.max(2, section.codeSnippet.split('\n').length) * 21 + 40}px` }}>
                            <Editor
                              defaultLanguage={course === 'c' ? 'c' : 'javascript'}
                              theme="vs-dark"
                              value={section.codeSnippet}
                              options={{
                                readOnly: true,
                                domReadOnly: true,
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                padding: { top: 20, bottom: 20 },
                                scrollBeyondLastLine: false,
                                overviewRulerLanes: 0,
                                hideCursorInOverviewRuler: true,
                                scrollbar: { vertical: 'hidden', horizontal: 'auto' },
                                lineNumbers: 'off',
                                folding: false,
                                renderLineHighlight: 'none',
                                wordWrap: 'off'
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {section.pitfall && (
                        <div className="mt-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 flex gap-4">
                          <div className="shrink-0 mt-0.5">
                            <TriangleAlert className="w-5 h-5 text-amber-500" />
                          </div>
                          <div>
                            <h4 className="text-amber-500 font-bold text-xs uppercase tracking-widest mb-1">Common Pitfall</h4>
                            <p className="text-amber-200/80 text-sm leading-relaxed">{renderTheoryText(section.pitfall)}</p>
                          </div>
                        </div>
                      )}

                      {section.quiz && (
                        <div className="mt-8 bg-white/[0.02] border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
                          {/* Top Glow Decor */}
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500/0 via-indigo-500/40 to-purple-500/0" />
                          
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                              <HelpCircle className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-xs uppercase tracking-widest font-semibold text-indigo-300">Knowledge Check</span>
                          </div>

                          <h4 className="text-base font-bold text-white mb-4 leading-relaxed">
                            {section.quiz.question}
                          </h4>

                          <div className="space-y-2.5 mb-5">
                            {section.quiz.options.map((option, idx) => {
                              let optionStyle = "border-white/5 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/20";
                              if (isSubmitted) {
                                if (idx === section.quiz.correctIndex) {
                                  optionStyle = "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
                                } else if (selectedOption === idx) {
                                  optionStyle = "border-rose-500/30 bg-rose-500/10 text-rose-300";
                                } else {
                                  optionStyle = "border-white/5 bg-white/5 opacity-40 text-white/50 cursor-not-allowed";
                                }
                              } else if (selectedOption === idx) {
                                optionStyle = "border-indigo-500/50 bg-indigo-500/10 text-indigo-300";
                              }

                              return (
                                <button
                                  key={idx}
                                  disabled={isSubmitted}
                                  onClick={() => setSelectedOption(idx)}
                                  className={`w-full text-left px-5 py-3.5 rounded-xl border font-medium text-sm transition-all duration-200 flex items-center justify-between ${optionStyle}`}
                                >
                                  <span>{option}</span>
                                  {isSubmitted && idx === section.quiz.correctIndex && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                                  )}
                                  {isSubmitted && selectedOption === idx && idx !== section.quiz.correctIndex && (
                                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          <div className="flex items-center gap-3">
                            {!isSubmitted ? (
                              <button
                                disabled={selectedOption === null}
                                onClick={() => {
                                  setIsSubmitted(true);
                                  setIsCorrect(selectedOption === section.quiz.correctIndex);
                                }}
                                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 text-white font-bold text-sm transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] disabled:shadow-none flex items-center gap-1.5"
                              >
                                Submit Answer
                              </button>
                            ) : (
                              !isCorrect && (
                                <button
                                  onClick={() => {
                                    setIsSubmitted(false);
                                    setSelectedOption(null);
                                  }}
                                  className="px-5 py-2.5 rounded-xl bg-white/5 text-white/80 hover:bg-white/10 border border-white/10 font-bold text-sm transition-all flex items-center gap-1.5"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" /> Try Again
                                </button>
                              )
                            )}
                          </div>

                          {isSubmitted && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`mt-5 p-4 rounded-xl border text-sm leading-relaxed ${
                                isCorrect 
                                  ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-200/90" 
                                  : "bg-rose-500/5 border-rose-500/10 text-rose-200/90"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1.5 font-bold">
                                {isCorrect ? (
                                  <>
                                    <Sparkles className="w-4 h-4 text-emerald-400" />
                                    <span>Correct!</span>
                                  </>
                                ) : (
                                  <span>Incorrect, but keep learning!</span>
                                )}
                              </div>
                              <p className="opacity-90">{section.quiz.explanation}</p>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between lg:ml-14">
                      <button
                        onClick={() => handleSectionChange(Math.max(0, activeSection - 1))}
                        disabled={activeSection === 0}
                        className="px-6 py-3 rounded-xl bg-white/5 text-white font-medium text-sm hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" /> Previous
                      </button>

                      <div className="text-white/40 text-sm font-medium tracking-widest">
                        {activeSection + 1} / {worldData.sections.length}
                      </div>

                      {activeSection === worldData.sections.length - 1 ? (
                        <Link
                          to={`/quest?world=${worldId}&course=${course}`}
                          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center gap-2"
                        >
                          Enter Coding <TerminalSquare className="w-4 h-4" />
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleSectionChange(activeSection + 1)}
                          className="px-6 py-3 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold text-sm hover:bg-indigo-500/30 transition-all flex items-center gap-2"
                        >
                          Next <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Theory;
