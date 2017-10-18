'use strict';

(() => {
    $(document).ready(() => {
        //Load the JSON
        $.getJSON('data/imdb1k.json', (data) => {

            //Variable declaration
            let graphGenerator, graph, layout, graphics, renderer;

            graphGenerator = Viva.Graph.generator();
            graph = Viva.Graph.graph();

            //Add nodes to graph
            data.nodes.forEach((node) => graph.addNode(node.id, {name: node.name, type: node.type}));
            //Add edges to graph
            data.edges.forEach((edge) => graph.addLink(edge.source, edge.target, edge.value));
            console.log(data.nodes.length, data.edges.length);
            graphics = Viva.Graph.View.webglGraphics();

            graphics.node((node) => {
                let nodeColor = node.data.type === 'feature' ? '#7836CF' : '#BF0A0A';
                return  Viva.Graph.View.webglSquare(10, nodeColor);
            });

            layout = Viva.Graph.Layout.forceDirected(graph, {
                springLength: 30,
                springCoeff: 0.000009,
                dragCoeff: 0.003,
                gravity: -1.2,
                theta: 0.8
            });

            renderer = Viva.Graph.View.renderer(graph, {
                graphics,
                layout,
                renderLinks: true
            });

            renderer.run();
        });
    });


})();