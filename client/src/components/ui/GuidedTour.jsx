import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

const GuidedTour = ({ steps, run, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [rect, setRect] = useState(null);

  const updateRect = useCallback(() => {
    if (!run || !steps[currentStep]) return;
    const el = document.querySelector(steps[currentStep].target);
    if (el) {
      setRect(el.getBoundingClientRect());
    }
  }, [run, steps, currentStep]);

  useEffect(() => {
    if (!run) return;
    setCurrentStep(0);
  }, [run]);

  useEffect(() => {
    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [updateRect]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      onFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const handleSkip = () => onFinish();

  if (!run || !rect) return null;

  const PADDING = 8;
  const highlight = {
    top: rect.top - PADDING,
    left: rect.left - PADDING,
    width: rect.width + PADDING * 2,
    height: rect.height + PADDING * 2,
  };

  // Position tooltip smartly: below by default, above if near bottom
  const tooltipAbove = rect.bottom + 180 > window.innerHeight;
  const tooltipLeft = Math.min(
    Math.max(rect.left, 8),
    window.innerWidth - 330
  );
  const tooltipTop = tooltipAbove
    ? rect.top - PADDING - 160
    : rect.bottom + PADDING + 12;

  return createPortal(
    <AnimatePresence>
      {run && (
        <>
          {/* Dark overlay with cutout */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none' }}
          >
            <svg
              width="100%"
              height="100%"
              style={{ position: 'absolute', inset: 0 }}
            >
              <defs>
                <mask id="tour-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <rect
                    x={highlight.left}
                    y={highlight.top}
                    width={highlight.width}
                    height={highlight.height}
                    rx="10"
                    fill="black"
                  />
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="rgba(0,0,0,0.65)"
                mask="url(#tour-mask)"
              />
              {/* Highlight border glow */}
              <rect
                x={highlight.left}
                y={highlight.top}
                width={highlight.width}
                height={highlight.height}
                rx="10"
                fill="none"
                stroke="rgba(21,145,220,0.8)"
                strokeWidth="2"
              />
            </svg>
          </motion.div>

          {/* Tooltip */}
          <motion.div
            key={`tooltip-${currentStep}`}
            initial={{ opacity: 0, y: tooltipAbove ? 8 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: tooltipTop,
              left: tooltipLeft,
              width: 320,
              zIndex: 9999,
            }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #0f0f0f 0%, #141414 100%)',
              border: '1px solid rgba(21,145,220,0.4)',
              borderRadius: 14,
              padding: '18px 20px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)',
              color: '#fff',
            }}>
              {/* Step indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  {steps.map((_, i) => (
                    <div key={i} style={{
                      width: i === currentStep ? 18 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: i === currentStep ? '#1591DC' : 'rgba(255,255,255,0.15)',
                      transition: 'all 0.3s',
                    }} />
                  ))}
                </div>
                <button
                  onClick={handleSkip}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 2 }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Content */}
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', margin: 0, marginBottom: 16 }}>
                {steps[currentStep].content}
              </p>

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={handleSkip}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 12, padding: 0 }}
                >
                  Skip tour
                </button>
                <div style={{ display: 'flex', gap: 8 }}>
                  {currentStep > 0 && (
                    <button
                      onClick={handlePrev}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8, color: '#fff', cursor: 'pointer',
                        padding: '6px 14px', fontSize: 13, fontWeight: 600,
                      }}
                    >
                      <ChevronLeft size={14} /> Back
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      background: '#1591DC', border: 'none',
                      borderRadius: 8, color: '#fff', cursor: 'pointer',
                      padding: '6px 16px', fontSize: 13, fontWeight: 700,
                      boxShadow: '0 0 15px rgba(21,145,220,0.4)',
                    }}
                  >
                    {currentStep === steps.length - 1 ? 'Finish' : 'Next'} <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Click blocker */}
          <div
            onClick={handleSkip}
            style={{ position: 'fixed', inset: 0, zIndex: 9997 }}
          />
          {/* Allow clicking on highlighted element */}
          <div
            style={{
              position: 'fixed',
              top: highlight.top,
              left: highlight.left,
              width: highlight.width,
              height: highlight.height,
              zIndex: 9999,
              pointerEvents: 'none',
            }}
          />
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default GuidedTour;
