from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

products = []
_next_id = 1

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(products)

@app.route('/api/products', methods=['POST'])
def add_product():
    global _next_id
    data = request.get_json() or {}
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Nome do produto é obrigatório'}), 400
    try:
        price = float(data.get('price') or 0)
    except (TypeError, ValueError):
        price = 0.0
    try:
        stock = int(data.get('stock') or 0)
    except (TypeError, ValueError):
        stock = 0
    product = {
        'id': _next_id,
        'name': name,
        'price': price,
        'stock': stock,
        'category': data.get('category') or 'Geral',
        'emoji': data.get('emoji') or '📦'
    }
    products.insert(0, product)
    _next_id += 1
    return jsonify(product), 201

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    base = os.path.dirname(__file__) or '.'
    if path and os.path.exists(os.path.join(base, path)):
        return send_from_directory(base, path)
    return send_from_directory(base, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
