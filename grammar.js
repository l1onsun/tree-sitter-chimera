/**
 * @file Chimera grammar for tree-sitter
 * @author Ilya Cherezov <ilya@cherezov.xyz>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const expression_fn = ($) =>
  choice(
    $.identifier,
    $.binnary_expression,
    $.unary_expression,
    $.const_value,
    $.function_call,
    $.function_call_list,
    $.list_pattern,
  );

module.exports = grammar({
  name: "walktime",

  rules: {
    source_file: ($) => expression_fn($),
    list_pattern: ($) => seq("[", repeat(expression_fn($)), "]"),
    function_call: ($) => prec(5, seq(expression_fn($), "(", expression_fn($), ")")),
    function_call_list: ($) =>
      prec(5, seq(expression_fn($), "{", repeat(expression_fn($)), "}")),

    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,
    expression: ($) =>
      choice(
        $.identifier,
        $.binnary_expression,
        $.unary_expression,
        $.const_value,
        $.function_call,
        $.function_call_list,
        $.list_pattern,
      ),
      
    at_operator: ($) => prec(6, seq("@", expression_fn($))),
    // unary_expression: ($) => seq(choice("+", "-", "$"), expression_fn($))
    binnary_expression: ($) =>
      choice(
        prec.left(0, seq(expression_fn($), choice("="), expression_fn($))),
        prec.left(1, seq(expression_fn($), $.at_operator, expression_fn($))),
        prec.left(2, seq(expression_fn($), choice(":"), expression_fn($))),
        prec.left(3, seq(expression_fn($), choice(">>", "<<", "|>", "<|", "::", "..", ">=", "<=", "=="), expression_fn($))),
        prec.left(4, seq(expression_fn($), choice("+", "-"), expression_fn($))),
        prec.left(
          5,
          seq(expression_fn($), choice("*", "/", "%", "|"), expression_fn($)),
        ),
        prec.left(7, seq(expression_fn($), ".", expression_fn($))),
      ),

    unary_expression: ($) => prec(8, seq(choice("$", "&", "`"), expression_fn($))),

    const_value: ($) => choice($.const_string, $.const_number),
    const_number: ($) => /\d+/,
    const_string: ($) => seq('"', /[^"]*/, '"'),


    comment: ($) => token(seq(';', /.*/)),
  },
  extras: ($) => [
    /[\s\uFEFF\u2060\u200B]/, // Whitespace (includes spaces, tabs, newlines)
    $.comment, // Include comments
  ],
});
