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
    $.binary_expression,
    $.prefix_expression,
    $.postfix_expression,
    $.const_value,
    $.list,
    $.tree,
    $.tree_call,
    $.group,
  );

// `{...} body: braces with optional content
const tree_body = ($) => seq("{", optional($.pair), "}");

module.exports = grammar({
  name: "chimera",

  rules: {
    source_file: ($) => optional($.pair),

    pair: ($) =>
      choice(
        any_expression($), // base: (a b)
        seq(any_expression($), $.pair), // recursive: (a b c) = pair(a, pair(b, c))
      ),
    list: ($) => seq("[", optional($.pair), "]"),
    group: ($) => seq("(", optional($.pair), ")"),

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

    // tree literal: `{...} (backtick is only used here)
    tree: ($) => seq("`", tree_body($)),
    // macro call: <expr>{...} (whitespace is allowed before the braces)
    tree_call: ($) => prec.left(5, seq(any_expression($), tree_body($))),

    binary_expression: ($) =>
      choice(
        prec.left(
          0,
          seq(
            any_expression($),
            choice("=", ".=", ":=", "~", "--"),
            any_expression($),
          ),
        ),
        // prec.left(2, seq(any_expression($), ":", any_expression($))),
        prec.left(
          1,
          seq(
            any_expression($),
            choice(
              ">>",
              "<<",
              "|>",
              "<|",
              "::",
              "..",
              ">=",
              "<=",
              "==",
              "?>",
              "<?",
              "<?>",
              "->",
              "<-",
              "<->",
            ),
            any_expression($),
          ),
        ),
        prec.left(
          2,
          seq(any_expression($), choice("+", "-"), any_expression($)),
        ),
        prec.left(
          3,
          seq(any_expression($), choice("*", "/"), any_expression($)),
        ),
        prec.left(
          4,
          seq(any_expression($), choice(":", "|", "%"), any_expression($)),
        ),
        prec.left(5, seq(any_expression($), ".", any_expression($))),
      ),

    prefix_expression: ($) =>
      prec.left(6, seq(choice("@", "$", "&"), any_expression($))),
    postfix_expression: ($) => prec.left(5, seq(any_expression($), "!")),

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
