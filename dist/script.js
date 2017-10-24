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
            // graph = graphGenerator.grid(480, 1);

            //Add nodes to graph
            data.nodes.forEach((node) => graph.addNode(node.id, {name: node.name, type: node.type}));
            console.log("total nodes:" + data.nodes.length);
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
                // return  Viva.Graph.View.webglSquare(nodeSize, nodeColor);
                var ui = Viva.Graph.View.webglSquare(nodeSize, nodeColor);
                ui.addEventListener('click', function () {
                    // toggle pinned mode
                    layout.pinNode(node, !layout.isNodePinned(node));
                });
                return ui;
            });

            layout = Viva.Graph.Layout.forceDirected(graph, {
                springLength: 30,
                springCoeff: 0.00001,
                dragCoeff: 0.006,
                gravity: -1.2,
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
            var graphics1 = renderer.getGraphics();
            $('.zoom').click(function (e) {
                e.preventDefault();
                if ($(this).hasClass('in')) {
                    renderer.zoomIn();
                } else {
                    renderer.zoomOut();
                }
            });

            $('#centerForm').submit(function(e) {
                e.preventDefault();
                var nodeId = $('#nodeid').val();
                console.log("nodeId: " + nodeId)
                if (graph.getNode(nodeId)) {
                    var pos = layout.getNodePosition(nodeId);
                    renderer.moveTo(pos.x, pos.y);
                    highlightNode(nodeId);
                }
            });

            $('.reset').click(function () {
                renderer.reset()
            });

            var prevSelected;
            function highlightNode(nodeId) {
                var ui = graphics1.getNodeUI(nodeId);
                if (prevSelected) {
                    // prevSelected.attr('fill', '#BF0A0A')
                    prevSelected.color = -1089860865;
                }
                prevSelected = ui;
                // ui.attr('fill', 'orange');
                ui.color = -1039860865;
            }

            // listen to events
            var events = Viva.Graph.webglInputEvents(graphics, graph);
            events.mouseEnter(function (node) {
                    console.log('Mouse entered node: ' + node.id);
            }).click(function (node) {
                console.log('Single click on node: ' + node.id);
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