var variable = true
var nIB = 0
var bracketPair = ["group-1", "group-2", "group-3"]
CodeMirror.defineMode("EXREGAN", function() {
    return {
        token: function(stream, _) {
            if(stream.pos === 0) {
                variable = true
            }
            if(stream.match(/=/)) {
                variable = false
                return null
            }
            if(stream.match(/\s+/)) {
                return null
            }
            if(stream.match(/[\{\[\(]/)) {
                var g = bracketPair[nIB % bracketPair.length]
                nIB ++
                return g;
            }
            if(stream.match(/[\}\]\)]/)) {
                nIB --
                return bracketPair[nIB % bracketPair.length];
            }
            if(stream.match(/[0-9]+/)) {
                return "integer";
            }
            if(stream.match(/\\n|\\t|\\\.|\\s|\\r|\\\"|\\\'/)) {
                return "Char";
            }
            if(stream.match(/\"([^\n\"\\]|\\.)*\"/)) {
                return "String";
            }
            if(stream.match(/[\+\*\?\.\|]+/)) {
                return "operator";
            }
            if(stream.match(/[a-zA-Z$][a-zA-Z0-9$]*/)) {
                if(variable) {
                    return "var-l";
                }
                return "var-r";
            }
            stream.next();
            return 'error';
        }
    };
});