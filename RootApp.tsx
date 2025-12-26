import React, { useState } from 'react';
import App from './App'; // Original AI Studio
import { AdminApp } from './AdminApp'; // New Admin System
import { NeuralButton } from './components/UIElements';

export const RootApp: React.FC = () => {
  // Check URL parameter to decide which app to show
  const urlParams = new URLSearchParams(window.location.search);
  const initialMode = urlParams.get('mode') === 'studio' ? 'studio' : 'admin';
  const [appMode, setAppMode] = useState<'studio' | 'admin'>(initialMode);

  const toggleMode = () => {
    const newMode = appMode === 'studio' ? 'admin' : 'studio';
    setAppMode(newMode);
    
    // Update URL without reload
    const url = new URL(window.location.href);
    url.searchParams.set('mode', newMode);
    window.history.pushState({}, '', url);
  };

  return (
    <>
      {/* App Toggle Button - Fixed position */}
      <div className="fixed top-4 right-4 z-[9999]">
        <NeuralButton
          onClick={toggleMode}
          variant="primary"
          size="sm"
          className="shadow-2xl"
        >
          {appMode === 'studio' ? '🎛️ Admin' : '✨ Studio'}
        </NeuralButton>
      </div>

      {/* Render the selected app */}
      {appMode === 'studio' ? <App /> : <AdminApp />}
    </>
  );
};

export default RootApp;
