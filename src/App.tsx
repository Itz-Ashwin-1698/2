import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles } from 'lucide-react';

function App() {
  const [stage, setStage] = useState<'countdown' | 'spotlight' | 'curtains' | 'reveal'>('countdown');
  const [countdown, setCountdown] = useState(5);
  const [showRat, setShowRat] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [showCurtains, setShowCurtains] = useState(false);
  const [showSecondSpeech, setShowSecondSpeech] = useState(false);
  const [showRibbonButton, setShowRibbonButton] = useState(false);
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [showBirthdayCard, setShowBirthdayCard] = useState(false);

  // Audio refs
  const countdownAudioRef = useRef<HTMLAudioElement | null>(null);
  const ratEntranceAudioRef = useRef<HTMLAudioElement | null>(null);
  const curtainOpenAudioRef = useRef<HTMLAudioElement | null>(null);
  const birthdayMusicRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    // Create audio elements
    countdownAudioRef.current = new Audio('https://www.soundjay.com/misc/sounds/clock-ticking-3.wav');
    ratEntranceAudioRef.current = new Audio('https://www.soundjay.com/misc/sounds/magic-chime-02.wav');
    curtainOpenAudioRef.current = new Audio('https://www.soundjay.com/misc/sounds/ta-da.wav');
    birthdayMusicRef.current = new Audio('https://www.soundjay.com/misc/sounds/happy-birthday-song.wav');

    // Set audio properties
    if (countdownAudioRef.current) {
      countdownAudioRef.current.volume = 0.6;
      countdownAudioRef.current.loop = true;
    }
    if (ratEntranceAudioRef.current) {
      ratEntranceAudioRef.current.volume = 0.7;
    }
    if (curtainOpenAudioRef.current) {
      curtainOpenAudioRef.current.volume = 0.8;
    }
    if (birthdayMusicRef.current) {
      birthdayMusicRef.current.volume = 0.5;
      birthdayMusicRef.current.loop = true;
    }

    return () => {
      // Cleanup audio
      [countdownAudioRef, ratEntranceAudioRef, curtainOpenAudioRef, birthdayMusicRef].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current = null;
        }
      });
    };
  }, []);

  useEffect(() => {
    // Countdown stage
    if (stage === 'countdown' && countdown > 0) {
      // Play countdown music
      if (countdown === 5 && countdownAudioRef.current) {
        countdownAudioRef.current.play().catch(() => {
          // Fallback if audio doesn't play
          console.log('Audio autoplay blocked');
        });
      }

      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (stage === 'countdown' && countdown === 0) {
      // Stop countdown music
      if (countdownAudioRef.current) {
        countdownAudioRef.current.pause();
      }

      // Move to spotlight stage
      setTimeout(() => {
        setStage('spotlight');
        // Rat enters after stage is set
        setTimeout(() => {
          setShowRat(true);
          // Play rat entrance sound
          if (ratEntranceAudioRef.current) {
            ratEntranceAudioRef.current.play().catch(() => {
              console.log('Audio play failed');
            });
          }
        }, 1000);
        // First speech bubble appears after rat
        setTimeout(() => setShowSpeechBubble(true), 2500);
        // Auto-transition to curtains stage after 5 seconds
        setTimeout(() => {
          setStage('curtains');
          setShowSpeechBubble(false);
          setShowCurtains(true);
          // Second speech bubble appears
          setTimeout(() => setShowSecondSpeech(true), 1000);
          // Ribbon button appears
          setTimeout(() => setShowRibbonButton(true), 2000);
        }, 6000);
      }, 500);
    }
  }, [stage, countdown]);

  const handleContinue = () => {
    setShowSecondSpeech(false);
    setShowRibbonButton(false);
    setCurtainOpen(true);
    
    // Play curtain opening sound
    if (curtainOpenAudioRef.current) {
      curtainOpenAudioRef.current.play().catch(() => {
        console.log('Audio play failed');
      });
    }
    
    // Wait for curtain animation to complete before showing birthday card
    setTimeout(() => {
      setStage('reveal');
      // Show birthday card with delay for dramatic effect
      setTimeout(() => {
        setShowBirthdayCard(true);
        // Play birthday music
        if (birthdayMusicRef.current) {
          birthdayMusicRef.current.play().catch(() => {
            console.log('Audio play failed');
          });
        }
      }, 500);
    }, 2000);
  };

  // Enable audio on first user interaction
  const enableAudio = () => {
    [countdownAudioRef, ratEntranceAudioRef, curtainOpenAudioRef, birthdayMusicRef].forEach(ref => {
      if (ref.current) {
        ref.current.load();
      }
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black" onClick={enableAudio}>
      {/* Film grain overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="film-grain"></div>
      </div>

      {/* Countdown Stage */}
      {stage === 'countdown' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="countdown-circle">
              <div className="countdown-glow"></div>
              <div className="countdown-number">
                {countdown || '✨'}
              </div>
            </div>
            {/* Musical notes animation during countdown */}
            <div className="musical-notes">
              <div className="note note-1">♪</div>
              <div className="note note-2">♫</div>
              <div className="note note-3">♪</div>
              <div className="note note-4">♫</div>
            </div>
          </div>
        </div>
      )}

      {/* Spotlight Stage - Dark with spotlight on rat */}
      {stage === 'spotlight' && (
        <>
          <div className="spotlight-stage">
            {/* Spotlight effect */}
            <div className="spotlight-container">
              <div className="spotlight"></div>
              <div className="spotlight-particles">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`particle particle-${i}`}></div>
                ))}
              </div>
            </div>

            {/* Rat Character */}
            {showRat && (
              <div className="rat-container">
                <img 
                  src="/24889b63-2a23-4c1d-bdeb-c6bc764031e5.png" 
                  alt="Cute rat character" 
                  className="rat-image"
                />
                
                {/* Paw prints trail */}
                <div className="paw-prints">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`paw-print paw-print-${i}`}>🐾</div>
                  ))}
                </div>

                {/* Magic sparkles around rat */}
                <div className="magic-sparkles">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`sparkle sparkle-${i}`}>✨</div>
                  ))}
                </div>

                {/* First Speech bubble */}
                {showSpeechBubble && (
                  <div className="speech-bubble">
                    <div className="speech-content">
                      <Sparkles className="speech-icon" />
                      <p>Oyee Chuiyaa,</p>
                      <p>Tere liye ek suprise hai ....GAWAR!!!!</p>
                    </div>
                    <div className="speech-tail"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Curtains Stage - Lights on with curtains */}
      {(stage === 'curtains' || stage === 'reveal') && (
        <>
          {/* Stage background with lights on */}
          <div className="stage-background lights-on">
            <div className="stage-floor"></div>
            
            {/* Spotlight effect - dimmed */}
            <div className="spotlight-container">
              <div className="spotlight dimmed"></div>
              <div className="spotlight-particles">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`particle particle-${i}`}></div>
                ))}
              </div>
            </div>

            {/* Curtains */}
            {showCurtains && (
              <>
                <div className={`curtain-left ${curtainOpen ? 'curtain-open-left' : ''}`}></div>
                <div className={`curtain-right ${curtainOpen ? 'curtain-open-right' : ''}`}></div>
              </>
            )}
          </div>

          {/* Rat Character - stays visible in both curtains and reveal stages */}
          <div className={`rat-container ${stage === 'reveal' ? 'rat-moved-up' : ''}`}>
            <img 
              src="/24889b63-2a23-4c1d-bdeb-c6bc764031e5.png" 
              alt="Cute rat character" 
              className="rat-image"
            />

            {/* Magic sparkles around rat in reveal stage */}
            {stage === 'reveal' && (
              <div className="magic-sparkles celebration">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`sparkle sparkle-celebration-${i}`}>✨</div>
                ))}
              </div>
            )}

            {/* Second Speech bubble - only in curtains stage */}
            {stage === 'curtains' && showSecondSpeech && (
              <div className="speech-bubble">
                <div className="speech-content">
                  <Sparkles className="speech-icon" />
                  <p>Oyee ....Isse open toh ker</p>
                  <p>Surprise dekhna hai na? 🎁</p>
                </div>
                <div className="speech-tail"></div>
              </div>
            )}
          </div>

          {/* Ribbon Button - only in curtains stage */}
          {stage === 'curtains' && showRibbonButton && (
            <div className="ribbon-button-container">
              <button 
                onClick={handleContinue}
                className="ribbon-button"
              >
                <span>✨ Open Curtains ✨</span>
              </button>
            </div>
          )}

          {/* Birthday Card Reveal - only in reveal stage */}
          {stage === 'reveal' && showBirthdayCard && (
            <div className="birthday-card">
              <div className="card-content">
                <h1 className="rainbow-text">
                  🎊 HAPPY BIRTHDAY! 🎊
                </h1>
                <div className="birthday-message">
                  <p className="message-line message-line-1">
                    <Heart className="inline mr-2 text-pink-400" />
                    May your special day be filled with wonder, laughter, and all the magic life has to offer!
                  </p>
                  <p className="message-line message-line-2">
                    Here's to another year of adventures, dreams coming true, and moments that make your heart sing! 
                  </p>
                  <p className="signature message-line message-line-3">
                    🌟 With love and birthday wishes 🌟
                  </p>
                </div>
                
                {/* Floating birthday elements */}
                <div className="floating-elements">
                  <div className="floating-balloon balloon-1">🎈</div>
                  <div className="floating-balloon balloon-2">🎈</div>
                  <div className="floating-balloon balloon-3">🎈</div>
                  <div className="floating-confetti confetti-1">🎊</div>
                  <div className="floating-confetti confetti-2">🎉</div>
                  <div className="floating-confetti confetti-3">🎊</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;