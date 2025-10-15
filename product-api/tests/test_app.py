import pytest
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health(client):
    """Test health endpoint"""
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json['status'] == 'healthy'

def test_ready(client):
    """Test readiness endpoint"""
    response = client.get('/ready')
    assert response.status_code == 200
    assert response.json['status'] == 'ready'

def test_home(client):
    """Test home endpoint"""
    response = client.get('/')
    assert response.status_code == 200
    assert 'version' in response.json

def test_get_products(client):
    """Test get all products"""
    response = client.get('/api/products')
    assert response.status_code == 200
    assert 'products' in response.json
    assert response.json['count'] > 0

def test_get_product(client):
    """Test get single product"""
    response = client.get('/api/products/1')
    assert response.status_code == 200
    assert response.json['id'] == 1

def test_get_product_not_found(client):
    """Test product not found"""
    response = client.get('/api/products/999')
    assert response.status_code == 404

def test_create_product(client):
    """Test create product"""
    new_product = {
        "name": "Test Product",
        "price": 99.99,
        "stock": 10
    }
    response = client.post('/api/products', json=new_product)
    assert response.status_code == 201
    assert response.json['name'] == 'Test Product'