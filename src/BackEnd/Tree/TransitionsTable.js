class TransitionTable {
    constructor(transitions, nexts) {
        this.nexts = nexts
        this.transitions = transitions
        this.tmpTrnst = []
        this.terminals = []
    }

    build = () => {
        this.addTerminals()
        this.buildHelper(0)
    }

    buildHelper = (i) => {
        if(i < this.transitions.length) {
            let position, next, newTrnst
            const transition = this.transitions[i]
            for(const terminal of this.terminals) {
                newTrnst = new Transition(this.transitions.length, terminal.value)
                for(const nxt of transition.nexts) {
                    next = this.nexts.get(nxt)
                    if(next.value === terminal.value) {
                        newTrnst.nexts = new Set([...newTrnst.nexts, ...next.nexts])
                    }
                }
                position = this.existTransition(newTrnst)
                if(position === -1) {
                    if(newTrnst.nexts.size > 0) {
                        transition.changes.set(terminal.value, new Change(this.transitions.length, terminal.value, terminal.type))
                        this.transitions.push(newTrnst)
                    }
                } else {
                    transition.changes.set(terminal.value, new Change(position, terminal.value, terminal.type))
                }
            }
            this.buildHelper(i + 1)
        }
    }

    existTransition = (transition) => {
        for(let i = 0; i < this.transitions.length; i++) {
            if(JSON.stringify([...this.transitions[i].nexts]) === JSON.stringify([...transition.nexts])) {
                return i
            }
        }
        return -1
    }

    addTerminals = () => {
        for (const [_, next] of this.nexts) {
            if (next.value !== "#") {
                const newTerminal = new Terminal(next.value, next.type1)
                if (!this.verifyTerminal(newTerminal)) {
                    this.terminals.push(newTerminal)
                }
            }
        }
    }

    verifyTerminal = (newTerminal) => {
        for (const terminal of this.terminals) {
            if (terminal.value === newTerminal.value) {
                return true
            }
        }
        return false
    }

    getDot = (name) => {
        let dot = `digraph Transitions {\n\tgraph[fontname="Arial" labelloc="t"];\n\tnode[shape=none fontname="Arial"];\n\tlabel="Expresion Regular: ${name}";\n\ttable[label=<<table border="0" cellborder="1" cellspacing="0" cellpadding="3">`
        dot += `\n\t\t<tr>\n\t\t\t<td bgcolor="#009900" width="100" rowspan="2"><font color="#FFFFFF">Estados</font></td>\n\t\t\t<td bgcolor="#009900" width="100" colspan="${this.terminals.length}"><font color="#FFFFFF">Terminales</font></td>\n\t\t</tr>`
        dot += `\n\t\t<tr>`
        for (let i = 0; i < this.terminals.length; i++) {
            const title = this.terminals[i].value
            dot += `\n\t\t\t<td bgcolor="#009900" width="100"><font color="#FFFFFF">${title === " " ? "\\\\s" : title}</font></td>`
        }
        dot += `\n\t\t</tr>`
        for (let i = 0; i < this.transitions.length; i++) {
            const chngs = this.transitions[i].changes
            dot += `\n\t\t<tr>`
            dot += `\n\t\t\t<td align="left">${this.transitions[i].getState()}</td>`
            for (let j = 0; j < this.terminals.length; j++) {
                const aux = chngs.get(this.terminals[j].value)
                dot += `\n\t\t\t<td>${aux !== undefined ? "S" + aux.toState : "-"}</td>`
            }
            dot += `\n\t\t</tr>`
        }
        dot += `\n\t</table>>];\n}`
        return dot;
    }

    getHTML = () => {
        let dot = `<table border="0" cellborder="1" cellspacing="0" cellpadding="3">`
        dot += `\n\t\t<tr>\n\t\t\t<td bgcolor="#009900" width="100" rowspan="2"><font color="#FFFFFF">Estados</font></td>\n\t\t\t<td bgcolor="#009900" width="100" colspan="${this.terminals.length}"><font color="#FFFFFF">Terminales</font></td>\n\t\t</tr>`
        dot += `\n\t\t<tr>`
        for (let i = 0; i < this.terminals.length; i++) {
            const title = this.terminals[i].value
            dot += `\n\t\t\t<td bgcolor="#009900" width="100"><font color="#FFFFFF">${title === " " ? "\\\\s" : title}</font></td>`
        }
        dot += `\n\t\t</tr>`
        for (let i = 0; i < this.transitions.length; i++) {
            const chngs = this.transitions[i].changes
            dot += `\n\t\t<tr>`
            dot += `\n\t\t\t<td align="left" bgcolor="#FFFFFF">${this.transitions[i].getState()}</td>`
            for (let j = 0; j < this.terminals.length; j++) {
                const aux = chngs.get(this.terminals[j].value)
                dot += `\n\t\t\t<td bgcolor="#FFFFFF">${aux !== undefined ? "S" + aux.toState : "-"}</td>`
            }
            dot += `\n\t\t</tr>`
        }
        dot += `\n\t</table>`
        return dot;
    }
}