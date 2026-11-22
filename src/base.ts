
import './globals.d.ts';

import * as path from 'node:path';


export function unexpectedError(message: string): never {
    throw new Error(`This error should not occur, please report it: ${message}`);
}


export const BASE_INTERNAL_PATH = path.normalize(import.meta.dirname);

export function getInternalPath(...parts: string[]): string {
    return path.normalize(path.join(BASE_INTERNAL_PATH, ...parts));
}


export const DEEP_COPY_SYMBOL = Symbol('DEEP_COPY_SYMBOL');

function _deepCopy(value: unknown, refs: WeakMap<object, object>): unknown {
    if (typeof value !== 'object' || value === null) {
        return value;
    }
    let reference = refs.get(value);
    if (reference !== undefined) {
        return reference;
    }
    if (Array.isArray(value)) {
        let out: unknown[] = [];
        refs.set(value, out);
        for (let x of value) {
            out.push(_deepCopy(x, refs));
        }
        return out;
    } else if (value instanceof Date || value instanceof RegExp || value instanceof ArrayBuffer || value instanceof DataView || value instanceof Int8Array || value instanceof Int16Array || value instanceof Int32Array || value instanceof BigInt64Array || value instanceof Uint8Array || value instanceof Uint16Array || value instanceof Uint32Array || value instanceof BigUint64Array) {
        return structuredClone(value);
    } else if (value instanceof Map) {
        let out = new Map();
        refs.set(value, out);
        for (let [key, x] of value) {
            out.set(key, _deepCopy(x, refs));
        }
        return out;
    } else if (value instanceof Set) {
        let out = new Set();
        refs.set(value, out);
        for (let x of value) {
            out.add(_deepCopy(x, refs));
        }
        return out;
    } else if (DEEP_COPY_SYMBOL in value) {
        return (value[DEEP_COPY_SYMBOL] as () => unknown)();
    } else {
        let out: {[key: PropertyKey]: unknown} = {};
        for (let key of Reflect.ownKeys(value)) {
            out[key] = _deepCopy((value as {[key: PropertyKey]: unknown})[key], refs);
        }
        return out;
    }
}

export function deepCopy<T>(value: T): T {
    return _deepCopy(value, new WeakMap()) as T;
}


export interface SimplePosition {
    file: string;
    line: number;
    col: number;
    func?: string;
}

export function simplePositionToString(pos: SimplePosition): string {
    let out = `at ${pos.file}:${pos.line}:${pos.col}`;
    if (pos.func !== undefined) {
        out = `at ${pos.func} ${out}`;
    }
    return out;
}

export interface Position extends SimplePosition {
    invokedAt?: SimplePosition[];
}

export type HasPos = {pos: Position};


export class CYYError extends Error {

    name: string = 'CYYError';
    [Symbol.toStringTag]: string = 'CYYError';

    pos: Position;

    constructor(pos: Position, message: string) {
        super(message);
        this.pos = pos;
    }

    toString(): string {
        let pos = this.pos;
        let out = `Error: ${this.message}\n${simplePositionToString(pos)}`;
        if (pos.invokedAt) {
            for (let value of pos.invokedAt) {
                out += '\n' + simplePositionToString(value);
            }
        }
        return out;
    }

}

export function error(pos: Position | HasPos, message: string): never {
    if ('pos' in pos) {
        pos = pos.pos;
    }
    throw new CYYError(pos, message);
}


export const EOF = Symbol();
export type EOF = typeof EOF;


export const PREFIX_UNARY_OPERATORS = new Set([
    // numbers
    '+', '-', '~',
    // pointers
    '*', '&',
    // booleans
    '!',
    // types
    'mut', 'volatile', 'own', 'free',
    // general
    'decltype', 'typeof',
] as const);
export type PrefixUnaryOperator = typeof PREFIX_UNARY_OPERATORS extends Set<infer T> ? T : never;

export const POSTFIX_UNARY_OPERATORS = new Set([
    // members
    '.', '->', '::',
    // types
    'mut', 'volatile', 'own', 'free', '*', '&', '?',
] as const);
export type PostfixUnaryOperator = typeof POSTFIX_UNARY_OPERATORS extends Set<infer T> ? T : never;

export const BINARY_OPERATORS = new Set([
    // numbers
    '+', '-', '*', '/', '%', '&', '|', '^', '<<', '>>',
    // scalars
    '<', '<=', '>', '>=', '..<', '..=',
    // booleans
    '&&', '||', '^^',
    // types
    'extends',
    // general
    '==', '!=', '~=', '~!=', '??',
] as const);
export type BinaryOperator = typeof BINARY_OPERATORS extends Set<infer T> ? T : never;

