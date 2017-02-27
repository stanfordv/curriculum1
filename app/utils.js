import React from 'react';
import request from 'superagent';


class ExportJSON extends React.Component {
  render() {
    var diagramData = {};
    diagramData.nodes = this.props.nodes;
    diagramData.links = this.props.links;
    var data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(diagramData));

    return (
      <a className="btn btn-default pull-right" href={data} download="data.json">Export JSON</a>
    );
  }
};


class ImportJSON extends React.Component {
  render() {
    return (
      <span className="btn btn-default btn-file pull-right">
        Import JSON <input type="file" onChange={this.props.readFile} />
      </span>
    );
  }
};


var api="http://localhost:5001/api/";

function loadData(path, t) {
  var fullpath=api+path

  // t means local
  if(t){

   fullpath=path;

  }
 
  request
    .get(fullpath)
    .end((err, res) => {
      if (err) { console.log(err); }      
     
      var links = res.body.links;
      var nodes = res.body.nodes.map((node, i) => {
        if (!node.node) { node.node = i; }
        return node
      });
     
      this.setState({nodes, links});
    });
}

function postData(data, t, idx, ret, root) {
 // console.log("data: "+data)
  if(t=='node'){

  request
    .post(api+'nodes')
    .send({ "name" : data })
    .end((err, res) => {
      if (err) console.log(err);
      console.log(res);
      ret(idx, res.body._id, root)
    })

  }
  else if(t=='link'){

  request
    .post(api+'links')
    .send({ "source": data["source"], "target":data["target"],  "weight":data["weight"]})
    .end((err, res) => {
      if (err) console.log(err);
      console.log(res);
     ret(idx, res.body._id, root)
     
    })

 }else{

  console.log ("conditional error")
 }
  
}



function editNode(_id, name, root){

  request
    .put(api+'nodes/'+_id)
    .send({ "name": name })
    .end(function(err, res){
      if (err) console.log(err);
      console.log(res);
      root.editLocalNode(res.body._id, name, root)
          
    })
}


function deleteNode(_id, root){
   console.log("_id "+ _id)
 
  request
    .delete(api+'nodes/'+_id)
    .send({ "_id": _id })
    .end(function(err, res){
      if (err) console.log(err);
      console.log(res);
      root.deleteLocalNode(_id, root)
    })

}



function editLink(_id, w, root){

  request
    .put(api+'links/'+_id)
    .send({ "weight": w })
    .end(function(err, res){
      if (err) console.log(err);
      console.log(res);
      root.editLocalLink(res.body._id, w, root)
          
    })
}

function deleteLink(data, _id, root){
  console.log("_id "+ _id)
  console.log("data "+ data)
  request
    .delete(api+'links/'+_id)
    .send({ "weight": data })
    .end(function(err, res){
    if (err) console.log(err);
      console.log(res);
      root.deleteLocalLink(res.body._id, root)


    })

}

 


function readFile(e) {
  console.log("read")
  var file = e.target.files[0]; 

  if (!file) {
    console.log("Failed to load file"); 
  } else if (!file.type.match('json.*')) {
    console.log(file.name + " is not a valid json file.");
  } else {
    console.log("loading?"); 
    var r = new FileReader();    
    r.onload = function(e) { 
      var contents = JSON.parse(e.target.result);
      var nodes = contents.nodes.map(function(node, i){
        if (!node.node) {
            node.node = i;
          }
        return node;
      });
      var links = contents.links;
      this.setState({
        nodes: nodes,
        links: links
      });
     
    }.bind(this);
    r.readAsText(file);
  } 
}

export { ExportJSON, ImportJSON, loadData, readFile, postData, deleteNode, editNode, deleteLink, editLink }