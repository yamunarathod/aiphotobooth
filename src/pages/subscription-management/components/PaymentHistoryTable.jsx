import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentHistoryTable = ({ transactions, isLoading }) => {
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      success: { color: 'bg-success/20 text-success border-success/30', icon: 'CheckCircle' },
      pending: { color: 'bg-warning/20 text-warning border-warning/30', icon: 'Clock' },
      failed: { color: 'bg-error/20 text-error border-error/30', icon: 'XCircle' },
      refunded: { color: 'bg-accent/20 text-accent border-accent/30', icon: 'RotateCcw' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon name={config.icon} size={12} />
        <span className="capitalize">{status}</span>
      </div>
    );
  };

  const getPaymentMethodIcon = (method) => {
    switch (method.toLowerCase()) {
      case 'card':
        return 'CreditCard';
      case 'upi':
        return 'Smartphone';
      case 'netbanking':
        return 'Building2';
      case 'wallet':
        return 'Wallet';
      default:
        return 'CreditCard';
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleDownloadInvoice = (transactionId) => {
    console.log('Downloading invoice for transaction:', transactionId);
    // Implement invoice download logic
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filterStatus === 'all') return true;
    return transaction.status === filterStatus;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'date') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortBy === 'amount') {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (isLoading) {
    return (
      <div className="glass rounded-xl p-6 border border-white/20">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl border border-white/20 overflow-hidden">
      <div className="p-6 border-b border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Payment History</h3>
            <p className="text-text-secondary">Track your subscription payments and transactions</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 glass border border-white/20 rounded-lg text-text-primary bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="all" className="bg-surface text-text-primary">All Status</option>
              <option value="success" className="bg-surface text-text-primary">Success</option>
              <option value="pending" className="bg-surface text-text-primary">Pending</option>
              <option value="failed" className="bg-surface text-text-primary">Failed</option>
              <option value="refunded" className="bg-surface text-text-primary">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface/50">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  <span>Date</span>
                  <Icon 
                    name={sortBy === 'date' && sortOrder === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-medium text-text-secondary">Transaction ID</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-medium text-text-secondary">Description</span>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  <span>Amount</span>
                  <Icon 
                    name={sortBy === 'amount' && sortOrder === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-medium text-text-secondary">Method</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-medium text-text-secondary">Status</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-medium text-text-secondary">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {sortedTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm text-text-primary">{formatDate(transaction.date)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-mono text-text-secondary">{transaction.id}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <span className="text-sm text-text-primary">{transaction.description}</span>
                    {transaction.planType && (
                      <div className="text-xs text-text-secondary mt-1">{transaction.planType} Plan</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-text-primary">{formatCurrency(transaction.amount)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Icon name={getPaymentMethodIcon(transaction.method)} size={16} className="text-text-secondary" />
                    <span className="text-sm text-text-secondary capitalize">{transaction.method}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(transaction.status)}
                </td>
                <td className="px-6 py-4">
                  {transaction.status === 'success' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadInvoice(transaction.id)}
                      iconName="Download"
                      iconPosition="left"
                    >
                      Invoice
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-white/10">
        {sortedTransactions.map((transaction) => (
          <div key={transaction.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-medium text-text-primary">{transaction.description}</div>
                <div className="text-xs text-text-secondary mt-1">{formatDate(transaction.date)}</div>
              </div>
              {getStatusBadge(transaction.status)}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name={getPaymentMethodIcon(transaction.method)} size={16} className="text-text-secondary" />
                <span className="text-sm text-text-secondary capitalize">{transaction.method}</span>
              </div>
              <span className="text-sm font-medium text-text-primary">{formatCurrency(transaction.amount)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-secondary">{transaction.id}</span>
              {transaction.status === 'success' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadInvoice(transaction.id)}
                  iconName="Download"
                  iconPosition="left"
                >
                  Invoice
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {sortedTransactions.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Receipt" size={48} className="text-text-secondary mx-auto mb-4" />
          <h4 className="text-lg font-medium text-text-primary mb-2">No Transactions Found</h4>
          <p className="text-text-secondary">
            {filterStatus === 'all' ? "You haven't made any payments yet." 
              : `No ${filterStatus} transactions found.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryTable;