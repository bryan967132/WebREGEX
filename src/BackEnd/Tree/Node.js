class Node {
    constructor() {
        this.i = -1
        this.id = -1
        this.value = ''
        this.left = null
        this.right = null
        this.anulable = false
        this.type = null
        this.type1 = null
        this.firsts = []
        this.lasts = []
        this.nexts = []
    }

    terminals = (terminal) => {
        return (terminal.equals(" ") ? "\\s" : (terminal.equals("\n") ? "\\n" : terminal));
    }

    getDot = () => {
        return `\n\t\t<tr>\n\t\t\t<td>${this.i}</td>\n\t\t\t<td>${terminals(this.value)}</td>\n\t\t\t<td>${this.nexts ? this.nexts.map(String).join(", ") : "-"}</td>\n\t\t</tr>`
    }
}

newNode1 = (id, value, type) => {
    const newNode = new Node()
    newNode.id = id
    newNode.value = value
    newNode.type = type
    return newNode
}

newNode2 = (id, value, type, type1) => {
    const newNode = new Node()
    newNode.id = id
    newNode.value = type1 === Type.STRING ? value.substring(1, value.length - 1) : value
    newNode.type = type
    newNode.type1 = type1
    return newNode
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