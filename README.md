
- D3 runs all the calculation.
- A faux-dom coupled with D3 generates SVG elements in an isomorphic way.
- React handles state and renderings.

## DataFormat

You can import/export sankey diagrams using the following json format:

```
{ 
  nodes: [
    {"name":"node0"},
    {"name":"node1"}], 
  links: [
    {"source":0,"target":1,"value":100}
  ]
}
```


Build your bundle:

`$ webpack` or
`$ npm run dev`


## Webpack dev server
`$ webpack-dev-server` or
`npm run dev-server`

