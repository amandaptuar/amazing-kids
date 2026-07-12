import React, { useState, useEffect, useRef } from 'react';
import useSEO from '../hooks/useSEO';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Trophy, Play, RefreshCw, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Link, Navigate } from 'react-router-dom';

const Games = () => {
  useSEO({
    title: 'Interactive Games',
    description: "Play interactive sports games and earn points for the Amazing Kids of India leaderboard.",
    keywords: "kids sports games, earn points, amazing kids games",
    url: "https://amazingkidsofindia.com/games"
  });
  const { role, profile } = useAuth();
  const [gameState, setGameState] = useState('menu'); // menu, playing, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targetPos, setTargetPos] = useState({ top: '50%', left: '50%' });
  const [isSaving, setIsSaving] = useState(false);
  const timerRef = useRef(null);
  const gameAreaRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameState('playing');
    moveTarget();
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const moveTarget = () => {
    if (!gameAreaRef.current) return;
    const padding = 50;
    const maxX = gameAreaRef.current.clientWidth - padding;
    const maxY = gameAreaRef.current.clientHeight - padding;
    
    const x = Math.max(padding, Math.floor(Math.random() * maxX));
    const y = Math.max(padding, Math.floor(Math.random() * maxY));
    
    setTargetPos({ top: `${y}px`, left: `${x}px` });
  };

  const handleTargetClick = (e) => {
    e.stopPropagation();
    if (gameState !== 'playing') return;
    setScore(prev => prev + 10);
    moveTarget();
  };

  const endGame = async () => {
    setGameState('finished');
    if (score > 0 && role === 'student' && profile) {
      setIsSaving(true);
      try {
        const pointsEarned = Math.floor(score / 5); // 1 point for every 5 score
        
        // Fetch current points first (in case profile context is stale)
        const { data: currentData } = await supabase
          .from('students')
          .select('points')
          .eq('id', profile.id)
          .single();
          
        const currentPoints = currentData?.points || 0;
        const newTotal = currentPoints + pointsEarned;

        await supabase
          .from('students')
          .update({ points: newTotal })
          .eq('id', profile.id);

        setScore(pointsEarned); // Show points earned instead of raw score
      } catch (err) {
        console.error("Failed to save points", err);
      } finally {
        setIsSaving(false);
      }
    } else {
      setScore(Math.floor(score / 5)); // Just calculate what they would have earned
    }
  };

  if (role !== 'student' && role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', paddingTop: '100px', paddingBottom: '50px', color: 'white', fontFamily: 'var(--font-body)' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '48px', color: '#fbbf24', textShadow: '0 0 20px rgba(251, 191, 36, 0.3)', margin: '0 0 10px 0' }}>
            ARCADE ARENA
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '18px' }}>Play games, sharpen your skills, and earn Global Points!</p>
          <div style={{ marginTop: '20px' }}>
            <Link to="/leaderboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', padding: '10px 20px', borderRadius: '30px', textDecoration: 'none', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.3s' }}>
              <Trophy size={18} color="#fbbf24" /> View Leaderboard
            </Link>
          </div>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#1e293b', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid #334155' }}>
          
          {/* Game Header */}
          <div style={{ backgroundColor: '#0f172a', padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ backgroundColor: '#3b82f6', padding: '10px', borderRadius: '12px' }}><Target size={24} color="white" /></div>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Reaction Strike</h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Hit the targets before time runs out!</p>
              </div>
            </div>
            
            {gameState === 'playing' && (
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Time</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: timeLeft <= 5 ? '#ef4444' : 'white', fontFamily: 'monospace' }}>{timeLeft}s</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Score</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', fontFamily: 'monospace' }}>{score}</div>
                </div>
              </div>
            )}
          </div>

          {/* Game Area */}
          <div 
            ref={gameAreaRef}
            style={{ 
              height: '500px', 
              position: 'relative', 
              backgroundColor: '#020617', 
              backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', 
              backgroundSize: '30px 30px',
              cursor: gameState === 'playing' ? 'crosshair' : 'default',
              overflow: 'hidden'
            }}
          >
            <AnimatePresence mode="wait">
              {gameState === 'menu' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(5px)' }}>
                  <div style={{ backgroundColor: '#1e293b', padding: '40px', borderRadius: '24px', textAlign: 'center', border: '1px solid #334155' }}>
                    <Target size={64} color="#3b82f6" style={{ margin: '0 auto 20px auto' }} />
                    <h2 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>Ready to Test Your Reflexes?</h2>
                    <p style={{ color: '#94a3b8', marginBottom: '30px', maxWidth: '300px' }}>Click the moving targets as fast as you can. Every successful hit earns you Global Points!</p>
                    <button onClick={startGame} style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '16px 40px', fontSize: '18px', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)', transition: 'transform 0.2s' }} onMouseOver={(e)=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={(e)=>e.currentTarget.style.transform='scale(1)'}>
                      <Play fill="white" /> Start Game
                    </button>
                  </div>
                </motion.div>
              )}

              {gameState === 'playing' && (
                <motion.div
                  key="target"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  onClick={handleTargetClick}
                  style={{
                    position: 'absolute',
                    top: targetPos.top,
                    left: targetPos.left,
                    transform: 'translate(-50%, -50%)',
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#ef4444',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'crosshair',
                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.6), inset 0 0 10px rgba(0,0,0,0.3)',
                    border: '4px solid white'
                  }}
                >
                  <div style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%' }}></div>
                </motion.div>
              )}

              {gameState === 'finished' && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(10px)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                      <Star size={80} color="#fbbf24" fill="#fbbf24" style={{ margin: '0 auto 20px auto', filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.5))' }} />
                    </motion.div>
                    <h2 style={{ fontSize: '36px', margin: '0 0 10px 0' }}>Time's Up!</h2>
                    
                    {isSaving ? (
                      <p style={{ color: '#94a3b8', fontSize: '18px' }}>Saving your points...</p>
                    ) : (
                      <>
                        <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '5px' }}>You earned</p>
                        <div style={{ fontSize: '64px', fontWeight: 'bold', color: '#10b981', fontFamily: 'monospace', lineHeight: '1' }}>+{score}</div>
                        <p style={{ color: '#94a3b8', fontSize: '16px', marginTop: '5px', textTransform: 'uppercase', letterSpacing: '2px' }}>Global Points</p>
                      </>
                    )}
                    
                    <div style={{ marginTop: '40px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
                      <button onClick={startGame} style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '14px 30px', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <RefreshCw size={18} /> Play Again
                      </button>
                      <Link to="/leaderboard" style={{ backgroundColor: '#1e293b', color: 'white', border: '1px solid #334155', padding: '14px 30px', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <Trophy size={18} color="#fbbf24" /> Leaderboard
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;
