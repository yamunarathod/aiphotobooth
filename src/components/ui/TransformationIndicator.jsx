import React, { useEffect, useState } from 'react';
import { useTransformation } from '../../contexts/TransformationContext';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const TransformationIndicator = () => {
  const { activeTransformations } = useTransformation();
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);

  if (activeTransformations.length === 0) {
    return null;
  }

  const latestTransformation = activeTransformations[activeTransformations.length - 1];
  const progressPercentage = latestTransformation.progress || 0;

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isMinimized ? 'w-16 h-16' : 'w-80'
      }`}
    >
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border border-violet-500/30 shadow-xl">
        {!isMinimized ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                <h4 className="text-white font-semibold">Transforming Image</h4>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Icon name="Minimize2" size={16} />
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-slate-300">
                Style: <span className="text-violet-400 capitalize">{latestTransformation.selectedStyle}</span>
              </div>
              
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              
              <div className="text-xs text-slate-400 text-center">
                {Math.round(progressPercentage)}% complete
              </div>
              
              <button
                onClick={() => navigate('/')}
                className="w-full mt-2 text-sm bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 rounded-lg py-2 transition-colors"
              >
                Go to Live Demo
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => setIsMinimized(false)}
            className="w-full h-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            <div className="relative">
              <div className="w-10 h-10 border-3 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-white font-bold">{Math.round(progressPercentage)}%</span>
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default TransformationIndicator;