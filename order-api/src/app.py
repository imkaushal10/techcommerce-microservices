from flask import Flask, jsonify, request
from flask_cors import CORS
from prometheus_flask_exporter import PrometheusMetrics
import os
import time
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Prometheus metrics
metrics = PrometheusMetrics(app)

# Mock database
ORDERS = [
    {"id": 1, "customer": "John Doe", "total": 1299.98, "status": "delivered", "date": "2024-10-01"},
    {"id": 2, "customer": "Jane Smith", "total": 79.99, "status": "processing", "date": "2024-10-10"},
    {"id": 3, "customer": "Bob Johnson", "total": 599.97, "status": "shipped", "date": "2024-10-08"},
]

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "order-api"}), 200

@app.route('/ready', methods=['GET'])
def ready():
    """Readiness check endpoint"""
    return jsonify({"status": "ready", "service": "order-api"}), 200

@app.route('/', methods=['GET'])
def home():
    """Home endpoint"""
    return jsonify({
        "message": "Order API",
        "version": "1.0.0",
        "endpoints": ["/api/orders", "/api/orders/<id>", "/health", "/ready"]
    }), 200

@app.route('/api/orders', methods=['GET'])
def get_orders():
    """Get all orders"""
    # Simulate some processing time
    time.sleep(random.uniform(0.1, 0.3))
    return jsonify({"orders": ORDERS, "count": len(ORDERS)}), 200

@app.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    """Get a specific order"""
    order = next((o for o in ORDERS if o["id"] == order_id), None)
    if order:
        return jsonify(order), 200
    return jsonify({"error": "Order not found"}), 404

@app.route('/api/orders', methods=['POST'])
def create_order():
    """Create a new order"""
    data = request.get_json()
    
    # Validation
    if not data or 'customer' not in data or 'total' not in data:
        return jsonify({"error": "Missing required fields"}), 400
    
    new_order = {
        "id": len(ORDERS) + 1,
        "customer": data['customer'],
        "total": data['total'],
        "status": data.get('status', 'pending'),
        "date": datetime.now().strftime('%Y-%m-%d')
    }
    ORDERS.append(new_order)
    return jsonify(new_order), 201

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)