export const OVERLOAD_OPERATORS = new Set([
    // prefix unary
        // numbers
        '+', '-', '~',
        // pointers
        '*.', '&.',
        // booleans
        '!',
        // types
        'mut.', 'volatile.',
    // postfix unary
        // types
        '.mut', '.volatile', '.*', '.&', '.?',
    // binary
        // numbers
        '+', '-', '*', '/', '%', '&', '|', '^', '<<', '>>',
        // scalars
        '<', '<=', '>', '>=', '..<', '..=',
        // booleans
        '&&', '||', '^^',
        // types
        'extends',
        // general
        '==', '!=', '~=', '~!=', '??',
    // other
        // postfix
        '[]', '()',
        // ternary conditional
        '?:',
]);
export type OverloadOperator = typeof OVERLOAD_OPERATORS extends Set<infer T> ? T : never;


export const SYMBOLS = new Set([
    // basic
    ',', ':', ';',
    // grouping
    '(', ')', '[', ']', '{', '}',
    // prefix unary operators
        // numbers
        '+', '-', '~',
        // pointers
        '*', '&',
        // booleans
        '!',
    // postfix unary operators
        // members
        '.', '->', '::',
        // types
        '*', '&',
    // binary operators
        // numbers
        '+', '-', '*', '/', '%', '&', '|', '^', '<<', '>>',
        // scalars
        '<', '<=', '>', '>=', '..<', '..=',
        // booleans
        '&&', '||', '^^',
        // general
        '==', '!=', '~=', '~!=', '??',
] as const);
export type CYYSymbol = typeof SYMBOLS extends Set<infer T> ? T : never;

export const KEYWORDS = new Set([
    // modules
    'module', 'import', 'export',
    // control flow
    'if', 'else', 'for', 'while', 'break', 'continue', 'match',
    // primitive types
    'never', 'void', 'bool', 'int', 'uint', 'float16', 'bfloat16', 'float32', 'float64', 'float80', 'float128', 'size', 'ssize', 'uintptr', 'char', 'string', 'type', 'any', 'code',
    // operators
    'mut', 'volatile', 'decltype', 'typeof', 'extends',
    // constructs
    'this', 'auto', 'struct', 'union', 'enum', 'class', 'operator', 'template', 'namespace',
    // declaration qualifiers
    'constexpr', 'inline', 'alignas',
] as const);
export type BasicKeyword = typeof KEYWORDS extends Set<infer T> ? T : never;
export type Keyword = BasicKeyword | `int${number}` | `uint${number}`;


export type BaseToken = {pos: Position};
export type SymbolToken<T extends CYYSymbol = CYYSymbol> = BaseToken & {type: 'symbol', value: T};
export type IdentifierToken = BaseToken & {type: 'identifier', name: string};
export type KeywordToken<T extends Keyword = Keyword> = BaseToken & {type: 'keyword', value: T};
export type NumberToken = BaseToken & {type: 'number-literal', value: number | bigint, raw: string};
export type CharacterLiteralToken = BaseToken & {type: 'character-literal', value: number, raw: string};
export type StringLiteralToken = BaseToken & {type: 'string-literal', value: Uint8Array, raw: string};

export type Token = SymbolToken | IdentifierToken | KeywordToken | NumberToken | CharacterLiteralToken | StringLiteralToken;

export const STRING_TOKEN_NAMES: {[K in Token['type']]: string} = {
    'symbol': 'symbol',
    'identifier': 'identifier',
    'keyword': 'keyword',
    'number-literal': 'number-literal',
    'character-literal': 'character literal',
    'string-literal': 'string literal',
};

export function getTokenRaw(token: Token): string {
    if (token.type === 'identifier') {
        return token.name;
    } else if (token.type === 'number-literal' || token.type === 'character-literal' || token.type === 'string-literal') {
        return token.raw;
    } else {
        return token.value;
    }
}

export function tokenToString(token: Token | EOF): string {
    if (token === EOF) {
        return `end of file`;
    } else {
        return `${STRING_TOKEN_NAMES[token.type]} ${getTokenRaw(token)}`;
    }
}


type Matcher = 
    | EOF
    | Token['type']
    | BasicKeyword | 'intn' | 'uintn' | 'floatn'
    | CYYSymbol
    | `identifier ${string}`
    | Matcher[]
;

type MatcherReturnType<T extends Matcher> =
    T extends EOF ? EOF :
    T extends Token['type'] ? Extract<Token, {type: T}> :
    T extends BasicKeyword ? KeywordToken<T> :
    T extends 'intn' | 'uintn' ? (T extends `${infer T extends 'int' | 'uint'}n` ? KeywordToken<`${T}${number}`> : never) :
    T extends CYYSymbol ? SymbolToken<T> :
    T extends `identifier ${string}` ? IdentifierToken :
    // T extends (infer U)[] ? MatcherReturnType<U> :
    T extends any[] ? Token :
    never
;

