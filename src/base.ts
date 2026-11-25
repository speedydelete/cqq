
import './globals.d.ts';

import * as path from 'node:path';


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


export class CQQError extends Error {

    name: string = 'CQQError';
    [Symbol.toStringTag]: string = 'CQQError';

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
    throw new CQQError(pos, message);
}


export const EOF = Symbol();
export type EOF = typeof EOF;


export const PREFIX_OPERATORS = new Set([
    // numbers
    '+', '-', '~',
    // pointers
    '*', '&',
    // booleans
    '!',
    // types
    'mut', 'volatile',
    // general
    'decltype', 'typeof',
] as const);
export type PrefixOperator = typeof PREFIX_OPERATORS extends Set<infer T> ? T : never;

export const POSTFIX_OPERATORS = new Set([
    // types
    'mut', 'volatile', '*', '&'
] as const);
export type PostfixOperator = typeof POSTFIX_OPERATORS extends Set<infer T> ? T : never;

export const BINARY_OPERATORS = new Set([
    // numbers
    '+', '-', '*', '/', '%', '&', '|', '^', '<<', '>>',
    // scalars
    '<', '<=', '>', '>=', '..<', '..=',
    // booleans
    '&&', '||', '^^',
    // general
    '==', '!=', '~=', '~!=', '??',
    // assignment
    '=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>=',
    // member access
    '.', '->', '::',
] as const);
export type BinaryOperator = typeof BINARY_OPERATORS extends Set<infer T> ? T : never;


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
        // assignment
        '=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>=',
        // member access
        '.', '->', '::',
    // other
        // ternary conditional operator
        '?', ':',
] as const);

export type CQQSymbol = typeof SYMBOLS extends Set<infer T> ? T : never;

export const KEYWORDS = new Set([
    // literals
    'true', 'false', 'null',
    'never', 'void', 'bool', 'int', 'uint', 'float16', 'float32', 'float64', 'size', 'ssize', 'char', 'string', 'type', 'any', 'code',
    // operators
    'mut', 'volatile', 'decltype', 'typeof', 
    // declarations
    'struct', 'union', 'enum', 'class', 'namespace', 'template', 'operator',
    // declaration qualifiers
    'const', 'inline', 'alignas',
    // control flow
    'if', 'else', 'for', 'while', 'break', 'continue', 'match',
    // modules
    'module', 'import', 'export',
] as const);

export type BasicKeyword = typeof KEYWORDS extends Set<infer T> ? T : never;
export type Keyword = BasicKeyword | `int${number}` | `uint${number}`;


export const OVERLOAD_OPERATORS = new Set([
    // prefix unary
        // numbers
        'prefix +', 'prefix -', 'prefix ~',
        // pointers
        'prefix *', 'prefix &',
        // booleans
        'prefix !',
        // types
        'prefix mut', 'prefix volatile',
    // postfix unary
        // types
        'postfix mut', 'postfix volatile', 'postfix *', 'postfix &', 'postfix ?',
    // binary
        // numbers
        'binary +', 'binary -', 'binary *', 'binary /', 'binary %', 'binary &', 'binary |', 'binary ^', 'binary <<', 'binary >>',
        // scalars
        'binary <', 'binary <=', 'binary >', 'binary >=', 'binary ..<', 'binary ..=',
        // booleans
        'binary &&', 'binary ||', 'binary ^^',
        // general
        'binary ==', 'binary !=', 'binary ~=', 'binary ~!=', 'binary ??',
        // assignment
        'binary =', 'binary +=', 'binary -=', 'binary *=', 'binary /=', 'binary %=', 'binary &=', 'binary |=', 'binary ^=', 'binary <<=', 'binary >>=',
    // other
        // postfix
        'mixfix []', 'mixfix ()',
        // ternary conditional
        'mixfix ?:',
] as const);

export type OverloadOperator = typeof OVERLOAD_OPERATORS extends Set<infer T> ? T : never;
