; Идентификаторы (обычно переменные)
(identifier) @variable

; 1. Левая часть присваивания (identifier или path) как `function`
; Используем якоря "." чтобы убедиться, что это непосредственный ребенок binary_expression
(binary_expression
  . _ @function
  . "=")

; 2. Строки и числа
(const_string) @string
(const_number) @number
(paragrapth) @string
(cat_string) @string

; 3. Prefix оператор @ (вместе с child) как `variable.parameter`
; Сначала матчим сам узел, если он начинается с "@"
(prefix_expression
  . "@"
  . (_) @variable.parameter) @variable.parameter

; 4. Остальные операторы
; Список операторов исключает "=", так как он выделен выше.
; Операторы binary_expression
[
  ">>" "<<" "|>" "<|" "::" ".." ">=" "<=" "=="
  "+" "-" "*" "/"
  ":" "|" "%"
  "."
] @operator

; Операторы prefix_expression
[
  "$" "&"
] @operator

; Операторы postfix_expression
(postfix_expression
  "!") @operator

; Backtick литерала дерева `{...}
(tree
  "`") @punctuation.special

; 5. Комменты
(comment) @comment

; Пути (выглядят как строки или специальные константы)
(path) @string.special

; Скобки для списков и групп
[
  "(" ")"
  "[" "]"
  "{" "}"
] @punctuation.bracket


