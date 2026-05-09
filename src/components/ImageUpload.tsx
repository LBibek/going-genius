'use client';

import React, { useCallback } from 'react';
import * as UC from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';
import { uploadcare } from '@/lib/uploadcare';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  value?: string | null;
  label?: string;
}

/**
 * Premium Image Upload component powered by Uploadcare.
 */
export function ImageUpload({ onUploadComplete, value, label }: ImageUploadProps) {
  const publicKey = uploadcare.getPublicKey();

  const handleEntryChange = useCallback((event: any) => {
    const { successEntries } = event;
    if (successEntries.length > 0) {
      const file = successEntries[0];
      const url = `https://ucarecdn.com/${file.uuid}/`;
      onUploadComplete(url);
    }
  }, [onUploadComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {label && <label className="form-label" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>{label}</label>}
      
      <div style={{ position: 'relative' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '2rem', 
          border: '2px dashed var(--border)', 
          borderRadius: '1.25rem', 
          background: 'var(--glass)',
          transition: 'all 0.2s'
        }}>
          <UC.FileUploaderRegular
            pubkey={publicKey}
            multiple={false}
            imgOnly={true}
            sourceList="local, url, camera"
            className="uc-light uc-blue"
            onChange={handleEntryChange}
          />
          
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted-light)' }}>
              {value ? 'Change image' : 'Click to upload or drag and drop'}
            </p>
            <p style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.025em', marginTop: '0.25rem' }}>
              Supports PNG, JPG, WebP
            </p>
          </div>
        </div>

        {value && (
          <div style={{ 
            marginTop: '1rem', 
            position: 'relative', 
            width: '8rem', 
            height: '8rem', 
            borderRadius: '0.75rem', 
            overflow: 'hidden', 
            border: '1px solid var(--border)', 
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' 
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={uploadcare.getOptimizedUrl(value, { width: 128, height: 128 }) || ''} 
              alt="Preview" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
      </div>

      <style jsx global>{`
        .uc-light.uc-blue {
          --uc-brand-color: var(--primary);
          --uc-brand-color-hover: var(--primary-hover);
        }
        
        /* Premium styling for Uploadcare blocks */
        uc-file-uploader-regular {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        
        uc-simple-button {
          background: var(--primary) !important;
          color: #000 !important;
          font-weight: 700 !important;
          border-radius: 12px !important;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.75rem !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
