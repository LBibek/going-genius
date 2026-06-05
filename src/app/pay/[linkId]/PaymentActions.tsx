'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { initiateDirectCheckout } from '@/app/actions/billing';

export function PaymentActions({ 
  appId, 
  planId, 
  amount,
  redirectUrl 
}: { 
  appId: string;
  planId: string;
  amount: number;
  redirectUrl?: string;
}) {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePayment = async (provider: 'khalti' | 'esewa') => {
    setLoading(provider);
    try {
      const result: any = await initiateDirectCheckout(appId, planId, provider, redirectUrl);
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
      alert(error.message || 'Payment initiation failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <button 
        onClick={() => handlePayment('khalti')}
        disabled={loading !== null}
        className="bg-[#5C2D91] hover:bg-[#4a2474] disabled:opacity-50 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {loading === 'khalti' ? 'Loading...' : 'Pay with Khalti'}
      </button>
      <button 
        onClick={() => handlePayment('esewa')}
        disabled={loading !== null}
        className="bg-[#60BB46] hover:bg-[#4d9638] disabled:opacity-50 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {loading === 'esewa' ? 'Loading...' : 'Pay with eSewa'}
      </button>
    </div>
  );
}
