import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { saveAs } from 'file-saver';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LicenseDownload = ({ eventData, selectedStyles, onClose, onNewEvent }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [licenseGenerated, setLicenseGenerated] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');

  const generateJWTLicense = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate license generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create license payload
      const licensePayload = {
        eventId: `EVT_${Date.now()}`,
        eventName: eventData.eventName,
        startDate: eventData.startDate,
        startTime: eventData.startTime,
        endDate: eventData.endDate,
        endTime: eventData.endTime,
        location: eventData.location,
        description: eventData.description,
        selectedStyles: selectedStyles,
        subscriptionPlan: eventData.subscriptionPlan,
        generatedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year validity
        licenseType: 'PHOTOBOOTH_EVENT',
        version: '1.0'
      };

      // Create JWT-like structure (Header.Payload.Signature)
      const header = {
        alg: 'HS256',
        typ: 'JWT'
      };

      const encodedHeader = btoa(JSON.stringify(header));
      const encodedPayload = btoa(JSON.stringify(licensePayload));
      
      // Generate signature using CryptoJS
      const secretKey = 'MAGIC_PHOTOBOOTH_SECRET_2024';
      const signature = CryptoJS.HmacSHA256(`${encodedHeader}.${encodedPayload}`, secretKey).toString();
      const encodedSignature = btoa(signature);

      const jwtToken = `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
      
      setLicenseKey(jwtToken);
      setLicenseGenerated(true);
    } catch (error) {
      console.error('Error generating license:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadLicense = () => {
    if (!licenseKey) return;

    const licenseContent = {
      licenseKey: licenseKey,
      eventDetails: {
        eventId: `EVT_${Date.now()}`,
        eventName: eventData.eventName,
        startDateTime: `${eventData.startDate} ${eventData.startTime}`,
        endDateTime: `${eventData.endDate} ${eventData.endTime}`,
        location: eventData.location,
        selectedStyles: selectedStyles,
        subscriptionPlan: eventData.subscriptionPlan
      },
      instructions: `Magic Photobooth License File\n\nThis license file contains the JWT token required to activate your photobooth event.\n\nEvent: ${eventData.eventName}\nDate: ${eventData.startDate} to ${eventData.endDate}\nStyles: ${selectedStyles.join(', ')}\n\nTo use this license:\n1. Copy the license key from this file\n2. Paste it into your photobooth application\n3. The photobooth will automatically configure with your selected styles\n\nLicense Key:\n${licenseKey}\n\nGenerated on: ${new Date().toLocaleString('en-IN')}\nValid until: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleString('en-IN')}`
    };

    const blob = new Blob([licenseContent.instructions], { type: 'text/plain;charset=utf-8' });
    const fileName = `${eventData.eventName.replace(/[^a-zA-Z0-9]/g, '_')}_License.lic`;
    
    saveAs(blob, fileName);
  };

  const copyLicenseKey = () => {
    if (licenseKey) {
      navigator.clipboard.writeText(licenseKey);
    }
  };

  const formatDateTime = (date, time) => {
    if (!date || !time) return 'Not specified';
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-success to-success/80 flex items-center justify-center">
          <Icon name="CheckCircle" size={32} color="white" />
        </div>
        <h3 className="text-2xl font-semibold text-text-primary mb-2">Event Created Successfully!</h3>
        <p className="text-text-secondary">
          Your photobooth event has been configured. Generate and download your license key below.
        </p>
      </div>

      {/* Event Summary Card */}
      <div className="glass rounded-lg border border-white/20 p-6">
        <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="Calendar" size={20} className="mr-2 text-primary" />
          Event Details
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-text-secondary">Event Name:</span>
            <p className="text-text-primary font-medium">{eventData.eventName}</p>
          </div>
          
          <div>
            <span className="text-text-secondary">Duration:</span>
            <p className="text-text-primary font-medium">
              {formatDateTime(eventData.startDate, eventData.startTime)} - {formatDateTime(eventData.endDate, eventData.endTime)}
            </p>
          </div>
          
          {eventData.location && (
            <div>
              <span className="text-text-secondary">Location:</span>
              <p className="text-text-primary font-medium">{eventData.location}</p>
            </div>
          )}
          
          <div>
            <span className="text-text-secondary">Selected Styles:</span>
            <p className="text-text-primary font-medium">{selectedStyles.join(', ')}</p>
          </div>
        </div>
      </div>

      {/* License Generation Section */}
      <div className="glass rounded-lg border border-white/20 p-6">
        <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="Shield" size={20} className="mr-2 text-accent" />
          License Key Generation
        </h4>

        {!licenseGenerated ? (
          <div className="text-center py-8">
            <Icon name="Key" size={48} className="mx-auto mb-4 text-accent" />
            <p className="text-text-secondary mb-6">
              Generate a secure JWT license key for your photobooth event. This key will contain all your event configuration and selected AI styles.
            </p>
            
            <Button
              variant="primary"
              onClick={generateJWTLicense}
              loading={isGenerating}
              iconName="Zap"
              iconPosition="left"
              className="gradient-border"
            >
              {isGenerating ? 'Generating License...' : 'Generate License Key'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-success flex items-center">
                <Icon name="CheckCircle" size={16} className="mr-2" />
                License Generated Successfully
              </span>
              <span className="text-xs text-text-secondary">
                Generated on {new Date().toLocaleString('en-IN')}
              </span>
            </div>

            {/* License Key Display */}
            <div className="bg-surface/50 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">License Key:</span>
                <Button
                  variant="ghost"
                  onClick={copyLicenseKey}
                  iconName="Copy"
                  size="sm"
                >
                  Copy
                </Button>
              </div>
              <div className="bg-background/50 rounded p-3 font-mono text-xs text-text-secondary break-all">
                {licenseKey}
              </div>
            </div>

            {/* Download Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                onClick={downloadLicense}
                iconName="Download"
                iconPosition="left"
                className="gradient-border flex-1"
              >
                Download License File (.lic)
              </Button>
              
              <Button
                variant="ghost"
                onClick={copyLicenseKey}
                iconName="Copy"
                iconPosition="left"
                className="flex-1"
              >
                Copy License Key
              </Button>
            </div>

            {/* Usage Instructions */}
            <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
              <h5 className="text-sm font-medium text-text-primary mb-2 flex items-center">
                <Icon name="Info" size={16} className="mr-2 text-accent" />
                How to Use Your License
              </h5>
              <ul className="text-xs text-text-secondary space-y-1">
                <li>• Download the .lic file and transfer it to your photobooth device</li>
                <li>• Or copy the license key and paste it directly into your photobooth app</li>
                <li>• The license will automatically configure your selected AI styles</li>
                <li>• License is valid for 1 year from generation date</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/20">
        <Button
          variant="primary"
          onClick={onNewEvent}
          iconName="Plus"
          iconPosition="left"
          className="gradient-border flex-1"
        >
          Create Another Event
        </Button>
        
        <Button
          variant="ghost"
          onClick={onClose}
          iconName="ArrowLeft"
          iconPosition="left"
          className="flex-1"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default LicenseDownload;