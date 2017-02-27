import React from 'react';
import ReactFauxDOM from 'react-faux-dom';
import d3 from 'd3';

import _ from 'lodash';

export default class extends React.Component {
  constructor() {
    super()

    this.state = {
      nodes: [], 
      links: []
    };
  }

  componentWillReceiveProps(nextProps) {
   
    this.setState({
      nodes: nextProps.nodes,
      links: nextProps.links
    });
   
  }


  render() {

    // Create your element.

    var el=ReactFauxDOM.createElement('div')

    var graph = {
          nodes: _.cloneDeep(this.state.nodes),
          links: _.cloneDeep(this.state.links)
        };

    var width = 960,
    height = 500,
    radius = 6;

var fill = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

d3.select("svg").remove();

var svg = d3.select("div").append("svg")
    .attr("width", width)
    .attr("height", height);



  var link = svg.selectAll("link")
      .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d,i){return d.weight;})
      .attr("class", "link")
      .on('dblclick', this.props.openModal);



  var node = svg.selectAll(".node")
        .data(graph.nodes)
      .enter().append("g")
        .attr("class", "node")
        .on('dblclick', this.props.openModal)
        .call(force.drag);

    node.append("circle")
        .attr("r", 8);

    node.append("text")
        .attr("x", 12)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .on("tick", tick)
      .start();

  function tick(e) {
    var k = 6 * e.alpha;

    // Push sources up and targets down to form a weak tree.
    link
        .each(function(d) { d.source.y -= k, d.target.y += k; })
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y+ ")"; });


  }

    // Render it to React elements.
    return el.toReact()
  }//render
}//component