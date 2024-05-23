var graphs = JSON.parse(localStorage.getItem('graphs'))
if(!graphs) {
    localStorage.setItem('graphs', JSON.stringify({
        tree: '',
        nexts: '',
        transitions: '',
        afd: '',
        afnd: '',
    }))
    graphs = JSON.parse(localStorage.getItem('graphs'))
} else if(graphs.tree !== '') {
    document.getElementById('results').innerHTML = '<div id="graph" class="graph"></div>'
    d3.select('#graph')
    .graphviz()
    .scale(0.5)
    .height(600*.45)
    .width(document.getElementById('graph').clientWidth)
    .height(document.getElementById('graph').clientHeight)
    .renderDot(JSON.parse(localStorage.getItem('graphs')).tree)
}

document.addEventListener('keyup', (_) => {
    const keyCode = event.keyCode
    if (
        keyCode >= 48 && keyCode <= 57 ||
        keyCode >= 65 && keyCode <= 90 ||
        keyCode >= 96 && keyCode <= 107 ||
        [8, 13, 16, 32, 34, 46, 110, 186, 187, 188, 190, 191, 219, 220, 222].includes(keyCode)
    ) {
        if(editor.getValue() !== '') {
            parse()
        }
    }
});

renderGraph = (id) => {
    console.log(id)
    var graphs = JSON.parse(localStorage.getItem('graphs'))
    switch(id) {
        case 'tree':
            document.getElementById('results').innerHTML = '<div id="graph" class="graph"></div>'
            d3.select('#graph')
            .graphviz()
            .scale(0.5)
            .height(600*.45)
            .width(document.getElementById('graph').clientWidth)
            .height(document.getElementById('graph').clientHeight)
            .renderDot(graphs.tree)
            break
        case 'nexts':
            document.getElementById('results').innerHTML = `${graphs.nexts}`
            break
        case 'transitions':
            document.getElementById('results').innerHTML = `${graphs.transitions}`
            break
        case 'afd':
            document.getElementById('results').innerHTML = '<div id="graph" class="graph"></div>'
            d3.select('#graph')
            .graphviz()
            .scale(0.5)
            .height(600*.45)
            .width(document.getElementById('graph').clientWidth)
            .height(document.getElementById('graph').clientHeight)
            .renderDot(graphs.afd)
            break
        default:
            document.getElementById('results').innerHTML = ``
    }
}

parse = () => {
    const nodes = Parser.parse(editor.getValue())
    if(nodes.length > 0) {
        const tree = new Tree(nodes[0][1])
        tree.calculateFirsts()
        tree.calculateLasts()
        tree.calculateNexts()
        tree.calculateTransitions()
        var graphs = JSON.parse(localStorage.getItem('graphs'))
        graphs.tree = tree.getDot(nodes[0][0])
        graphs.nexts = tree.nexts.getHTML()
        graphs.transitions = tree.table.getHTML()
        graphs.afd = tree.getDotAFD(nodes[0][0])
        document.getElementById('results').innerHTML = '<div id="graph" class="graph"></div>'
        d3.select('#graph')
        .graphviz()
        .scale(0.5)
        .height(600*.45)
        .width(document.getElementById('graph').clientWidth)
        .height(document.getElementById('graph').clientHeight)
        .renderDot(graphs.tree)
        localStorage.setItem('graphs', JSON.stringify(graphs))
    }
}