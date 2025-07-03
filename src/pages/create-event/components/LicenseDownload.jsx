import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { saveAs } from 'file-saver';

// Mock Icon component for demonstration purposes
const Icon = ({ name, size = 16, color = 'currentColor', className = '' }) => {
  // In a real app, this would render an actual SVG icon.
  // Using a placeholder span for this example.
  return (
    <span className={`inline-block ${className}`} style={{ width: size, height: size, color: color }}>
      [{name}]
    </span>
  );
};

// Mock Button component for demonstration purposes
const Button = ({ children, onClick, loading, iconName, variant = 'primary', ...props }) => {
    const baseClasses = "px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variantClasses = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        ghost: "bg-transparent text-gray-300 hover:bg-gray-700",
    };

    return (
        <button onClick={onClick} disabled={loading} className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
            {loading ? 'Loading...' : (
                <div className="flex items-center justify-center">
                    {iconName && <Icon name={iconName} className="mr-2" />}
                    {children}
                </div>
            )}
        </button>
    );
};


// --- JWT Generation Logic (as per your reference) ---

/**
 * Makes a Base64 string URL-safe.
 * @param {string} base64 - The Base64 encoded string.
 * @returns {string} The URL-safe Base64 string.
 */
const base64UrlSafe = (base64) => {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

/**
 * Encodes a string into a URL-safe Base64 format.
 * @param {string} str - The string to encode.
 * @returns {string} The URL-safe Base64 encoded string.
 */
const base64UrlEncode = (str) => {
  // btoa can have issues with Unicode characters. This pattern is more robust.
  let base64 = btoa(unescape(encodeURIComponent(str)));
  return base64UrlSafe(base64);
};

/**
 * Creates a JWT token with the given payload and secret.
 * @param {object} payload - The data to include in the token.
 * @param {string} secret - The secret key for signing.
 * @returns {string} The generated JWT.
 */
const createJWT = (payload, secret) => {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  // Sign the data and encode the signature in Base64
  const signature = CryptoJS.HmacSHA256(dataToSign, secret).toString(
    CryptoJS.enc.Base64
  );

  // Make the signature URL-safe
  const encodedSignature = base64UrlSafe(signature);

  return `${dataToSign}.${encodedSignature}`;
};


const LicenseDownload = ({ eventData, selectedStyles, onClose, onNewEvent }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [licenseGenerated, setLicenseGenerated] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');

  /**
   * Generates the license key using the corrected JWT creation logic.
   */
  const generateJWTLicense = async () => {
    setIsGenerating(true);

    try {
      // Simulate license generation delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 1. Create the license payload with the user-specified structure.
      const startDateTime = new Date(`${eventData.startDate}T${eventData.startTime}`);
      const endDateTime = new Date(`${eventData.endDate}T${eventData.endTime}`);

      // NOTE: 'builds' and 'mode' are not available in the component's current props.
      // Using placeholder values as per the required payload structure.
      // You might need to pass these down as props if they are dynamic.
      const builds = ['default_build', 'premium_features'];
      const mode = 'standard';

      const licensePayload = {
        start_date_time: !isNaN(startDateTime) ? startDateTime.toISOString() : 'Invalid Start Date',
        end_date_time: !isNaN(endDateTime) ? endDateTime.toISOString() : 'Invalid End Date',
        themes_selected: selectedStyles.join(", "),
        selected_builds: builds.join(", "),
        photobooth_mode: mode,
        issuedAt: new Date().toISOString(),
      };

      // 2. Define the secret key.
      const secretKey = 'MAGIC_PHOTOBOOTH_SECRET_2024';

      // 3. Create the JWT using the corrected, URL-safe function.
      const jwtToken = createJWT(licensePayload, secretKey);

      setLicenseKey(jwtToken);
      setLicenseGenerated(true);

    } catch (error) {
      console.error('Error generating license:', error);
      // Optionally, set an error state here to show in the UI
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadLicense = () => {
    if (!licenseKey) return;

    const licenseContent = {
      licenseKey: licenseKey,
      eventDetails: {
        eventName: eventData.eventName,
        startDateTime: `${eventData.startDate} ${eventData.startTime}`,
        endDateTime: `${eventData.endDate} ${eventData.endTime}`,
        selectedStyles: selectedStyles,
      },
      instructions: `Magic Photobooth License File\n\nThis license file contains the JWT token required to activate your photobooth event.\n\nEvent: ${eventData.eventName}\nDate: ${eventData.startDate} to ${eventData.endDate}\nStyles: ${selectedStyles.join(', ')}\n\nTo use this license:\n1. Copy the license key from this file.\n2. Paste it into your photobooth application.\n3. The photobooth will automatically configure with your selected styles.\n\n--- LICENSE KEY BEGIN ---\n${licenseKey}\n--- LICENSE KEY END ---\n\nGenerated on: ${new Date().toLocaleString('en-IN')}\nValid until: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleString('en-IN')}`
    };

    const blob = new Blob([licenseContent.instructions], { type: 'text/plain;charset=utf-8' });
    const fileName = `${eventData.eventName.replace(/[^a-zA-Z0-9]/g, '_')}_License.lic`;

    saveAs(blob, fileName);
  };

  const copyLicenseKey = () => {
    if (licenseKey) {
      // Using a temporary textarea for broader browser support
      const textArea = document.createElement("textarea");
      textArea.value = licenseKey;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        // Add user feedback, e.g., a toast notification
        console.log('License key copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
      document.body.removeChild(textArea);
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

  // Dummy data for standalone rendering
  if (!eventData) {
    eventData = {
        eventName: 'Test Gala 2024',
        startDate: '2024-12-25',
        startTime: '18:00',
        endDate: '2024-12-25',
        endTime: '23:00',
        location: 'Grand Ballroom',
        description: 'Annual company celebration.',
        subscriptionPlan: 'Premium'
    };
  }
   if (!selectedStyles) {
       selectedStyles = ['Vintage', 'Sci-Fi', 'Fantasy'];
   }
   if (!onClose) onClose = () => console.log('Close clicked');
   if (!onNewEvent) onNewEvent = () => console.log('New Event clicked');


  return (
    <div className="bg-gray-900 text-white p-8 max-w-2xl mx-auto rounded-lg shadow-2xl space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
          <Icon name="CheckCircle" size={32} color="white" />
        </div>
        <h3 className="text-2xl font-semibold text-white mb-2">Event Created Successfully!</h3>
        <p className="text-gray-400">
          Your photobooth event has been configured. Generate and download your license key below.
        </p>
      </div>

      {/* Event Summary Card */}
      <div className="bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Icon name="Calendar" size={20} className="mr-2 text-blue-400" />
          Event Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Event Name:</span>
            <p className="text-white font-medium">{eventData.eventName}</p>
          </div>
          <div>
            <span className="text-gray-400">Duration:</span>
            <p className="text-white font-medium">
              {formatDateTime(eventData.startDate, eventData.startTime)} - {formatDateTime(eventData.endDate, eventData.endTime)}
            </p>
          </div>
          {eventData.location && (
            <div>
              <span className="text-gray-400">Location:</span>
              <p className="text-white font-medium">{eventData.location}</p>
            </div>
          )}
          <div>
            <span className="text-gray-400">Selected Styles:</span>
            <p className="text-white font-medium">{selectedStyles.join(', ')}</p>
          </div>
        </div>
      </div>

      {/* License Generation Section */}
      <div className="bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Icon name="Shield" size={20} className="mr-2 text-purple-400" />
          License Key Generation
        </h4>

        {!licenseGenerated ? (
          <div className="text-center py-8">
            <Icon name="Key" size={48} className="mx-auto mb-4 text-purple-400" />
            <p className="text-gray-400 mb-6">
              Generate a secure JWT license key for your photobooth event. This key will contain all your event configuration and selected AI styles.
            </p>
            <Button
              variant="primary"
              onClick={generateJWTLicense}
              loading={isGenerating}
              iconName="Zap"
            >
              {isGenerating ? 'Generating License...' : 'Generate License Key'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-green-400 flex items-center">
                <Icon name="CheckCircle" size={16} className="mr-2" />
                License Generated Successfully
              </span>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">License Key:</span>
                <Button variant="ghost" onClick={copyLicenseKey} iconName="Copy">
                  Copy
                </Button>
              </div>
              <div className="bg-black bg-opacity-50 rounded p-3 font-mono text-xs text-gray-400 break-all">
                {licenseKey}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="primary" onClick={downloadLicense} iconName="Download" className="flex-1">
                Download License File (.lic)
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700">
        <Button variant="primary" onClick={onNewEvent} iconName="Plus" className="flex-1">
          Create Another Event
        </Button>
        <Button variant="ghost" onClick={onClose} iconName="ArrowLeft" className="flex-1">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default LicenseDownload;
