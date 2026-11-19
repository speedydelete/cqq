
import './globals.d.ts';

import * as path from 'node:path';
import {existsSync} from 'node:fs';
import * as fs from 'node:fs/promises';
import {execSync} from 'node:child_process';


export const BASE_INTERNAL_PATH = path.normalize(import.meta.dirname);

export function getInternalPath(...parts: string[]): string {
    return path.normalize(path.join(BASE_INTERNAL_PATH, ...parts));
}


export interface CTypeData {
    size: number;
    align: number;
    bits: number;
}

export const C_VALUES: {[key: string]: number} = {};

export const C_TYPES: {[key: string]: CTypeData} = {};

if (!existsSync(getInternalPath('.c_data.txt'))) {
    try {
        execSync(`cc -o '${getInternalPath('a.out')}' '${getInternalPath('src/data_getter.c')}'`, {stdio: ['ignore', 'ignore', 'inherit']});
    } catch (error) {
        console.error(`Error while compiling C data getter`);
        process.exit(1);
    }
    try {
        execSync(`'${getInternalPath('a.out')}' > ${getInternalPath('.c_data.txt')}`, {stdio: ['ignore', 'ignore', 'inherit']});
    } catch (error) {
        console.error(`Error while running C data getter`);
        process.exit(1);
    }
}

let data = (await fs.readFile(getInternalPath('.c_data.txt'))).toString();
for (let line of data.split('\n')) {
    let match: RegExpMatchArray | null;
    if (match = line.match(/^value (.+) = (-?\d+)$/)) {
        let name = match[1];
        let value = Number(match[2]);
        C_VALUES[name] = value;
    } else if (match = line.match(/^type (.+): size = (\d+), align = (\d+), bits = (\d+)$/)) {
        let name = match[1];
        let size = Number(match[2]);
        let align = Number(match[3]);
        let bits = Number(match[4]);
        C_TYPES[name] = {size, align, bits};
    } else {
        throw new Error(`Invalid line in .c_data.txt: '${line}'`);
    }
}

function getCValue<T>(data: {[key: string]: T}, name: string): T {
    let out = data[name];
    if (out === undefined) {
        console.error(`Error: C backend does not define ${name}`);
        process.exit(1);
    }
    return out;
}

export const C_VERSION = getCValue(C_VALUES, '__STDC_VERSION__');

export const CHAR_BIT = getCValue(C_VALUES, 'CHAR_BIT');

export const C_BOOL = getCValue(C_TYPES, 'bool');
export const C_CHAR = getCValue(C_TYPES, 'char');
export const C_SIGNED_CHAR = getCValue(C_TYPES, 'signed char');
export const C_UNSIGNED_CHAR = getCValue(C_TYPES, 'unsigned char');
export const C_INT = getCValue(C_TYPES, 'int');
export const C_UNSIGNED_INT = getCValue(C_TYPES, 'unsigned int');

export const C_FLOAT = getCValue(C_TYPES, 'float');
if (C_FLOAT.bits !== 32) {
    console.error(`C backend's float type is not 32 bits`);
    process.exit(1);
}

export const C_DOUBLE = getCValue(C_TYPES, 'double');
if (C_DOUBLE.bits !== 64) {
    console.error(`C backend's double type is not 64 bits`);
    process.exit(1);
}

export const C_POINTER = getCValue(C_TYPES, 'char*');

export const C_SIZE_T = getCValue(C_TYPES, 'size_t');
export const C_PTRDIFF_T = getCValue(C_TYPES, 'ptrdiff_t');
export const C_MAX_ALIGN_T = getCValue(C_TYPES, 'max_align_t');
export const C_UINTPTR_T = getCValue(C_TYPES, 'uintptr_t');



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


export const SYMBOLS = new Set([
    // basic
    '.', ',', ':', ';', '::',
    // grouping
    '(', ')', '[', ']', '{', '}',
    // arithmetic operators
    '+', '-', '*', '/', '%',
    // bitwise operators
    '~', '&', '|', '^', '<<', '>>',
    // relational operators
    '==', '!=', '<', '<=', '>', '>=',
    // logical operators
    '!', '&&', '||', '^^',
    // range creation operators
    '..<', '..=',
    // other operators
    '=', '<=<', '??', '?',
] as const);
export type CYYSymbol = typeof SYMBOLS extends Set<infer T> ? T : never;

export const KEYWORDS = new Set([
    // primitive types
    'never', 'void', 'bool', 'int', 'uint', 'size', 'ssize', 'uintptr', 'char', 'string', 'type', 'any', 'code',
    // operators
    'mut', 'volatile', 'typeof', 'template',
    // other constructs
    'struct', 'union', 'enum', 'class', 'auto',
    // control flow
    'if', 'else', 'for', 'while', 'break', 'continue', 'match', 'defer',
] as const);
export type BasicKeyword = typeof KEYWORDS extends Set<infer T> ? T : never;
export type Keyword = BasicKeyword | `int${number}` | `uint${number}` | `float${number}`;


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
    T extends 'intn' | 'uintn' | 'floatn' ? (T extends `${infer T extends 'int' | 'uint' | 'float'}n` ? KeywordToken<`${T}${number}`> : never) : 
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
