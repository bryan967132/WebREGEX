class Transition {
    constructor(state, value, nexts = new Set()) {
        this.state = state;
        this.value = value;
        this.nexts = nexts;
        this.accept = false;
        this.changes = new Map();
    }

    getState = () => {
        return `S${this.state} {${Array.from(this.nexts).join(", ")}}${this.accept ? " *" : ""}`;
    }
}