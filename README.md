
- D3 runs all the calculation.
- A faux-dom coupled with D3 generates SVG elements in an isomorphic way.
- React handles state and renderings.
- app loads in a nodes and links in JSON format via a python script from Mongodb, therefore, mongo must first be installed. Link and Node tables get initiallized automatically by the script if starting from scratch. Otherwise, ou can import the origJson file provided into Mongo manually.
- React is calling in a component called Tree and passes the json data to it.



## DataFormat

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
## To make this work:

# you need to install the node modules since we don't store them on github
$ npm install

# Then you need to open 4 seperate terminals from the projects root directory
1. ## Python: start the python script to activate the API and pass variables to and from the MongoDB via PyMongo

			$ python run.py

2. ## Mongo db: (Nb. if installed globally, not necessary to run from the project directory)

			$ mongodb 

3. ## Build your bundle:

			$ webpack
			or
			$ npm run dev

4. 
## Start the Webpack dev server

			$ webpack-dev-server
			 or
			$ npm run dev-server


## Manual mango tweaking: To see directly into the db, you will need a 5th terminal
			$ mongo

