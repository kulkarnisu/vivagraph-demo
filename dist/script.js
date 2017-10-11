'use strict';

(() => {
    $(document).ready(() => {
        //Load the JSON
        $.getJSON('imdb.json', (data) => {
            console.log(data);
            
            //Variable declaration
            let graphGenerator, graph, layout, graphics, renderer;
            
            graphGenerator = Viva.Graph.generator();
            graph = Viva.Graph.graph();
            
            //Add nodes to graph
            data.nodes.forEach((node) => graph.addNode(node.id, {name: node.name, type: node.type}));
            //Add edges to graph
            data.edges.forEach((edge) => graph.addLink(edge.source, edge.target, edge.value));
            
            graphics = Viva.Graph.View.webglGraphics();
            
            renderer = Viva.Graph.View.renderer(graph, {
                graphics,
                renderLinks: true
            });
            
            renderer.run();
        })
    }); 
    
    
})();