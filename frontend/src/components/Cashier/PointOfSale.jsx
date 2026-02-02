import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const PointOfSale = ({ onStatsUpdate }) => {
  const { user, sessionToken } = useAuth();
  const [cart, setCart] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inventoryLoading, setInventoryLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setInventoryLoading(true);
    try {
      const response = await fetch('http://localhost/pharmacy-system/api/modules/get_inventory.php');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const availableInventory = data.filter(item => item.quantity > 0);
        setInventory(availableInventory);
      } else {
        console.error('Invalid inventory data format:', data);
        setInventory([]);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      alert('Failed to load inventory. Please check your connection and try again.');
      setInventory([]);
    } finally {
      setInventoryLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.generic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.inventory_id === item.inventory_id);
    
    if (existingItem) {
      if (existingItem.quantity < item.quantity) {
        setCart(cart.map(cartItem =>
          cartItem.inventory_id === item.inventory_id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        ));
      } else {
        alert(`Not enough stock available for ${item.name}!\nAvailable: ${item.quantity}, In cart: ${existingItem.quantity}`);
      }
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (inventoryId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(inventoryId);
      return;
    }

    const inventoryItem = inventory.find(item => item.inventory_id === inventoryId);
    if (newQuantity > inventoryItem.quantity) {
      alert(`Not enough stock available for ${inventoryItem.name}!\nAvailable: ${inventoryItem.quantity}, Requested: ${newQuantity}`);
      return;
    }

    setCart(cart.map(item =>
      item.inventory_id === inventoryId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (inventoryId) => {
    setCart(cart.filter(item => item.inventory_id !== inventoryId));
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDiscountAmount = () => {
    return (getSubtotal() * discount) / 100;
  };

  const getTotal = () => {
    return getSubtotal() - getDiscountAmount();
  };

  const processSale = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    setLoading(true);
    try {
      // Use sessionToken from AuthContext instead of localStorage
      const token = sessionToken || localStorage.getItem('session_token');
      
      if (!token) {
        alert('Please log in to process sales');
        setLoading(false);
        return;
      }

      console.log('Processing sale with data:', {
        items: cart.map(item => ({
          inventory_id: item.inventory_id,
          quantity: item.quantity,
          name: item.name
        })),
        customer: customerInfo,
        payment_method: paymentMethod,
        subtotal: getSubtotal(),
        discount: getDiscountAmount(),
        total: getTotal()
      });

      const saleData = {
        items: cart.map(item => ({
          inventory_id: item.inventory_id,
          quantity: item.quantity
        })),
        customer: customerInfo,
        payment_method: paymentMethod,
        subtotal: getSubtotal(),
        discount: getDiscountAmount(),
        total: getTotal()
      };

      console.log('Sending request to process_sale.php...');
      console.log('Using session token:', token ? 'Token present' : 'No token');
      
      // First test with simple endpoint
      console.log('Testing with simple endpoint first...');
      const testResponse = await fetch('http://localhost/pharmacy-system/api/modules/process_sale_simple.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ test: 'data' })
      });
      
      console.log('Test response status:', testResponse.status);
      const testResult = await testResponse.json();
      console.log('Test result:', testResult);
      
      if (!testResponse.ok) {
        throw new Error(`Test endpoint failed - HTTP ${testResponse.status}: ${testResponse.statusText}`);
      }
      
      // Now try the actual endpoint
      const response = await fetch('http://localhost/pharmacy-system/api/modules/process_sale.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(saleData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      if (result.success) {
        alert(`✅ Sale processed successfully!\n\n📋 Transaction Details:\n• Transaction ID: ${result.transaction_id}\n• Total Amount: TSh ${getTotal().toLocaleString()}\n• Payment Method: ${paymentMethod.toUpperCase()}\n• Items Sold: ${cart.length}\n• Cashier: ${user?.full_name || 'Unknown'}\n• Date: ${new Date().toLocaleString()}`);
        
        // Clear the form
        setCart([]);
        setCustomerInfo({ name: '', phone: '', email: '' });
        setDiscount(0);
        
        // Refresh inventory and stats
        await fetchInventory();
        onStatsUpdate?.();
      } else {
        throw new Error(result.message || 'Failed to process sale');
      }
      
    } catch (error) {
      console.error('❌ Error processing sale:', error);
      
      // More detailed error message
      let errorMessage = 'Failed to process sale. ';
      
      if (error.message.includes('HTTP 401')) {
        errorMessage += 'Please log in again (session expired).';
      } else if (error.message.includes('HTTP 500')) {
        errorMessage += 'Server error. Please check if the database is running.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage += 'Cannot connect to server. Please check if XAMPP is running.';
      } else {
        errorMessage += error.message;
      }
      
      alert(`❌ ${errorMessage}\n\n🔧 Troubleshooting:\n• Check browser console for details\n• Ensure XAMPP is running\n• Verify you are logged in\n• Check internet connection`);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear the cart?')) {
      setCart([]);
    }
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={headerLeftStyle}>
          <h2 style={titleStyle}>🛒 Point of Sale</h2>
          <p style={subtitleStyle}>Process customer transactions quickly and efficiently</p>
        </div>
        <div style={headerRightStyle}>
          <div style={cartSummaryStyle}>
            <div style={cartCountStyle}>{cart.length} items</div>
            <div style={cartTotalStyle}>TSh {getTotal().toLocaleString()}</div>
          </div>
          <button 
            onClick={clearCart} 
            style={clearButtonStyle} 
            disabled={cart.length === 0}
          >
            🗑️ Clear Cart
          </button>
        </div>
      </div>

      <div style={mainLayoutStyle}>
        {/* Left Panel - Products */}
        <div style={leftPanelStyle}>
          {/* Search Section */}
          <div style={searchSectionStyle}>
            <div style={searchHeaderStyle}>
              <h3 style={sectionTitleStyle}>🔍 Search Products</h3>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <div style={searchStatsStyle}>
                  {filteredInventory.length} products found
                </div>
                <button
                  onClick={fetchInventory}
                  disabled={inventoryLoading}
                  style={{
                    background: inventoryLoading ? '#e2e8f0' : '#3182ce',
                    color: inventoryLoading ? '#a0aec0' : '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: inventoryLoading ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    transition: 'all 0.3s'
                  }}
                >
                  {inventoryLoading ? '⏳' : '🔄'} Refresh
                </button>
              </div>
            </div>
            <input
              type="text"
              placeholder="Search by name, generic name, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyle}
            />
          </div>

          {/* Products Grid */}
          <div style={productsContainerStyle}>
            <div style={searchHeaderStyle}>
              <h3 style={sectionTitleStyle}>📦 Available Products</h3>
              <div style={searchStatsStyle}>
                {filteredInventory.length} of {inventory.length} products
              </div>
            </div>
            <div style={productsGridStyle}>
              {inventoryLoading ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '200px',
                  gridColumn: '1 / -1',
                  color: '#718096'
                }}>
                  <div style={{textAlign: 'center'}}>
                    <div style={{margin: '0 auto 16px', width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
                    <div>Loading products...</div>
                  </div>
                </div>
              ) : filteredInventory.length === 0 ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '200px',
                  gridColumn: '1 / -1',
                  color: '#718096',
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{fontSize: '48px', marginBottom: '16px', opacity: 0.5}}>📦</div>
                    <div style={{fontSize: '16px', fontWeight: '600', marginBottom: '4px'}}>No products found</div>
                    <div style={{fontSize: '14px'}}>
                      {searchTerm ? 'Try adjusting your search terms' : 'No products available in inventory'}
                    </div>
                  </div>
                </div>
              ) : (
                filteredInventory.map(item => (
                  <div key={item.inventory_id} style={productCardStyle}>
                    <div style={productTopStyle}>
                      <div style={productNameStyle}>{item.name}</div>
                      <div style={productPriceStyle}>TSh {item.price.toLocaleString()}</div>
                    </div>
                    
                    <div style={productMiddleStyle}>
                      <div style={productGenericStyle}>{item.generic_name}</div>
                      <div style={productCategoryBadgeStyle}>{item.category}</div>
                    </div>
                    
                    <div style={productBottomStyle}>
                      <div style={productStockInfoStyle}>
                        <span style={stockLabelStyle}>Stock:</span>
                        <span style={stockValueStyle}>{item.quantity}</span>
                        <span style={batchLabelStyle}>Batch: {item.batch_number}</span>
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        style={item.quantity === 0 ? addToCartDisabledStyle : addToCartButtonStyle}
                        disabled={item.quantity === 0}
                      >
                        {item.quantity === 0 ? '❌ Out of Stock' : '➕ Add to Cart'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Cart & Checkout */}
        <div style={rightPanelStyle}>
          {/* Shopping Cart */}
          <div style={cartSectionStyle}>
            <div style={cartHeaderStyle}>
              <h3 style={sectionTitleStyle}>🛒 Shopping Cart</h3>
              <div style={cartItemCountStyle}>{cart.length} items</div>
            </div>
            
            <div style={cartContentStyle}>
              {cart.length === 0 ? (
                <div style={emptyCartStyle}>
                  <div style={emptyCartIconStyle}>🛒</div>
                  <div style={emptyCartTextStyle}>Your cart is empty</div>
                  <div style={emptyCartSubtextStyle}>Add products to get started</div>
                </div>
              ) : (
                <div style={cartItemsListStyle}>
                  {cart.map(item => (
                    <div key={item.inventory_id} style={cartItemStyle}>
                      <div style={cartItemLeftStyle}>
                        <div style={cartItemNameStyle}>{item.name}</div>
                        <div style={cartItemPriceStyle}>TSh {item.price.toLocaleString()} each</div>
                      </div>
                      
                      <div style={cartItemRightStyle}>
                        <div style={quantityControlsStyle}>
                          <button
                            onClick={() => updateCartQuantity(item.inventory_id, item.quantity - 1)}
                            style={quantityButtonStyle}
                          >
                            −
                          </button>
                          <span style={quantityDisplayStyle}>{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.inventory_id, item.quantity + 1)}
                            style={quantityButtonStyle}
                          >
                            +
                          </button>
                        </div>
                        
                        <div style={itemTotalStyle}>
                          TSh {(item.price * item.quantity).toLocaleString()}
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.inventory_id)}
                          style={removeItemButtonStyle}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div style={customerSectionStyle}>
            <h3 style={sectionTitleStyle}>👤 Customer Information</h3>
            <div style={customerFormStyle}>
              <div style={customerRowStyle}>
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  style={customerInputStyle}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  style={customerInputStyle}
                />
              </div>
              <input
                type="email"
                placeholder="Email Address (Optional)"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                style={customerInputFullStyle}
              />
            </div>
          </div>

          {/* Payment & Checkout */}
          <div style={checkoutSectionStyle}>
            <h3 style={sectionTitleStyle}>💳 Payment & Checkout</h3>
            
            <div style={paymentRowStyle}>
              <div style={paymentMethodGroupStyle}>
                <label style={paymentLabelStyle}>Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={paymentSelectStyle}
                >
                  <option value="cash">💵 Cash</option>
                  <option value="card">💳 Card</option>
                  <option value="mobile">📱 Mobile Money</option>
                  <option value="insurance">🏥 Insurance</option>
                </select>
              </div>
              
              <div style={discountGroupStyle}>
                <label style={discountLabelStyle}>Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={discount}
                  onChange={(e) => setDiscount(Math.min(50, Math.max(0, parseFloat(e.target.value) || 0)))}
                  style={discountInputStyle}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Checkout Footer */}
      <div style={stickyCheckoutFooterStyle}>
        <div style={stickyContentStyle}>
          <div style={quickTotalsStyle}>
            <div style={quickTotalItemStyle}>
              <span style={quickTotalLabelStyle}>Items:</span>
              <span style={quickTotalValueStyle}>{cart.length}</span>
            </div>
            <div style={quickTotalItemStyle}>
              <span style={quickTotalLabelStyle}>Subtotal:</span>
              <span style={quickTotalValueStyle}>TSh {getSubtotal().toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div style={quickTotalItemStyle}>
                <span style={quickTotalLabelStyle}>Discount:</span>
                <span style={quickDiscountStyle}>-TSh {getDiscountAmount().toLocaleString()}</span>
              </div>
            )}
            <div style={quickTotalItemStyle}>
              <span style={quickTotalMainLabelStyle}>TOTAL:</span>
              <span style={quickTotalMainValueStyle}>TSh {getTotal().toLocaleString()}</span>
            </div>
          </div>

          <div style={stickyButtonContainerStyle}>
            {cart.length === 0 && (
              <div style={stickyInstructionsStyle}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                  🛒 Ready to make a sale?
                </div>
                <div>
                  Search for products and click "Add to Cart" to get started!
                </div>
              </div>
            )}

            <button
              onClick={processSale}
              style={cart.length === 0 || loading ? stickyCheckoutButtonDisabledStyle : stickyCheckoutButtonStyle}
              disabled={cart.length === 0 || loading}
            >
              {loading ? '⏳ Processing Sale...' : 
               cart.length === 0 ? '🛒 Add Items to Cart First' : '💰 Process Sale'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  padding: '20px',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  minHeight: '100vh',
  paddingBottom: '120px'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
  padding: '24px 28px',
  background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid #e2e8f0'
};

const headerLeftStyle = { flex: 1 };

const titleStyle = {
  margin: 0,
  fontSize: '24px',
  fontWeight: '700',
  color: '#2d3748',
  marginBottom: '4px'
};

const subtitleStyle = {
  margin: 0,
  fontSize: '14px',
  color: '#718096'
};

const headerRightStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px'
};

const cartSummaryStyle = { textAlign: 'right' };

const cartCountStyle = {
  fontSize: '12px',
  color: '#718096',
  marginBottom: '2px'
};

const cartTotalStyle = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#38a169'
};

const clearButtonStyle = {
  background: '#fed7d7',
  color: '#c53030',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
  transition: 'all 0.3s'
};

const mainLayoutStyle = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gap: '24px',
  height: 'calc(100vh - 140px)',
  minHeight: '600px'
};

const leftPanelStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const rightPanelStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  minWidth: '380px',
  maxWidth: '450px'
};

const searchSectionStyle = {
  background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid #e2e8f0'
};

const searchHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px'
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: '16px',
  fontWeight: '600',
  color: '#2d3748'
};

