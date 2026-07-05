import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Gift, X, AlertCircle, ShoppingBag, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Store = () => {
  const { user, role, profile } = useAuth();
  const navigate = useNavigate();
  
  const [points, setPoints] = useState(0);
  const [redeemingId, setRedeemingId] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const goodies = [
    { 
      id: 1, 
      name: 'Amazing Kids Cap', 
      cost: 1000, 
      img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop', 
      color: '#f59e0b', 
      desc: 'Premium cotton cap with embroidered logo. Adjustable fit for maximum comfort during sports and outdoor activities.' 
    },
    { 
      id: 2, 
      name: 'Sports Sipper', 
      cost: 1500, 
      img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop', 
      color: '#3b82f6', 
      desc: '750ml leak-proof stainless steel water bottle. Keeps your drinks cold for up to 24 hours while you train.' 
    },
    { 
      id: 3, 
      name: 'Champion T-Shirt', 
      cost: 3000, 
      img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop', 
      color: '#10b981', 
      desc: 'High-performance breathable dry-fit tee. Designed for maximum agility and sweat resistance on the field.' 
    },
    { 
      id: 6, 
      name: 'Athletic Duffle Bag', 
      cost: 5000, 
      img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop', 
      color: '#ef4444', 
      desc: 'Spacious and durable sports bag with multiple compartments for all your tournament gear and shoes.' 
    },
    { 
      id: 4, 
      name: 'Smart Fitness Band', 
      cost: 8000, 
      img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=600&auto=format&fit=crop', 
      color: '#8b5cf6', 
      desc: 'Track your steps, heart rate, and active minutes. The ultimate companion for serious athletes.' 
    },
    { 
      id: 5, 
      name: 'Pro Headphones', 
      cost: 12000, 
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop', 
      color: '#ec4899', 
      desc: 'Immersive noise-cancelling wireless headphones. Get in the zone before your big tournament.' 
    }
  ];

  useEffect(() => {
    if (user && role === 'student' && profile) {
      const fetchPoints = async () => {
        const { data } = await supabase.from('students').select('points').eq('id', profile.id).single();
        if (data) {
          setPoints(data.points || 0);
        }
      };
      fetchPoints();
    }
  }, [user, role, profile]);

  const handleRedeem = async (goodie) => {
    if (!user || role !== 'student') {
      setShowLoginPopup(true);
      return;
    }

    if (points < goodie.cost) {
      alert(`Insufficient points! You need ${goodie.cost - points} more points to redeem the ${goodie.name}. Play games or win tournaments to earn more!`);
      return;
    }
    
    if (window.confirm(`Are you sure you want to spend ${goodie.cost} points on ${goodie.name}?`)) {
      setRedeemingId(goodie.id);
      try {
        const newPoints = points - goodie.cost;
        const { error } = await supabase.from('students').update({ points: newPoints }).eq('id', profile.id);
        
        if (error) throw error;
        
        setPoints(newPoints);
        alert(`🎉 Success! You have successfully redeemed the ${goodie.name}. It will be shipped to your registered address or school.`);
      } catch (error) {
        alert("An error occurred while redeeming. Please try again later.");
      } finally {
        setRedeemingId(null);
      }
    }
  };

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '80px', fontFamily: 'var(--font-body)' }}>
      
      {/* Login Popup Modal */}
      <AnimatePresence>
        {showLoginPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}
            onClick={() => setShowLoginPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', position: 'relative' }}
            >
              <button onClick={() => setShowLoginPopup(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={24} />
              </button>
              <div style={{ width: '70px', height: '70px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px auto' }}>
                <AlertCircle size={32} style={{ color: 'var(--primary-blue)' }} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', margin: '0 0 10px 0', fontSize: '24px', color: 'var(--text-dark)' }}>Login Required</h2>
              <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '30px', lineHeight: '1.6' }}>You must be logged into a Student account to redeem items from the Goodies Store.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => navigate('/login')} style={{ padding: '14px', backgroundColor: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' }}>
                  Login to Account
                </button>
                <button onClick={() => navigate('/register/student')} style={{ padding: '14px', backgroundColor: '#f1f5f9', color: 'var(--primary-dark)', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                  Create Student Account
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Banner */}
      <section style={{ 
        position: 'relative', 
        height: '40vh', 
        minHeight: '350px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '80px',
        overflow: 'hidden'
      }}>
        {/* Background elements */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)', filter: 'blur(30px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)', filter: 'blur(30px)' }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ width: '70px', height: '70px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <ShoppingBag size={32} style={{ color: '#fbbf24' }} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(36px, 5vw, 56px)', color: 'white', margin: '0 0 15px 0', letterSpacing: '-1px' }}
          >
            Exclusive Rewards Store
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}
          >
            Exchange your hard-earned Global Points for premium Amazing Kids merchandise and athletic gear. Train hard, play smart, and get rewarded!
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 20 }}>
        
        {/* User Balance Card */}
        {user && role === 'student' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ backgroundColor: 'white', padding: '20px 30px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '500px', margin: '0 auto 40px auto', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#fffbeb', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Zap size={24} style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>Your Available Balance</div>
                <div style={{ color: 'var(--text-dark)', fontWeight: 'bold', fontSize: '15px' }}>{profile.full_name}</div>
              </div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fbbf24', fontFamily: 'monospace' }}>
              {points.toLocaleString()} <span style={{ fontSize: '14px', color: '#b45309', fontWeight: 'bold' }}>PTS</span>
            </div>
          </motion.div>
        )}

        {!user && (
          <div style={{ textAlign: 'center', marginBottom: '40px', backgroundColor: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', maxWidth: '500px', margin: '0 auto 40px auto' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
              Want to start earning? <button onClick={() => navigate('/register/student')} style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>Create a Student Account</button> today!
            </p>
          </div>
        )}

        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
          {goodies.map((item, index) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -10, boxShadow: '0 25px 50px rgba(0,0,0,0.1)' }}
              style={{ backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.03)', transition: 'all 0.3s ease' }}
            >
              {/* Product Image */}
              <div style={{ position: 'relative', height: '240px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                <img 
                  src={item.img} 
                  alt={item.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px', color: item.color, boxShadow: '0 4px 10px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Zap size={14} /> {item.cost.toLocaleString()} PTS
                </div>
              </div>
              
              {/* Product Details */}
              <div style={{ padding: '30px 25px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', color: 'var(--text-dark)', fontFamily: 'var(--font-heading)' }}>{item.name}</h3>
                <p style={{ margin: '0 0 25px 0', color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>{item.desc}</p>
                
                <div style={{ marginTop: 'auto' }}>
                  {user && role === 'student' && points < item.cost ? (
                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '5px', fontWeight: 'bold' }}>
                        <span>Progress</span>
                        <span>{Math.round((points / item.cost) * 100)}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min((points / item.cost) * 100, 100)}%`, height: '100%', backgroundColor: item.color, borderRadius: '3px' }}></div>
                      </div>
                      <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '5px', textAlign: 'right' }}>Need {item.cost - points} more pts</div>
                    </div>
                  ) : null}

                  <button 
                    onClick={() => handleRedeem(item)}
                    disabled={redeemingId === item.id || (user && role === 'student' && points < item.cost)}
                    style={{ 
                      width: '100%', padding: '16px', 
                      backgroundColor: (!user || role !== 'student' || points >= item.cost) ? item.color : '#f1f5f9', 
                      color: (!user || role !== 'student' || points >= item.cost) ? 'white' : '#94a3b8', 
                      border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px',
                      cursor: (!user || role !== 'student' || points >= item.cost) ? 'pointer' : 'not-allowed',
                      boxShadow: (!user || role !== 'student' || points >= item.cost) ? `0 10px 20px ${item.color}40` : 'none',
                      transition: 'all 0.2s',
                      display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
                    }}
                  >
                    {redeemingId === item.id ? 'Processing...' : (!user || role !== 'student') ? 'Login to Redeem' : (points >= item.cost ? 'Redeem Now' : 'Not Enough Points')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </section>
    </main>
  );
};

export default Store;
