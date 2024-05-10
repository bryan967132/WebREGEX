class Node {
    constructor(id, value, type, type1 = null) {
        this.i = -1
        this.id = id
        this.value = type1 ? (type1 === Type.STRING ? value.substring(1, value.length - 1) : value) : value
        this.left = null
        this.right = null
        this.anulable = false
        this.type = type
        this.type1 = type1
        this.firsts = []
        this.lasts = []
        this.nexts = []
        this.isGroup = false
    }

    terminals = (terminal) => {
        return terminal == " " ? "\\s" : (terminal == "\n" ? "\\n" : terminal);
    }

    getDot = () => {
        return `\n\t\t<tr>\n\t\t\t<td>${this.i}</td>\n\t\t\t<td>${this.terminals(this.value)}</td>\n\t\t\t<td>${this.nexts ? this.nexts.map(String).join(", ") : "-"}</td>\n\t\t</tr>`
    }

    getHTML = () => {
        return `\n\t\t<tr>\n\t\t\t<td bgcolor="#FFFFFF">${this.i}</td>\n\t\t\t<td bgcolor="#FFFFFF">${this.terminals(this.value)}</td>\n\t\t\t<td bgcolor="#FFFFFF">${this.nexts ? this.nexts.map(String).join(", ") : "-"}</td>\n\t\t</tr>`
    }

    getRegex = () => {
        return this._getRegex(this.left)
    }

    _getRegex = (node) => {
        var dot = ''
        if(node) {
            dot += this._getRegex(node.left)
            if(node.type !== Type.CONCAT) {
                dot += node.value
                if(node.type1 === Type.STRING) {
                    dot = `"${dot}"`
                }
            }
            dot += this._getRegex(node.right)
            if(node.isGroup) {
                dot = `(${dot})`
            }
        }
        return dot
    }
}

const Type = {
    ID: 'ID',
    OR: 'OR',
    END: 'END',
    LEAF: 'LEAF',
    CONCAT: 'CONCAT',
    KLEENE: 'KLEENE',
    STRING: 'STRING',
    POSITIVE: 'POSITIVE',
    OPTIONAL: 'OPTIONAL',
}