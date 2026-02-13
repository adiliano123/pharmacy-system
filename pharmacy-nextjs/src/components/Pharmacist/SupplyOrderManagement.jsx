'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const SupplyOrderManagement = ({ onStatsUpdate }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [formData, setFormData] = useState({
    supplier_name: '',
    supplier_contact: '',
    order_date: new Date().toISOString().split('T')[0],
    expected_delivery: '',
    notes: '',
    items: [{ medicine_name: '', generic_name: '', quantity_ordered: '', unit_cost: '' }]
  });

  useEffect(() => {
    fetchOrders();
    fetchLowStockItems();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/modules/supply_orders.php');
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStockItems = async () => {
    try {
      const response = await fetch('/api/modules/supply_orders.php?action=low_stock');
      const data = await response.json();
      if (data.success) {
        setLowStockItems(data.data);
      }
    } catch (error) {
      console.error('Error fetching low stock items:', error);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`/api/modules/supply_orders.php?action=details&id=${orderId}`);
      const data = await response.json();
      if (data.success) {
        setSelectedOrder(data.data);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const createOrder = async (e) => {
    e.preventDefault();
    
    try {
      const orderData = {
        ...formData,
        ordered_by: user.user_id,
        total_amount: formData.items.reduce((sum, item) => 
          sum + (parseFloat(item.quantity_ordered || 0) * parseFloat(item.unit_cost || 0)), 0
        )
      };

      const response = await fetch('/api/modules/supply_orders.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', ...orderData })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Order created successfully! Order Number: ${data.order_number}`);
        setShowNewOrderForm(false);
        resetForm();
        fetchOrders();
        onStatsUpdate?.();
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order');
    }
  };

  const updateOrderStatus = async (orderId, status, notes = '') => {
    try {
      const response = await fetch('/api/modules/supply_orders.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_status',
          order_id: orderId,
          status: status,
          notes: notes
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Order status updated successfully!');
        fetchOrders();
        if (selectedOrder?.order_id === orderId) {
          fetchOrderDetails(orderId);
        }
        onStatsUpdate?.();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const receiveOrder = async (orderId, receivedItems) => {
    try {
      const response = await fetch('/api/modules/supply_orders.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'receive',
          order_id: orderId,
          received_by: user.user_id,
          items: receivedItems
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Order received and inventory updated!');
        fetchOrders();
        fetchOrderDetails(orderId);
        onStatsUpdate?.();
      }
    } catch (error) {
      console.error('Error receiving order:', error);
      alert('Error receiving order');
    }
  };

  const resetForm = () => {
    setFormData({
      supplier_name: '',
      supplier_contact: '',
      order_date: new Date().toISOString().split('T')[0],
      expected_delivery: '',
      notes: '',
      items: [{ medicine_name: '', generic_name: '', quantity_ordered: '', unit_cost: '' }]
    });
  };

  const addOrderItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { medicine_name: '', generic_name: '', quantity_ordered: '', unit_cost: '' }]
    });
  };

  const removeOrderItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateOrderItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ecc94b';
      case 'ordered': return '#3182ce';
      case 'received': return '#48bb78';
      case 'cancelled': return '#e53e3e';
      default: return '#718096';
    }
  };

  const getStockLevelColor = (level) => {
    switch (level) {
      case 'out_of_stock': return '#e53e3e';
      case 'low_stock': return '#ed8936';
      case 'moderate_stock': return '#ecc94b';
      default: return '#48bb78';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'pending') return ['pending', 'ordered'].includes(order.status);
    if (activeTab === 'received') return order.status === 'received';
    return true;
  });

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>📦 Supply Order Management</h2>
        <button
          onClick={() => setShowNewOrderForm(true)}
          style={addButtonStyle}
        >
          ➕ New Order
        </button>
      </div>

      {/* New Order Form Modal */}
      {showNewOrderForm && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={modalTitleStyle}>Create New Supply Order</h3>
              <button
                onClick={() => setShowNewOrderForm(false)}
                style={closeButtonStyle}
              >
                ❌
              </button>
            </div>

            <form onSubmit={createOrder} style={formStyle}>
              <div style={formGridStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Supplier Name *</label>
                  <input
                    type="text"
                    value={formData.supplier_name}
                    onChange={(e) => setFormData({...formData, supplier_name: e.target.value})}
                    style={inputStyle}
                    required
                  />
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Supplier Contact</label>
                  <input
                    type="text"
                    value={formData.supplier_contact}
                    onChange={(e) => setFormData({...formData, supplier_contact: e.target.value})}
                    style={inputStyle}
                    placeholder="Phone or email"
                  />
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Order Date *</label>
                  <input
                    type="date"
                    value={formData.order_date}
                    onChange={(e) => setFormData({...formData, order_date: e.target.value})}
                    style={inputStyle}
                    required
                  />
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Expected Delivery</label>
                  <input
                    type="date"
                    value={formData.expected_delivery}
                    onChange={(e) => setFormData({...formData, expected_delivery: e.target.value})}
                    style={inputStyle}
                    min={formData.order_date}
                  />
                </div>
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Order Items *</label>
                {formData.items.map((item, index) => (
                  <div key={index} style={itemRowStyle}>
                    <input
                      type="text"
                      value={item.medicine_name}
                      onChange={(e) => updateOrderItem(index, 'medicine_name', e.target.value)}
                      placeholder="Medicine name"
                      style={itemInputStyle}
                      required
                    />
                    <input
                      type="text"
                      value={item.generic_name}
                      onChange={(e) => updateOrderItem(index, 'generic_name', e.target.value)}
                      placeholder="Generic name"
                      style={itemInputStyle}
                    />
                    <input
                      type="number"
                      value={item.quantity_ordered}
                      onChange={(e) => updateOrderItem(index, 'quantity_ordered', e.target.value)}
                      placeholder="Quantity"
                      style={itemInputStyle}
                      min="1"
                      required
                    />
                    <input
                      type="number"
                      value={item.unit_cost}
                      onChange={(e) => updateOrderItem(index, 'unit_cost', e.target.value)}
                      placeholder="Unit cost"
                      style={itemInputStyle}
                      step="0.01"
                      min="0"
                      required
                    />
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOrderItem(index)}
                        style={removeItemButtonStyle}
                      >
                        ❌
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOrderItem}
                  style={addItemButtonStyle}
                >
                  ➕ Add Item
                </button>
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes or special instructions..."
                  style={textareaStyle}
                  rows={3}
                />
              </div>

              <div style={totalStyle}>
                <strong>Total Amount: TSh {formData.items.reduce((sum, item) => 
                  sum + (parseFloat(item.quantity_ordered || 0) * parseFloat(item.unit_cost || 0)), 0
                ).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
              </div>

              <div style={formActionsStyle}>
                <button
                  type="button"
                  onClick={() => setShowNewOrderForm(false)}
                  style={cancelButtonStyle}
                >
                  Cancel
                </button>
                <button type="submit" style={submitButtonStyle}>
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={contentGridStyle}>
        {/* Orders List */}
        <div style={ordersContainerStyle}>
          <div style={tabsContainerStyle}>
            <button
              onClick={() => setActiveTab('pending')}
              style={{
                ...tabButtonStyle,
                ...(activeTab === 'pending' ? activeTabButtonStyle : {})
              }}
            >
              Pending Orders
            </button>
            <button
              onClick={() => setActiveTab('received')}
              style={{
                ...tabButtonStyle,
                ...(activeTab === 'received' ? activeTabButtonStyle : {})
              }}
            >
              Received Orders
            </button>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                ...tabButtonStyle,
                ...(activeTab === 'all' ? activeTabButtonStyle : {})
              }}
            >
              All Orders
            </button>
          </div>

          <div style={ordersListStyle}>
            {loading ? (
              <div style={loadingStyle}>Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div style={emptyStateStyle}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                <p>No orders found</p>
              </div>
            ) : (
              filteredOrders.map(order => (
                <div
                  key={order.order_id}
                  onClick={() => fetchOrderDetails(order.order_id)}
                  style={{
                    ...orderCardStyle,
                    ...(selectedOrder?.order_id === order.order_id ? selectedCardStyle : {})
                  }}
                >
                  <div style={orderHeaderStyle}>
                    <div>
                      <div style={orderNumberStyle}>{order.order_number}</div>
                      <div style={supplierNameStyle}>{order.supplier_name}</div>
                    </div>
                    <div
                      style={{
                        ...statusBadgeStyle,
                        backgroundColor: getStatusColor(order.status)
                      }}
                    >
                      {order.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <div style={orderDetailsStyle}>
                    <div>📅 Order: {new Date(order.order_date).toLocaleDateString()}</div>
                    {order.expected_delivery && (
                      <div>🚚 Expected: {new Date(order.expected_delivery).toLocaleDateString()}</div>
                    )}
                    <div>📦 Items: {order.item_count}</div>
                    <div>💰 Total: TSh {parseFloat(order.total_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order Details / Low Stock Items */}
        <div style={detailsContainerStyle}>
          {selectedOrder ? (
            <div>
              <div style={detailsHeaderStyle}>
                <h3 style={sectionTitleStyle}>Order Details</h3>
                <div
                  style={{
                    ...statusBadgeStyle,
                    backgroundColor: getStatusColor(selectedOrder.status)
                  }}
                >
                  {selectedOrder.status.toUpperCase()}
                </div>
              </div>

              <div style={orderInfoStyle}>
                <div><strong>Order Number:</strong> {selectedOrder.order_number}</div>
                <div><strong>Supplier:</strong> {selectedOrder.supplier_name}</div>
                {selectedOrder.supplier_contact && (
                  <div><strong>Contact:</strong> {selectedOrder.supplier_contact}</div>
                )}
                <div><strong>Order Date:</strong> {new Date(selectedOrder.order_date).toLocaleDateString()}</div>
                {selectedOrder.expected_delivery && (
                  <div><strong>Expected Delivery:</strong> {new Date(selectedOrder.expected_delivery).toLocaleDateString()}</div>
                )}
                <div><strong>Ordered by:</strong> {selectedOrder.ordered_by_name}</div>
                {selectedOrder.received_by_name && (
                  <div><strong>Received by:</strong> {selectedOrder.received_by_name}</div>
                )}
              </div>

              <div style={itemsListStyle}>
                <h4 style={subsectionTitleStyle}>Order Items</h4>
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} style={itemCardStyle}>
                    <div style={itemHeaderStyle}>
                      <div>
                        <div style={itemNameStyle}>{item.medicine_name}</div>
                        {item.generic_name && (
                          <div style={itemGenericStyle}>({item.generic_name})</div>
                        )}
                      </div>
                      <div style={itemQuantityStyle}>
                        {item.quantity_received || 0} / {item.quantity_ordered}
                      </div>
                    </div>
                    <div style={itemDetailsStyle}>
                      <div>Unit Cost: TSh {parseFloat(item.unit_cost || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                      <div>Total: TSh {parseFloat(item.total_cost || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                      {item.batch_number && <div>Batch: {item.batch_number}</div>}
                      {item.expiry_date && <div>Expiry: {new Date(item.expiry_date).toLocaleDateString()}</div>}
                    </div>
                  </div>
                ))}
              </div>

              {selectedOrder.notes && (
                <div style={notesStyle}>
                  <strong>Notes:</strong> {selectedOrder.notes}
                </div>
              )}

              <div style={actionButtonsStyle}>
                {selectedOrder.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.order_id, 'ordered')}
                      style={orderButtonStyle}
                    >
                      📋 Mark as Ordered
                    </button>
                    <button
                      onClick={() => {
                        const notes = prompt('Reason for cancellation:');
                        if (notes) updateOrderStatus(selectedOrder.order_id, 'cancelled', notes);
                      }}
                      style={cancelOrderButtonStyle}
                    >
                      ❌ Cancel Order
                    </button>
                  </>
                )}
                {selectedOrder.status === 'ordered' && (
                  <button
                    onClick={() => {
                      // Simplified receive - in real app, would show detailed receive form
                      const receivedItems = selectedOrder.items.map(item => ({
                        ...item,
                        quantity_received: item.quantity_ordered,
                        batch_number: `BATCH-${Date.now()}`,
                        expiry_date: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                      }));
                      receiveOrder(selectedOrder.order_id, receivedItems);
                    }}
                    style={receiveButtonStyle}
                  >
                    ✅ Mark as Received
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h3 style={sectionTitleStyle}>🚨 Low Stock Items ({lowStockItems.length})</h3>
              <p style={{ fontSize: '14px', color: '#718096', marginBottom: '16px' }}>
                Items that need to be reordered
              </p>
              
              {lowStockItems.length === 0 ? (
                <div style={emptyStateStyle}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                  <p>All items are well stocked</p>
                </div>
              ) : (
                <div style={lowStockListStyle}>
                  {lowStockItems.map((item, index) => (
                    <div key={index} style={lowStockCardStyle}>
                      <div style={lowStockHeaderStyle}>
                        <div>
                          <div style={lowStockNameStyle}>{item.name}</div>
                          {item.generic_name && (
                            <div style={lowStockGenericStyle}>({item.generic_name})</div>
                          )}
                        </div>
                        <div
                          style={{
                            ...stockLevelBadgeStyle,
                            backgroundColor: getStockLevelColor(item.stock_level)
                          }}
                        >
                          {item.quantity} left
                        </div>
                      </div>
                      <div style={lowStockDetailsStyle}>
                        <div>Current Price: TSh {parseFloat(item.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                        <div style={{ color: getStockLevelColor(item.stock_level), fontWeight: '600' }}>
                          {item.stock_level.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Styles (truncated for brevity - includes all the necessary styles)
const containerStyle = { height: '100%' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' };
const titleStyle = { margin: 0, color: '#2d3748', fontSize: '1.5rem' };
const addButtonStyle = { background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' };

// Modal styles
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalStyle = { background: '#fff', borderRadius: '12px', padding: '24px', maxWidth: '900px', width: '90%', maxHeight: '90vh', overflow: 'auto' };
const modalHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' };
const modalTitleStyle = { margin: 0, color: '#2d3748', fontSize: '1.2rem' };
const closeButtonStyle = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' };

// Form styles
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const formGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };
const formGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontWeight: '600', color: '#2d3748', fontSize: '14px' };
const inputStyle = { padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' };
const textareaStyle = { padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' };

// Item row styles
const itemRowStyle = { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' };
const itemInputStyle = { flex: 1, padding: '8px 10px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '14px' };
const removeItemButtonStyle = { background: '#fed7d7', color: '#c53030', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' };
const addItemButtonStyle = { background: '#e2e8f0', color: '#4a5568', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', alignSelf: 'flex-start' };

const totalStyle = { background: '#f7fafc', padding: '12px', borderRadius: '6px', textAlign: 'right', fontSize: '16px' };
const formActionsStyle = { display: 'flex', gap: '12px', justifyContent: 'flex-end' };
const cancelButtonStyle = { background: '#e2e8f0', color: '#4a5568', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' };
const submitButtonStyle = { background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' };

// Content styles
const contentGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', height: 'calc(100vh - 400px)' };
const ordersContainerStyle = { background: '#f7fafc', borderRadius: '12px', padding: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column' };
const detailsContainerStyle = { background: '#f7fafc', borderRadius: '12px', padding: '20px', overflow: 'auto' };

// Tab styles
const tabsContainerStyle = { display: 'flex', gap: '8px', marginBottom: '16px' };
const tabButtonStyle = { background: '#fff', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' };
const activeTabButtonStyle = { background: '#3182ce', color: '#fff', borderColor: '#3182ce' };

// List styles
const ordersListStyle = { flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' };
const orderCardStyle = { background: '#fff', borderRadius: '8px', padding: '16px', cursor: 'pointer', transition: 'all 0.2s', border: '2px solid transparent' };
const selectedCardStyle = { borderColor: '#3182ce', boxShadow: '0 4px 12px rgba(49, 130, 206, 0.2)' };

const orderHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' };
const orderNumberStyle = { fontWeight: '600', color: '#3182ce', fontSize: '14px' };
const supplierNameStyle = { fontWeight: '600', color: '#2d3748', fontSize: '16px' };
const statusBadgeStyle = { color: '#fff', padding: '4px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: '600' };
const orderDetailsStyle = { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#718096' };

// Details styles
const detailsHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const sectionTitleStyle = { margin: 0, color: '#2d3748', fontSize: '1.1rem' };
const orderInfoStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px', color: '#2d3748', marginBottom: '20px' };

const itemsListStyle = { marginBottom: '20px' };
const subsectionTitleStyle = { margin: '0 0 12px 0', color: '#4a5568', fontSize: '14px', fontWeight: '600' };
const itemCardStyle = { background: '#fff', borderRadius: '6px', padding: '12px', marginBottom: '8px', border: '1px solid #e2e8f0' };
const itemHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' };
const itemNameStyle = { fontWeight: '600', color: '#2d3748', fontSize: '14px' };
const itemGenericStyle = { color: '#718096', fontSize: '12px', fontStyle: 'italic' };
const itemQuantityStyle = { background: '#bee3f8', color: '#2b6cb0', padding: '2px 6px', borderRadius: '10px', fontSize: '11px', fontWeight: '600' };
const itemDetailsStyle = { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#4a5568' };

const notesStyle = { background: '#f7fafc', padding: '12px', borderRadius: '6px', fontSize: '14px', color: '#4a5568', marginBottom: '20px' };

const actionButtonsStyle = { display: 'flex', gap: '8px', flexWrap: 'wrap' };
const orderButtonStyle = { background: 'linear-gradient(135deg, #3182ce 0%, #2c5aa0 100%)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' };
const cancelOrderButtonStyle = { background: '#fed7d7', color: '#c53030', border: '1px solid #feb2b2', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' };
const receiveButtonStyle = { background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' };

// Low stock styles
const lowStockListStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const lowStockCardStyle = { background: '#fff', borderRadius: '6px', padding: '12px', border: '1px solid #e2e8f0' };
const lowStockHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' };
const lowStockNameStyle = { fontWeight: '600', color: '#2d3748', fontSize: '14px' };
const lowStockGenericStyle = { color: '#718096', fontSize: '12px', fontStyle: 'italic' };
const stockLevelBadgeStyle = { color: '#fff', padding: '2px 6px', borderRadius: '10px', fontSize: '11px', fontWeight: '600' };
const lowStockDetailsStyle = { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#4a5568' };

const loadingStyle = { textAlign: 'center', padding: '40px', color: '#718096' };
const emptyStateStyle = { textAlign: 'center', padding: '40px', color: '#718096' };

export default SupplyOrderManagement;
