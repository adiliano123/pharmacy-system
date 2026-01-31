import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const PointOfSale = ({ onStatsUpdate }) => {
  const { user } = useAuth();
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
        // Filter out items with zero or negative quantity
        const availableInventory = data.filter(item => item.quantity > 0);
        setInventory(availableInventory);
      } else {
        console.error('Invalid inventory data format:', data);
        setInventory([]);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      // Show user-friendly error message
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
      // Get session token from localStorage
      const sessionToken = localStorage.getItem('sessionToken');
      
      if (!sessionToken) {
        alert('Please log in to process sales');
        return;
      }

      // Prepare sale data
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

      const response = await fetch('http://localhost/pharmacy-system/api/modules/process_sale.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify(saleData)
      });

      const result = await response.json();

      if (result.success) {
        alert(`Sale processed successfully!\nTransaction ID: ${result.transaction_id}\nTotal: TSh ${getTotal().toLocaleString()}\nPayment: ${paymentMethod.toUpperCase()}\nCashier: ${user?.full_name || 'Unknown'}`);
        
        // Clear cart and customer info
        setCart([]);
        setCustomerInfo({ name: '', phone: '', email: '' });
        setDiscount(0);
        
        // Refresh inventory to show updated quantities
        await fetchInventory();
        
        // Update stats
        onStatsUpdate?.();
      } else {
        throw new Error(result.message || 'Failed to process sale');
      }
      
    } catch (error) {
      console.error('Error processing sale:', error);
      alert(`Error processing sale: ${error.message}`);
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
          <button onClick={clearCart} 
                  className="pos-clear-btn"
                  style={clearButtonStyle} 
                  disabled={cart.length === 0}
                  onMouseEnter={(e) => {
                    if (cart.length > 0) {
                      e.target.style.background = '#e53e3e';
                      e.target.style.color = '#fff';
                      e.target.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (cart.length > 0) {
                      e.target.style.background = '#fed7d7';
                      e.target.style.color = '#c53030';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
          >
            🗑️ Clear Cart
          </button>
        </div>
      </div>

      <div style={getResponsiveMainLayout()}>
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
              className="pos-search-input"
              style={searchInputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = '#38a169';
                e.target.style.boxShadow = '0 0 0 3px rgba(56, 161, 105, 0.1)';
                e.target.style.background = '#fff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
                e.target.style.background = '#fff';
              }}
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
            <div className="pos-products-grid" style={productsGridStyle}>
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
                    <div className="spinner" style={{margin: '0 auto 16px'}}></div>
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
                <div 
                  key={item.inventory_id} 
                  className="pos-product-card" 
                  style={productCardStyle}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-4px)';
                    e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
                    e.target.style.borderColor = '#38a169';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    e.target.style.borderColor = '#e2e8f0';
                  }}
                >
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
                      className={item.quantity === 0 ? '' : 'pos-add-to-cart-btn'}
                      style={item.quantity === 0 ? addToCartDisabledStyle : addToCartButtonStyle}
                      disabled={item.quantity === 0}
                      onMouseEnter={(e) => {
                        if (item.quantity > 0) {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 8px 25px rgba(56, 161, 105, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (item.quantity > 0) {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {item.quantity === 0 ? '❌ Out of Stock' : '➕ Add to Cart'}
                    </button>
                  </div>
                </div>
              )))}
            </div>
          </div>
        </div>

        {/* Right Panel - Cart & Checkout */}
        <div style={getResponsiveRightPanel()}>
          {/* Shopping Cart */}
          <div style={cartSectionStyle}>
            <div style={cartHeaderStyle}>
              <h3 style={sectionTitleStyle}>🛒 Shopping Cart</h3>
              <div style={cartItemCountStyle}>{cart.length} items</div>
            </div>
            
                <div style={cartContentStyle}>
              {cart.length === 0 ? (
                <div style={emptyCartStyle}>
                  <div className="pos-empty-cart-icon" style={emptyCartIconStyle}>🛒</div>
                  <div style={emptyCartTextStyle}>Your cart is empty</div>
                  <div style={emptyCartSubtextStyle}>Add products to get started</div>
                </div>
              ) : (
                <div className="pos-cart-items" style={cartItemsListStyle}>
                  {cart.map(item => (
                    <div 
                      key={item.inventory_id} 
                      className="pos-cart-item"
                      style={cartItemStyle}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#fff';
                        e.target.style.transform = 'translateX(4px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#f8fafc';
                        e.target.style.transform = 'translateX(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <div style={cartItemLeftStyle}>
                        <div style={cartItemNameStyle}>{item.name}</div>
                        <div style={cartItemPriceStyle}>TSh {item.price.toLocaleString()} each</div>
                      </div>
                      
                      <div style={cartItemRightStyle}>
                        <div style={quantityControlsStyle}>
                          <button
                            onClick={() => updateCartQuantity(item.inventory_id, item.quantity - 1)}
                            className="pos-quantity-btn"
                            style={quantityButtonStyle}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'scale(1.1)';
                              e.target.style.boxShadow = '0 4px 12px rgba(49, 130, 206, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'scale(1)';
                              e.target.style.boxShadow = 'none';
                            }}
                          >
                            −
                          </button>
                          <span style={quantityDisplayStyle}>{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.inventory_id, item.quantity + 1)}
                            className="pos-quantity-btn"
                            style={quantityButtonStyle}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'scale(1.1)';
                              e.target.style.boxShadow = '0 4px 12px rgba(49, 130, 206, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'scale(1)';
                              e.target.style.boxShadow = 'none';
                            }}
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="pos-total-amount" style={itemTotalStyle}>
                          TSh {(item.price * item.quantity).toLocaleString()}
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.inventory_id)}
                          className="pos-remove-btn"
                          style={removeItemButtonStyle}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.1)';
                            e.target.style.boxShadow = '0 4px 12px rgba(229, 62, 62, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = 'none';
                          }}
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
                  className="pos-customer-input"
                  style={customerInputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3182ce';
                    e.target.style.boxShadow = '0 0 0 3px rgba(49, 130, 206, 0.1)';
                    e.target.style.background = '#fff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#fff';
                  }}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  className="pos-customer-input"
                  style={customerInputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3182ce';
                    e.target.style.boxShadow = '0 0 0 3px rgba(49, 130, 206, 0.1)';
                    e.target.style.background = '#fff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#fff';
                  }}
                />
              </div>
              <input
                type="email"
                placeholder="Email Address (Optional)"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                className="pos-customer-input"
                style={customerInputFullStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3182ce';
                  e.target.style.boxShadow = '0 0 0 3px rgba(49, 130, 206, 0.1)';
                  e.target.style.background = '#fff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = '#fff';
                }}
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
                  className="pos-payment-select"
                  style={paymentSelectStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3182ce';
                    e.target.style.boxShadow = '0 0 0 3px rgba(49, 130, 206, 0.1)';
                    e.target.style.background = '#fff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#fff';
                  }}
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
                  className="pos-discount-input"
                  style={discountInputStyle}
                  placeholder="0"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#d69e2e';
                    e.target.style.boxShadow = '0 0 0 3px rgba(214, 158, 46, 0.1)';
                    e.target.style.background = '#fff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#fff';
                  }}
                />
              </div>
            </div>

            {/* Totals */}
            <div style={totalsContainerStyle}>
              <div style={totalRowStyle}>
                <span>Subtotal:</span>
                <span>TSh {getSubtotal().toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div style={totalRowStyle}>
                  <span>Discount ({discount}%):</span>
                  <span style={discountAmountStyle}>-TSh {getDiscountAmount().toLocaleString()}</span>
                </div>
              )}
              <div style={finalTotalRowStyle}>
                <span>Total Amount:</span>
                <span className="pos-total-amount">TSh {getTotal().toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={processSale}
              className={cart.length === 0 || loading ? '' : 'pos-checkout-btn'}
              style={cart.length === 0 || loading ? checkoutButtonDisabledStyle : checkoutButtonStyle}
              disabled={cart.length === 0 || loading}
              onMouseEnter={(e) => {
                if (cart.length > 0 && !loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 40px rgba(49, 130, 206, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (cart.length > 0 && !loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {loading ? '⏳ Processing Sale...' : '💰 Process Sale'}
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
  minHeight: '100vh'
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

const headerLeftStyle = {
  flex: 1
};

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

const cartSummaryStyle = {
  textAlign: 'right'
};

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

// Search Section
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

// Products Section
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

const productMiddleStyle = {
  marginBottom: '12px'
};

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

const stockLabelStyle = {
  color: '#718096'
};

const stockValueStyle = {
  fontWeight: '600',
  color: '#2d3748'
};

const batchLabelStyle = {
  color: '#a0aec0',
  marginLeft: 'auto'
};

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

// Cart Section
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

const emptyCartSubtextStyle = {
  fontSize: '14px'
};

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

const cartItemLeftStyle = {
  flex: 1
};

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

// Customer Section
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

// Checkout Section
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

const totalsContainerStyle = {
  background: '#f8fafc',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '16px',
  border: '1px solid #e2e8f0'
};

const totalRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px',
  fontSize: '14px',
  color: '#4a5568'
};

const discountAmountStyle = {
  color: '#e53e3e',
  fontWeight: '600'
};

const finalTotalRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '18px',
  fontWeight: '700',
  color: '#2d3748',
  borderTop: '1px solid #e2e8f0',
  paddingTop: '8px',
  marginTop: '8px'
};

const checkoutButtonStyle = {
  width: '100%',
  background: 'linear-gradient(135deg, #3182ce 0%, #2c5282 100%)',
  color: '#fff',
  border: 'none',
  padding: '14px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '16px',
  transition: 'all 0.3s'
};

const checkoutButtonDisabledStyle = {
  ...checkoutButtonStyle,
  background: '#e2e8f0',
  color: '#a0aec0',
  cursor: 'not-allowed'
};

// Responsive styles for smaller screens
const getResponsiveMainLayout = () => {
  if (window.innerWidth < 1200) {
    return {
      ...mainLayoutStyle,
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'auto auto',
      height: 'auto'
    };
  }
  return mainLayoutStyle;
};

const getResponsiveRightPanel = () => {
  if (window.innerWidth < 1200) {
    return {
      ...rightPanelStyle,
      minWidth: 'auto',
      maxWidth: 'none'
    };
  }
  return rightPanelStyle;
};

export default PointOfSale;