const searchStatsStyle = {
  fontSize: '12px',
  color: '#718096',
  background: '#f7fafc',
  padding: '4px 8px',
  borderRadius: '12px'
};

const searchInputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '8px',
  border: '2px solid #e2e8f0',
  fontSize: '14px',
  transition: 'border-color 0.3s',
  outline: 'none'
};

const productsContainerStyle = {
  background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid #e2e8f0',
  flex: 1,
  overflow: 'hidden'
};

const productsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px',
  maxHeight: '100%',
  overflowY: 'auto',
  padding: '8px'
};

const productCardStyle = {
  background: '#fff',
  borderRadius: '12px',
  padding: '18px',
  border: '2px solid #e2e8f0',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  height: 'fit-content'
};

const productTopStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '12px'
};

const productNameStyle = {
  fontSize: '15px',
  fontWeight: '600',
  color: '#2d3748',
  flex: 1,
  marginRight: '12px',
  lineHeight: '1.3'
};

const productPriceStyle = {
  fontSize: '16px',
  fontWeight: '700',
  color: '#38a169',
  background: '#c6f6d5',
  padding: '4px 8px',
  borderRadius: '6px',
  minWidth: 'fit-content'
};

const productMiddleStyle = { marginBottom: '12px' };

const productGenericStyle = {
  fontSize: '13px',
  color: '#4a5568',
  marginBottom: '6px'
};

