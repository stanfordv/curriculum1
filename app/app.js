import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

import { ExportJSON, ImportJSON, loadData, readFile, postData, deleteNode, editNode, deleteLink, editLink } from './utils';

import TopBar from './toolbars/TopBar';
import Tree from './Tree';
import FooterBar from './toolbars/FooterBar';


import bootstrap from 'bootstrap/dist/css/bootstrap.css';
import style from './sankey.css';


class App extends React.Component {
    constructor() {
      super()

      this.state = {
          nodes: [],
          links: [],
          modalIsOpen: false
      };

      this.loadData = loadData.bind(this);
      this.postData = postData.bind(this);
      // this.updateData = updateData.bind(this);
      // this.deleteData = deleteData.bind(this);

      this.deleteNode = deleteNode.bind(this);
      this.editNode = editNode.bind(this);
      this.deleteLink = deleteLink.bind(this);
      this.editLink = editLink.bind(this);

      this.readFile = readFile.bind(this);

      this.emptyDiagram = this.emptyDiagram.bind(this);

      this.addNode = this.addNode.bind(this);
     // this.updateNode = this.updateNode.bind(this);
      this.addLink = this.addLink.bind(this);
      //this.updateLink = this.updateLink.bind(this);


      this.openModal = this.openModal.bind(this);
      this.closeModal = this.closeModal.bind(this);
      this.closeAndSaveModal = this.closeAndSaveModal.bind(this);
      this.deleteCloseAndSaveModal = this.deleteCloseAndSaveModal.bind(this);
     
      this.handleInputChange = this.handleInputChange.bind(this);

    }


    componentDidMount() {
        this.loadData('linksandnodes');
    }

    emptyDiagram() {
      console.log("hello")
        this.loadData('./emptyData.json', 'local');
    }


//****NODES***
    updateNodeIDX(idx, _id, root){
      console.log("here "+root)
      var nodes=root.state.nodes;
      console.log("there")
      nodes[idx]._id=_id
      root.setState({ nodes })
    }

    addNode(name) {
        var nodes = this.state.nodes;
        var idx = nodes.length;
        name = name || 'Node' + idx
        nodes[idx] = {
            node: idx,
            _id:"AAA",
            name
        };

        this.postData(name, "node", idx, this.updateNodeIDX, this);

        this.setState({ nodes });
        console.log(JSON.stringify("nodes: "+ nodes))
    }



    editLocalNode(_id, name, root){

      var index=0; 
      var n = root.state.nodes.map((node, i) => {
       
        if(node._id==_id){
          index=i; 
        }
      })

      var nodes= root.state.nodes; 
    
      nodes[index].name=name; 
   
      this.setState({nodes})
    }



    deleteLocalNode(_id,root){
       
       var index=0; 
        var n = root.state.nodes.map((node, i) => {
            console.log("- "+JSON.stringify("Nodeid: "+node._id))
            console.log("- "+JSON.stringify("id "+_id))
            if(node._id==_id){
             index=i
             console.log("index "+index)
             }

        })
        var nodes=root.state.nodes;
        console.log("nodes before : "+ JSON.stringify(nodes))
        nodes.splice(index, 1);
        console.log("nodes after : "+ JSON.stringify(nodes))


        root.setState({nodes})
    }
    
    
    
    //*****LINKS****

    updateLinkIDX(idx, _id, root){
      console.log("idx "+idx)
      var links=root.state.links;
      console.log("_id "+_id)
      links[idx]._id=_id
      root.setState({ links })
    }

    addLink(source, target, weight) {


        if (this.state.nodes.length > 1 && !isNaN(weight) && !isNaN(source) && !isNaN(target)) {

            var links = this.state.links;
           
            var idx = links.length;

            links[idx] = { source, target, weight };

            var l = { "source": source, "target": target, "weight": weight }
            this.postData(l, "link", idx, this.updateLinkIDX, this);

            this.setState({ links });
            

        }
    }

    editLocalLink(_id, weight, root) {

      var index=0; 
      var l = this.state.links.map((link, i) => {
       
        if(link._id==_id){
          index=i; 
        }
      })

      var links= this.state.links; 
    
      links[index].weight=weight; 
   
      this.setState({links})
    }
    
