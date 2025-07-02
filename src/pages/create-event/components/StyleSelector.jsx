import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const StyleSelector = ({ 
  selectedStyles, 
  onStyleToggle, 
  subscriptionPlan, 
  maxStyles,
  errors 
}) => {
  const availableStyles = [
    {
      id: 'Ghibli',
      name: 'Ghibli',
      description: 'Timeless sepia and ghibli film effects',
      preview: 'https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751373008/image_20250621_154501_q3uj8c.png',
      category: 'Classic'
    },
    {
      id: 'pixar',
      name: 'Pixar',
      description: 'Contemporary filters with vibrant colors',
      preview: 'https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751371138/image_20250621_163838_gowdyd.png',
      category: 'Modern'
    },
    {
      id: 'packaging',
      name: 'Packaging',
      description: 'Professional portrait enhancement',
      preview: 'https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751373010/image_20250628_113955_vet6mk.png',
      category: 'Professional'
    },
    {
      id: 'Faceswap',
      name: 'Faceswap',
      description: 'Romantic soft focus and warm tones',
      preview: 'https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751371139/IMG_0787_ps9i2x.jpg',
      category: 'Wedding'
    }
  ];

  const isStyleSelected = (styleId) => {
    return selectedStyles.includes(styleId);
  };

  const canSelectMoreStyles = () => {
    return selectedStyles.length < maxStyles;
  };

  const handleStyleClick = (styleId) => {
    if (isStyleSelected(styleId)) {
      // Deselect style
      onStyleToggle(styleId, false);
    } else if (canSelectMoreStyles()) {
      // Select style
      onStyleToggle(styleId, true);
    }
  };

  const getSubscriptionBadgeColor = (plan) => {
    switch (plan?.toLowerCase()) {
      case 'professional':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'starter':
        return 'bg-accent/20 text-accent border-accent/30';
      default:
        return 'bg-warning/20 text-warning border-warning/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Subscription Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Select AI Styles</h3>
          <p className="text-sm text-text-secondary">
            Choose up to {maxStyles} style{maxStyles > 1 ? 's' : ''} for your photobooth event
          </p>
        </div>
        
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
          getSubscriptionBadgeColor(subscriptionPlan)
        }`}>
          <Icon name="Crown" size={14} className="mr-1" />
          {subscriptionPlan} Plan - {maxStyles} Style{maxStyles > 1 ? 's' : ''}
        </div>
      </div>

      {/* Selection Counter */}
      <div className="glass rounded-lg p-4 border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Palette" size={16} className="text-accent" />
            <span className="text-sm font-medium text-text-primary">
              Selected Styles: {selectedStyles.length} / {maxStyles}
            </span>
          </div>
          
          {selectedStyles.length > 0 && (
            <div className="flex items-center space-x-1">
              {selectedStyles.map((styleId) => {
                const style = availableStyles.find(s => s.id === styleId);
                return (
                  <span key={styleId} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/20 text-primary">
                    {style?.name}
                  </span>
                );
              })}
            </div>
          )}
        </div>
        
        {selectedStyles.length === maxStyles && (
          <p className="text-xs text-warning mt-2 flex items-center">
            <Icon name="Info" size={14} className="mr-1" />
            Maximum styles selected. Deselect a style to choose a different one.
          </p>
        )}
      </div>

      {/* Error Message */}
      {errors.styles && (
        <div className="glass rounded-lg p-3 border border-error/30 bg-error/10">
          <p className="text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={16} className="mr-2" />
            {errors.styles}
          </p>
        </div>
      )}

      {/* Style Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableStyles.map((style) => {
          const isSelected = isStyleSelected(style.id);
          const isDisabled = !isSelected && !canSelectMoreStyles();
          
          return (
            <div
              key={style.id}
              className={`relative group cursor-pointer transition-all duration-300 ${
                isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
              onClick={() => !isDisabled && handleStyleClick(style.id)}
            >
              <div className={`glass rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                isSelected 
                  ? 'border-primary shadow-lg shadow-primary/25' 
                  : 'border-white/20 hover:border-primary/50'
              }`}>
                {/* Preview Image */}
                <div className="relative h-32 overflow-hidden">
                  <Image
                    src={style.preview}
                    alt={style.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Selection Overlay */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Icon name="Check" size={16} color="white" />
                      </div>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-background/80 text-text-primary">
                      {/* {style.category} */}
                    </span>
                  </div>
                </div>

                {/* Style Info */}
                <div className="p-4">
                  <h4 className="font-medium text-text-primary mb-1">{style.name}</h4>
                  <p className="text-sm text-text-secondary">{style.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upgrade Prompt for Starter Plan */}
      {subscriptionPlan === 'Starter' && (
        <div className="glass rounded-lg p-4 border border-accent/30 bg-accent/5">
          <div className="flex items-start space-x-3">
            <Icon name="Sparkles" size={20} className="text-accent mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-text-primary mb-1">Want More Styles?</h4>
              <p className="text-sm text-text-secondary mb-3">
                Upgrade to Professional plan to unlock all 6 AI styles and create more diverse photobooth experiences.
              </p>
              <button
                onClick={() => window.open('/subscription-management', '_blank')}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors duration-200 text-sm font-medium"
              >
                <Icon name="ArrowUpRight" size={16} className="mr-1" />
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StyleSelector;