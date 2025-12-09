from flask import Flask, jsonify, request
from flask_cors import CORS
from prometheus_flask_exporter import PrometheusMetrics
import os
import time
import random

app = Flask(__name__)
CORS(app)

# Prometheus metrics
metrics = PrometheusMetrics(app)

# Mock database
PRODUCTS = [
    {"id": 1, "name": "Laptop", "price": 999.99, "stock": 50},
    {"id": 2, "name": "Mouse", "price": 29.99, "stock": 200},
    {"id": 3, "name": "Keyboard", "price": 79.99, "stock": 150},
    {"id": 4, "name": "Monitor", "price": 299.99, "stock": 75},
    {"id": 5, "name": "Headphones", "price": 149.99, "stock": 100},
]

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "product-api"}), 200

@app.route('/ready', methods=['GET'])
def ready():
    """Readiness check endpoint"""
    # Simulate checking database connection
    return jsonify({"status": "ready", "service": "product-api"}), 200

@app.route('/', methods=['GET'])
def home():
    """Home endpoint"""
    return jsonify({
        "message": "Product API",
        "version": "1.0.0",
        "endpoints": ["/api/products", "/api/products/<id>", "/health", "/ready"]
    }), 200

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get all products"""
    # Simulate some processing time
    time.sleep(random.uniform(0.1, 0.3))
    return jsonify({"products": PRODUCTS, "count": len(PRODUCTS)}), 200

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get a specific product"""
    product = next((p for p in PRODUCTS if p["id"] == product_id), None)
    if product:
        return jsonify(product), 200
    return jsonify({"error": "Product not found"}), 404

@app.route('/api/products', methods=['POST'])
def create_product():
    """Create a new product"""
    data = request.get_json()
    
    # Validation
    if not data or 'name' not in data or 'price' not in data:
        return jsonify({"error": "Missing required fields"}), 400
    
    new_product = {
        "id": len(PRODUCTS) + 1,
        "name": data['name'],
        "price": data['price'],
        "stock": data.get('stock', 0)
    }
    PRODUCTS.append(new_product)
    return jsonify(new_product), 201

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5003))
    app.run(host='0.0.0.0', port=port, debug=False)