import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
      <h1>🛍️ E-Commerce Dashboard</h1>

      <div className="container">
        {/* Products Section */}
        <div className="section">
          <h2>Products ({products.length})</h2>
          <div className="items">
            {products.map(product => (
              <div key={product.id} className="item">
                <h3>{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p>Stock: {product.stock} units</p>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Section */}
        <div className="section">
          <h2>Orders ({orders.length})</h2>
          <div className="items">
            {orders.map(order => (
              <div key={order.id} className="item">
                <h3>{order.customer}</h3>
                <p>Total: ${order.total}</p>
                <p>Status: {order.status}</p>
                <p>Date: {order.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;