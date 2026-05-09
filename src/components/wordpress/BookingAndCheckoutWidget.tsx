/* eslint-disable @typescript-eslint/no-unused-vars, react/no-unescaped-entities */
'use client';

import React, { useState } from 'react';
import { CreditCard, Calendar, Clock, Lock, ChevronRight, User } from 'lucide-react';
import { GGBillingButton } from '@/lib/sdk/GGBillingButton';

export function BookingAndCheckoutWidget() {
  const [step, setStep] = useState(1); // 1: Booking, 2: Checkout, 3: Success

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md mx-auto shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>1</div>
          <div className={`h-1 w-8 ${step >= 2 ? 'bg-indigo-600' : 'bg-zinc-800'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>2</div>
        </div>
        <span className="text-sm font-medium text-zinc-400">
          {step === 1 ? 'Schedule Appointment' : step === 2 ? 'Secure Checkout' : 'Confirmed'}
        </span>
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Select a Time</h3>
            <p className="text-sm text-zinc-400">Choose when you would like to book the consultation.</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
              <input 
                type="date" 
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {['09:00 AM', '10:30 AM', '01:00 PM', '03:30 PM'].map((time, i) => (
                <button 
                  key={i}
                  className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg border transition-all ${
                    i === 1 ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-zinc-700 hover:border-zinc-500 text-zinc-300'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{time}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setStep(2)}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3.5 font-semibold flex items-center justify-center space-x-2 transition-all hover:shadow-lg hover:shadow-indigo-500/25 mt-4"
          >
            <span>Continue to Payment</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Payment Details</h3>
            <p className="text-sm text-zinc-400">Consultation Fee: <span className="text-white font-medium">$49.00</span></p>
          </div>

          <div className="space-y-4">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 text-emerald-500 mb-1">
                <Lock size={14} />
                <span className="text-[10px] font-black uppercase tracking-wider">GG Secure Billing</span>
              </div>
              <p className="text-xs text-zinc-400">Going Genius handles payment security, compliance, and multi-gateway support automatically.</p>
            </div>
            
            <GGBillingButton 
              appId="demo_wp_app" 
              label="Pay NPR 1,500 with Going Genius"
              className="w-full"
              onClick={() => {
                // Simulate payment success for demo purposes
                setStep(3);
              }}
            />
          </div>
          
          <button 
            onClick={() => setStep(1)}
            className="w-full text-zinc-500 hover:text-zinc-300 text-sm font-medium transition-colors"
          >
            Back to Scheduling
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in duration-500">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
          <p className="text-zinc-400 text-center mb-8">
            Your appointment is scheduled and payment was successful. We've sent the details to your email.
          </p>
          <button 
            onClick={() => setStep(1)}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl py-3.5 font-semibold transition-colors"
          >
            Book Another
          </button>
        </div>
      )}
    </div>
  );
}
