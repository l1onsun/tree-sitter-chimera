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
    $.path,
    $.binnary_expression,
    $.unary_expression,
    $.const_value,
    $.list,
    $.curly_list,
    $.group,
  );

module.exports = grammar({
  name: "chimera",

  rules: {
    source_file: ($) => repeat(any_expression($)),

    list: ($) => seq("[", repeat(any_expression($)), "]"),
    curly_list: ($) => seq("{", repeat(any_expression($)), "}"),
    group: ($) => seq("(", repeat(any_expression($)), ")"),

    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,
    path: ($) =>
      token(
        choice(
          // absolute: /a/b/c
          /\/[^\s\]\)\}\,;"]+(?:\/[^\s\]\)\}\,;"]+)*/,
          // relative: ./a/b/c
          /\.\/[^\s\]\)\}\,;"]+(?:\/[^\s\]\)\}\,;"]+)*/,
        ),
      ),

    binnary_expression: ($) =>
      choice(
        prec.left(0, seq(any_expression($), "=", any_expression($))),
        prec.left(2, seq(any_expression($), ":", any_expression($))),
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
          seq(any_expression($), choice("*", "/"), any_expression($)),
        ),
        prec.left(7, seq(any_expression($), ".", any_expression($))),
      ),

    unary_expression: ($) =>
      prec.left(8, seq(choice("@", "$", "&", "`", "%"), any_expression($))),

    const_value: ($) =>
      choice($.const_string, $.const_number, $.paragrapth, $.cat_string),
    const_number: ($) => /\d+/,
    const_string: ($) => seq('"', /[^"]*/, '"'),
    paragrapth: ($) =>
      seq(
        ",,,",
        optional(seq($.paragrapth_head, "\n")),
        repeat($.paragrapth_content),
        "\n,,,",
      ),
    paragrapth_head: ($) => /[a-zA-Z0-9_+-]+/,
    paragrapth_content: ($) => /[^\n]+|\n/,
    cat_string: ($) =>
      seq(
        "^_",
        optional($.paragrapth_head),
        /\s/,
        repeat(choice(/[^_]/, seq("_", /[^^]/))),
        "_^",
      ),

    comment: ($) => token(seq(";", /.*/)),
  },
  extras: ($) => [
    /[\s\uFEFF\u2060\u200B]/, // Whitespace (includes spaces, tabs, newlines)
    $.comment, // Include comments
  ],
});