const productCategoryBadgeStyle = {
  fontSize: '11px',
  color: '#3182ce',
  background: '#bee3f8',
  padding: '2px 6px',
  borderRadius: '10px',
  display: 'inline-block'
};

const productBottomStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const productStockInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '12px'
};

const stockLabelStyle = { color: '#718096' };
const stockValueStyle = { fontWeight: '600', color: '#2d3748' };
const batchLabelStyle = { color: '#a0aec0', marginLeft: 'auto' };

const addToCartButtonStyle = {
  width: '100%',
  background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
  color: '#fff',
  border: 'none',
  padding: '10px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '13px',
  transition: 'all 0.3s'
};

const addToCartDisabledStyle = {
  ...addToCartButtonStyle,
  background: '#e2e8f0',
  color: '#a0aec0',
  cursor: 'not-allowed'
};

const cartSectionStyle = {
  background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid #e2e8f0',
  flex: 1
};

const cartHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px'
};

const cartItemCountStyle = {
  fontSize: '12px',
  color: '#718096',
  background: '#f7fafc',
  padding: '4px 8px',
  borderRadius: '12px'
};

const cartContentStyle = {
  height: '250px',
  overflow: 'hidden'
};

const emptyCartStyle = {
  textAlign: 'center',
  padding: '40px 20px',
  color: '#718096'
};

