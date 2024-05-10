class NextsTable {
    constructor(root) {
        this.root = root
        this.leafs = new Map()
    }

    calculateNexts() {
        this.fillLeafs(this.root)
        this._calculateNexts(this.root)
    }

    _calculateNexts = (node) => {
        if(node) {
            if(node.type === Type.LEAF) return
            if(node.type === Type.CONCAT) {
                for(const last of node.left.lasts) {
                    this.leafs.get(last).nexts = [...this.leafs.get(last).nexts, ...node.right.firsts]
                    this.leafs.get(last).nexts.sort(function(a, b) {
                        return a - b
                    })
                }
            } else if(node.type === Type.KLEENE || node.type === Type.POSITIVE) {
                for(const last of node.left.lasts) {
                    this.leafs.get(last).nexts = [...this.leafs.get(last).nexts, ...node.left.firsts]
                    this.leafs.get(last).nexts.sort(function(a, b) {
                        return a - b
                    })
                }
            }
            this._calculateNexts(node.left)
            this._calculateNexts(node.right)
        }
    }

    fillLeafs = (node) => {
        if(node) {
            if(node.type === Type.LEAF) {
                this.leafs.set(node.i, node)
                return
            }
            this.fillLeafs(node.left)
            this.fillLeafs(node.right)
        }
    }

    getDot = (name) => {
        var dot = "digraph Nexts {\n\tgraph[fontname=\"Arial\" labelloc=\"t\"];\n\tnode[shape=none fontname=\"Arial\"];\n\tlabel=\"Expresion Regular: " + name + "\";\n\ttable[label=<<table border=\"0\" cellborder=\"1\" cellspacing=\"0\" cellpadding=\"3\">\n\t\t<tr>\n\t\t\t<td bgcolor=\"#009900\" width=\"30\"><font color=\"#FFFFFF\">No</font></td>\n\t\t\t<td bgcolor=\"#009900\" width=\"100\"><font color=\"#FFFFFF\">Hoja</font></td>\n\t\t\t<td bgcolor=\"#009900\" width=\"100\"><font color=\"#FFFFFF\">Siguientes</font></td>\n\t\t</tr>";
        for(const [_, value] of this.leafs) {
            dot += value.getDot()
        }
        dot += "\n\t</table>>];\n}"
        return dot
    }

    getHTML = () => {
        var dot = "<table>\n\t\t<tr>\n\t\t\t<td bgcolor=\"#009900\" width=\"30\"><font color=\"#FFFFFF\">No</font></td>\n\t\t\t<td bgcolor=\"#009900\" width=\"100\"><font color=\"#FFFFFF\">Hoja</font></td>\n\t\t\t<td bgcolor=\"#009900\" width=\"100\"><font color=\"#FFFFFF\">Siguientes</font></td>\n\t\t</tr>";
        for(const [_, value] of this.leafs) {
            dot += value.getHTML()
        }
        dot += "\n\t</table>"
        return dot
    }
}