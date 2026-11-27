/**
 * @file LC-3 grammar for tree-sitter
 * @author twhlynch
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
	name: 'lc3',

	extras: (_$) => ['\r', '\t', ' '],

	word: ($) => $.mnemonic,

	rules: {
		document: ($) =>
			repeat(
				choice(
					$.comment,
					// everything after .END is a comment
					$.end_directive,
					seq(
						$.line,
						optional($.comment),
						choice('\n', '\0'),
					),
					'\n',
					'\0',
				),
			),

		comment: (_$) => /;[^\n]*/,

		end_directive: ($) =>
			prec(
				1,
				seq(
					$.period,
					$.end_name,
					optional($.comment),
					/[^\x00]*/,
				),
			),

		end_name: (_$) => token(prec(1, /end/i)),

		line: ($) =>
			repeat1(
				seq(
					optional($.comma),
					choice(
						$.mnemonic,
						$.alias,
						$.directive,
						$.register,
						$.integer,
						$.string,
						$.colon,
						$.maybe_trap_alias,
						$.label,
					),
				),
			),

		mnemonic: (_$) =>
			/add|and|not|jmp|ret|jsr|jsrr|lea|ld|st|ldi|sti|ldr|str|brn?z?p?|trap|rti/i,

		alias: (_$) =>
			/getc|out|puts|in|putsp|putn|halt|reg/i,

		directive: ($) => seq($.period, $.directive_name),

		directive_name: (_$) => token(prec(1, /[a-z_]+/i)),

		register: (_$) => token(prec(1, /r[0-7]/i)),

		integer: (_$) =>
			choice(
				// hex: xFFFF, 0x7B, x-5, -xF
				token(
					prec(
						1,
						/[-+]?0?x[-+]?[0-9a-f][0-9a-f_]*/i,
					),
				),
				// binary: b1010, 0b0
				token(prec(1, /[-+]?0?b[01][01_]*/i)),
				// octal: o77, 0o77
				token(prec(1, /[-+]?0?o[0-7][0-7_]*/i)),
				// decimal: #5, -1, #03
				token(prec(1, /#?[-+]?[0-9][0-9_]*/)),
				// char literal: 'a', '\n', '\''
				token(prec(1, /'(?:[^'\\]|\\[\s\S])*'/)),
			),

		string: (_$) =>
			// closing quote optional
			token(prec(1, /"(?:[^"\\\n]|\\[\s\S])*"?/)),

		// lowercase label could be an unknown trap alias
		maybe_trap_alias: (_$) => token(/[a-z]+/),

		label: (_$) => /[A-Za-z_][A-Za-z0-9_]*/,

		period: (_$) => '.',
		comma: (_$) => ',',
		colon: (_$) => ':',
	},
});