function matcherToString(matcher: Matcher): string {
    if (matcher === EOF) {
        return `end of file`;
    } else if (typeof matcher === 'string') {
        if (KEYWORDS.has(matcher as BasicKeyword)) {
            return `keyword '${matcher}'`;
        } else if (SYMBOLS.has(matcher as CYYSymbol)) {
            return `symbol '${matcher}'`;
        } else if (matcher.startsWith('identifier ')) {
            return `identifier '${matcher.slice('identifier '.length)}'`;
        } else {
            return STRING_TOKEN_NAMES[matcher as Token['type']];
        }
    } else {
        let out = matcher.map(matcherToString);
        if (out.length === 0) {
            return `nothing`;
        } else if (out.length === 1) {
            return out[0];
        } else if (out.length === 2) {
            return `${out[0]} or ${out[1]}`;
        } else {
            return `${out.slice(0, -1).join(', ')}, or ${out[out.length - 1]}`;
        }
    }
}


export class BaseParser {

    tokens: Token[];
    pos: number;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
        this.pos = 0;
    }

    canHaveHeaderTokens: boolean = false;

    getCurrentPosition(): Position {
        if (this.tokens[this.pos] === undefined) {
            return this.tokens[this.tokens.length - 1].pos;
        } else {
            return this.tokens[this.pos].pos;
        }
    }

    error(pos: Position | {pos: Position} | undefined, message: string): never {
        if (pos === undefined) {
            pos = this.getCurrentPosition();
        } else if ('pos' in pos) {
            pos = pos.pos;
        }
        throw new CYYError(pos, message);
    }

    peek<T extends Exclude<Matcher, EOF> = Exclude<Matcher, EOF>>(): MatcherReturnType<T> {
        let out = this.tokens[this.pos];
        if (out === undefined) {
            throw new Error(`Unexpected end of input`);
        } else {
            return out as MatcherReturnType<T>;
        }
    }

    peekOrEOF<T extends Matcher = Matcher>(): MatcherReturnType<T> | EOF {
        return (this.tokens[this.pos] ?? EOF) as MatcherReturnType<T> | EOF;
    }

    advance<T extends Exclude<Matcher, EOF> = Exclude<Matcher, EOF>>(): MatcherReturnType<T> {
        let out = this.tokens[this.pos];
        if (out === undefined) {
            throw new Error(`Unexpected end of input`);
        } else {
            this.pos++;
            return out as MatcherReturnType<T>;
        }
    }

    advanceOrEOF<T extends Matcher = Matcher>(): MatcherReturnType<T> | EOF {
        let out = this.tokens[this.pos];
        if (out === undefined) {
            return EOF;
        } else {
            this.pos++;
            return out as MatcherReturnType<T>;
        }
    }

    _match(token: Token | EOF, matcher: Matcher): boolean {
        if (matcher === EOF) {
            return token === EOF;
        } else if (token === EOF) {
            return false;
        } else if (typeof matcher === 'string') {
            if (SYMBOLS.has(matcher as CYYSymbol)) {
                return token.type === 'symbol' && token.value === matcher;
            } else if (KEYWORDS.has(matcher as BasicKeyword)) {
                return token.type === 'keyword' && token.value === matcher;
            } else if (matcher === 'intn' || matcher === 'uintn' || matcher === 'floatn') {
                return token.type === 'keyword' && Boolean(token.value.match(new RegExp(`^${matcher.slice(1, -1)}\\d+$`)));
            } else if (matcher.startsWith('identifier ')) {
                return token.type === 'identifier' && token.name === matcher.slice('identifier '.length);
            } else {
                return token.type === matcher;
            }
        } else {
            return matcher.some(value => this._match(token, value));
        }
    }

    match(...data: Matcher[]): boolean {
        for (let i = 0; i < data.length; i++) {
            let token = (this.tokens[this.pos + i] ?? EOF) as Token | EOF;
            if (!this._match(token, data[i])) {
                return false;
            }
        }
        return true;
    }

    expect(...data: Matcher[]): void {
        for (let i = 0; i < data.length; i++) {
            let token = (this.tokens[this.pos + i] ?? EOF) as Token | EOF;
            this._expect(token, data[i]);
        }
    }

    isAtEnd(): boolean {
        return this.pos >= this.tokens.length;
    }

    try<T, U extends any[]>(func: (this: this, ...args: U) => T, ...args: U): T | undefined {
        try {
            return func.apply(this, args);
        } catch (error) {
            if (error instanceof CYYError) {
                return undefined;
            } else {
                throw error;
            }
        }
    }

    tryVoid<T extends any[]>(func: (this: this, ...args: T) => void, ...args: T): boolean {
        try {
            func.apply(this, args);
            return true;
        } catch (error) {
            if (error instanceof CYYError) {
                return false;
            } else {
                throw error;
            }
        }
    }

    _expect(token: Token | EOF, matcher: Matcher): void {
        if (this._match(token, matcher)) {
            return;
        }
        throw new Error(`Expected ${matcherToString(matcher)}, got ${tokenToString(token)}`);
    }

    eat<T extends Exclude<Matcher, EOF>>(matcher: T): MatcherReturnType<T> {
        this.expect(matcher);
        return this.advance<T>();
    }

}
