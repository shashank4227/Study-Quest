import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Sparkles, TerminalSquare, Database, ArrowLeft, Code2, TriangleAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { theoryData } from '../data/theoryData';
import Editor from '@monaco-editor/react';
import WorldSidebar from '../components/quest/WorldSidebar';

const Theory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const worldId = searchParams.get('world') || 1;
  const initialSection = parseInt(searchParams.get('section') || '0', 10);
  const [activeSection, setActiveSection] = useState(initialSection);

  // Sync state with URL changes
  useEffect(() => {
    setActiveSection(parseInt(searchParams.get('section') || '0', 10));
  }, [searchParams]);

  const handleSectionChange = (newSection) => {
    setActiveSection(newSection);
    setSearchParams({ world: worldId, section: newSection });
  };
  
  const worldData = theoryData[worldId] || {
    title: `World ${worldId}`,
    description: "Theory for this world is currently being forged by the elders.",
    sections: []
  };

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
      />
      
      <div className="flex-1 relative h-full overflow-y-auto custom-scrollbar">
        {/* Dynamic Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 blur-[150px] rounded-full mix-blend-screen opacity-50" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen opacity-50" />
        </div>

      {/* Header */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link to="/map" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
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

        {/* Content */}
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
                            defaultLanguage="javascript"
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
                  </div>
                  
                  {/* Navigation Buttons */}
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
                        to={`/quest?world=${worldId}`}
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
