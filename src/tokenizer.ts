
import {Decimal} from 'decimal.js';

import {Position, error, SYMBOLS, CQQSymbol, KEYWORDS, BasicKeyword, Keyword} from './base.js';
import {dataLayout, ByteArray, Token} from './types.js';


const IDENTIFIER_REGEX = /^\p{XID_Start}\p{XID_Continue}*$/u;

const NUMBER_REGEX = /^(\.?[0-9](\p{XID_Continue}|'[0-9]|'[_a-zA-Z]|[eEpP][+-]|\.)*)$/u;
const INTEGER_DECIMAL_LITERAL_REGEX = /^([0-9]('?[0-9])*)$/u;
const INTEGER_BINARY_LITERAL_REGEX = /^(0'?[bB]'?[01]('?[01])*)$/u;
const INTEGER_OCTAL_LITERAL_REGEX = /^(0'?[oO]'?('?[0-7]*))$/u;
const INTEGER_HEXADECIMAL_LITERAL_REGEX = /^(0'?[xX]'?[0-9a-fA-F]('?[0-9a-fA-F])*)$/u;
// digit-sequence: ([0-9]('?[0-9])*)
// exponent-part: ([eE][+-]?([0-9]('?[0-9])*))
const DECIMAL_FLOATING_LITERAL_REGEX = /^((([0-9]('?[0-9])*)?\.([0-9]('?[0-9])*)|([0-9]('?[0-9])*)\.)([eE][+-]?([0-9]('?[0-9])*))|([0-9]('?[0-9])*)([eE][+-]?([0-9]('?[0-9])*)))$/u;
// hexadecimal-digit-sequence: ([0-9a-fA-F]('?[0-9a-fA-F])*)
// hexadecimal-fractional-literal: ([0-9a-fA-F]('?[0-9a-fA-F])*)?\.([0-9a-fA-F]('?[0-9a-fA-F])*)|([0-9a-fA-F]('?[0-9a-fA-F])*)\.
// binary-exponent-part: ([pP][+-]?([0-9]('?[0-9])*))
const HEXADECIMAL_FLOATING_LITERAL_REGEX = /^(0[xX](([0-9a-fA-F]('?[0-9a-fA-F])*)|([0-9a-fA-F]('?[0-9a-fA-F])*)?\.([0-9a-fA-F]('?[0-9a-fA-F])*)|([0-9a-fA-F]('?[0-9a-fA-F])*)\.)([pP][+-]?([0-9]('?[0-9])*)))$/u;

const CHARACTER_LITERAL_REGEX = /^('([^'\\]|((\\)(['"?\\abfnrtv0]|[0-7]{1,3}|o\{[0-7]{1,3}\}|x[0-9a-fA-F]+|x\{[0-9a-fA-F]+\})))+')$/u;

const ESCAPE_SEQUENCE_REGEX = /^((\\)(['"?\\abfnrtv]|[0-7]{1,3}|o\{[0-7]{1,3}\}|x[0-9a-fA-F]+|x\{[0-9a-fA-F]+\}))/u;

function parseEscapeSequence(value: string): string {
    value = value.slice(1);
    if (value === `'` || value === '"' || value === '?' || value === '\\') {
        return value;
    } else if (value === 'a') {
        return '\x07';
    } else if (value === 'b') {
        return '\b';
    } else if (value === 'f') {
        return '\f';
    } else if (value === 'n') {
        return '\n';
    } else if (value === 'r') {
        return '\r';
    } else if (value === 't') {
        return '\t';
    } else if (value === 'v') {
        return '\v';
    } else if (value === '0') {
        return '\0';
    } else if (value.startsWith('o')) {
        value = value.slice(1);
        if (value.startsWith('{')) {
            value = value.slice(1, -1);
        }
        return String.fromCodePoint(parseInt(value, 16));
    } else if (value.startsWith('x')) {
        value = value.slice(1);
        if (value.startsWith('{')) {
            value = value.slice(1, -1);
        }
        return String.fromCodePoint(parseInt(value, 8));
    } else {
        return String.fromCodePoint(parseInt(value, 8));
    }
}

let encoder = new TextEncoder();
function parseStringLiteral(value: string): ByteArray | false {
    if (!(value.startsWith('"') && value.endsWith('"'))) {
        return false;
    }
    let out = '';
    // call Array.from here to use real Unicode characters
    let chars = Array.from(value.slice(1, -1));
    for (let i = 0; i < chars.length; i++) {
        let char = chars[i];
        if (char === '"') {
            return false;
        } else if (char === '\\') {
            let match = chars.slice(i).join('').match(ESCAPE_SEQUENCE_REGEX);
            if (!match) {
                return false;
            }
            i += Array.from(match[0]).length - 1;
            out += parseEscapeSequence(match[0]);
        } else {
            out += char;
        }
    }
    return new ByteArray(encoder.encode(out));
}

let i8 = dataLayout.getIntegerType(8);

function tryToConvertToSingleToken(pos: Position, text: string): Token | 'whitespace' | false {
    pos = structuredClone(pos);
    let string = parseStringLiteral(text);
    if (string !== false) {
        return {pos, type: 'string-literal', value: string, raw: text};
    }
    if (text === ' ' || text === '\n' || text === '\t' || text === '\v' || text === '\f') {
        return 'whitespace';
    } else if (text.match(IDENTIFIER_REGEX)) {
        if (KEYWORDS.has(text as BasicKeyword) || text.match(/^((int|uint|float)\d+)$/)) {
            return {pos, type: 'keyword', value: text as Keyword};
        } else {
            return {pos, type: 'identifier', name: text};
        }
    } else if (text.match(NUMBER_REGEX)) {
        let value = Decimal(text.replaceAll(`'`, ''));
        return {pos, type: 'number-literal', value, raw: text};
    } else if (text.match(CHARACTER_LITERAL_REGEX)) {
        text = text.slice(1, -1);
        let value: number;
        if (text[0] === '\\') {
            value = parseEscapeSequence(text).charCodeAt(0);
        } else {
            if (text.length !== 1) {
                error(pos, `Invalid character literal: ${text} (more than one character)`);
            }
            value = text.charCodeAt(0);
        }
        if (value > (1n ** BigInt(i8.bits))) {
            error(pos, `Invalid character literal: ${text} (resolves to ${value} which is out of range of char)`);
        }
        return {pos, type: 'number-literal', value: Decimal(value), raw: text};
    } else if (SYMBOLS.has(text as CQQSymbol)) {
        return {pos, type: 'symbol', value: text as CQQSymbol};
    } else {
        return false;
    }
}

export function tokenize(filePath: string, code: string): Token[] {
    let lines = code.split('\n');
    let out: Token[] = [];
    let multiLineComment: false | Position = false;
    for (let lineNumber = 1; lineNumber < lines.length + 1; lineNumber++) {
        // call Array.from here to use real Unicode characters
        let line = Array.from(lines[lineNumber]);
        let col = 0;
        while (line.length > 0) {
            let pos = {file: filePath, line: lineNumber, col};
            let char = line[0];
            if (multiLineComment) {
                if (char === '*' && line[1] === '/') {
                    multiLineComment = false;
                    line.shift();
                    line.shift();
                    col += 2;
                    continue;
                } else {
                    line.shift();
                    col += 1;
                    continue;
                }
            }
            if (char === '/' && line[1] === '/') {
                // single-line comment
                break;
            } else if (char === '/' && line[1] === '*') {
                multiLineComment = structuredClone(pos);
                line.shift();
                line.shift();
                col += 2;
                continue;
            }
            // get the largest possible token
            let found = false;
            for (let i = line.length; i > 0; i--) {
                let value = line.slice(0, i).join('');
                let token = tryToConvertToSingleToken(pos, value);
                if (token === false) {
                    continue;
                } else if (token === 'whitespace') {
                    line.shift();
                    continue;
                } else {
                    out.push(token);
                    found = true;
                    for (let j = 0; j < i; j++) {
                        line.shift();
                    }
                    col += i;
                    break;
                }
            }
            if (!found) {
                error(pos, `Invalid token`);
            }
        }
    }
    if (multiLineComment) {
        error(multiLineComment, `Unterminated multi-line comment`);
    }
    return out;
}
