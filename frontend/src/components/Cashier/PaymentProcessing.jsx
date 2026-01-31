import { useState, useEffect } from 'react';

const PaymentProcessing = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [processingPayment, setProcessingPayment] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    method: 'cash',
    reference: '',
    notes: ''
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      // Mock pending payments
      const mockPendingPayments = [
        {
          id: 1,
          transactionId: 'TXN005',
          customerName: 'Robert Wilson',
          amount: 2500,
          items: ['Amoxicillin 250mg', 'Paracetamol 500mg'],
          createdAt: '2024-01-31 15:30:00',
          status: 'pending',
          paymentMethod: 'insurance'
        },
        {
          id: 2,
          transactionId: 'TXN006',
          customerName: 'Sarah Brown',
          amount: 1800,
          items: ['Vitamin C 1000mg', 'Ibuprofen 400mg'],
          createdAt: '2024-01-31 14:45:00',
          status: 'pending',
          paymentMethod: 'mobile'
        }
      ];

      // Mock payment history
      const mockPaymentHistory = [
        {
          id: 3,
          transactionId: 'TXN004',
          customerName: 'Mary Johnson',
          amount: 1615,
          paymentMethod: 'cash',
          processedAt: '2024-01-31 11:20:15',
          status: 'completed',
          reference: 'CASH001'
        },
        {
          id: 4,
          transactionId: 'TXN003',
          customerName: 'Walk-in Customer',
          amount: 1200,
          paymentMethod: 'mobile',
          processedAt: '2024-01-31 12:45:30',
          status: 'completed',
          reference: 'M-PESA123456'
        },
        {
          id: 5,
          transactionId: 'TXN002',
          customerName: 'Jane Smith',
          amount: 2660,
          paymentMethod: 'card',
          processedAt: '2024-01-31 13:15:10',
          status: 'completed',
          reference: 'CARD789012'
        }
      ];

      setPendingPayments(mockPendingPayments);
      setPaymentHistory(mockPaymentHistory);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const processPayment = async (payment) => {
    setProcessingPayment(payment);
    setPaymentForm({
      amount: payment.amount.toString(),
      method: payment.paymentMethod,
      reference: '',
      notes: ''
    });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const processedPayment = {
        ...processingPayment,
        status: 'completed',
        processedAt: new Date().toISOString(),
        reference: paymentForm.reference || generateReference(paymentForm.method),
        actualAmount: parseFloat(paymentForm.amount),
        notes: paymentForm.notes
      };

      // Move from pending to history
      setPendingPayments(pendingPayments.filter(p => p.id !== processingPayment.id));
      setPaymentHistory([processedPayment, ...paymentHistory]);

      alert(`Payment processed successfully!\nTransaction: ${processingPayment.transactionId}\nAmount: TSh ${paymentForm.amount}\nMethod: ${paymentForm.method.toUpperCase()}`);
      
      resetPaymentForm();
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error processing payment');
    }
  };

  const generateReference = (method) => {
    const timestamp = Date.now().toString().slice(-6);
    switch (method) {
      case 'cash': return `CASH${timestamp}`;
      case 'card': return `CARD${timestamp}`;
      case 'mobile': return `MPESA${timestamp}`;
      case 'insurance': return `INS${timestamp}`;
      default: return `REF${timestamp}`;
    }
  };

  const resetPaymentForm = () => {
    setProcessingPayment(null);
    setPaymentForm({
      amount: '',
      method: 'cash',
      reference: '',
      notes: ''
    });
  };

  const refundPayment = async (payment) => {
    if (!window.confirm(`Are you sure you want to refund ${payment.transactionId}?`)) return;
    
    try {
      // Mock refund process
      const refundedPayment = {
        ...payment,
        status: 'refunded',
        refundedAt: new Date().toISOString()
      };

      setPaymentHistory(paymentHistory.map(p => 
        p.id === payment.id ? refundedPayment : p
      ));

      alert(`Refund processed for transaction ${payment.transactionId}`);
    } catch (error) {
      console.error('Error processing refund:', error);
      alert('Error processing refund');
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'cash': return '💵';
      case 'card': return '💳';
      case 'mobile': return '📱';
      case 'insurance': return '🏥';
      default: return '💰';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#d69e2e';
      case 'completed': return '#38a169';
      case 'refunded': return '#e53e3e';
      default: return '#718096';
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>💳 Payment Processing</h2>
        <div style={statsStyle}>
          <div style={statItemStyle}>
            <span style={statValueStyle}>{pendingPayments.length}</span>
            <span style={statLabelStyle}>Pending</span>
          </div>
          <div style={statItemStyle}>
            <span style={statValueStyle}>
              TSh {paymentHistory.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
            </span>
            <span style={statLabelStyle}>Today's Total</span>
          </div>
        </div>
      </div>

      {/* Payment Processing Modal */}
      {processingPayment && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={modalTitleStyle}>💳 Process Payment</h3>
              <button onClick={resetPaymentForm} style={closeButtonStyle}>❌</button>
            </div>

            <div style={paymentDetailsStyle}>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>Transaction:</span>
                <span style={detailValueStyle}>{processingPayment.transactionId}</span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>Customer:</span>
                <span style={detailValueStyle}>{processingPayment.customerName}</span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>Items:</span>
                <span style={detailValueStyle}>{processingPayment.items.join(', ')}</span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>Amount:</span>
                <span style={amountValueStyle}>TSh {processingPayment.amount.toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} style={paymentFormStyle}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Payment Amount *</label>
                <input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                  style={inputStyle}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Payment Method *</label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({...paymentForm, method: e.target.value})}
                  style={selectStyle}
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="mobile">Mobile Money</option>
                  <option value="insurance">Insurance</option>
                </select>
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Reference Number</label>
                <input
                  type="text"
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm({...paymentForm, reference: e.target.value})}
                  style={inputStyle}
                  placeholder="Enter reference number (optional)"
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Notes</label>
                <textarea
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                  style={textareaStyle}
                  rows="3"
                  placeholder="Additional notes (optional)"
                />
              </div>

              <div style={formActionsStyle}>
                <button type="button" onClick={resetPaymentForm} style={cancelButtonStyle}>
                  Cancel
                </button>
                <button type="submit" style={processButtonStyle}>
                  💰 Process Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={tabsStyle}>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            ...tabButtonStyle,
            ...(activeTab === 'pending' ? activeTabButtonStyle : {})
          }}
        >
          ⏳ Pending Payments ({pendingPayments.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            ...tabButtonStyle,
            ...(activeTab === 'history' ? activeTabButtonStyle : {})
          }}
        >
          📋 Payment History ({paymentHistory.length})
        </button>
      </div>

      {/* Tab Content */}
      <div style={contentStyle}>
        {activeTab === 'pending' ? (
          <div style={paymentsListStyle}>
            {pendingPayments.length === 0 ? (
              <div style={noDataStyle}>
                <div style={noDataIconStyle}>💳</div>
                <div>No pending payments</div>
              </div>
            ) : (
              pendingPayments.map(payment => (
                <div key={payment.id} style={paymentCardStyle}>
                  <div style={paymentHeaderStyle}>
                    <div style={paymentInfoStyle}>
                      <div style={transactionIdStyle}>#{payment.transactionId}</div>
                      <div style={customerNameStyle}>{payment.customerName}</div>
                      <div style={paymentDateStyle}>
                        {new Date(payment.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div style={paymentAmountStyle}>
                      <div style={amountStyle}>TSh {payment.amount.toLocaleString()}</div>
                      <div
                        style={{
                          ...statusBadgeStyle,
                          backgroundColor: getStatusColor(payment.status)
                        }}
                      >
                        {payment.status.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div style={paymentItemsStyle}>
                    <strong>Items:</strong> {payment.items.join(', ')}
                  </div>

                  <div style={paymentActionsStyle}>
                    <div style={paymentMethodStyle}>
                      {getPaymentMethodIcon(payment.paymentMethod)} {payment.paymentMethod.toUpperCase()}
                    </div>
                    <button
                      onClick={() => processPayment(payment)}
                      style={processPaymentButtonStyle}
                    >
                      💳 Process Payment
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div style={paymentsListStyle}>
            {paymentHistory.length === 0 ? (
              <div style={noDataStyle}>
                <div style={noDataIconStyle}>📋</div>
                <div>No payment history</div>
              </div>
            ) : (
              paymentHistory.map(payment => (
                <div key={payment.id} style={paymentCardStyle}>
                  <div style={paymentHeaderStyle}>
                    <div style={paymentInfoStyle}>
                      <div style={transactionIdStyle}>#{payment.transactionId}</div>
                      <div style={customerNameStyle}>{payment.customerName}</div>
                      <div style={paymentDateStyle}>
                        {new Date(payment.processedAt).toLocaleString()}
                      </div>
                    </div>
                    <div style={paymentAmountStyle}>
                      <div style={amountStyle}>TSh {payment.amount.toLocaleString()}</div>
                      <div
                        style={{
                          ...statusBadgeStyle,
                          backgroundColor: getStatusColor(payment.status)
                        }}
                      >
                        {payment.status.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div style={paymentDetailsRowStyle}>
                    <div style={paymentMethodStyle}>
                      {getPaymentMethodIcon(payment.paymentMethod)} {payment.paymentMethod.toUpperCase()}
                    </div>
                    {payment.reference && (
                      <div style={referenceStyle}>
                        Ref: {payment.reference}
                      </div>
                    )}
                  </div>

                  {payment.status === 'completed' && (
                    <div style={paymentActionsStyle}>
                      <button
                        onClick={() => refundPayment(payment)}
                        style={refundButtonStyle}
                      >
                        🔄 Refund
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const containerStyle = { height: '100%' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' };
const titleStyle = { margin: 0, color: '#2d3748', fontSize: '1.5rem' };
const statsStyle = { display: 'flex', gap: '24px' };
const statItemStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center' };
const statValueStyle = { fontSize: '18px', fontWeight: '700', color: '#2d3748' };
const statLabelStyle = { fontSize: '12px', color: '#718096' };

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalStyle = { background: '#fff', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' };
const modalHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const modalTitleStyle = { margin: 0, color: '#2d3748', fontSize: '1.2rem' };
const closeButtonStyle = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' };

const paymentDetailsStyle = { background: '#f7fafc', borderRadius: '8px', padding: '16px', marginBottom: '20px' };
const detailRowStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' };
const detailLabelStyle = { fontWeight: '600', color: '#4a5568' };
const detailValueStyle = { color: '#2d3748' };
const amountValueStyle = { color: '#38a169', fontWeight: '700', fontSize: '18px' };

const paymentFormStyle = { display: 'flex', flexDirection: 'column', gap: '16px' };
const formGroupStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { fontWeight: '600', color: '#2d3748', fontSize: '14px' };
const inputStyle = { padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' };
const selectStyle = { padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', background: '#fff' };
const textareaStyle = { padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', resize: 'vertical' };

const formActionsStyle = { display: 'flex', gap: '12px', justifyContent: 'flex-end' };
const cancelButtonStyle = { background: '#e2e8f0', color: '#4a5568', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' };
const processButtonStyle = { background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' };

const tabsStyle = { display: 'flex', gap: '8px', marginBottom: '24px' };
const tabButtonStyle = { background: '#f7fafc', color: '#4a5568', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.3s' };
const activeTabButtonStyle = { background: 'linear-gradient(135deg, #3182ce 0%, #2c5282 100%)', color: '#fff' };

const contentStyle = { background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const paymentsListStyle = { display: 'flex', flexDirection: 'column' };
const noDataStyle = { textAlign: 'center', padding: '60px 20px' };
const noDataIconStyle = { fontSize: '48px', marginBottom: '16px' };

const paymentCardStyle = { padding: '20px', borderBottom: '1px solid #e2e8f0' };
const paymentHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' };
const paymentInfoStyle = { flex: 1 };
const transactionIdStyle = { fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '4px' };
const customerNameStyle = { fontSize: '14px', color: '#4a5568', marginBottom: '4px' };
const paymentDateStyle = { fontSize: '12px', color: '#718096' };
const paymentAmountStyle = { display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '8px' };
const amountStyle = { fontSize: '20px', fontWeight: '700', color: '#38a169' };
const statusBadgeStyle = { color: '#fff', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' };

const paymentItemsStyle = { fontSize: '14px', color: '#4a5568', marginBottom: '12px' };
const paymentDetailsRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' };
const paymentMethodStyle = { fontSize: '14px', fontWeight: '500', color: '#2d3748' };
const referenceStyle = { fontSize: '12px', color: '#718096' };

const paymentActionsStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const processPaymentButtonStyle = { background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '14px' };
const refundButtonStyle = { background: '#fed7d7', color: '#c53030', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' };

export default PaymentProcessing;