// try {
    const nodes = Parser.parse(`REGEX1 -> (a?.b+)*|(b*.c?)+
REGEX2 -> (d+.(".".d+)?)`)
    if(nodes.length > 0) {
        const tree = new Tree(nodes[0][1])
        tree.calculateFirsts()
        tree.calculateLasts()
        d3.select('#graph1')
        .graphviz()
        .scale(0.5)
        .height(600*.45)
        .width(document.getElementById('graph1').clientWidth)
        .height(document.getElementById('graph1').clientHeight)
        .renderDot(tree.getDot(nodes[0][0]))
    }
// } catch (error) {
//     console.log(error)
// }