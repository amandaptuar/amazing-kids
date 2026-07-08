import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './GlobalLoader.css';

const GlobalLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let simTimer;
    let finishTimer;
    let fadeOutTimer;
    
    // Reset state on route change
    setIsLoading(true);
    setIsHidden(false);
    setProgress(0);
    
    const startTime = Date.now();
    const MIN_DISPLAY_MS = 1200;

    // Simulate progress
    simTimer = setInterval(() => {
      setProgress(prev => {
        if (prev < 90) {
          return prev + ((90 - prev) * 0.06 + 0.4);
        }
        return prev;
      });
    }, 120);

    const finish = () => {
      const elapsed = Date.now() - startTime;
      const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
      
      finishTimer = setTimeout(() => {
        clearInterval(simTimer);
        setProgress(100);
        
        setTimeout(() => {
          setIsHidden(true); // Triggers CSS transition
          
          fadeOutTimer = setTimeout(() => {
            setIsLoading(false); // Removes from DOM
          }, 650);
        }, 200);
      }, wait);
    };

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish);
    }

    return () => {
      clearInterval(simTimer);
      clearTimeout(finishTimer);
      clearTimeout(fadeOutTimer);
      window.removeEventListener('load', finish);
    };
  }, [location.pathname]);

  if (!isLoading) return null;

  const RADIUS = 100;
  const CIRC = 2 * Math.PI * RADIUS;
  const dashArray = `${(CIRC * Math.min(progress, 100) / 100).toFixed(1)} ${CIRC}`;

  return (
    <div id="naspe-loader" className={isHidden ? 'is-hidden' : ''}>
      <div className="loader-stage">
        <div className="track-ring">
          <svg viewBox="0 0 220 220">
            <defs>
              <linearGradient id="naspeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F0632B" />
                <stop offset="100%" stopColor="#E8952C" />
              </linearGradient>
            </defs>
            <circle className="bg-ring" cx="110" cy="110" r="100"></circle>
            <circle className="spin-ring" cx="110" cy="110" r="86"></circle>
            <circle
              id="naspe-progress-ring"
              className="progress-ring"
              cx="110"
              cy="110"
              r="100"
              style={{ strokeDasharray: dashArray }}
            ></circle>
          </svg>
          <div className="mascot-wrap">
            <img src="/assets/naspe-mascot.png" alt="NASPE India mascot loading" />
            <div className="mascot-shadow"></div>
          </div>
        </div>
        <div className="loader-text">
          <p className="loader-eyebrow">NASPE India</p>
          <p className="loader-title">
            Loading Amazing Kids of India<span className="dots"><span>.</span><span>.</span><span>.</span></span>
          </p>
          <div className="loader-bar-track">
            <div
              id="naspe-bar-fill"
              className="loader-bar-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <p className="loader-percent">
            <span id="naspe-percent">{Math.round(Math.min(progress, 100))}</span>%
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;
