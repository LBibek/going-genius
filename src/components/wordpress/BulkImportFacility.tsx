'use client';

import React, { useState } from 'react';
import { UploadCloud, FileType, CheckCircle, AlertCircle, RefreshCw, Users, Calendar, ShoppingCart } from 'lucide-react';

export function BulkImportFacility() {
  const [dragActive, setDragActive] = useState(false);
  const [importType, setImportType] = useState('users'); // users, products, appointments
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setStatus('uploading');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    }, 2000);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <UploadCloud className="w-6 h-6 text-indigo-400" />
        <h2 className="text-xl font-semibold text-white">Bulk Import Facility</h2>
      </div>

      <div className="flex space-x-4 mb-6">
        <button 
          onClick={() => setImportType('users')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${importType === 'users' ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
        >
          <Users className="w-4 h-4" />
          <span>Users</span>
        </button>
        <button 
          onClick={() => setImportType('products')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${importType === 'products' ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Products</span>
        </button>
        <button 
          onClick={() => setImportType('appointments')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${importType === 'appointments' ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
        >
          <Calendar className="w-4 h-4" />
          <span>Appointments</span>
        </button>
      </div>

      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors ${
          dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/50'
        }`}
      >
        {status === 'idle' && (
          <>
            <FileType className="w-12 h-12 text-zinc-500 mb-4" />
            <p className="text-zinc-300 font-medium mb-1">Drag & drop your CSV file here</p>
            <p className="text-zinc-500 text-sm mb-4">or click to browse from your computer</p>
            <label className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors">
              Browse Files
              <input type="file" className="hidden" accept=".csv" onChange={simulateUpload} />
            </label>
          </>
        )}

        {status === 'uploading' && (
          <div className="flex flex-col items-center">
            <RefreshCw className="w-12 h-12 text-indigo-400 animate-spin mb-4" />
            <p className="text-zinc-300 font-medium">Processing records...</p>
            <div className="w-64 h-2 bg-zinc-800 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full animate-pulse w-2/3"></div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
            <p className="text-emerald-400 font-medium text-lg">Import Successful!</p>
            <p className="text-zinc-400 text-sm mt-1">1,245 {importType} have been synced securely.</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-red-400 font-medium text-lg">Import Failed</p>
            <p className="text-zinc-400 text-sm mt-1">Invalid CSV format. Please check your columns.</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-between items-center text-xs text-zinc-500">
        <span>Supported formats: .csv, .xlsx</span>
        <button className="text-indigo-400 hover:text-indigo-300 flex items-center space-x-1">
          <span>Download Template</span>
        </button>
      </div>
    </div>
  );
}
