%lex

%%

\s+                      {}
[ \n\r]                  {}
[a-zA-Z][a-zA-Z0-9]*\b   {return 'TK_id'}
\"([^\n\"\\]|\\.)\"      {return 'TK_string'}
\-[ ]*\>                 {return 'TK_arrow'}
"|"                      {return '|'}
"."                      {return '.'}
"*"                      {return '*'}
"+"                      {return '+'}
"?"                      {return '?'}
"("                      {return '('}
")"                      {return ')'}
.                        {console.log({tipo: 'LEXICO', descripcion: `El caracter "${yytext}" no pertenece al lenguaje`, linea: yylloc.first_line, columna: yylloc.first_column + 1})}
<<EOF>>                  {return 'EOF'}

/lex

%{
    var id = 0
    var leaf = 1

    getTree = (op) => {
        var root = newNode1(id + 1, ".", Type.CONCAT);
        root.left = op;
        root.right = newNode2(id, "#", Type.LEAF, Type.END);
        root.right.anulable = false;
        root.right.i = leaf;
        root.anulable = root.left.anulable && root.right.anulable;
        id = 0;
        leaf = 1;
        return root
    }

    getNode1 = (value, left, right, anulable, type) => {
        var root = newNode1(id, value, type);
        root.anulable = anulable;
        root.left = left;
        root.right = right;
        id ++;
        return root;
    }

    getNode2 = (op, type, type1) => {
        var root = newNode2(id, op, type, type1);
        root.anulable = false;
        root.i = leaf;
        id ++;
        leaf ++;
        return root;
    }
%}

%left '|'
%left '.'
%right '*', '+', '?'

%start INIT

%%

INIT :
    REGEXS EOF {return $1} |
    EOF        {return []} ;

REGEXS :
    REGEXS REGEX {$$.push($2)} |
    REGEX        {$$ = [$1]  } ;

REGEX :
    TK_id TK_arrow OPERATION {$$ = [$1, getTree($3)]} |
    error                    {console.log({tipo: 'SINTACTICO', descripcion: `No se esperaba "${yytext}".` ,  linea: this._$.first_line , columna: this._$.first_column + 1})} ;

OPERATION :
    OPERATION '.' OPERATION {$$ = getNode1($2, $1,   $3,   $1.anulable && $3.anulable, Type.CONCAT  )} |
    OPERATION '|' OPERATION {$$ = getNode1($2, $1,   $3,   $1.anulable || $3.anulable, Type.OR      )} |
    OPERATION '*'           {$$ = getNode1($2, $1,   null, true,                       Type.KLEENE  )} |
    OPERATION '+'           {$$ = getNode1($2, $1,   null, $1.anulable,                Type.POSITIVE)} |
    OPERATION '?'           {$$ = getNode1($2, $1,   null, true,                       Type.OPTIONAL)} |
    TK_id                   {$$ = getNode2($1, Type.LEAF,  Type.ID    )} |
    TK_string               {$$ = getNode2($1, Type.LEAF,  Type.STRING)} |
    '(' OPERATION ')'       {$$ = $2} ;