const emptyCartIconStyle = {
  fontSize: '48px',
  marginBottom: '12px',
  opacity: 0.5
};

const emptyCartTextStyle = {
  fontSize: '16px',
  fontWeight: '600',
  marginBottom: '4px'
};

const emptyCartSubtextStyle = { fontSize: '14px' };

const cartItemsListStyle = {
  height: '100%',
  overflowY: 'auto',
  padding: '4px'
};

const cartItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px',
  background: '#f8fafc',
  borderRadius: '8px',
  marginBottom: '8px',
  border: '1px solid #e2e8f0'
};

const cartItemLeftStyle = { flex: 1 };

const cartItemNameStyle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#2d3748',
  marginBottom: '4px'
};

const cartItemPriceStyle = {
  fontSize: '12px',
  color: '#718096'
};

const cartItemRightStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const quantityControlsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: '#fff',
  padding: '4px',
  borderRadius: '6px',
  border: '1px solid #e2e8f0'
};

const quantityButtonStyle = {
  width: '24px',
  height: '24px',
  borderRadius: '4px',
  border: 'none',
  background: '#3182ce',
  color: '#fff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: '600'
};

const quantityDisplayStyle = {
  minWidth: '20px',
  textAlign: 'center',
  fontWeight: '600',
  fontSize: '14px'
};

