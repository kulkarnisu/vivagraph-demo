'use strict';

(() => {
    $(document).ready(() => {
        //Load the JSON
        let container = document.body;

        $.getJSON('data/imdb5k.json', (data) => {

            //Variable declaration
            let graphGenerator, graph, layout, graphics, renderer, domLabels;

            graphGenerator = Viva.Graph.generator();
            graph = Viva.Graph.graph();

            //Add nodes to graph
            data.nodes.forEach((node) => graph.addNode(node.id, {name: node.name, type: node.type}));
            //Add edges to graph
            data.edges.forEach((edge) => {
                if (edge.value > 0) {
                    graph.addLink(edge.source, edge.target, edge.value);
                }
            });

            graphics = Viva.Graph.View.svgGraphics();
            //domLabels = generateDOMLabels(graph);

            let highlightRelatedNodes = function(nodeId, isOn) {
                // just enumerate all realted nodes and update link color:
                graph.forEachLinkedNode(nodeId, function(node, link){
                    let linkUI = graphics.getLinkUI(link.id);
                    if (linkUI) {
                        // linkUI is a UI object created by graphgics below
                        linkUI.attr('stroke', isOn ? 'red' : 'gray');
                    }
                });
            };

            graphics.node((node) => {
                let ui = Viva.Graph.svg('g'),
                    svgText = node.data.type === 'label'? Viva.Graph.svg('text').attr('y', '-4px').text(node.data.name):undefined;

                if (svgText) ui.append(svgText);
                $(ui).hover(function() { // mouse over
                    highlightRelatedNodes(node.id, true);
                }, function() { // mouse out
                    highlightRelatedNodes(node.id, false);
                });

                return ui;
            }).placeNode((nodeUI, pos) => {
                nodeUI.attr('transform',
                    'translate(' +
                    (pos.x - 16) + ',' + (pos.y - 16) +
                    ')');
            });

            graphics.link(function(link){
                return Viva.Graph.svg('path')
                    .attr('stroke', 'gray');
            }).placeLink(function(linkUI, fromPos, toPos) {
                let data = 'M' + fromPos.x + ',' + fromPos.y +
                    'L' + toPos.x + ',' + toPos.y;
                linkUI.attr("d", data);
            })


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
                graph.forEachNode(function (node) {
                    if (node.data.type === 'label') {
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