    deleteLocalLink(_id, root){

      var index=0; 
      var n = root.state.links.map((link, i) => {
        console.log("- "+JSON.stringify("Linkid: "+link._id))
        console.log("- "+JSON.stringify("id "+_id))
        if(link._id==_id){
           index=i
           console.log("index "+index)
         }
        })

        var links=root.state.links;
        console.log("links before : "+ JSON.stringify(links))
        links.splice(index, 1);
        console.log("links after : "+ JSON.stringify(links))

        root.setState({links})
    }   

    openModal(e) {
      console.log("e._id "+e._id)
      console.log("e.name "+e.name)
      console.log("e.weight "+e.weight)

        if (e.node !== undefined) {
            var modalContent = 'node';
            var modalContentNodeId = e._id;
            var modalContentNodeName = e.name;
        } else if (e.weight !== undefined) {
            var modalContent = 'link';
            var modalContentLinkId = e._id;
            var modalContentLinkWeight = e.weight;
            var modalContentLinkSource = e.source.node;
            var modalContentLinkTarget = e.target.node;
        }

        this.setState({
            modalIsOpen: true,
            modalContent,
            modalContentNodeId,
            modalContentNodeName,
            modalContentLinkId,
            modalContentLinkWeight,
            modalContentLinkSource,
            modalContentLinkTarget
        });
    }


    closeModal() {
        this.setState({ modalIsOpen: false });
    }


    closeAndSaveModal() {
      
        if (this.state.modalContent === 'link') {
           
           // todo: need to make this function in utils just like for editNode
            this.editLink(this.state.modalContentLinkId, this.state.modalContentLinkWeight, this);
        
        } else if (this.state.modalContent === 'node') {
            this.editNode(this.state.modalContentNodeId, this.state.modalContentNodeName, this);
        }
        this.setState({ modalIsOpen: false });
    }

    deleteCloseAndSaveModal(){
      
        if (this.state.modalContent === 'link') {

       
          
            this.deleteLink(this.state.modalContentLinkWeight, this.state.modalContentLinkId, this);
        
        } else if (this.state.modalContent === 'node') {
            this.deleteNode(this.state.modalContentNodeId, this);
        }
        this.setState({ modalIsOpen: false });
      
    }

    handleInputChange(key) {
     
        if (this.state.modalContent === 'link') {
            this.setState({ modalContentLinkWeight: key.target.value });
        } else if (this.state.modalContent === 'node') {
            this.setState({ modalContentNodeName: key.target.value });
        }
    }


    render() {
        if (this.state.modalContent === 'link') {
            var modalValue = this.state.modalContentLinkWeight;
            var header = 'Update Link Weight';

        } else if (this.state.modalContent === 'node') {
            var modalValue = this.state.modalContentNodeName;
            var header = 'Update Node Name';
        }

        var modalStyle = {
            content: {
                top: '275px',
                left: '37%',
                right: 'auto',
                bottom: 'auto',
                border: '0px solid #333',
                width: '300px',
            },
            overlay: {
                backgroundColor: 'rgba(0, 0, 0 , 0.35)'
            }
        };

        return (
      <div>
        <TopBar 
          nodes={this.state.nodes}
          links={this.state.links}
          addLink={this.addLink}
          addNode={this.addNode}
          openModal ={this.openModal}
        />
        <Tree nodes={this.state.nodes} links={this.state.links} openModal={this.openModal}/>
        <FooterBar 
          nodes={this.state.nodes}
          links={this.state.links}
          readFile={this.readFile}
          emptyDiagram={this.emptyDiagram}
        />
        <Modal
          closeTimeoutMS={150}
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.handleModalCloseRequest}
          style={modalStyle}>
          <button className="close" onClick={this.closeModal}>
            <span aria-hidden="true">&times;</span>
          </button>
          
          <h4>{header}</h4>
          <hr />

          <input
            className="form-control"
            defaultValue={modalValue}   
            onChange={this.handleInputChange} 
          />
          <button className="delete" onClick={this.deleteCloseAndSaveModal}>
            <span aria-hidden="true">Delete {this.state.modalContent}</span>
          </button>
          <hr />
          <div className="row">
            <div className="col-xs-12">
              <button className="btn btn-primary btn-block" onClick={this.closeAndSaveModal}>Apply Changes</button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
};


ReactDOM.render( < App / > , document.getElementById('app'));