const itemTotalStyle = {
  fontSize: '14px',
  fontWeight: '700',
  color: '#38a169',
  minWidth: '80px',
  textAlign: 'right'
};

const removeItemButtonStyle = {
  width: '24px',
  height: '24px',
  borderRadius: '4px',
  border: 'none',
  background: '#e53e3e',
  color: '#fff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px'
};

const customerSectionStyle = {
  background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid #e2e8f0'
};

const customerFormStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const customerRowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px'
};

const customerInputStyle = {
  padding: '10px 12px',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.3s'
};

const customerInputFullStyle = {
  ...customerInputStyle,
  width: '100%'
};

const checkoutSectionStyle = {
  background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid #e2e8f0'
};

const paymentRowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 100px',
  gap: '12px',
  marginBottom: '16px'
};

const paymentMethodGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const paymentLabelStyle = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#4a5568'
};

const paymentSelectStyle = {
  padding: '8px 10px',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  fontSize: '13px',
  background: '#fff',
  outline: 'none'
};

const discountGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const discountLabelStyle = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#4a5568'
};

const discountInputStyle = {
  padding: '8px 10px',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  fontSize: '13px',
  outline: 'none',
  textAlign: 'center'
};

// Sticky Footer Styles
const stickyCheckoutFooterStyle = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
  borderTop: '3px solid #3182ce',
  boxShadow: '0 -8px 32px rgba(0,0,0,0.15)',
  zIndex: 1000,
  padding: '16px 20px'
};

const stickyContentStyle = {
  maxWidth: '1400px',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '24px',
  flexWrap: 'wrap'
};

const quickTotalsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
  flex: 1,
  flexWrap: 'wrap',
  minWidth: '300px'
};

const quickTotalItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2px'
};

const quickTotalLabelStyle = {
  fontSize: '12px',
  color: '#718096',
  fontWeight: '500'
};

const quickTotalValueStyle = {
  fontSize: '16px',
  fontWeight: '700',
  color: '#2d3748'
};

const quickDiscountStyle = {
  fontSize: '16px',
  fontWeight: '700',
  color: '#e53e3e'
};

const quickTotalMainLabelStyle = {
  fontSize: '14px',
  color: '#2d3748',
  fontWeight: '700'
};

const quickTotalMainValueStyle = {
  fontSize: '24px',
  fontWeight: '900',
  color: '#38a169',
  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
};

const stickyButtonContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
  minWidth: '300px'
};

const stickyInstructionsStyle = {
  background: '#fef5e7',
  border: '1px solid #f6ad55',
  borderRadius: '8px',
  padding: '8px 12px',
  textAlign: 'center',
  color: '#c05621',
  fontSize: '12px',
  width: '100%'
};

const stickyCheckoutButtonStyle = {
  width: '100%',
  background: 'linear-gradient(135deg, #3182ce 0%, #2c5282 100%)',
  color: '#fff',
  border: 'none',
  padding: '16px 24px',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '18px',
  transition: 'all 0.3s',
  boxShadow: '0 8px 25px rgba(49, 130, 206, 0.3)',
  minHeight: '60px'
};

const stickyCheckoutButtonDisabledStyle = {
  ...stickyCheckoutButtonStyle,
  background: 'linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)',
  color: '#4a5568',
  cursor: 'not-allowed',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
};

export default PointOfSale;