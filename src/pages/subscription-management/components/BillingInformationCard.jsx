import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const BillingInformationCard = ({ billingInfo, onUpdateBilling, isLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: billingInfo.companyName || '',
    email: billingInfo.email || '',
    phone: billingInfo.phone || '',
    address: billingInfo.address || '',
    city: billingInfo.city || '',
    state: billingInfo.state || '',
    pincode: billingInfo.pincode || '',
    gstin: billingInfo.gstin || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onUpdateBilling(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating billing information:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      companyName: billingInfo.companyName || '',
      email: billingInfo.email || '',
      phone: billingInfo.phone || '',
      address: billingInfo.address || '',
      city: billingInfo.city || '',
      state: billingInfo.state || '',
      pincode: billingInfo.pincode || '',
      gstin: billingInfo.gstin || ''
    });
    setIsEditing(false);
  };

  const handleAddPaymentMethod = () => {
    console.log('Add payment method clicked');
    // Implement Razorpay payment method addition
  };

  const handleRemovePaymentMethod = (methodId) => {
    console.log('Remove payment method:', methodId);
    // Implement payment method removal
  };

  return (
    <div className="space-y-6">
      {/* Billing Information */}
      <div className="glass rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Billing Information</h3>
            <p className="text-text-secondary">Manage your billing details and tax information</p>
          </div>
          {!isEditing && (
            <Button
              variant="ghost"
              onClick={() => setIsEditing(true)}
              iconName="Edit"
              iconPosition="left"
            >
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Company Name
                </label>
                <Input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="billing@company.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  GSTIN (Optional)
                </label>
                <Input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleInputChange}
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Address
              </label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  City
                </label>
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  State
                </label>
                <Input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  PIN Code
                </label>
                <Input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="400001"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                loading={isLoading}
                iconName="Save"
                iconPosition="left"
              >
                Save Changes
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-text-secondary mb-2">Company Details</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-text-primary">{billingInfo.companyName || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-text-secondary">{billingInfo.email}</span>
                  </div>
                  <div>
                    <span className="text-sm text-text-secondary">{billingInfo.phone || 'Not provided'}</span>
                  </div>
                  {billingInfo.gstin && (
                    <div>
                      <span className="text-xs text-text-secondary">GSTIN: </span>
                      <span className="text-sm text-text-primary">{billingInfo.gstin}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-text-secondary mb-2">Billing Address</h4>
                <div className="text-sm text-text-primary">
                  <div>{billingInfo.address}</div>
                  <div>{billingInfo.city}, {billingInfo.state} {billingInfo.pincode}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <div className="glass rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Payment Methods</h3>
            <p className="text-text-secondary">Manage your saved payment methods</p>
          </div>
          <Button
            variant="primary"
            onClick={handleAddPaymentMethod}
            iconName="Plus"
            iconPosition="left"
            className="gradient-border"
          >
            Add Method
          </Button>
        </div>

        <div className="space-y-3">
          {billingInfo.paymentMethods && billingInfo.paymentMethods.length > 0 ? (
            billingInfo.paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 glass rounded-lg border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Icon name={method.type === 'card' ? 'CreditCard' : 'Smartphone'} size={20} color="white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-primary">
                      {method.type === 'card' ? `•••• •••• •••• ${method.last4}` : method.upiId}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {method.type === 'card' ? `${method.brand} • Expires ${method.expiry}` : 'UPI'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {method.isDefault && (
                    <div className="px-2 py-1 bg-success/20 text-success border border-success/30 rounded-full text-xs font-medium">
                      Default
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePaymentMethod(method.id)}
                    iconName="Trash2"
                    className="text-error hover:text-error hover:bg-error/10"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Icon name="CreditCard" size={48} className="text-text-secondary mx-auto mb-4" />
              <h4 className="text-lg font-medium text-text-primary mb-2">No Payment Methods</h4>
              <p className="text-text-secondary mb-4">Add a payment method to manage your subscriptions</p>
              <Button
                variant="primary"
                onClick={handleAddPaymentMethod}
                iconName="Plus"
                iconPosition="left"
                className="gradient-border"
              >
                Add Payment Method
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingInformationCard;