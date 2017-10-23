'use strict';

(() => {
    $(document).ready(() => {
        //Load the JSON
        let container = document.body;

        $.getJSON('data/imdb1k_p.json', (data) => {

            //Variable declaration
            let graphGenerator, graph, layout, graphics, renderer, domLabels;

            graphGenerator = Viva.Graph.generator();
            graph = Viva.Graph.graph();

            //Add nodes to graph
            data.nodes.forEach((node) => graph.addNode(node.id, {name: node.name, type: node.type}));
            //Add edges to graph
            data.edges.forEach((edge) => graph.addLink(edge.source, edge.target, edge.value));

            graphics = Viva.Graph.View.webglGraphics();
            domLabels = generateDOMLabels(graph);

            graphics.placeNode((ui, pos) => {
                let domPos = {x: pos.x, y: pos.y};

                graphics.transformGraphToClientCoordinates(domPos);

                let nodeId = ui.node.id;
                if (domLabels[nodeId]){
                    let labelStyle = domLabels[nodeId].style;
                    labelStyle.left = domPos.x + 'px';
                    labelStyle.top = domPos.y + 'px';
                }
            });

            graphics.node((node) => {
                let nodeColor = node.data.type === 'feature' ? '#7836CF' : '#BF0A0A';
                return  Viva.Graph.View.webglSquare(10, nodeColor);
            });

            layout = Viva.Graph.Layout.forceDirected(graph, {
                springLength: 30,
                springCoeff: 0.000009,
                dragCoeff: 0.006,
                gravity: -0.7,
                theta: 0.8
            });

            renderer = Viva.Graph.View.renderer(graph, {
                graphics,
                layout,
                renderLinks: true
            });

            renderer.run();

            function generateDOMLabels(graph) {
                // this will map node id into DOM element
                let labels = Object.create(null);
                graph.forEachNode(function(node) {
                    if(node.data.type === 'label'){
                        let label = document.createElement('span');
                        label.classList.add('node-label');
                        label.innerText = node.data.name;
                        labels[node.id] = label;
                        container.appendChild(label);
                    }
                });
                // NOTE: If your graph changes over time you will need to
                // monitor graph changes and update DOM elements accordingly
                return labels;
            }
        });
    });
})();