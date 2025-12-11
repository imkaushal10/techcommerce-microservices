import React, { useState, useEffect } from 'react';
import './App.css';
import { ShoppingCart, Plus, Search, TrendingUp, Package, Clock, CheckCircle, XCircle } from 'lucide-react';

function App() {
  // State management
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [showCart, setShowCart] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5003/api/products');
      const data = await response.json();
      setProducts(data.products || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5004/api/orders');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  /**
   * Adds product to cart or increments quantity if already exists
   * Maintains cart immutability by creating new arrays/objects
   */
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      // Increment quantity for existing item
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Add new item with quantity 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  /**
   * Updates item quantity in cart
   * Automatically removes items when quantity reaches 0
   */
  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0)); // Remove items with 0 quantity
  };

  // Calculate total cart price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  /**
   * Returns appropriate status icon based on order status
   * Handles multiple status variations (completed/delivered, pending/processing, etc.)
   */
  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return <CheckCircle size={18} className="status-icon completed" />;
      case 'pending':
      case 'processing':
        return <Clock size={18} className="status-icon pending" />;
      case 'cancelled':
        return <XCircle size={18} className="status-icon cancelled" />;
      default:
        return <Package size={18} className="status-icon" />;
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading your shopping experience...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {/* ===== HEADER SECTION ===== */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Package size={32} />
            <h1>ShopHub</h1>
          </div>
          
          {/* Tab navigation between Products and Orders views */}
          <nav className="nav-tabs">
            <button 
              className={`nav-tab ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <TrendingUp size={20} />
              Products
            </button>
            <button 
              className={`nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <Package size={20} />
              Orders
            </button>
          </nav>

          {/* Cart button with dynamic badge showing item count */}
          <button className="cart-button" onClick={() => setShowCart(!showCart)}>
            <ShoppingCart size={24} />
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </button>
        </div>
      </header>

      {/* ===== CART SIDEBAR ===== */}
      {/* Slides in from right when showCart is true */}
      <div className={`cart-sidebar ${showCart ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="close-cart" onClick={() => setShowCart(false)}>×</button>
        </div>
        
        {/* Show empty state or cart items based on cart contents */}
        {cart.length === 0 ? (
          <div className="empty-cart">
            <ShoppingCart size={48} />
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p className="cart-item-price">${item.price}</p>
                  </div>
                  {/* Quantity controls: decrease, display, increase, remove */}
                  <div className="cart-item-controls">
                    <button onClick={() => updateQuantity(item.id, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                    <button 
                      className="remove-btn" 
                      onClick={() => removeFromCart(item.id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span className="total-price">${getTotalPrice()}</span>
              </div>
              <button className="checkout-btn">Checkout</button>
            </div>
          </>
        )}
      </div>

      {/* Dark overlay behind cart - clicking closes the cart */}
      {showCart && <div className="overlay" onClick={() => setShowCart(false)}></div>}

      {/* ===== MAIN CONTENT AREA ===== */}
      {/* Conditionally render Products or Orders based on active tab */}
      <main className="main-content">
        {activeTab === 'products' ? (
          <div className="products-section">
            <div className="section-header">
              <h2>Featured Products</h2>
              <div className="search-bar">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="products-grid">
              {filteredProducts.length === 0 ? (
                <div className="empty-state">
                  <p>No products found</p>
                </div>
              ) : (
                filteredProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="product-card"
                    style={{ animationDelay: `${index * 0.1}s` }} // Staggered animation
                  >
                    <div className="product-image">
                      <div className="product-placeholder">
                        <Package size={40} />
                      </div>
                      {/* Conditional stock badges - only show when relevant */}
                      {product.stock < 10 && product.stock > 0 && (
                        <span className="badge low-stock">Low Stock</span>
                      )}
                      {product.stock === 0 && (
                        <span className="badge out-of-stock">Out of Stock</span>
                      )}
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <div className="product-meta">
                        <span className="price">${product.price}</span>
                        <span className="stock">{product.stock} in stock</span>
                      </div>
                      {/* Disable add to cart button when out of stock */}
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                      >
                        <Plus size={18} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          // Orders tab view
          <div className="orders-section">
            <div className="section-header">
              <h2>Order History</h2>
              {/* Quick stats showing order counts */}
              <div className="stats">
                <div className="stat-card">
                  <span className="stat-value">{orders.length}</span>
                  <span className="stat-label">Total Orders</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">
                    {orders.filter(o => o.status?.toLowerCase() === 'completed').length}
                  </span>
                  <span className="stat-label">Completed</span>
                </div>
              </div>
            </div>

            <div className="orders-list">
              {orders.length === 0 ? (
                <div className="empty-state">
                  <Package size={48} />
                  <p>No orders yet</p>
                </div>
              ) : (
                orders.map((order, index) => (
                  <div 
                    key={order.id} 
                    className="order-card"
                    style={{ animationDelay: `${index * 0.1}s` }} // Staggered animation
                  >
                    <div className="order-header">
                      <div className="order-id">
                        <Package size={20} />
                        <span>Order #{order.id}</span>
                      </div>
                      {/* Dynamic status badge with icon and color */}
                      <div className="order-status">
                        {getStatusIcon(order.status)}
                        <span className={`status-text ${order.status?.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="order-body">
                      <div className="order-info">
                        <p><strong>Customer:</strong> {order.customer}</p>
                        <p><strong>Date:</strong> {order.date}</p>
                      </div>
                      <div className="order-total">
                        <span>Total</span>
                        <span className="amount">${order.total}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;