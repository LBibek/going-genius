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
    <div className="image-upload-wrapper">
      {label && <label className="form-label image-upload-label">{label}</label>}
      
      <div className="image-upload-container">
        <div className="image-upload-dropzone">
          <UC.FileUploaderRegular
            pubkey={publicKey}
            multiple={false}
            imgOnly={true}
            sourceList="local, url, camera"
            className="uc-light uc-blue"
            onChange={handleEntryChange}
          />
          
          <div className="image-upload-info">
            <p className="image-upload-text">
              {value ? 'Change image' : 'Click to upload or drag and drop'}
            </p>
            <p className="image-upload-subtext">
              Supports PNG, JPG, WebP
            </p>
          </div>
        </div>

        {value && (
          <div className="image-upload-preview-container">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={uploadcare.getOptimizedUrl(value, { width: 128, height: 128 }) || ''} 
              alt="Preview" 
              className="image-upload-preview"
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

