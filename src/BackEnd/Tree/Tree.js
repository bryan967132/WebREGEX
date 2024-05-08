class Tree {
    constructor(root) {
        this.root = root
        this.transitions = []
    }

    calculateFirsts = () => {
        this._calculateFirsts(this.root)
    }

    _calculateFirsts = (node) => {
        if(node) {
            if(node.type === Type.LEAF) {
                node.firsts.push(node.i)
                return
            }
            this._calculateFirsts(node.left)
            this._calculateFirsts(node.right)
            node.firsts = [...node.firsts, ...node.left.firsts]
            if(node.type === Type.OR) {
                node.firsts = [...node.firsts, ...node.right.firsts]
            } else if(node.type === Type.CONCAT) {
                if(node.left.anulable) {
                    node.firsts = [...node.firsts, ...node.right.firsts]
                }
            }
        }
    }

    calculateLasts = () => {
        this._calculateLasts(this.root)
    }

    _calculateLasts = (node) => {
        if(node) {
            if(node.type === Type.LEAF) {
                node.lasts.push(node.i)
                return
            }
            this._calculateLasts(node.left)
            this._calculateLasts(node.right)
            if(node.type === Type.OR || node.type === Type.POSITIVE || node.type === Type.KLEENE || node.type === Type.OPTIONAL) {
                node.lasts = [...node.lasts, ...node.left.lasts]
                if(node.type === Type.OR) {
                    node.lasts = [...node.lasts, ...node.right.lasts]
                }
            } else if(node.type === Type.CONCAT) {
                if(node.right.anulable) {
                    node.lasts = [...node.lasts, ...node.left.lasts]
                }
                node.lasts = [...node.lasts, ...node.right.lasts]
            }
        }
    }

    getDot = (name) => {
        return `digraph Tree {\n\tgraph[fontname="Arial" labelloc=t];\n\tnode[shape=plaintext fontname="Arial"];\n\tedge[dir=none];\n\t${this.description(name)}${this.getDotNodes(this.root, 'CENTER')}\n}`;
    }

    description = (name) => {
        return `label=<EXPRESIÓN REGULAR: ${name}<br/><font color="#0C7CBA">IDENTIFICADORES</font><br align="left"/><font color="#CC0000">ANULABLES</font><br align="left"/><font color="#CC6600">PRIMEROS</font><br align="left"/><font color="#009900">ÚLTIMOS</font><br align="left"/>>;`;
    }

    terminals = (terminal) => {
        return (terminal === " " ? "&#92;&#92;s" : (terminal === "\\n" ? "&#92;&#92;n" : terminal));
    }

    getDotNodes = (node, align) => {
        var dot = "";
        if(node != null) {
            dot += "\n\t" + this.getStructN(node, align)
            if(node.left != null) {
                dot += this.getDotNodes(node.left, 'LEFT')
                dot += `\n\tnode${node.id}:p${node.id} -> node${node.left.id}:p${node.left.id};`
            }
            if(node.right != null) {
                dot += this.getDotNodes(node.right, 'RIGHT')
                dot += `\n\tnode${node.id}:p${node.id} -> node${node.right.id}:p${node.right.id};`
            }
        }
        return dot;
    }

    getStructN = (node, align) => {
        return `node${node.id}[label=<<table border="0" cellspacing="0" cellpadding="3"><tr>${this.getAnulable(node, align)}</tr><tr><td><font color="#CC6600">${this.getFirsts(node)}</font></td><td border="1" style="rounded" port="p${node.id}" width="25">${this.terminals(node.value)}</td><td><font color="#009900">${this.getLasts(node)}</font></td></tr><tr><td></td><td>${node.i > 0 ? `<font color="#0C7CBA">${node.i}</font>` : ""}</td><td></td></tr></table>>];`
    }

    getAnulable = (node, align) => {
        return `<td>${align === 'LEFT' ? (node.anulable ? "<font color=\"#CC0000\">A</font>" : "<font color=\"#CC0000\">N</font>") : ""}</td><td>${align === 'CENTER' ? (node.anulable ? "<font color=\"#CC0000\">A</font>" : "<font color=\"#CC0000\">N</font>") : ""}</td><td>${align === 'RIGHT' ? (node.anulable ? "<font color=\"#CC0000\">A</font>" : "<font color=\"#CC0000\">N</font>") : ""}</td>`
    }

    getFirsts = (node) => {
        return node.firsts.length > 0 ? node.firsts.join(", ") : "";
    }

    getLasts = (node) => {
        return node.lasts.length > 0 ? node.lasts.join(", ") : "";
    }
}