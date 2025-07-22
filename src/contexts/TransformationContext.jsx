import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';

const TransformationContext = createContext();

export const useTransformation = () => {
  const context = useContext(TransformationContext);
  if (!context) {
    throw new Error('useTransformation must be used within TransformationProvider');
  }
  return context;
};

export const TransformationProvider = ({ children }) => {
  const [activeTransformations, setActiveTransformations] = useState([]);

  // Load active transformations from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('activeTransformations');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setActiveTransformations(parsed);
      } catch (e) {
        console.error('Failed to parse stored transformations:', e);
      }
    }
  }, []);

  // Save to localStorage whenever transformations change
  useEffect(() => {
    if (activeTransformations.length > 0) {
      localStorage.setItem('activeTransformations', JSON.stringify(activeTransformations));
    } else {
      localStorage.removeItem('activeTransformations');
    }
  }, [activeTransformations]);

  const addTransformation = useCallback((transformation) => {
    setActiveTransformations(prev => [...prev, {
      ...transformation,
      startedAt: new Date().toISOString(),
      status: 'processing'
    }]);
  }, []);

  const updateTransformation = useCallback((jobId, updates) => {
    setActiveTransformations(prev => 
      prev.map(t => t.jobId === jobId ? { ...t, ...updates } : t)
    );
  }, []);

  const removeTransformation = useCallback((jobId) => {
    setActiveTransformations(prev => prev.filter(t => t.jobId !== jobId));
  }, []);

  const checkTransformationStatus = useCallback(async (jobId, uuid, apiKey) => {
    try {
      const statusResponse = await fetch(`https://api.runpod.ai/v2/tdme3jq4u7zg1s/status/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      const statusData = await statusResponse.json();

      if (statusData.status === 'COMPLETED') {
        // Fetch output from Supabase
        const { data, error } = await supabase
          .from('inputimagetable')
          .select('output')
          .eq('unique_id', uuid)
          .single();

        if (!error && data && data.output) {
          updateTransformation(jobId, {
            status: 'completed',
            processedImage: data.output,
            completedAt: new Date().toISOString()
          });
          return { status: 'completed', processedImage: data.output };
        }
      } else if (statusData.status === 'FAILED') {
        updateTransformation(jobId, {
          status: 'failed',
          error: 'Processing failed',
          completedAt: new Date().toISOString()
        });
        return { status: 'failed' };
      } else {
        let progress = 10;
        if (statusData.status === 'IN_PROGRESS') {
          // Estimate progress based on time elapsed
          const transformation = activeTransformations.find(t => t.jobId === jobId);
          if (transformation) {
            const elapsed = Date.now() - new Date(transformation.startedAt).getTime();
            progress = Math.min(90, 10 + (elapsed / 20000) * 80); // Assume ~20s average
          }
        }
        updateTransformation(jobId, { progress });
        return { status: 'processing', progress };
      }
    } catch (error) {
      console.error('Error checking transformation status:', error);
      return { status: 'error', error: error.message };
    }
  }, [activeTransformations, updateTransformation]);

  const value = {
    activeTransformations,
    addTransformation,
    updateTransformation,
    removeTransformation,
    checkTransformationStatus
  };

  return (
    <TransformationContext.Provider value={value}>
      {children}
    </TransformationContext.Provider>
  );
};