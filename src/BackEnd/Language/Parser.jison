%lex

ID     [a-zA-Z0-9]+
STRING \"([^\n\"\\]|\\.)*\"
CHAR   (\\"n"|\\"t"|\\"."|\\"s"|\\"r"|\\\"|\\\')

%%

\s+      {}
[ \n\r]  {}
{ID}     {return 'TK_id'}
{CHAR}   {return 'TK_char'}
{STRING} {return 'TK_string'}
"="      {return '='}
"|"      {return '|'}
"."      {return '.'}
"*"      {return '*'}
"+"      {return '+'}
"?"      {return '?'}
"("      {return '('}
")"      {return ')'}
.        {console.log({tipo: 'LEXICO', descripcion: `El caracter "${yytext}" no pertenece al lenguaje`, linea: yylloc.first_line, columna: yylloc.first_column + 1})}
<<EOF>>  {return 'EOF'}

/lex

%{
    var id = 0
    var leaf = 1
    var buffer = ''

    getTree = (op) => {
        var root = new Node(id + 1, ".", Type.CONCAT);
        root.left = op;
        root.right = new Node(id, "#", Type.LEAF, Type.END);
        root.right.anulable = false;
        root.right.i = leaf;
        root.anulable = root.left.anulable && root.right.anulable;
        id = 0;
        leaf = 1;
        return root
    }

    getNode1 = (value, left, right, anulable, type) => {
        var root = new Node(id, value, type);
        root.anulable = anulable;
        root.left = left;
        root.right = right;
        id ++;
        return root;
    }

    getNode2 = (op, type, type1) => {
        var root = new Node(id, op, type, type1);
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
    TK_id '=' OPERATION {$$ = [$1, getTree($3)]} |
    error               {console.log({tipo: 'SINTACTICO', descripcion: `No se esperaba "${yytext}".` ,  linea: this._$.first_line , columna: this._$.first_column + 1})} ;

OPERATION :
    OPERATION '.' OPERATION {$$ = getNode1($2, $1,   $3,   $1.anulable && $3.anulable, Type.CONCAT  )} |
    OPERATION '|' OPERATION {$$ = getNode1($2, $1,   $3,   $1.anulable || $3.anulable, Type.OR      )} |
    OPERATION '*'           {$$ = getNode1($2, $1,   null, true,                       Type.KLEENE  )} |
    OPERATION '+'           {$$ = getNode1($2, $1,   null, $1.anulable,                Type.POSITIVE)} |
    OPERATION '?'           {$$ = getNode1($2, $1,   null, true,                       Type.OPTIONAL)} |
    TK_id                   {$$ = getNode2($1, Type.LEAF, Type.ID    )} |
    TK_char                 {$$ = getNode2($1, Type.LEAF, Type.ID    )} |
    TK_string               {$$ = getNode2($1, Type.LEAF, Type.STRING)} |
    '(' OPERATION ')'       {$$ = $2; $$.isGroup = true} ;