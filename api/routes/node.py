from flask import abort, request

from api import app
from api import jsonify
from api.models.node import Node
from api.models.link import Link
import pdb


def find_node(node_id):
    return Node.query.get(node_id)
    
def next_order():
    node = Node.query.descending(Node.order).first()
    if node is None:
        return 0
        
    return node.order + 1

def valid_request(request):
    if not request.json:
        return False
    if 'name' in request.json and type(request.json['name']) is not str:
        return False
    return True


@app.route('/api/nodes', methods=['GET'])
def get_nodes():
    nodes = Node.query.all()
    
    results = []
    for node in nodes:
        results.append(node.wrap())
    return jsonify(results)



@app.route('/api/linksandnodes', methods=['GET'])
def get_linksandnodes():
    nodes = Node.query.all()
    links = Link.query.all()
    
    results = {}
    all_nodes=[]
    for node in nodes:
        all_nodes.append(node.wrap())
    all_links=[]
    for link in links:
        all_links.append(link.wrap())


    results.update({"nodes": all_nodes})
    results.update({"links": all_links})

    return jsonify(results)



@app.route('/api/nodes/<string:node_id>', methods=['GET'])
def get_node(node_id):
    node = find_node(node_id)
    if node is None:
        abort(404)
    result = node.wrap()
    
    return jsonify(result)

@app.route('/api/nodes', methods=['POST'])
def create_node():
    if not request.json or not 'name' in request.json:
        abort(400)
    node = Node(name=request.json['name'])
    node.save()
    result = node.wrap()
    
    return jsonify(result), 201
    
@app.route('/api/nodes/<string:node_id>', methods=['PUT'])
def update_node(node_id):
    node = find_node(node_id)
    if node is None:
        abort(404)
   
    
    node.name = request.json['name']
   
    node.save()
    result = node.wrap()
    
    return jsonify(result)

@app.route('/api/nodes/<string:node_id>', methods=['DELETE'])
def delete_node(node_id):
    node = find_node(node_id)
    if node is None:
        abort(404)
    node.remove()
    return jsonify({'result': True})