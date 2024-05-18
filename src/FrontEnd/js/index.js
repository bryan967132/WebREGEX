document.addEventListener('keyup', (_) => {
    const keyCode = event.keyCode
    console.log(keyCode)
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

parse = () => {
    const nodes = Parser.parse(editor.getValue())
    if(nodes.length > 0) {
        const tree = new Tree(nodes[0][1])
        tree.calculateFirsts()
        tree.calculateLasts()
        tree.calculateNexts()
        tree.calculateTransitions()
        // document.getElementById('regex').innerHTML = `${nodes[0][0]} -> ${tree.getRegex()}`
        document.getElementById('results').innerHTML = '<div id="graph" class="graph"></div>'
        d3.select('#graph')
        .graphviz()
        .scale(0.5)
        .height(600*.45)
        .width(document.getElementById('graph').clientWidth)
        .height(document.getElementById('graph').clientHeight)
        .renderDot(tree.getDot(nodes[0][0]))
        // document.getElementById('graph2').innerHTML = `<p class="table-title">Tabla De Siguientes</p><p class="table-title">Expresión Regular: ${nodes[0][0]}</p>${tree.nexts.getHTML()}`
        // document.getElementById('graph3').innerHTML = `<p class="table-title">Tabla De Transiciones</p><p class="table-title">Expresión Regular: ${nodes[0][0]}</p>${tree.table.getHTML()}`
        // d3.select('#graph4')
        // .graphviz()
        // .scale(0.6)
        // .height(600*.45)
        // .width(document.getElementById('graph4').clientWidth)
        // .height(document.getElementById('graph4').clientHeight)
        // .renderDot(tree.getDotAFD(nodes[0][0]))
    }
}