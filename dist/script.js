'use strict';

(() => {
    $(document).ready(() => {
        //Load the JSON
        let container = document.body;

        $.getJSON('data/imdb1k.json', (data) => {

            //Variable declaration
            let graphGenerator, graph, layout, graphics, renderer, domLabels;

            graphGenerator = Viva.Graph.generator();
            graph = Viva.Graph.graph();
            // graph = graphGenerator.grid(1000, 1000);

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
                let nodeSize = node.data.type === 'label' ? 50 : 10;
                return  Viva.Graph.View.webglSquare(nodeSize, nodeColor);
            });

            layout = Viva.Graph.Layout.forceDirected(graph, {
                springLength: 30,
                springCoeff: 0.000001,
                dragCoeff: 0.006,
                gravity: -2.2,
                theta: 0.8
                // stableThreshold: 0
            });

            renderer = Viva.Graph.View.renderer(graph, {
                graphics,
                layout,
                renderLinks: true,
                prerender  : true
            });

            renderer.run();

            // listen to events
            var events = Viva.Graph.webglInputEvents(graphics, graph);
            events.mouseEnter(function (node) {
                    console.log('Mouse entered node: ' + node.data.name);
            }).click(function (node) {
                console.log('Single click on node: ' + node.data.name);
            });

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