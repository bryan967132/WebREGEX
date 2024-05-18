var editor = CodeMirror(document.getElementById('editor'), {
    mode: "EXREGAN",
    theme: "eclipse",
    lineNumbers: true,
    indentUnit: 0,
    indentWithTabs: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    styleActiveLine: true,
    caseFold: true,
})

editor.setSize(null, window.innerHeight - document.getElementById('editor').offsetTop - 16)
window.addEventListener("resize", () => {
	editor.setSize(null, window.innerHeight - document.getElementById('editor').offsetTop - 16)
})