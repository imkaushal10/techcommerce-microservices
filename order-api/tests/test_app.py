import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health(client):
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json['status'] == 'healthy'

def test_ready(client):
    response = client.get('/ready')
    assert response.status_code == 200
    assert response.json['status'] == 'ready'

def test_get_orders(client):
    response = client.get('/api/orders')
    assert response.status_code == 200
    assert 'orders' in response.json

def test_get_order(client):
    response = client.get('/api/orders/1')
    assert response.status_code == 200
    assert response.json['id'] == 1

def test_create_order(client):
    new_order = {
        "customer": "Test Customer",
        "total": 199.99,
        "status": "pending"
    }
    response = client.post('/api/orders', json=new_order)
    assert response.status_code == 201