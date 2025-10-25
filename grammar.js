/**
 * @file Chimera grammar for tree-sitter
 * @author Ilya Cherezov <ilya@cherezov.xyz>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const any_expression = ($) =>
  choice(
    $.identifier,
    $.binnary_expression,
    $.unary_expression,
    $.const_value,
    $.function_call,
    $.function_call_list,
    $.list_pattern,
    $.group,
  );

module.exports = grammar({
  name: "chimera",

  rules: {
    source_file: ($) => any_expression($),
    list_pattern: ($) => seq("[", repeat(any_expression($)), "]"),
    function_call: ($) =>
      prec.left(5, seq(any_expression($), "(", any_expression($), ")")),
    function_call_list: ($) =>
      prec.left(5, seq(any_expression($), "{", repeat(any_expression($)), "}")),
    group: ($) => seq("(", any_expression($), ")"),

    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,
    // expression: ($) => expression_fn($),

    // left_operator: ($) => prec.left(9, seq("%", any_expression($))),
    // right_operator: ($) => prec.left(8, seq(any_expression($), "%")),
    // left_operator: ($) => prec(6, token(seq("@", any_expression($)))),

    // unary_expression: ($) => seq(choice("+", "-", "$"), expression_fn($))
    binnary_expression: ($) =>
      choice(
        prec.left(0, seq(any_expression($), choice("="), any_expression($))),
        // prec.left(1, seq(any_expression($), choice($.left_operator, $.right_operator), any_expression($))),
        // prec.left(1, seq(any_expression($), $.right_operator, any_expression($))),
        prec.left(2, seq(any_expression($), choice(":"), any_expression($))),
        prec.left(
          3,
          seq(
            any_expression($),
            choice(">>", "<<", "|>", "<|", "::", "..", ">=", "<=", "=="),
            any_expression($),
          ),
        ),
        prec.left(
          4,
          seq(any_expression($), choice("+", "-"), any_expression($)),
        ),
        prec.left(
          5,
          seq(any_expression($), choice("*", "/", "%", "|"), any_expression($)),
        ),
        prec.left(7, seq(any_expression($), ".", any_expression($))),
      ),

    unary_expression: ($) =>
      prec.left(8, seq(choice("@", "$", "&", "`", ","), any_expression($))),
    // unary_expression: ($) => token(seq(choice("$", "&", "`"), any_expression($))),

    const_value: ($) => choice($.const_string, $.const_number),
    const_number: ($) => /\d+/,
    const_string: ($) => seq('"', /[^"]*/, '"'),

    comment: ($) => token(seq(";", /.*/)),
  },
  extras: ($) => [
    /[\s\uFEFF\u2060\u200B]/, // Whitespace (includes spaces, tabs, newlines)
    $.comment, // Include comments
  ],
});
