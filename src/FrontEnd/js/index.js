document.addEventListener('keyup', (_) => {
    if(editor.getValue() !== '') {
        parse()
    }
});

parse = () => {
    const nodes = Parser.parse(editor.getValue())
    if(nodes.length > 0) {
        const tree = new Tree(nodes[0][1])
        tree.calculateFirsts()
        tree.calculateLasts()
        tree.calculateNexts()
        tree.calculateTransitions()
        // document.getElementById('regex').innerHTML = `${nodes[0][0]} -> ${tree.getRegex()}`
        d3.select('#graph1')
        .graphviz()
        .scale(0.6)
        .height(600*.45)
        .width(document.getElementById('graph1').clientWidth)
        .height(document.getElementById('graph1').clientHeight)
        .renderDot(tree.getDot(nodes[0][0]))
        document.getElementById('graph2').innerHTML = `<p class="table-title">Tabla De Siguientes</p><p class="table-title">Expresión Regular: ${nodes[0][0]}</p>${tree.nexts.getHTML()}`
        document.getElementById('graph3').innerHTML = `<p class="table-title">Tabla De Transiciones</p><p class="table-title">Expresión Regular: ${nodes[0][0]}</p>${tree.table.getHTML()}`
        d3.select('#graph4')
        .graphviz()
        .scale(0.6)
        .height(600*.45)
        .width(document.getElementById('graph4').clientWidth)
        .height(document.getElementById('graph4').clientHeight)
        .renderDot(tree.getDotAFD(nodes[0][0]))
    }
}