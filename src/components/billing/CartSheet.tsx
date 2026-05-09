/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { getCart, removeFromCart, clearCart, initiateCheckout } from '@/app/actions/billing';
import { ShoppingCart, X, Trash2, ArrowRight, CreditCard, ShoppingBag } from 'lucide-react';

export function CartSheet({ appId }: { appId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    const data = await getCart(appId);
    setCart(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

  const handleRemove = async (itemId: string) => {
    await removeFromCart(appId, itemId);
    fetchCart();
  };

  const handleCheckout = async (provider: 'khalti' | 'esewa') => {
    setCheckingOut(true);
    try {
      const result: any = await initiateCheckout(appId, provider);
      if (result.url) {
        window.location.href = result.url;
      } else if (result.formData) {
        // Submit eSewa form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'; // Testing
        
        Object.entries(result.formData).forEach(([key, value]: [string, any]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });
        
        document.body.appendChild(form);
        form.submit();
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setCheckingOut(false);
    }
  };

  const total = cart?.items.reduce((acc: number, item: any) => acc + (item.plan.price * item.quantity), 0) || 0;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="cart-trigger"
      >
        <ShoppingCart size={20} />
        {cart?.items.length > 0 && <span className="cart-badge">{cart.items.length}</span>}
      </button>

      {isOpen && (
        <div className="cart-overlay" onClick={() => setIsOpen(false)}>
          <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                <ShoppingBag size={24} /> Your Cart
              </h2>
              <button onClick={() => setIsOpen(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="cart-items">
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                  <div className="spinner" style={{ borderTopColor: 'var(--primary)' }} />
                </div>
              ) : cart?.items.length > 0 ? (
                cart.items.map((item: any) => (
                  <div key={item.id} className="cart-item">
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0 }}>{item.plan.name}</h4>
                      <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: '0.25rem 0' }}>
                        Rs. {item.plan.price} x {item.quantity}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontWeight: 700 }}>Rs. {item.plan.price * item.quantity}</span>
                      <button onClick={() => handleRemove(item.id)} className="remove-btn">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                  Your cart is empty.
                </div>
              )}
            </div>

            {cart?.items.length > 0 && (
              <div className="cart-footer">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                  <span style={{ fontWeight: 600 }}>Total</span>
                  <span style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit, sans-serif' }}>
                    Rs. {total}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button 
                    className="btn-submit" 
                    onClick={() => handleCheckout('khalti')}
                    disabled={checkingOut}
                  >
                    {checkingOut ? <div className="spinner" /> : <><CreditCard size={18} /> Pay with Khalti</>}
                  </button>
                  <button 
                    className="btn-submit" 
                    style={{ background: '#60bb46', boxShadow: '0 4px 20px rgba(96, 187, 70, 0.3)' }}
                    onClick={() => handleCheckout('esewa')}
                    disabled={checkingOut}
                  >
                    {checkingOut ? <div className="spinner" /> : <><ArrowRight size={18} /> Pay with eSewa</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .cart-trigger {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 8px 30px var(--primary-glow);
          z-index: 100;
          transition: transform 0.2s;
        }
        .cart-trigger:hover { transform: scale(1.1); }
        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          font-size: 0.7rem;
          font-weight: 800;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--background);
        }
        .cart-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
        }
        .cart-panel {
          width: 100%;
          max-width: 400px;
          background: var(--background);
          height: 100%;
          display: flex;
          flex-direction: column;
          animation: slideIn 0.3s ease-out;
          border-left: 1px solid var(--border);
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .cart-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .close-btn { background: none; border: none; color: var(--muted); cursor: pointer; padding: 4px; border-radius: 4px; }
        .close-btn:hover { background: var(--glass); color: var(--foreground); }
        .cart-items { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flexDirection: column; gap: 1rem; }
        .cart-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: var(--glass);
          border: 1px solid var(--border);
          border-radius: 12px;
        }
        .remove-btn { background: none; border: none; color: #fca5a5; cursor: pointer; padding: 4px; }
        .remove-btn:hover { color: #ef4444; }
        .cart-footer { padding: 1.5rem; border-top: 1px solid var(--border); background: var(--background-alt); }
      `}</style>
    </>
  );
}
