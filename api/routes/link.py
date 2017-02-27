from flask import abort, request

from api import app
from api import jsonify
from api.models.link import Link

def find_link(link_id):
    return Link.query.get(link_id)
    
def next_order():
    link = Link.query.descending(Link.order).first()
    if link is None:
        return 0
        
    return link.order + 1

def valid_request(request):
    if not request.json:
        return False
    if 'source' in request.json and type(request.json['source']) is not float:
        return False
    if 'target' in request.json and type(request.json['target']) is not float:
        return False
    if 'weight' in request.json and type(request.json['weight']) is not any:
        return False
    
    return True

@app.route('/api/links', methods=['GET'])
def get_links():
    links = Link.query.all()
    results = []
    for link in links:
        results.append(link.wrap())
    return jsonify(results)


@app.route('/api/links/<string:link_id>', methods=['GET'])
def get_link(link_id):
    link = find_link(link_id)
    if link is None:
        abort(404)
    result = link.wrap()
    
    return jsonify(result)

@app.route('/api/links', methods=['POST'])
def create_link():
    if not request.json or not 'source' in request.json:
        abort(400)
    link = Link(source=request.json['source'], target=request.json['target'], weight=request.json['weight'])
    link.save()
    result = link.wrap()
    
    return jsonify(result), 201
    
@app.route('/api/links/<string:link_id>', methods=['PUT'])
def update_link(link_id):
    link = find_link(link_id)
    if link is None:
        abort(404)
   
    link.weight = request.json['weight']
    link.save()
    result = link.wrap()
    
    return jsonify(result)

@app.route('/api/links/<string:link_id>', methods=['DELETE'])
def delete_link(link_id):
    link = find_link(link_id)
    if link is None:
        abort(404)
    link.remove()
    return jsonify({'result': True})