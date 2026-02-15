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

; 3. Unary оператор % (вместе с child) как `variable.parameter`
; Сначала матчим сам узел, если он начинается с "%"
(unary_expression
  . "%" 
  . (_) @variable.parameter) @variable.parameter

; 4. Остальные операторы
; Список операторов исключает "=", так как он выделен выше, и "%", который выделен как parameter.
; Операторы binary_expression
[
  ">>" "<<" "|>" "<|" "::" ".." ">=" "<=" "=="
  "+" "-" "*" "/"
  ":" "|"
  "."
] @operator

; Операторы unary_expression (кроме %)
[
  "@" "$" "&" "`"
] @operator

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


