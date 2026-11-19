export declare var ____: undefined;
declare global {
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0
THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABILITY OR NON-INFRINGEMENT.
See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var NaN: number;
var Infinity: number;
function eval(x: string): any;
function parseInt(string: string, radix?: number): number;
function parseFloat(string: string): number;
function isNaN(number: number): boolean;
function isFinite(number: number): boolean;
function decodeURI(encodedURI: string): string;
function decodeURIComponent(encodedURIComponent: string): string;
function encodeURI(uri: string): string;
function encodeURIComponent(uriComponent: string | number | boolean): string;
function escape(string: string): string;
function unescape(string: string): string;
interface Symbol {
    toString(): string;
    valueOf(): symbol;
    [Symbol.toPrimitive](hint: string): symbol;
    readonly [Symbol.toStringTag]: string;
}
type PropertyKey = string | number | symbol;
interface PropertyDescriptor {
    configurable?: boolean;
    enumerable?: boolean;
    value?: any;
    writable?: boolean;
    get?(): any;
    set?(v: any): void;
}
interface PropertyDescriptorMap {
    [key: PropertyKey]: PropertyDescriptor;
}
interface Object {
    constructor: Function;
    toString(): string;
    toLocaleString(): string;
    valueOf(): Object;
    hasOwnProperty(v: PropertyKey): boolean;
    isPrototypeOf(v: Object): boolean;
    propertyIsEnumerable(v: PropertyKey): boolean;
}
interface ObjectConstructor {
    new (value?: any): Object;
    (): any;
    (value: any): any;
    readonly prototype: Object;
    getPrototypeOf(o: any): any;
    getOwnPropertyDescriptor(o: any, p: PropertyKey): PropertyDescriptor | undefined;
    getOwnPropertyNames(o: any): string[];
    create(o: object | null): any;
    create(o: object | null, properties: PropertyDescriptorMap & ThisType<any>): any;
    defineProperty<T>(o: T, p: PropertyKey, attributes: PropertyDescriptor & ThisType<any>): T;
    defineProperties<T>(o: T, properties: PropertyDescriptorMap & ThisType<any>): T;
    seal<T>(o: T): T;
    freeze<T extends Function>(f: T): T;
    freeze<T extends { [idx: string]: U | null | undefined | object; }, U extends string | bigint | number | boolean | symbol>(o: T): Readonly<T>;
    freeze<T>(o: T): Readonly<T>;
    preventExtensions<T>(o: T): T;
    isSealed(o: any): boolean;
    isFrozen(o: any): boolean;
    isExtensible(o: any): boolean;
    keys(o: object): string[];
    assign<T extends {}, U>(target: T, source: U): T & U;
    assign<T extends {}, U, V>(target: T, source1: U, source2: V): T & U & V;
    assign<T extends {}, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
    assign(target: object, ...sources: any[]): any;
    getOwnPropertySymbols(o: any): symbol[];
    keys(o: {}): string[];
    is(value1: any, value2: any): boolean;
    setPrototypeOf(o: any, proto: object | null): any;
    values<T>(o: { [s: string]: T; } | ArrayLike<T>): T[];
    values(o: {}): any[];
    entries<T>(o: { [s: string]: T; } | ArrayLike<T>): [string, T][];
    entries(o: {}): [string, any][];
    getOwnPropertyDescriptors<T>(o: T): { [P in keyof T]: TypedPropertyDescriptor<T[P]>; } & { [x: string]: PropertyDescriptor; };
    fromEntries<T = any>(entries: Iterable<readonly [PropertyKey, T]>): { [k: string]: T; };
    fromEntries(entries: Iterable<readonly any[]>): any;
    hasOwn(o: object, v: PropertyKey): boolean;
    groupBy<K extends PropertyKey, T>(
        items: Iterable<T>,
        keySelector: (item: T, index: number) => K,
    ): Partial<Record<K, T[]>>;
}
var Object: ObjectConstructor;
interface Function {
    apply(this: Function, thisArg: any, argArray?: any): any;
    call(this: Function, thisArg: any, ...argArray: any[]): any;
    bind(this: Function, thisArg: any, ...argArray: any[]): any;
    toString(): string;
    prototype: any;
    readonly length: number;
    arguments: any;
    caller: Function;
    readonly name: string;
}
interface FunctionConstructor {
    new (...args: string[]): Function;
    (...args: string[]): Function;
    readonly prototype: Function;
    [Symbol.hasInstance](value: any): boolean;
    [Symbol.metadata]: DecoratorMetadata | null;
}
var Function: FunctionConstructor;
type ThisParameterType<T> = T extends (this: infer U, ...args: never) => any ? U : unknown;
type OmitThisParameter<T> = unknown extends ThisParameterType<T> ? T : T extends (...args: infer A) => infer R ? (...args: A) => R : T;
interface CallableFunction extends Function {
    apply<T, R>(this: (this: T) => R, thisArg: T): R;
    apply<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T, args: A): R;
    call<T, A extends any[], R>(this: (this: T, ...args: A) => R, thisArg: T, ...args: A): R;
    bind<T>(this: T, thisArg: ThisParameterType<T>): OmitThisParameter<T>;
    bind<T, A extends any[], B extends any[], R>(this: (this: T, ...args: [...A, ...B]) => R, thisArg: T, ...args: A): (...args: B) => R;
}
interface NewableFunction extends Function {
    apply<T>(this: new () => T, thisArg: T): void;
    apply<T, A extends any[]>(this: new (...args: A) => T, thisArg: T, args: A): void;
    call<T, A extends any[]>(this: new (...args: A) => T, thisArg: T, ...args: A): void;
    bind<T>(this: T, thisArg: any): T;
    bind<A extends any[], B extends any[], R>(this: new (...args: [...A, ...B]) => R, thisArg: any, ...args: A): new (...args: B) => R;
}
interface IArguments {
    [index: number]: any;
    length: number;
    callee: Function;
    [Symbol.iterator](): ArrayIterator<any>;
}
interface String {
    toString(): string;
    charAt(pos: number): string;
    charCodeAt(index: number): number;
    concat(...strings: string[]): string;
    indexOf(searchString: string, position?: number): number;
    lastIndexOf(searchString: string, position?: number): number;
    localeCompare(that: string): number;
    match(regexp: string | RegExp): RegExpMatchArray | null;
    replace(searchValue: string | RegExp, replaceValue: string): string;
    replace(searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
    search(regexp: string | RegExp): number;
    slice(start?: number, end?: number): string;
    split(separator: string | RegExp, limit?: number): string[];
    substring(start: number, end?: number): string;
    toLowerCase(): string;
    toLocaleLowerCase(locales?: string | string[]): string;
    toUpperCase(): string;
    toLocaleUpperCase(locales?: string | string[]): string;
    trim(): string;
    readonly length: number;
    substr(from: number, length?: number): string;
    valueOf(): string;
    readonly [index: number]: string;
    codePointAt(pos: number): number | undefined;
    includes(searchString: string, position?: number): boolean;
    endsWith(searchString: string, endPosition?: number): boolean;
    normalize(form: "NFC" | "NFD" | "NFKC" | "NFKD"): string;
    normalize(form?: string): string;
    repeat(count: number): string;
    startsWith(searchString: string, position?: number): boolean;
    anchor(name: string): string;
    big(): string;
    blink(): string;
    bold(): string;
    fixed(): string;
    fontcolor(color: string): string;
    fontsize(size: number): string;
    fontsize(size: string): string;
    italics(): string;
    link(url: string): string;
    small(): string;
    strike(): string;
    sub(): string;
    sup(): string;
    [Symbol.iterator](): StringIterator<string>;
    match(matcher: { [Symbol.match](string: string): RegExpMatchArray | null; }): RegExpMatchArray | null;
    replace(searchValue: { [Symbol.replace](string: string, replaceValue: string): string; }, replaceValue: string): string;
    replace(searchValue: { [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string; }, replacer: (substring: string, ...args: any[]) => string): string;
    search(searcher: { [Symbol.search](string: string): number; }): number;
    split(splitter: { [Symbol.split](string: string, limit?: number): string[]; }, limit?: number): string[];
    padStart(maxLength: number, fillString?: string): string;
    padEnd(maxLength: number, fillString?: string): string;
    trimEnd(): string;
    trimStart(): string;
    trimLeft(): string;
    trimRight(): string;
    matchAll(regexp: RegExp): RegExpStringIterator<RegExpExecArray>;
    toLocaleLowerCase(locales?: Intl.LocalesArgument): string;
    toLocaleUpperCase(locales?: Intl.LocalesArgument): string;
    localeCompare(that: string, locales?: Intl.LocalesArgument, options?: Intl.CollatorOptions): number;
    replaceAll(searchValue: string | RegExp, replaceValue: string): string;
    replaceAll(searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
    at(index: number): string | undefined;
    isWellFormed(): boolean;
    toWellFormed(): string;
}
interface StringConstructor {
    new (value?: any): String;
    (value?: any): string;
    readonly prototype: String;
    fromCharCode(...codes: number[]): string;
    localeCompare(that: string, locales?: string | string[], options?: Intl.CollatorOptions): number;
    fromCodePoint(...codePoints: number[]): string;
    raw(template: { raw: readonly string[] | ArrayLike<string>; }, ...substitutions: any[]): string;
}
var String: StringConstructor;
interface Boolean {
    valueOf(): boolean;
}
interface BooleanConstructor {
    new (value?: any): Boolean;
    <T>(value?: T): boolean;
    readonly prototype: Boolean;
}
var Boolean: BooleanConstructor;
interface Number {
    toString(radix?: number): string;
    toFixed(fractionDigits?: number): string;
    toExponential(fractionDigits?: number): string;
    toPrecision(precision?: number): string;
    valueOf(): number;
    toLocaleString(locales?: string | string[], options?: Intl.NumberFormatOptions): string;
    toLocaleString(locales?: Intl.LocalesArgument, options?: Intl.NumberFormatOptions): string;
}
interface NumberConstructor {
    new (value?: any): Number;
    (value?: any): number;
    readonly prototype: Number;
    readonly MAX_VALUE: number;
    readonly MIN_VALUE: number;
    readonly NaN: number;
    readonly NEGATIVE_INFINITY: number;
    readonly POSITIVE_INFINITY: number;
    readonly EPSILON: number;
    isFinite(number: unknown): boolean;
    isInteger(number: unknown): boolean;
    isNaN(number: unknown): boolean;
    isSafeInteger(number: unknown): boolean;
    readonly MAX_SAFE_INTEGER: number;
    readonly MIN_SAFE_INTEGER: number;
    parseFloat(string: string): number;
    parseInt(string: string, radix?: number): number;
}
var Number: NumberConstructor;
interface TemplateStringsArray extends ReadonlyArray<string> {
    readonly raw: readonly string[];
}
interface ImportMeta {
}
interface ImportCallOptions {
 assert?: ImportAssertions;
    with?: ImportAttributes;
}
interface ImportAssertions {
    [key: string]: string;
}
interface ImportAttributes {
    [key: string]: string;
}
interface Math {
    readonly E: number;
    readonly LN10: number;
    readonly LN2: number;
    readonly LOG2E: number;
    readonly LOG10E: number;
    readonly PI: number;
    readonly SQRT1_2: number;
    readonly SQRT2: number;
    abs(x: number): number;
    acos(x: number): number;
    asin(x: number): number;
    atan(x: number): number;
    atan2(y: number, x: number): number;
    ceil(x: number): number;
    cos(x: number): number;
    exp(x: number): number;
    floor(x: number): number;
    log(x: number): number;
    max(...values: number[]): number;
    min(...values: number[]): number;
    pow(x: number, y: number): number;
    random(): number;
    round(x: number): number;
    sin(x: number): number;
    sqrt(x: number): number;
    tan(x: number): number;
    clz32(x: number): number;
    imul(x: number, y: number): number;
    sign(x: number): number;
    log10(x: number): number;
    log2(x: number): number;
    log1p(x: number): number;
    expm1(x: number): number;
    cosh(x: number): number;
    sinh(x: number): number;
    tanh(x: number): number;
    acosh(x: number): number;
    asinh(x: number): number;
    atanh(x: number): number;
    hypot(...values: number[]): number;
    trunc(x: number): number;
    fround(x: number): number;
    cbrt(x: number): number;
    readonly [Symbol.toStringTag]: string;
    f16round(x: number): number;
}
var Math: Math;
interface Date {
    toString(): string;
    toDateString(): string;
    toTimeString(): string;
    toLocaleString(): string;
    toLocaleDateString(): string;
    toLocaleTimeString(): string;
    valueOf(): number;
    getTime(): number;
    getFullYear(): number;
    getUTCFullYear(): number;
    getMonth(): number;
    getUTCMonth(): number;
    getDate(): number;
    getUTCDate(): number;
    getDay(): number;
    getUTCDay(): number;
    getHours(): number;
    getUTCHours(): number;
    getMinutes(): number;
    getUTCMinutes(): number;
    getSeconds(): number;
    getUTCSeconds(): number;
    getMilliseconds(): number;
    getUTCMilliseconds(): number;
    getTimezoneOffset(): number;
    setTime(time: number): number;
    setMilliseconds(ms: number): number;
    setUTCMilliseconds(ms: number): number;
    setSeconds(sec: number, ms?: number): number;
    setUTCSeconds(sec: number, ms?: number): number;
    setMinutes(min: number, sec?: number, ms?: number): number;
    setUTCMinutes(min: number, sec?: number, ms?: number): number;
    setHours(hours: number, min?: number, sec?: number, ms?: number): number;
    setUTCHours(hours: number, min?: number, sec?: number, ms?: number): number;
    setDate(date: number): number;
    setUTCDate(date: number): number;
    setMonth(month: number, date?: number): number;
    setUTCMonth(month: number, date?: number): number;
    setFullYear(year: number, month?: number, date?: number): number;
    setUTCFullYear(year: number, month?: number, date?: number): number;
    toUTCString(): string;
    toISOString(): string;
    toJSON(key?: any): string;
    toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
    toLocaleDateString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
    toLocaleTimeString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;
    [Symbol.toPrimitive](hint: "default"): string;
    [Symbol.toPrimitive](hint: "string"): string;
    [Symbol.toPrimitive](hint: "number"): number;
    [Symbol.toPrimitive](hint: string): string | number;
    toLocaleString(locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions): string;
    toLocaleDateString(locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions): string;
    toLocaleTimeString(locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions): string;
    toTemporalInstant(): Temporal.Instant;
}
interface DateConstructor {
    new (): Date;
    new (value: number | string): Date;
    new (year: number, monthIndex: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): Date;
    (): string;
    readonly prototype: Date;
    parse(s: string): number;
    UTC(year: number, monthIndex: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): number;
    now(): number;
    new (value: number | string | Date): Date;
    UTC(year: number, monthIndex?: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): number;
}
var Date: DateConstructor;
interface RegExpMatchArray extends Array<string> {
    index?: number;
    input?: string;
    0: string;
    groups?: {
        [key: string]: string;
    };
    indices?: RegExpIndicesArray;
}
interface RegExpExecArray extends Array<string> {
    index: number;
    input: string;
    0: string;
    indices?: RegExpIndicesArray;
    groups?: {
        [key: string]: string;
    };
}
interface RegExp {
    exec(string: string): RegExpExecArray | null;
    test(string: string): boolean;
    readonly source: string;
    readonly global: boolean;
    readonly ignoreCase: boolean;
    readonly multiline: boolean;
    lastIndex: number;
    compile(pattern: string, flags?: string): this;
    readonly flags: string;
    readonly sticky: boolean;
    readonly unicode: boolean;
    [Symbol.match](string: string): RegExpMatchArray | null;
    [Symbol.replace](string: string, replaceValue: string): string;
    [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string;
    [Symbol.search](string: string): number;
    [Symbol.split](string: string, limit?: number): string[];
    readonly dotAll: boolean;
    [Symbol.matchAll](str: string): RegExpStringIterator<RegExpExecArray>;
    readonly hasIndices: boolean;
    readonly unicodeSets: boolean;
}
interface RegExpConstructor {
    new (pattern: RegExp | string): RegExp;
    new (pattern: string, flags?: string): RegExp;
    (pattern: RegExp | string): RegExp;
    (pattern: string, flags?: string): RegExp;
    readonly "prototype": RegExp;
    "$1": string;
    "$2": string;
    "$3": string;
    "$4": string;
    "$5": string;
    "$6": string;
    "$7": string;
    "$8": string;
    "$9": string;
    "input": string;
    "$_": string;
    "lastMatch": string;
    "$&": string;
    "lastParen": string;
    "$+": string;
    "leftContext": string;
    "$`": string;
    "rightContext": string;
    "$'": string;
    escape(string: string): string;
    new (pattern: RegExp | string, flags?: string): RegExp;
    (pattern: RegExp | string, flags?: string): RegExp;
    readonly [Symbol.species]: RegExpConstructor;
}
var RegExp: RegExpConstructor;
interface Error {
    name: string;
    message: string;
    stack?: string;
    cause?: unknown;
}
interface ErrorConstructor {
    new (message?: string): Error;
    (message?: string): Error;
    readonly prototype: Error;
    new (message?: string, options?: ErrorOptions): Error;
    (message?: string, options?: ErrorOptions): Error;
    isError(error: unknown): error is Error;
}
var Error: ErrorConstructor;
interface EvalError extends Error {
}
interface EvalErrorConstructor extends ErrorConstructor {
    new (message?: string): EvalError;
    (message?: string): EvalError;
    readonly prototype: EvalError;
    new (message?: string, options?: ErrorOptions): EvalError;
    (message?: string, options?: ErrorOptions): EvalError;
}
var EvalError: EvalErrorConstructor;
interface RangeError extends Error {
}
interface RangeErrorConstructor extends ErrorConstructor {
    new (message?: string): RangeError;
    (message?: string): RangeError;
    readonly prototype: RangeError;
    new (message?: string, options?: ErrorOptions): RangeError;
    (message?: string, options?: ErrorOptions): RangeError;
}
var RangeError: RangeErrorConstructor;
interface ReferenceError extends Error {
}
interface ReferenceErrorConstructor extends ErrorConstructor {
    new (message?: string): ReferenceError;
    (message?: string): ReferenceError;
    readonly prototype: ReferenceError;
    new (message?: string, options?: ErrorOptions): ReferenceError;
    (message?: string, options?: ErrorOptions): ReferenceError;
}
var ReferenceError: ReferenceErrorConstructor;
interface SyntaxError extends Error {
}
interface SyntaxErrorConstructor extends ErrorConstructor {
    new (message?: string): SyntaxError;
    (message?: string): SyntaxError;
    readonly prototype: SyntaxError;
    new (message?: string, options?: ErrorOptions): SyntaxError;
    (message?: string, options?: ErrorOptions): SyntaxError;
}
var SyntaxError: SyntaxErrorConstructor;
interface TypeError extends Error {
}
interface TypeErrorConstructor extends ErrorConstructor {
    new (message?: string): TypeError;
    (message?: string): TypeError;
    readonly prototype: TypeError;
    new (message?: string, options?: ErrorOptions): TypeError;
    (message?: string, options?: ErrorOptions): TypeError;
}
var TypeError: TypeErrorConstructor;
interface URIError extends Error {
}
interface URIErrorConstructor extends ErrorConstructor {
    new (message?: string): URIError;
    (message?: string): URIError;
    readonly prototype: URIError;
    new (message?: string, options?: ErrorOptions): URIError;
    (message?: string, options?: ErrorOptions): URIError;
}
var URIError: URIErrorConstructor;
interface JSON {
    parse(text: string, reviver?: (this: any, key: string, value: any) => any): any;
    stringify(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
    stringify(value: any, replacer?: (number | string)[] | null, space?: string | number): string;
    readonly [Symbol.toStringTag]: string;
}
var JSON: JSON;
interface ReadonlyArray<T> {
    readonly length: number;
    toString(): string;
    toLocaleString(): string;
    concat(...items: ConcatArray<T>[]): T[];
    concat(...items: (T | ConcatArray<T>)[]): T[];
    join(separator?: string): string;
    slice(start?: number, end?: number): T[];
    indexOf(searchElement: T, fromIndex?: number): number;
    lastIndexOf(searchElement: T, fromIndex?: number): number;
    every<S extends T>(predicate: (value: T, index: number, array: readonly T[]) => value is S, thisArg?: any): this is readonly S[];
    every(predicate: (value: T, index: number, array: readonly T[]) => unknown, thisArg?: any): boolean;
    some(predicate: (value: T, index: number, array: readonly T[]) => unknown, thisArg?: any): boolean;
    forEach(callbackfn: (value: T, index: number, array: readonly T[]) => void, thisArg?: any): void;
    map<U>(callbackfn: (value: T, index: number, array: readonly T[]) => U, thisArg?: any): U[];
    filter<S extends T>(predicate: (value: T, index: number, array: readonly T[]) => value is S, thisArg?: any): S[];
    filter(predicate: (value: T, index: number, array: readonly T[]) => unknown, thisArg?: any): T[];
    reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: readonly T[]) => T): T;
    reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: readonly T[]) => T, initialValue: T): T;
    reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: readonly T[]) => U, initialValue: U): U;
    reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: readonly T[]) => T): T;
    reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: readonly T[]) => T, initialValue: T): T;
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: readonly T[]) => U, initialValue: U): U;
    readonly [n: number]: T;
    find<S extends T>(predicate: (value: T, index: number, obj: readonly T[]) => value is S, thisArg?: any): S | undefined;
    find(predicate: (value: T, index: number, obj: readonly T[]) => unknown, thisArg?: any): T | undefined;
    findIndex(predicate: (value: T, index: number, obj: readonly T[]) => unknown, thisArg?: any): number;
    toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions & Intl.DateTimeFormatOptions): string;
    [Symbol.iterator](): ArrayIterator<T>;
    entries(): ArrayIterator<[number, T]>;
    keys(): ArrayIterator<number>;
    values(): ArrayIterator<T>;
    readonly [Symbol.unscopables]: {
        [K in keyof readonly any[]]?: boolean;
    };
    includes(searchElement: T, fromIndex?: number): boolean;
    flat<A, D extends number = 1>(
        this: A,
        depth?: D,
    ): FlatArray<A, D>[];
    at(index: number): T | undefined;
    findLast<S extends T>(
        predicate: (value: T, index: number, array: readonly T[]) => value is S,
        thisArg?: any,
    ): S | undefined;
    findLast(
        predicate: (value: T, index: number, array: readonly T[]) => unknown,
        thisArg?: any,
    ): T | undefined;
    findLastIndex(
        predicate: (value: T, index: number, array: readonly T[]) => unknown,
        thisArg?: any,
    ): number;
    toReversed(): T[];
    toSorted(compareFn?: (a: T, b: T) => number): T[];
    toSpliced(start: number, deleteCount: number, ...items: T[]): T[];
    toSpliced(start: number, deleteCount?: number): T[];
    with(index: number, value: T): T[];
}
interface ConcatArray<T> {
    readonly length: number;
    readonly [n: number]: T;
    join(separator?: string): string;
    slice(start?: number, end?: number): T[];
}
interface Array<T> {
    length: number;
    toString(): string;
    toLocaleString(): string;
    pop(): T | undefined;
    push(...items: T[]): number;
    concat(...items: ConcatArray<T>[]): T[];
    concat(...items: (T | ConcatArray<T>)[]): T[];
    join(separator?: string): string;
    reverse(): T[];
    shift(): T | undefined;
    slice(start?: number, end?: number): T[];
    sort(compareFn?: (a: T, b: T) => number): this;
    splice(start: number, deleteCount?: number): T[];
    splice(start: number, deleteCount: number, ...items: T[]): T[];
    unshift(...items: T[]): number;
    indexOf(searchElement: T, fromIndex?: number): number;
    lastIndexOf(searchElement: T, fromIndex?: number): number;
    every<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): this is S[];
    every(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean;
    some(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean;
    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
    map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
    filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];
    filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[];
    reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
    reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
    reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
    reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
    reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
    [n: number]: T;
    find<S extends T>(predicate: (value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined;
    find(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined;
    findIndex(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): number;
    fill(value: T, start?: number, end?: number): this;
    copyWithin(target: number, start: number, end?: number): this;
    toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions & Intl.DateTimeFormatOptions): string;
    [Symbol.iterator](): ArrayIterator<T>;
    entries(): ArrayIterator<[number, T]>;
    keys(): ArrayIterator<number>;
    values(): ArrayIterator<T>;
    readonly [Symbol.unscopables]: {
        [K in keyof any[]]?: boolean;
    };
    includes(searchElement: T, fromIndex?: number): boolean;
    flat<A, D extends number = 1>(
        this: A,
        depth?: D,
    ): FlatArray<A, D>[];
    at(index: number): T | undefined;
    findLast<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S | undefined;
    findLast(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T | undefined;
    findLastIndex(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): number;
    toReversed(): T[];
    toSorted(compareFn?: (a: T, b: T) => number): T[];
    toSpliced(start: number, deleteCount: number, ...items: T[]): T[];
    toSpliced(start: number, deleteCount?: number): T[];
    with(index: number, value: T): T[];
}
interface ArrayConstructor {
    new (arrayLength?: number): any[];
    new <T>(arrayLength: number): T[];
    new <T>(...items: T[]): T[];
    (arrayLength?: number): any[];
    <T>(arrayLength: number): T[];
    <T>(...items: T[]): T[];
    isArray(arg: any): arg is any[];
    readonly prototype: any[];
    from<T>(arrayLike: ArrayLike<T>): T[];
    from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
    of<T>(...items: T[]): T[];
    from<T>(iterable: Iterable<T> | ArrayLike<T>): T[];
    from<T, U>(iterable: Iterable<T> | ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
    readonly [Symbol.species]: ArrayConstructor;
    fromAsync<T>(iterableOrArrayLike: AsyncIterable<T> | Iterable<T | PromiseLike<T>> | ArrayLike<T | PromiseLike<T>>): Promise<T[]>;
    fromAsync<T, U>(iterableOrArrayLike: AsyncIterable<T> | Iterable<T> | ArrayLike<T>, mapFn: (value: Awaited<T>, index: number) => U, thisArg?: any): Promise<Awaited<U>[]>;
}
var Array: ArrayConstructor;
interface TypedPropertyDescriptor<T> {
    enumerable?: boolean;
    configurable?: boolean;
    writable?: boolean;
    value?: T;
    get?: () => T;
    set?: (value: T) => void;
}
type PromiseConstructorLike = new <T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) => PromiseLike<T>;
interface PromiseLike<T> {
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): PromiseLike<TResult1 | TResult2>;
}
interface Promise<T> {
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    readonly [Symbol.toStringTag]: string;
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}
type Awaited<T> = T extends null | undefined ? T :
    T extends object & { then(onfulfilled: infer F, ...args: infer _): any; } ?
        F extends ((value: infer V, ...args: infer _) => any) ?
            Awaited<V> :
        never :
    T;
interface ArrayLike<T> {
    readonly length: number;
    readonly [n: number]: T;
}
type Partial<T> = {
    [P in keyof T]?: T[P];
};
type Required<T> = {
    [P in keyof T]-?: T[P];
};
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
type Exclude<T, U> = T extends U ? never : T;
type Extract<T, U> = T extends U ? T : never;
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
type NonNullable<T> = T & {};
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
type ConstructorParameters<T extends abstract new (...args: any) => any> = T extends abstract new (...args: infer P) => any ? P : never;
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;
type Uppercase<S extends string> = intrinsic;
type Lowercase<S extends string> = intrinsic;
type Capitalize<S extends string> = intrinsic;
type Uncapitalize<S extends string> = intrinsic;
type NoInfer<T> = intrinsic;
interface ThisType<T> {}
interface WeakKeyTypes {
    object: object;
    symbol: symbol;
}
type WeakKey = WeakKeyTypes[keyof WeakKeyTypes];
interface ArrayBuffer {
    readonly byteLength: number;
    slice(begin?: number, end?: number): ArrayBuffer;
    readonly [Symbol.toStringTag]: "ArrayBuffer";
    get maxByteLength(): number;
    get resizable(): boolean;
    resize(newByteLength?: number): void;
    get detached(): boolean;
    transfer(newByteLength?: number): ArrayBuffer;
    transferToFixedLength(newByteLength?: number): ArrayBuffer;
}
interface ArrayBufferTypes {
    ArrayBuffer: ArrayBuffer;
    SharedArrayBuffer: SharedArrayBuffer;
}
type ArrayBufferLike = ArrayBufferTypes[keyof ArrayBufferTypes];
interface ArrayBufferConstructor {
    readonly prototype: ArrayBuffer;
    new (byteLength: number): ArrayBuffer;
    isView(arg: any): arg is ArrayBufferView;
    readonly [Symbol.species]: ArrayBufferConstructor;
    new (): ArrayBuffer;
    new (byteLength: number, options?: { maxByteLength?: number; }): ArrayBuffer;
}
var ArrayBuffer: ArrayBufferConstructor;
interface ArrayBufferView<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    readonly buffer: TArrayBuffer;
    readonly byteLength: number;
    readonly byteOffset: number;
}
interface DataView<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    readonly buffer: TArrayBuffer;
    readonly byteLength: number;
    readonly byteOffset: number;
    getFloat32(byteOffset: number, littleEndian?: boolean): number;
    getFloat64(byteOffset: number, littleEndian?: boolean): number;
    getInt8(byteOffset: number): number;
    getInt16(byteOffset: number, littleEndian?: boolean): number;
    getInt32(byteOffset: number, littleEndian?: boolean): number;
    getUint8(byteOffset: number): number;
    getUint16(byteOffset: number, littleEndian?: boolean): number;
    getUint32(byteOffset: number, littleEndian?: boolean): number;
    setFloat32(byteOffset: number, value: number, littleEndian?: boolean): void;
    setFloat64(byteOffset: number, value: number, littleEndian?: boolean): void;
    setInt8(byteOffset: number, value: number): void;
    setInt16(byteOffset: number, value: number, littleEndian?: boolean): void;
    setInt32(byteOffset: number, value: number, littleEndian?: boolean): void;
    setUint8(byteOffset: number, value: number): void;
    setUint16(byteOffset: number, value: number, littleEndian?: boolean): void;
    setUint32(byteOffset: number, value: number, littleEndian?: boolean): void;
    readonly [Symbol.toStringTag]: string;
    getBigInt64(byteOffset: number, littleEndian?: boolean): bigint;
    getBigUint64(byteOffset: number, littleEndian?: boolean): bigint;
    setBigInt64(byteOffset: number, value: bigint, littleEndian?: boolean): void;
    setBigUint64(byteOffset: number, value: bigint, littleEndian?: boolean): void;
    getFloat16(byteOffset: number, littleEndian?: boolean): number;
    setFloat16(byteOffset: number, value: number, littleEndian?: boolean): void;
}
interface DataViewConstructor {
    readonly prototype: DataView<ArrayBufferLike>;
    new <TArrayBuffer extends ArrayBufferLike & { BYTES_PER_ELEMENT?: never; }>(buffer: TArrayBuffer, byteOffset?: number, byteLength?: number): DataView<TArrayBuffer>;
}
var DataView: DataViewConstructor;
interface Int8Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    readonly BYTES_PER_ELEMENT: number;
    readonly buffer: TArrayBuffer;
    readonly byteLength: number;
    readonly byteOffset: number;
    copyWithin(target: number, start: number, end?: number): this;
    every(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;
    fill(value: number, start?: number, end?: number): this;
    filter(predicate: (value: number, index: number, array: this) => any, thisArg?: any): Int8Array<ArrayBuffer>;
    find(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number | undefined;
    findIndex(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number;
    forEach(callbackfn: (value: number, index: number, array: this) => void, thisArg?: any): void;
    indexOf(searchElement: number, fromIndex?: number): number;
    join(separator?: string): string;
    lastIndexOf(searchElement: number, fromIndex?: number): number;
    readonly length: number;
    map(callbackfn: (value: number, index: number, array: this) => number, thisArg?: any): Int8Array<ArrayBuffer>;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;
    reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;
    reverse(): this;
    set(array: ArrayLike<number>, offset?: number): void;
    slice(start?: number, end?: number): Int8Array<ArrayBuffer>;
    some(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;
    sort(compareFn?: (a: number, b: number) => number): this;
    subarray(begin?: number, end?: number): Int8Array<TArrayBuffer>;
    toLocaleString(): string;
    toString(): string;
    valueOf(): this;
    [index: number]: number;
    toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions): string;
    [Symbol.iterator](): ArrayIterator<number>;
    entries(): ArrayIterator<[number, number]>;
    keys(): ArrayIterator<number>;
    values(): ArrayIterator<number>;
    readonly [Symbol.toStringTag]: "Int8Array";
    includes(searchElement: number, fromIndex?: number): boolean;
    at(index: number): number | undefined;
    findLast<S extends number>(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => value is S,
        thisArg?: any,
    ): S | undefined;
    findLast(
        predicate: (value: number, index: number, array: this) => unknown,
        thisArg?: any,
    ): number | undefined;
    findLastIndex(
        predicate: (value: number, index: number, array: this) => unknown,
        thisArg?: any,
    ): number;
    toReversed(): Int8Array<ArrayBuffer>;
    toSorted(compareFn?: (a: number, b: number) => number): Int8Array<ArrayBuffer>;
    with(index: number, value: number): Int8Array<ArrayBuffer>;
}
interface Int8ArrayConstructor {
    readonly prototype: Int8Array<ArrayBufferLike>;
    new (length: number): Int8Array<ArrayBuffer>;
    new (array: ArrayLike<number>): Int8Array<ArrayBuffer>;
    new <TArrayBuffer extends ArrayBufferLike = ArrayBuffer>(buffer: TArrayBuffer, byteOffset?: number, length?: number): Int8Array<TArrayBuffer>;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Int8Array<ArrayBuffer>;
    new (array: ArrayLike<number> | ArrayBuffer): Int8Array<ArrayBuffer>;
    readonly BYTES_PER_ELEMENT: number;
    of(...items: number[]): Int8Array<ArrayBuffer>;
    from(arrayLike: ArrayLike<number>): Int8Array<ArrayBuffer>;
    from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any): Int8Array<ArrayBuffer>;
    new (elements: Iterable<number>): Int8Array<ArrayBuffer>;
    from(elements: Iterable<number>): Int8Array<ArrayBuffer>;
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Int8Array<ArrayBuffer>;
    new (): Int8Array<ArrayBuffer>;
}
var Int8Array: Int8ArrayConstructor;
interface Uint8Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    readonly BYTES_PER_ELEMENT: number;
    readonly buffer: TArrayBuffer;
    readonly byteLength: number;
    readonly byteOffset: number;
    copyWithin(target: number, start: number, end?: number): this;
    every(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;
    fill(value: number, start?: number, end?: number): this;
    filter(predicate: (value: number, index: number, array: this) => any, thisArg?: any): Uint8Array<ArrayBuffer>;
    find(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number | undefined;
    findIndex(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number;
    forEach(callbackfn: (value: number, index: number, array: this) => void, thisArg?: any): void;
    indexOf(searchElement: number, fromIndex?: number): number;
    join(separator?: string): string;
    lastIndexOf(searchElement: number, fromIndex?: number): number;
    readonly length: number;
    map(callbackfn: (value: number, index: number, array: this) => number, thisArg?: any): Uint8Array<ArrayBuffer>;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;
    reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;
    reverse(): this;
    set(array: ArrayLike<number>, offset?: number): void;
    slice(start?: number, end?: number): Uint8Array<ArrayBuffer>;
    some(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;
    sort(compareFn?: (a: number, b: number) => number): this;
    subarray(begin?: number, end?: number): Uint8Array<TArrayBuffer>;
    toLocaleString(): string;
    toString(): string;
    valueOf(): this;
    [index: number]: number;
}
interface Uint8ArrayConstructor {
    readonly prototype: Uint8Array<ArrayBufferLike>;
    new (length: number): Uint8Array<ArrayBuffer>;
    new (array: ArrayLike<number>): Uint8Array<ArrayBuffer>;
    new <TArrayBuffer extends ArrayBufferLike = ArrayBuffer>(buffer: TArrayBuffer, byteOffset?: number, length?: number): Uint8Array<TArrayBuffer>;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Uint8Array<ArrayBuffer>;
    new (array: ArrayLike<number> | ArrayBuffer): Uint8Array<ArrayBuffer>;
    readonly BYTES_PER_ELEMENT: number;
    of(...items: number[]): Uint8Array<ArrayBuffer>;
    from(arrayLike: ArrayLike<number>): Uint8Array<ArrayBuffer>;
    from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any): Uint8Array<ArrayBuffer>;
}
var Uint8Array: Uint8ArrayConstructor;
interface Uint8ClampedArray<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    readonly BYTES_PER_ELEMENT: number;
    readonly buffer: TArrayBuffer;
    readonly byteLength: number;
    readonly byteOffset: number;
    copyWithin(target: number, start: number, end?: number): this;
    every(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;
    fill(value: number, start?: number, end?: number): this;
    filter(predicate: (value: number, index: number, array: this) => any, thisArg?: any): Uint8ClampedArray<ArrayBuffer>;
    find(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number | undefined;
    findIndex(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number;
    forEach(callbackfn: (value: number, index: number, array: this) => void, thisArg?: any): void;
    indexOf(searchElement: number, fromIndex?: number): number;
    join(separator?: string): string;
    lastIndexOf(searchElement: number, fromIndex?: number): number;
    readonly length: number;
    map(callbackfn: (value: number, index: number, array: this) => number, thisArg?: any): Uint8ClampedArray<ArrayBuffer>;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;
    reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;
    reverse(): this;
    set(array: ArrayLike<number>, offset?: number): void;
    slice(start?: number, end?: number): Uint8ClampedArray<ArrayBuffer>;
    some(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;
    sort(compareFn?: (a: number, b: number) => number): this;
    subarray(begin?: number, end?: number): Uint8ClampedArray<TArrayBuffer>;
    toLocaleString(): string;
    toString(): string;
    valueOf(): this;
    [index: number]: number;
}
interface Uint8ClampedArrayConstructor {
    readonly prototype: Uint8ClampedArray<ArrayBufferLike>;
    new (length: number): Uint8ClampedArray<ArrayBuffer>;
    new (array: ArrayLike<number>): Uint8ClampedArray<ArrayBuffer>;
    new <TArrayBuffer extends ArrayBufferLike = ArrayBuffer>(buffer: TArrayBuffer, byteOffset?: number, length?: number): Uint8ClampedArray<TArrayBuffer>;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Uint8ClampedArray<ArrayBuffer>;
    new (array: ArrayLike<number> | ArrayBuffer): Uint8ClampedArray<ArrayBuffer>;
    readonly BYTES_PER_ELEMENT: number;
    of(...items: number[]): Uint8ClampedArray<ArrayBuffer>;
    from(arrayLike: ArrayLike<number>): Uint8ClampedArray<ArrayBuffer>;
    from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any): Uint8ClampedArray<ArrayBuffer>;
}
var Uint8ClampedArray: Uint8ClampedArrayConstructor;
interface Int16Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    readonly BYTES_PER_ELEMENT: number;
    readonly buffer: TArrayBuffer;
    readonly byteLength: number;
    readonly byteOffset: number;
    copyWithin(target: number, start: number, end?: number): this;
    every(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;
    fill(value: number, start?: number, end?: number): this;
    filter(predicate: (value: number, index: number, array: this) => any, thisArg?: any): Int16Array<ArrayBuffer>;
    find(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number | undefined;
    findIndex(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number;
    forEach(callbackfn: (value: number, index: number, array: this) => void, thisArg?: any): void;
    indexOf(searchElement: number, fromIndex?: number): number;
    join(separator?: string): string;
    lastIndexOf(searchElement: number, fromIndex?: number): number;
    readonly length: number;
    map(callbackfn: (value: number, index: number, array: this) => number, thisArg?: any): Int16Array<ArrayBuffer>;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;
    reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;
    reverse(): this;
    set(array: ArrayLike<number>, offset?: number): void;
    slice(start?: number, end?: number): Int16Array<ArrayBuffer>;
    some(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;
    sort(compareFn?: (a: number, b: number) => number): this;
    subarray(begin?: number, end?: number): Int16Array<TArrayBuffer>;
    toLocaleString(): string;
    toString(): string;
    valueOf(): this;
    [index: number]: number;
}
interface Int16ArrayConstructor {
    readonly prototype: Int16Array<ArrayBufferLike>;
    new (length: number): Int16Array<ArrayBuffer>;
    new (array: ArrayLike<number>): Int16Array<ArrayBuffer>;
    new <TArrayBuffer extends ArrayBufferLike = ArrayBuffer>(buffer: TArrayBuffer, byteOffset?: number, length?: number): Int16Array<TArrayBuffer>;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Int16Array<ArrayBuffer>;
    new (array: ArrayLike<number> | ArrayBuffer): Int16Array<ArrayBuffer>;
    readonly BYTES_PER_ELEMENT: number;
    of(...items: number[]): Int16Array<ArrayBuffer>;
    from(arrayLike: ArrayLike<number>): Int16Array<ArrayBuffer>;
    from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any): Int16Array<ArrayBuffer>;
}
var Int16Array: Int16ArrayConstructor;
interface Uint16Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    readonly BYTES_PER_ELEMENT: number;
    readonly buffer: TArrayBuffer;
    readonly byteLength: number;
    readonly byteOffset: number;
    copyWithin(target: number, start: number, end?: number): this;
    every(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;
    fill(value: number, start?: number, end?: number): this;
    filter(predicate: (value: number, index: number, array: this) => any, thisArg?: any): Uint16Array<ArrayBuffer>;
    find(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number | undefined;
    findIndex(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number;
    forEach(callbackfn: (value: number, index: number, array: this) => void, thisArg?: any): void;
    indexOf(searchElement: number, fromIndex?: number): number;
    join(separator?: string): string;
    lastIndexOf(searchElement: number, fromIndex?: number): number;
    readonly length: number;
    map(callbackfn: (value: number, index: number, array: this) => number, thisArg?: any): Uint16Array<ArrayBuffer>;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;
    reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;
    reverse(): this;
    set(array: ArrayLike<number>, offset?: number): void;
    slice(start?: number, end?: number): Uint16Array<ArrayBuffer>;
    some(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;
    sort(compareFn?: (a: number, b: number) => number): this;
    subarray(begin?: number, end?: number): Uint16Array<TArrayBuffer>;
    toLocaleString(): string;
    toString(): string;
    valueOf(): this;
    [index: number]: number;
}
interface Uint16ArrayConstructor {
    readonly prototype: Uint16Array<ArrayBufferLike>;
    new (length: number): Uint16Array<ArrayBuffer>;
    new (array: ArrayLike<number>): Uint16Array<ArrayBuffer>;
    new <TArrayBuffer extends ArrayBufferLike = ArrayBuffer>(buffer: TArrayBuffer, byteOffset?: number, length?: number): Uint16Array<TArrayBuffer>;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Uint16Array<ArrayBuffer>;
    new (array: ArrayLike<number> | ArrayBuffer): Uint16Array<ArrayBuffer>;
    readonly BYTES_PER_ELEMENT: number;
    of(...items: number[]): Uint16Array<ArrayBuffer>;
    from(arrayLike: ArrayLike<number>): Uint16Array<ArrayBuffer>;
    from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any): Uint16Array<ArrayBuffer>;
}
var Uint16Array: Uint16ArrayConstructor;
interface Int32Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    readonly BYTES_PER_ELEMENT: number;
    readonly buffer: TArrayBuffer;
    readonly byteLength: number;
    readonly byteOffset: number;
    copyWithin(target: number, start: number, end?: number): this;
    every(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;
    fill(value: number, start?: number, end?: number): this;
    filter(predicate: (value: number, index: number, array: this) => any, thisArg?: any): Int32Array<ArrayBuffer>;
    find(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number | undefined;
    findIndex(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number;
    forEach(callbackfn: (value: number, index: number, array: this) => void, thisArg?: any): void;
    indexOf(searchElement: number, fromIndex?: number): number;
    join(separator?: string): string;
    lastIndexOf(searchElement: number, fromIndex?: number): number;
    readonly length: number;
    map(callbackfn: (value: number, index: number, array: this) => number, thisArg?: any): Int32Array<ArrayBuffer>;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;
    reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;
    reverse(): this;
    set(array: ArrayLike<number>, offset?: number): void;
    slice(start?: number, end?: number): Int32Array<ArrayBuffer>;
    some(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;
    sort(compareFn?: (a: number, b: number) => number): this;
    subarray(begin?: number, end?: number): Int32Array<TArrayBuffer>;
    toLocaleString(): string;
    toString(): string;
    valueOf(): this;
    [index: number]: number;
}
interface Int32ArrayConstructor {
    readonly prototype: Int32Array<ArrayBufferLike>;
    new (length: number): Int32Array<ArrayBuffer>;
    new (array: ArrayLike<number>): Int32Array<ArrayBuffer>;
    new <TArrayBuffer extends ArrayBufferLike = ArrayBuffer>(buffer: TArrayBuffer, byteOffset?: number, length?: number): Int32Array<TArrayBuffer>;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Int32Array<ArrayBuffer>;
    new (array: ArrayLike<number> | ArrayBuffer): Int32Array<ArrayBuffer>;
    readonly BYTES_PER_ELEMENT: number;
    of(...items: number[]): Int32Array<ArrayBuffer>;
    from(arrayLike: ArrayLike<number>): Int32Array<ArrayBuffer>;
    from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any): Int32Array<ArrayBuffer>;
}
var Int32Array: Int32ArrayConstructor;
interface Uint32Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    readonly BYTES_PER_ELEMENT: number;
    readonly buffer: TArrayBuffer;
    readonly byteLength: number;
    readonly byteOffset: number;
    copyWithin(target: number, start: number, end?: number): this;
    every(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;
    fill(value: number, start?: number, end?: number): this;
    filter(predicate: (value: number, index: number, array: this) => any, thisArg?: any): Uint32Array<ArrayBuffer>;
    find(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number | undefined;
    findIndex(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number;
    forEach(callbackfn: (value: number, index: number, array: this) => void, thisArg?: any): void;
    indexOf(searchElement: number, fromIndex?: number): number;
    join(separator?: string): string;
    lastIndexOf(searchElement: number, fromIndex?: number): number;
    readonly length: number;
    map(callbackfn: (value: number, index: number, array: this) => number, thisArg?: any): Uint32Array<ArrayBuffer>;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;
    reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;
    reverse(): this;
    set(array: ArrayLike<number>, offset?: number): void;
    slice(start?: number, end?: number): Uint32Array<ArrayBuffer>;
    some(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;
    sort(compareFn?: (a: number, b: number) => number): this;
    subarray(begin?: number, end?: number): Uint32Array<TArrayBuffer>;
    toLocaleString(): string;
    toString(): string;
    valueOf(): this;
    [index: number]: number;
}
interface Uint32ArrayConstructor {
    readonly prototype: Uint32Array<ArrayBufferLike>;
    new (length: number): Uint32Array<ArrayBuffer>;
    new (array: ArrayLike<number>): Uint32Array<ArrayBuffer>;
    new <TArrayBuffer extends ArrayBufferLike = ArrayBuffer>(buffer: TArrayBuffer, byteOffset?: number, length?: number): Uint32Array<TArrayBuffer>;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Uint32Array<ArrayBuffer>;
    new (array: ArrayLike<number> | ArrayBuffer): Uint32Array<ArrayBuffer>;
    readonly BYTES_PER_ELEMENT: number;
    of(...items: number[]): Uint32Array<ArrayBuffer>;
    from(arrayLike: ArrayLike<number>): Uint32Array<ArrayBuffer>;
    from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any): Uint32Array<ArrayBuffer>;
}
var Uint32Array: Uint32ArrayConstructor;
interface Float32Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    readonly BYTES_PER_ELEMENT: number;
    readonly buffer: TArrayBuffer;
    readonly byteLength: number;
    readonly byteOffset: number;
    copyWithin(target: number, start: number, end?: number): this;
    every(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;
    fill(value: number, start?: number, end?: number): this;
    filter(predicate: (value: number, index: number, array: this) => any, thisArg?: any): Float32Array<ArrayBuffer>;
    find(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number | undefined;
    findIndex(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number;
    forEach(callbackfn: (value: number, index: number, array: this) => void, thisArg?: any): void;
    indexOf(searchElement: number, fromIndex?: number): number;
    join(separator?: string): string;
    lastIndexOf(searchElement: number, fromIndex?: number): number;
    readonly length: number;
    map(callbackfn: (value: number, index: number, array: this) => number, thisArg?: any): Float32Array<ArrayBuffer>;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;
    reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;
    reverse(): this;
    set(array: ArrayLike<number>, offset?: number): void;
    slice(start?: number, end?: number): Float32Array<ArrayBuffer>;
    some(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;
    sort(compareFn?: (a: number, b: number) => number): this;
    subarray(begin?: number, end?: number): Float32Array<TArrayBuffer>;
    toLocaleString(): string;
    toString(): string;
    valueOf(): this;
    [index: number]: number;
}
interface Float32ArrayConstructor {
    readonly prototype: Float32Array<ArrayBufferLike>;
    new (length: number): Float32Array<ArrayBuffer>;
    new (array: ArrayLike<number>): Float32Array<ArrayBuffer>;
    new <TArrayBuffer extends ArrayBufferLike = ArrayBuffer>(buffer: TArrayBuffer, byteOffset?: number, length?: number): Float32Array<TArrayBuffer>;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Float32Array<ArrayBuffer>;
    new (array: ArrayLike<number> | ArrayBuffer): Float32Array<ArrayBuffer>;
    readonly BYTES_PER_ELEMENT: number;
    of(...items: number[]): Float32Array<ArrayBuffer>;
    from(arrayLike: ArrayLike<number>): Float32Array<ArrayBuffer>;
    from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any): Float32Array<ArrayBuffer>;
}
var Float32Array: Float32ArrayConstructor;
interface Float64Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    readonly BYTES_PER_ELEMENT: number;
    readonly buffer: TArrayBuffer;
    readonly byteLength: number;
    readonly byteOffset: number;
    copyWithin(target: number, start: number, end?: number): this;
    every(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;
    fill(value: number, start?: number, end?: number): this;
    filter(predicate: (value: number, index: number, array: this) => any, thisArg?: any): Float64Array<ArrayBuffer>;
    find(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number | undefined;
    findIndex(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number;
    forEach(callbackfn: (value: number, index: number, array: this) => void, thisArg?: any): void;
    indexOf(searchElement: number, fromIndex?: number): number;
    join(separator?: string): string;
    lastIndexOf(searchElement: number, fromIndex?: number): number;
    readonly length: number;
    map(callbackfn: (value: number, index: number, array: this) => number, thisArg?: any): Float64Array<ArrayBuffer>;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;
    reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;
    reverse(): this;
    set(array: ArrayLike<number>, offset?: number): void;
    slice(start?: number, end?: number): Float64Array<ArrayBuffer>;
    some(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;
    sort(compareFn?: (a: number, b: number) => number): this;
    subarray(begin?: number, end?: number): Float64Array<TArrayBuffer>;
    toLocaleString(): string;
    toString(): string;
    valueOf(): this;
    [index: number]: number;
}
interface Float64ArrayConstructor {
    readonly prototype: Float64Array<ArrayBufferLike>;
    new (length: number): Float64Array<ArrayBuffer>;
    new (array: ArrayLike<number>): Float64Array<ArrayBuffer>;
    new <TArrayBuffer extends ArrayBufferLike = ArrayBuffer>(buffer: TArrayBuffer, byteOffset?: number, length?: number): Float64Array<TArrayBuffer>;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Float64Array<ArrayBuffer>;
    new (array: ArrayLike<number> | ArrayBuffer): Float64Array<ArrayBuffer>;
    readonly BYTES_PER_ELEMENT: number;
    of(...items: number[]): Float64Array<ArrayBuffer>;
    from(arrayLike: ArrayLike<number>): Float64Array<ArrayBuffer>;
    from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any): Float64Array<ArrayBuffer>;
}
var Float64Array: Float64ArrayConstructor;
namespace Intl {
    interface CollatorOptions {
        usage?: "sort" | "search" | undefined;
        localeMatcher?: "lookup" | "best fit" | undefined;
        numeric?: boolean | undefined;
        caseFirst?: "upper" | "lower" | "false" | undefined;
        sensitivity?: "base" | "accent" | "case" | "variant" | undefined;
        collation?: "big5han" | "compat" | "default" | "dict" | "direct" | "ducet" | "emoji" | "eor" | "gb2312" | "phonebk" | "phonetic" | "pinyin" | "reformed" | "searchjl" | "stroke" | "trad" | "unihan" | "zhuyin" | undefined;
        ignorePunctuation?: boolean | undefined;
    }
    interface ResolvedCollatorOptions {
        locale: string;
        usage: string;
        sensitivity: string;
        ignorePunctuation: boolean;
        collation: string;
        caseFirst: string;
        numeric: boolean;
    }
    interface Collator {
        compare(x: string, y: string): number;
        resolvedOptions(): ResolvedCollatorOptions;
    }
    interface CollatorConstructor {
        new (locales?: string | string[], options?: CollatorOptions): Collator;
        (locales?: string | string[], options?: CollatorOptions): Collator;
        supportedLocalesOf(locales: string | string[], options?: CollatorOptions): string[];
    }
    var Collator: CollatorConstructor;
    interface NumberFormatOptionsStyleRegistry {
        decimal: never;
        percent: never;
        currency: never;
    }
    type NumberFormatOptionsStyle = keyof NumberFormatOptionsStyleRegistry;
    interface NumberFormatOptionsCurrencyDisplayRegistry {
        code: never;
        symbol: never;
        name: never;
    }
    type NumberFormatOptionsCurrencyDisplay = keyof NumberFormatOptionsCurrencyDisplayRegistry;
    interface NumberFormatOptionsUseGroupingRegistry {}
    type NumberFormatOptionsUseGrouping = {} extends NumberFormatOptionsUseGroupingRegistry ? boolean : keyof NumberFormatOptionsUseGroupingRegistry | "true" | "false" | boolean;
    type ResolvedNumberFormatOptionsUseGrouping = {} extends NumberFormatOptionsUseGroupingRegistry ? boolean : keyof NumberFormatOptionsUseGroupingRegistry | false;
    interface NumberFormatOptions {
        localeMatcher?: "lookup" | "best fit" | undefined;
        style?: NumberFormatOptionsStyle | undefined;
        currency?: string | undefined;
        currencyDisplay?: NumberFormatOptionsCurrencyDisplay | undefined;
        useGrouping?: NumberFormatOptionsUseGrouping | undefined;
        minimumIntegerDigits?: number | undefined;
        minimumFractionDigits?: number | undefined;
        maximumFractionDigits?: number | undefined;
        minimumSignificantDigits?: number | undefined;
        maximumSignificantDigits?: number | undefined;
    }
    interface ResolvedNumberFormatOptions {
        locale: string;
        numberingSystem: string;
        style: NumberFormatOptionsStyle;
        currency?: string;
        currencyDisplay?: NumberFormatOptionsCurrencyDisplay;
        minimumIntegerDigits: number;
        minimumFractionDigits?: number;
        maximumFractionDigits?: number;
        minimumSignificantDigits?: number;
        maximumSignificantDigits?: number;
        useGrouping: ResolvedNumberFormatOptionsUseGrouping;
    }
    interface NumberFormat {
        format(value: number): string;
        resolvedOptions(): ResolvedNumberFormatOptions;
    }
    interface NumberFormatConstructor {
        new (locales?: string | string[], options?: NumberFormatOptions): NumberFormat;
        (locales?: string | string[], options?: NumberFormatOptions): NumberFormat;
        supportedLocalesOf(locales: string | string[], options?: NumberFormatOptions): string[];
        readonly prototype: NumberFormat;
    }
    var NumberFormat: NumberFormatConstructor;
    interface DateTimeFormatOptions {
        localeMatcher?: "best fit" | "lookup" | undefined;
        weekday?: "long" | "short" | "narrow" | undefined;
        era?: "long" | "short" | "narrow" | undefined;
        year?: "numeric" | "2-digit" | undefined;
        month?: "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined;
        day?: "numeric" | "2-digit" | undefined;
        hour?: "numeric" | "2-digit" | undefined;
        minute?: "numeric" | "2-digit" | undefined;
        second?: "numeric" | "2-digit" | undefined;
        timeZoneName?: "short" | "long" | "shortOffset" | "longOffset" | "shortGeneric" | "longGeneric" | undefined;
        formatMatcher?: "best fit" | "basic" | undefined;
        hour12?: boolean | undefined;
        timeZone?: string | undefined;
    }
    interface ResolvedDateTimeFormatOptions {
        locale: string;
        calendar: string;
        numberingSystem: string;
        timeZone: string;
        hour12?: boolean;
        weekday?: string;
        era?: string;
        year?: string;
        month?: string;
        day?: string;
        hour?: string;
        minute?: string;
        second?: string;
        timeZoneName?: string;
    }
    interface DateTimeFormat {
        format(date?: Date | number): string;
        resolvedOptions(): ResolvedDateTimeFormatOptions;
    }
    interface DateTimeFormatConstructor {
        new (locales?: string | string[], options?: DateTimeFormatOptions): DateTimeFormat;
        (locales?: string | string[], options?: DateTimeFormatOptions): DateTimeFormat;
        supportedLocalesOf(locales: string | string[], options?: DateTimeFormatOptions): string[];
        readonly prototype: DateTimeFormat;
    }
    var DateTimeFormat: DateTimeFormatConstructor;
}
interface Uint8Array<TArrayBuffer extends ArrayBufferLike> {
    toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions): string;
}
interface Uint8ClampedArray<TArrayBuffer extends ArrayBufferLike> {
    toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions): string;
}
interface Int16Array<TArrayBuffer extends ArrayBufferLike> {
    toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions): string;
}
interface Uint16Array<TArrayBuffer extends ArrayBufferLike> {
    toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions): string;
}
interface Int32Array<TArrayBuffer extends ArrayBufferLike> {
    toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions): string;
}
interface Uint32Array<TArrayBuffer extends ArrayBufferLike> {
    toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions): string;
}
interface Float32Array<TArrayBuffer extends ArrayBufferLike> {
    toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions): string;
}
interface Float64Array<TArrayBuffer extends ArrayBufferLike> {
    toLocaleString(locales: string | string[], options?: Intl.NumberFormatOptions): string;
}
interface Map<K, V> {
    clear(): void;
    delete(key: K): boolean;
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): this;
    readonly size: number;
}
interface MapConstructor {
    new (): Map<any, any>;
    new <K, V>(entries?: readonly (readonly [K, V])[] | null): Map<K, V>;
    readonly prototype: Map<any, any>;
}
var Map: MapConstructor;
interface ReadonlyMap<K, V> {
    forEach(callbackfn: (value: V, key: K, map: ReadonlyMap<K, V>) => void, thisArg?: any): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    readonly size: number;
}
interface WeakMap<K extends WeakKey, V> {
    delete(key: K): boolean;
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): this;
}
interface WeakMapConstructor {
    new <K extends WeakKey = WeakKey, V = any>(entries?: readonly (readonly [K, V])[] | null): WeakMap<K, V>;
    readonly prototype: WeakMap<WeakKey, any>;
}
var WeakMap: WeakMapConstructor;
interface Set<T> {
    add(value: T): this;
    clear(): void;
    delete(value: T): boolean;
    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void;
    has(value: T): boolean;
    readonly size: number;
}
interface SetConstructor {
    new <T = any>(values?: readonly T[] | null): Set<T>;
    readonly prototype: Set<any>;
}
var Set: SetConstructor;
interface ReadonlySet<T> {
    forEach(callbackfn: (value: T, value2: T, set: ReadonlySet<T>) => void, thisArg?: any): void;
    has(value: T): boolean;
    readonly size: number;
}
interface WeakSet<T extends WeakKey> {
    add(value: T): this;
    delete(value: T): boolean;
    has(value: T): boolean;
}
interface WeakSetConstructor {
    new <T extends WeakKey = WeakKey>(values?: readonly T[] | null): WeakSet<T>;
    readonly prototype: WeakSet<WeakKey>;
}
var WeakSet: WeakSetConstructor;
interface Generator<T = unknown, TReturn = any, TNext = any> extends IteratorObject<T, TReturn, TNext> {
    next(...[value]: [] | [TNext]): IteratorResult<T, TReturn>;
    return(value: TReturn): IteratorResult<T, TReturn>;
    throw(e: any): IteratorResult<T, TReturn>;
    [Symbol.iterator](): Generator<T, TReturn, TNext>;
}
interface GeneratorFunction {
    new (...args: any[]): Generator;
    (...args: any[]): Generator;
    readonly length: number;
    readonly name: string;
    readonly prototype: Generator;
}
interface GeneratorFunctionConstructor {
    new (...args: string[]): GeneratorFunction;
    (...args: string[]): GeneratorFunction;
    readonly length: number;
    readonly name: string;
    readonly prototype: GeneratorFunction;
}
interface SymbolConstructor {
    readonly iterator: unique symbol;
    readonly prototype: Symbol;
    (description?: string | number): symbol;
    for(key: string): symbol;
    keyFor(sym: symbol): string | undefined;
    readonly hasInstance: unique symbol;
    readonly isConcatSpreadable: unique symbol;
    readonly match: unique symbol;
    readonly replace: unique symbol;
    readonly search: unique symbol;
    readonly species: unique symbol;
    readonly split: unique symbol;
    readonly toPrimitive: unique symbol;
    readonly toStringTag: unique symbol;
    readonly unscopables: unique symbol;
    readonly asyncIterator: unique symbol;
    readonly metadata: unique symbol;
    readonly dispose: unique symbol;
    readonly asyncDispose: unique symbol;
    readonly description: string | undefined;
    readonly matchAll: unique symbol;
}
interface IteratorYieldResult<TYield> {
    done?: false;
    value: TYield;
}
interface IteratorReturnResult<TReturn> {
    done: true;
    value: TReturn;
}
type IteratorResult<T, TReturn = any> = IteratorYieldResult<T> | IteratorReturnResult<TReturn>;
interface Iterator<T, TReturn = any, TNext = any> {
    next(...[value]: [] | [TNext]): IteratorResult<T, TReturn>;
    return?(value?: TReturn): IteratorResult<T, TReturn>;
    throw?(e?: any): IteratorResult<T, TReturn>;
}
interface Iterable<T, TReturn = any, TNext = any> {
    [Symbol.iterator](): Iterator<T, TReturn, TNext>;
}
interface IterableIterator<T, TReturn = any, TNext = any> extends Iterator<T, TReturn, TNext> {
    [Symbol.iterator](): IterableIterator<T, TReturn, TNext>;
}
interface IteratorObject<T, TReturn = unknown, TNext = unknown> extends Iterator<T, TReturn, TNext> {
    [Symbol.iterator](): IteratorObject<T, TReturn, TNext>;
}
type BuiltinIteratorReturn = intrinsic;
interface ArrayIterator<T> extends IteratorObject<T, BuiltinIteratorReturn, unknown> {
    [Symbol.iterator](): ArrayIterator<T>;
}
interface MapIterator<T> extends IteratorObject<T, BuiltinIteratorReturn, unknown> {
    [Symbol.iterator](): MapIterator<T>;
}
interface Map<K, V> {
    [Symbol.iterator](): MapIterator<[K, V]>;
    entries(): MapIterator<[K, V]>;
    keys(): MapIterator<K>;
    values(): MapIterator<V>;
}
interface ReadonlyMap<K, V> {
    [Symbol.iterator](): MapIterator<[K, V]>;
    entries(): MapIterator<[K, V]>;
    keys(): MapIterator<K>;
    values(): MapIterator<V>;
}
interface MapConstructor {
    new (): Map<any, any>;
    new <K, V>(iterable?: Iterable<readonly [K, V]> | null): Map<K, V>;
}
interface WeakMap<K extends WeakKey, V> {}
interface WeakMapConstructor {
    new <K extends WeakKey = WeakKey, V = any>(iterable?: Iterable<readonly [K, V]> | null): WeakMap<K, V>;
}
interface SetIterator<T> extends IteratorObject<T, BuiltinIteratorReturn, unknown> {
    [Symbol.iterator](): SetIterator<T>;
}
interface Set<T> {
    [Symbol.iterator](): SetIterator<T>;
    entries(): SetIterator<[T, T]>;
    keys(): SetIterator<T>;
    values(): SetIterator<T>;
}
interface ReadonlySet<T> {
    [Symbol.iterator](): SetIterator<T>;
    entries(): SetIterator<[T, T]>;
    keys(): SetIterator<T>;
    values(): SetIterator<T>;
}
interface SetConstructor {
    new <T>(iterable?: Iterable<T> | null): Set<T>;
}
interface WeakSet<T extends WeakKey> {}
interface WeakSetConstructor {
    new <T extends WeakKey = WeakKey>(iterable: Iterable<T>): WeakSet<T>;
}
interface PromiseConstructor {
    all<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>[]>;
    race<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>>;
}
var Promise: PromiseConstructor;
interface StringIterator<T> extends IteratorObject<T, BuiltinIteratorReturn, unknown> {
    [Symbol.iterator](): StringIterator<T>;
}
interface Uint8Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;
    entries(): ArrayIterator<[number, number]>;
    keys(): ArrayIterator<number>;
    values(): ArrayIterator<number>;
}
interface Uint8ArrayConstructor {
    new (elements: Iterable<number>): Uint8Array<ArrayBuffer>;
    from(elements: Iterable<number>): Uint8Array<ArrayBuffer>;
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Uint8Array<ArrayBuffer>;
}
interface Uint8ClampedArray<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;
    entries(): ArrayIterator<[number, number]>;
    keys(): ArrayIterator<number>;
    values(): ArrayIterator<number>;
}
interface Uint8ClampedArrayConstructor {
    new (elements: Iterable<number>): Uint8ClampedArray<ArrayBuffer>;
    from(elements: Iterable<number>): Uint8ClampedArray<ArrayBuffer>;
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Uint8ClampedArray<ArrayBuffer>;
}
interface Int16Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;
    entries(): ArrayIterator<[number, number]>;
    keys(): ArrayIterator<number>;
    values(): ArrayIterator<number>;
}
interface Int16ArrayConstructor {
    new (elements: Iterable<number>): Int16Array<ArrayBuffer>;
    from(elements: Iterable<number>): Int16Array<ArrayBuffer>;
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Int16Array<ArrayBuffer>;
}
interface Uint16Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;
    entries(): ArrayIterator<[number, number]>;
    keys(): ArrayIterator<number>;
    values(): ArrayIterator<number>;
}
interface Uint16ArrayConstructor {
    new (elements: Iterable<number>): Uint16Array<ArrayBuffer>;
    from(elements: Iterable<number>): Uint16Array<ArrayBuffer>;
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Uint16Array<ArrayBuffer>;
}
interface Int32Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;
    entries(): ArrayIterator<[number, number]>;
    keys(): ArrayIterator<number>;
    values(): ArrayIterator<number>;
}
interface Int32ArrayConstructor {
    new (elements: Iterable<number>): Int32Array<ArrayBuffer>;
    from(elements: Iterable<number>): Int32Array<ArrayBuffer>;
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Int32Array<ArrayBuffer>;
}
interface Uint32Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;
    entries(): ArrayIterator<[number, number]>;
    keys(): ArrayIterator<number>;
    values(): ArrayIterator<number>;
}
interface Uint32ArrayConstructor {
    new (elements: Iterable<number>): Uint32Array<ArrayBuffer>;
    from(elements: Iterable<number>): Uint32Array<ArrayBuffer>;
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Uint32Array<ArrayBuffer>;
}
interface Float32Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;
    entries(): ArrayIterator<[number, number]>;
    keys(): ArrayIterator<number>;
    values(): ArrayIterator<number>;
}
interface Float32ArrayConstructor {
    new (elements: Iterable<number>): Float32Array<ArrayBuffer>;
    from(elements: Iterable<number>): Float32Array<ArrayBuffer>;
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Float32Array<ArrayBuffer>;
}
interface Float64Array<TArrayBuffer extends ArrayBufferLike> {
    [Symbol.iterator](): ArrayIterator<number>;
    entries(): ArrayIterator<[number, number]>;
    keys(): ArrayIterator<number>;
    values(): ArrayIterator<number>;
}
interface Float64ArrayConstructor {
    new (elements: Iterable<number>): Float64Array<ArrayBuffer>;
    from(elements: Iterable<number>): Float64Array<ArrayBuffer>;
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Float64Array<ArrayBuffer>;
}
namespace Reflect {
    function apply<T, A extends readonly any[], R>(
        target: (this: T, ...args: A) => R,
        thisArgument: T,
        argumentsList: Readonly<A>,
    ): R;
    function apply(target: Function, thisArgument: any, argumentsList: ArrayLike<any>): any;
    function construct<A extends readonly any[], R>(
        target: new (...args: A) => R,
        argumentsList: Readonly<A>,
        newTarget?: new (...args: any) => any,
    ): R;
    function construct(target: Function, argumentsList: ArrayLike<any>, newTarget?: Function): any;
    function defineProperty(target: object, propertyKey: PropertyKey, attributes: PropertyDescriptor & ThisType<any>): boolean;
    function deleteProperty(target: object, propertyKey: PropertyKey): boolean;
    function get<T extends object, P extends PropertyKey>(
        target: T,
        propertyKey: P,
        receiver?: unknown,
    ): P extends keyof T ? T[P] : any;
    function getOwnPropertyDescriptor<T extends object, P extends PropertyKey>(
        target: T,
        propertyKey: P,
    ): TypedPropertyDescriptor<P extends keyof T ? T[P] : any> | undefined;
    function getPrototypeOf(target: object): object | null;
    function has(target: object, propertyKey: PropertyKey): boolean;
    function isExtensible(target: object): boolean;
    function ownKeys(target: object): (string | symbol)[];
    function preventExtensions(target: object): boolean;
    function set<T extends object, P extends PropertyKey>(
        target: T,
        propertyKey: P,
        value: P extends keyof T ? T[P] : any,
        receiver?: any,
    ): boolean;
    function set(target: object, propertyKey: PropertyKey, value: any, receiver?: any): boolean;
    function setPrototypeOf(target: object, proto: object | null): boolean;
}
var Symbol: SymbolConstructor;
interface Map<K, V> {
    readonly [Symbol.toStringTag]: string;
}
interface WeakMap<K extends WeakKey, V> {
    readonly [Symbol.toStringTag]: string;
}
interface Set<T> {
    readonly [Symbol.toStringTag]: string;
}
interface WeakSet<T extends WeakKey> {
    readonly [Symbol.toStringTag]: string;
}
interface GeneratorFunction {
    readonly [Symbol.toStringTag]: string;
}
interface PromiseConstructor {
    readonly [Symbol.species]: PromiseConstructor;
}
interface Uint8Array<TArrayBuffer extends ArrayBufferLike> {
    readonly [Symbol.toStringTag]: "Uint8Array";
}
interface Uint8ClampedArray<TArrayBuffer extends ArrayBufferLike> {
    readonly [Symbol.toStringTag]: "Uint8ClampedArray";
}
interface Int16Array<TArrayBuffer extends ArrayBufferLike> {
    readonly [Symbol.toStringTag]: "Int16Array";
}
interface Uint16Array<TArrayBuffer extends ArrayBufferLike> {
    readonly [Symbol.toStringTag]: "Uint16Array";
}
interface Int32Array<TArrayBuffer extends ArrayBufferLike> {
    readonly [Symbol.toStringTag]: "Int32Array";
}
interface Uint32Array<TArrayBuffer extends ArrayBufferLike> {
    readonly [Symbol.toStringTag]: "Uint32Array";
}
interface Float32Array<TArrayBuffer extends ArrayBufferLike> {
    readonly [Symbol.toStringTag]: "Float32Array";
}
interface Float64Array<TArrayBuffer extends ArrayBufferLike> {
    readonly [Symbol.toStringTag]: "Float64Array";
}
interface MapConstructor {
    readonly [Symbol.species]: MapConstructor;
}
interface SetConstructor {
    readonly [Symbol.species]: SetConstructor;
}
interface Uint8Array<TArrayBuffer extends ArrayBufferLike> {
    includes(searchElement: number, fromIndex?: number): boolean;
}
interface Uint8ClampedArray<TArrayBuffer extends ArrayBufferLike> {
    includes(searchElement: number, fromIndex?: number): boolean;
}
interface Int16Array<TArrayBuffer extends ArrayBufferLike> {
    includes(searchElement: number, fromIndex?: number): boolean;
}
interface Uint16Array<TArrayBuffer extends ArrayBufferLike> {
    includes(searchElement: number, fromIndex?: number): boolean;
}
interface Int32Array<TArrayBuffer extends ArrayBufferLike> {
    includes(searchElement: number, fromIndex?: number): boolean;
}
interface Uint32Array<TArrayBuffer extends ArrayBufferLike> {
    includes(searchElement: number, fromIndex?: number): boolean;
}
interface Float32Array<TArrayBuffer extends ArrayBufferLike> {
    includes(searchElement: number, fromIndex?: number): boolean;
}
interface Float64Array<TArrayBuffer extends ArrayBufferLike> {
    includes(searchElement: number, fromIndex?: number): boolean;
}
namespace Intl {
    function getCanonicalLocales(locale?: string | readonly string[]): string[];
}
namespace Intl {
    interface DateTimeFormatPartTypesRegistry {
        day: any;
        dayPeriod: any;
        era: any;
        hour: any;
        literal: any;
        minute: any;
        month: any;
        second: any;
        timeZoneName: any;
        weekday: any;
        year: any;
    }
    type DateTimeFormatPartTypes = keyof DateTimeFormatPartTypesRegistry;
    interface DateTimeFormatPart {
        type: DateTimeFormatPartTypes;
        value: string;
    }
    interface DateTimeFormat {
        formatToParts(date?: Date | number): DateTimeFormatPart[];
    }
}
interface SharedArrayBuffer {
    readonly byteLength: number;
    slice(begin?: number, end?: number): SharedArrayBuffer;
    readonly [Symbol.toStringTag]: "SharedArrayBuffer";
}
interface SharedArrayBufferConstructor {
    readonly prototype: SharedArrayBuffer;
    new (byteLength?: number): SharedArrayBuffer;
    readonly [Symbol.species]: SharedArrayBufferConstructor;
}
var SharedArrayBuffer: SharedArrayBufferConstructor;
interface Atomics {
    add(typedArray: Int8Array<ArrayBufferLike> | Uint8Array<ArrayBufferLike> | Int16Array<ArrayBufferLike> | Uint16Array<ArrayBufferLike> | Int32Array<ArrayBufferLike> | Uint32Array<ArrayBufferLike>, index: number, value: number): number;
    and(typedArray: Int8Array<ArrayBufferLike> | Uint8Array<ArrayBufferLike> | Int16Array<ArrayBufferLike> | Uint16Array<ArrayBufferLike> | Int32Array<ArrayBufferLike> | Uint32Array<ArrayBufferLike>, index: number, value: number): number;
    compareExchange(typedArray: Int8Array<ArrayBufferLike> | Uint8Array<ArrayBufferLike> | Int16Array<ArrayBufferLike> | Uint16Array<ArrayBufferLike> | Int32Array<ArrayBufferLike> | Uint32Array<ArrayBufferLike>, index: number, expectedValue: number, replacementValue: number): number;
    exchange(typedArray: Int8Array<ArrayBufferLike> | Uint8Array<ArrayBufferLike> | Int16Array<ArrayBufferLike> | Uint16Array<ArrayBufferLike> | Int32Array<ArrayBufferLike> | Uint32Array<ArrayBufferLike>, index: number, value: number): number;
    isLockFree(size: number): boolean;
    load(typedArray: Int8Array<ArrayBufferLike> | Uint8Array<ArrayBufferLike> | Int16Array<ArrayBufferLike> | Uint16Array<ArrayBufferLike> | Int32Array<ArrayBufferLike> | Uint32Array<ArrayBufferLike>, index: number): number;
    or(typedArray: Int8Array<ArrayBufferLike> | Uint8Array<ArrayBufferLike> | Int16Array<ArrayBufferLike> | Uint16Array<ArrayBufferLike> | Int32Array<ArrayBufferLike> | Uint32Array<ArrayBufferLike>, index: number, value: number): number;
    store(typedArray: Int8Array<ArrayBufferLike> | Uint8Array<ArrayBufferLike> | Int16Array<ArrayBufferLike> | Uint16Array<ArrayBufferLike> | Int32Array<ArrayBufferLike> | Uint32Array<ArrayBufferLike>, index: number, value: number): number;
    sub(typedArray: Int8Array<ArrayBufferLike> | Uint8Array<ArrayBufferLike> | Int16Array<ArrayBufferLike> | Uint16Array<ArrayBufferLike> | Int32Array<ArrayBufferLike> | Uint32Array<ArrayBufferLike>, index: number, value: number): number;
    wait(typedArray: Int32Array<ArrayBufferLike>, index: number, value: number, timeout?: number): "ok" | "not-equal" | "timed-out";
    notify(typedArray: Int32Array<ArrayBufferLike>, index: number, count?: number): number;
    xor(typedArray: Int8Array<ArrayBufferLike> | Uint8Array<ArrayBufferLike> | Int16Array<ArrayBufferLike> | Uint16Array<ArrayBufferLike> | Int32Array<ArrayBufferLike> | Uint32Array<ArrayBufferLike>, index: number, value: number): number;
    readonly [Symbol.toStringTag]: "Atomics";
}
var Atomics: Atomics;
interface Uint8ArrayConstructor {
    new (): Uint8Array<ArrayBuffer>;
}
interface Uint8ClampedArrayConstructor {
    new (): Uint8ClampedArray<ArrayBuffer>;
}
interface Int16ArrayConstructor {
    new (): Int16Array<ArrayBuffer>;
}
interface Uint16ArrayConstructor {
    new (): Uint16Array<ArrayBuffer>;
}
interface Int32ArrayConstructor {
    new (): Int32Array<ArrayBuffer>;
}
interface Uint32ArrayConstructor {
    new (): Uint32Array<ArrayBuffer>;
}
interface Float32ArrayConstructor {
    new (): Float32Array<ArrayBuffer>;
}
interface Float64ArrayConstructor {
    new (): Float64Array<ArrayBuffer>;
}
interface AsyncGenerator<T = unknown, TReturn = any, TNext = any> extends AsyncIteratorObject<T, TReturn, TNext> {
    next(...[value]: [] | [TNext]): Promise<IteratorResult<T, TReturn>>;
    return(value: TReturn | PromiseLike<TReturn>): Promise<IteratorResult<T, TReturn>>;
    throw(e: any): Promise<IteratorResult<T, TReturn>>;
    [Symbol.asyncIterator](): AsyncGenerator<T, TReturn, TNext>;
}
interface AsyncGeneratorFunction {
    new (...args: any[]): AsyncGenerator;
    (...args: any[]): AsyncGenerator;
    readonly length: number;
    readonly name: string;
    readonly prototype: AsyncGenerator;
}
interface AsyncGeneratorFunctionConstructor {
    new (...args: string[]): AsyncGeneratorFunction;
    (...args: string[]): AsyncGeneratorFunction;
    readonly length: number;
    readonly name: string;
    readonly prototype: AsyncGeneratorFunction;
}
interface AsyncIterator<T, TReturn = any, TNext = any> {
    next(...[value]: [] | [TNext]): Promise<IteratorResult<T, TReturn>>;
    return?(value?: TReturn | PromiseLike<TReturn>): Promise<IteratorResult<T, TReturn>>;
    throw?(e?: any): Promise<IteratorResult<T, TReturn>>;
}
interface AsyncIterable<T, TReturn = any, TNext = any> {
    [Symbol.asyncIterator](): AsyncIterator<T, TReturn, TNext>;
}
interface AsyncIterableIterator<T, TReturn = any, TNext = any> extends AsyncIterator<T, TReturn, TNext> {
    [Symbol.asyncIterator](): AsyncIterableIterator<T, TReturn, TNext>;
}
interface AsyncIteratorObject<T, TReturn = unknown, TNext = unknown> extends AsyncIterator<T, TReturn, TNext> {
    [Symbol.asyncIterator](): AsyncIteratorObject<T, TReturn, TNext>;
}
namespace Intl {
    type LDMLPluralRule = "zero" | "one" | "two" | "few" | "many" | "other";
    type PluralRuleType = "cardinal" | "ordinal";
    interface PluralRulesOptions {
        localeMatcher?: "lookup" | "best fit" | undefined;
        type?: PluralRuleType | undefined;
        minimumIntegerDigits?: number | undefined;
        minimumFractionDigits?: number | undefined;
        maximumFractionDigits?: number | undefined;
        minimumSignificantDigits?: number | undefined;
        maximumSignificantDigits?: number | undefined;
    }
    interface ResolvedPluralRulesOptions {
        locale: string;
        pluralCategories: LDMLPluralRule[];
        type: PluralRuleType;
        minimumIntegerDigits: number;
        minimumFractionDigits: number;
        maximumFractionDigits: number;
        minimumSignificantDigits?: number;
        maximumSignificantDigits?: number;
    }
    interface PluralRules {
        resolvedOptions(): ResolvedPluralRulesOptions;
        select(n: number): LDMLPluralRule;
    }
    interface PluralRulesConstructor {
        new (locales?: string | readonly string[], options?: PluralRulesOptions): PluralRules;
        (locales?: string | readonly string[], options?: PluralRulesOptions): PluralRules;
        supportedLocalesOf(locales: string | readonly string[], options?: { localeMatcher?: "lookup" | "best fit"; }): string[];
    }
    const PluralRules: PluralRulesConstructor;
    interface NumberFormatPartTypeRegistry {
        literal: never;
        nan: never;
        infinity: never;
        percent: never;
        integer: never;
        group: never;
        decimal: never;
        fraction: never;
        plusSign: never;
        minusSign: never;
        percentSign: never;
        currency: never;
    }
    type NumberFormatPartTypes = keyof NumberFormatPartTypeRegistry;
    interface NumberFormatPart {
        type: NumberFormatPartTypes;
        value: string;
    }
    interface NumberFormat {
        formatToParts(number?: number | bigint): NumberFormatPart[];
    }
}
namespace Intl {
    interface DateTimeFormatPartTypesRegistry {
        unknown: never;
    }
}
interface BigIntToLocaleStringOptions {
    localeMatcher?: string;
    style?: string;
    numberingSystem?: string;
    unit?: string;
    unitDisplay?: string;
    currency?: string;
    currencyDisplay?: string;
    useGrouping?: boolean;
    minimumIntegerDigits?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21;
    minimumFractionDigits?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
    maximumFractionDigits?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
    minimumSignificantDigits?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21;
    maximumSignificantDigits?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21;
    notation?: string;
    compactDisplay?: string;
}
interface BigInt {
    toString(radix?: number): string;
    toLocaleString(locales?: Intl.LocalesArgument, options?: BigIntToLocaleStringOptions): string;
    valueOf(): bigint;
    readonly [Symbol.toStringTag]: "BigInt";
}
interface BigIntConstructor {
    (value: bigint | boolean | number | string): bigint;
    readonly prototype: BigInt;
    asIntN(bits: number, int: bigint): bigint;
    asUintN(bits: number, int: bigint): bigint;
}
var BigInt: BigIntConstructor;
interface BigInt64Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    readonly BYTES_PER_ELEMENT: number;
    readonly buffer: TArrayBuffer;
    readonly byteLength: number;
    readonly byteOffset: number;
    copyWithin(target: number, start: number, end?: number): this;
    entries(): ArrayIterator<[number, bigint]>;
    every(predicate: (value: bigint, index: number, array: BigInt64Array<TArrayBuffer>) => boolean, thisArg?: any): boolean;
    fill(value: bigint, start?: number, end?: number): this;
    filter(predicate: (value: bigint, index: number, array: BigInt64Array<TArrayBuffer>) => any, thisArg?: any): BigInt64Array<ArrayBuffer>;
    find(predicate: (value: bigint, index: number, array: BigInt64Array<TArrayBuffer>) => boolean, thisArg?: any): bigint | undefined;
    findIndex(predicate: (value: bigint, index: number, array: BigInt64Array<TArrayBuffer>) => boolean, thisArg?: any): number;
    forEach(callbackfn: (value: bigint, index: number, array: BigInt64Array<TArrayBuffer>) => void, thisArg?: any): void;
    includes(searchElement: bigint, fromIndex?: number): boolean;
    indexOf(searchElement: bigint, fromIndex?: number): number;
    join(separator?: string): string;
    keys(): ArrayIterator<number>;
    lastIndexOf(searchElement: bigint, fromIndex?: number): number;
    readonly length: number;
    map(callbackfn: (value: bigint, index: number, array: BigInt64Array<TArrayBuffer>) => bigint, thisArg?: any): BigInt64Array<ArrayBuffer>;
    reduce(callbackfn: (previousValue: bigint, currentValue: bigint, currentIndex: number, array: BigInt64Array<TArrayBuffer>) => bigint): bigint;
    reduce<U>(callbackfn: (previousValue: U, currentValue: bigint, currentIndex: number, array: BigInt64Array<TArrayBuffer>) => U, initialValue: U): U;
    reduceRight(callbackfn: (previousValue: bigint, currentValue: bigint, currentIndex: number, array: BigInt64Array<TArrayBuffer>) => bigint): bigint;
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: bigint, currentIndex: number, array: BigInt64Array<TArrayBuffer>) => U, initialValue: U): U;
    reverse(): this;
    set(array: ArrayLike<bigint>, offset?: number): void;
    slice(start?: number, end?: number): BigInt64Array<ArrayBuffer>;
    some(predicate: (value: bigint, index: number, array: BigInt64Array<TArrayBuffer>) => boolean, thisArg?: any): boolean;
    sort(compareFn?: (a: bigint, b: bigint) => number | bigint): this;
    subarray(begin?: number, end?: number): BigInt64Array<TArrayBuffer>;
    toLocaleString(locales?: string | string[], options?: Intl.NumberFormatOptions): string;
    toString(): string;
    valueOf(): BigInt64Array<TArrayBuffer>;
    values(): ArrayIterator<bigint>;
    [Symbol.iterator](): ArrayIterator<bigint>;
    readonly [Symbol.toStringTag]: "BigInt64Array";
    [index: number]: bigint;
}
interface BigInt64ArrayConstructor {
    readonly prototype: BigInt64Array<ArrayBufferLike>;
    new (length?: number): BigInt64Array<ArrayBuffer>;
    new (array: ArrayLike<bigint> | Iterable<bigint>): BigInt64Array<ArrayBuffer>;
    new <TArrayBuffer extends ArrayBufferLike = ArrayBuffer>(buffer: TArrayBuffer, byteOffset?: number, length?: number): BigInt64Array<TArrayBuffer>;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): BigInt64Array<ArrayBuffer>;
    new (array: ArrayLike<bigint> | ArrayBuffer): BigInt64Array<ArrayBuffer>;
    readonly BYTES_PER_ELEMENT: number;
    of(...items: bigint[]): BigInt64Array<ArrayBuffer>;
    from(arrayLike: ArrayLike<bigint>): BigInt64Array<ArrayBuffer>;
    from<U>(arrayLike: ArrayLike<U>, mapfn: (v: U, k: number) => bigint, thisArg?: any): BigInt64Array<ArrayBuffer>;
    from(elements: Iterable<bigint>): BigInt64Array<ArrayBuffer>;
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => bigint, thisArg?: any): BigInt64Array<ArrayBuffer>;
}
var BigInt64Array: BigInt64ArrayConstructor;
interface BigUint64Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    readonly BYTES_PER_ELEMENT: number;
    readonly buffer: TArrayBuffer;
    readonly byteLength: number;
    readonly byteOffset: number;
    copyWithin(target: number, start: number, end?: number): this;
    entries(): ArrayIterator<[number, bigint]>;
    every(predicate: (value: bigint, index: number, array: BigUint64Array<TArrayBuffer>) => boolean, thisArg?: any): boolean;
    fill(value: bigint, start?: number, end?: number): this;
    filter(predicate: (value: bigint, index: number, array: BigUint64Array<TArrayBuffer>) => any, thisArg?: any): BigUint64Array<ArrayBuffer>;
    find(predicate: (value: bigint, index: number, array: BigUint64Array<TArrayBuffer>) => boolean, thisArg?: any): bigint | undefined;
    findIndex(predicate: (value: bigint, index: number, array: BigUint64Array<TArrayBuffer>) => boolean, thisArg?: any): number;
    forEach(callbackfn: (value: bigint, index: number, array: BigUint64Array<TArrayBuffer>) => void, thisArg?: any): void;
    includes(searchElement: bigint, fromIndex?: number): boolean;
    indexOf(searchElement: bigint, fromIndex?: number): number;
    join(separator?: string): string;
    keys(): ArrayIterator<number>;
    lastIndexOf(searchElement: bigint, fromIndex?: number): number;
    readonly length: number;
    map(callbackfn: (value: bigint, index: number, array: BigUint64Array<TArrayBuffer>) => bigint, thisArg?: any): BigUint64Array<ArrayBuffer>;
    reduce(callbackfn: (previousValue: bigint, currentValue: bigint, currentIndex: number, array: BigUint64Array<TArrayBuffer>) => bigint): bigint;
    reduce<U>(callbackfn: (previousValue: U, currentValue: bigint, currentIndex: number, array: BigUint64Array<TArrayBuffer>) => U, initialValue: U): U;
    reduceRight(callbackfn: (previousValue: bigint, currentValue: bigint, currentIndex: number, array: BigUint64Array<TArrayBuffer>) => bigint): bigint;
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: bigint, currentIndex: number, array: BigUint64Array<TArrayBuffer>) => U, initialValue: U): U;
    reverse(): this;
    set(array: ArrayLike<bigint>, offset?: number): void;
    slice(start?: number, end?: number): BigUint64Array<ArrayBuffer>;
    some(predicate: (value: bigint, index: number, array: BigUint64Array<TArrayBuffer>) => boolean, thisArg?: any): boolean;
    sort(compareFn?: (a: bigint, b: bigint) => number | bigint): this;
    subarray(begin?: number, end?: number): BigUint64Array<TArrayBuffer>;
    toLocaleString(locales?: string | string[], options?: Intl.NumberFormatOptions): string;
    toString(): string;
    valueOf(): BigUint64Array<TArrayBuffer>;
    values(): ArrayIterator<bigint>;
    [Symbol.iterator](): ArrayIterator<bigint>;
    readonly [Symbol.toStringTag]: "BigUint64Array";
    [index: number]: bigint;
}
interface BigUint64ArrayConstructor {
    readonly prototype: BigUint64Array<ArrayBufferLike>;
    new (length?: number): BigUint64Array<ArrayBuffer>;
    new (array: ArrayLike<bigint> | Iterable<bigint>): BigUint64Array<ArrayBuffer>;
    new <TArrayBuffer extends ArrayBufferLike = ArrayBuffer>(buffer: TArrayBuffer, byteOffset?: number, length?: number): BigUint64Array<TArrayBuffer>;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): BigUint64Array<ArrayBuffer>;
    new (array: ArrayLike<bigint> | ArrayBuffer): BigUint64Array<ArrayBuffer>;
    readonly BYTES_PER_ELEMENT: number;
    of(...items: bigint[]): BigUint64Array<ArrayBuffer>;
    from(arrayLike: ArrayLike<bigint>): BigUint64Array<ArrayBuffer>;
    from<U>(arrayLike: ArrayLike<U>, mapfn: (v: U, k: number) => bigint, thisArg?: any): BigUint64Array<ArrayBuffer>;
    from(elements: Iterable<bigint>): BigUint64Array<ArrayBuffer>;
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => bigint, thisArg?: any): BigUint64Array<ArrayBuffer>;
}
var BigUint64Array: BigUint64ArrayConstructor;
namespace Intl {
    interface NumberFormat {
        format(value: number | bigint): string;
    }
}
namespace Intl {
    type UnicodeBCP47LocaleIdentifier = string;
    type RelativeTimeFormatUnit =
        | "year"
        | "years"
        | "quarter"
        | "quarters"
        | "month"
        | "months"
        | "week"
        | "weeks"
        | "day"
        | "days"
        | "hour"
        | "hours"
        | "minute"
        | "minutes"
        | "second"
        | "seconds";
    type RelativeTimeFormatUnitSingular =
        | "year"
        | "quarter"
        | "month"
        | "week"
        | "day"
        | "hour"
        | "minute"
        | "second";
    type RelativeTimeFormatLocaleMatcher = "lookup" | "best fit";
    type RelativeTimeFormatNumeric = "always" | "auto";
    type RelativeTimeFormatStyle = "long" | "short" | "narrow";
    type LocalesArgument = UnicodeBCP47LocaleIdentifier | Locale | readonly (UnicodeBCP47LocaleIdentifier | Locale)[] | undefined;
    interface RelativeTimeFormatOptions {
        localeMatcher?: RelativeTimeFormatLocaleMatcher;
        numeric?: RelativeTimeFormatNumeric;
        style?: RelativeTimeFormatStyle;
    }
    interface ResolvedRelativeTimeFormatOptions {
        locale: UnicodeBCP47LocaleIdentifier;
        style: RelativeTimeFormatStyle;
        numeric: RelativeTimeFormatNumeric;
        numberingSystem: string;
    }
    type RelativeTimeFormatPart =
        | {
            type: "literal";
            value: string;
        }
        | {
            type: Exclude<NumberFormatPartTypes, "literal">;
            value: string;
            unit: RelativeTimeFormatUnitSingular;
        };
    interface RelativeTimeFormat {
        format(value: number, unit: RelativeTimeFormatUnit): string;
        formatToParts(value: number, unit: RelativeTimeFormatUnit): RelativeTimeFormatPart[];
        resolvedOptions(): ResolvedRelativeTimeFormatOptions;
    }
    const RelativeTimeFormat: {
        new (
            locales?: LocalesArgument,
            options?: RelativeTimeFormatOptions,
        ): RelativeTimeFormat;
        supportedLocalesOf(
            locales?: LocalesArgument,
            options?: RelativeTimeFormatOptions,
        ): UnicodeBCP47LocaleIdentifier[];
    };
    interface NumberFormatOptionsStyleRegistry {
        unit: never;
    }
    interface NumberFormatOptionsCurrencyDisplayRegistry {
        narrowSymbol: never;
    }
    interface NumberFormatOptionsSignDisplayRegistry {
        auto: never;
        never: never;
        always: never;
        exceptZero: never;
    }
    type NumberFormatOptionsSignDisplay = keyof NumberFormatOptionsSignDisplayRegistry;
    interface NumberFormatOptions {
        numberingSystem?: string | undefined;
        compactDisplay?: "short" | "long" | undefined;
        notation?: "standard" | "scientific" | "engineering" | "compact" | undefined;
        signDisplay?: NumberFormatOptionsSignDisplay | undefined;
        unit?: string | undefined;
        unitDisplay?: "short" | "long" | "narrow" | undefined;
        currencySign?: "standard" | "accounting" | undefined;
    }
    interface ResolvedNumberFormatOptions {
        compactDisplay?: "short" | "long";
        notation: "standard" | "scientific" | "engineering" | "compact";
        signDisplay: NumberFormatOptionsSignDisplay;
        unit?: string;
        unitDisplay?: "short" | "long" | "narrow";
        currencySign?: "standard" | "accounting";
    }
    interface NumberFormatPartTypeRegistry {
        compact: never;
        exponentInteger: never;
        exponentMinusSign: never;
        exponentSeparator: never;
        unit: never;
        unknown: never;
    }
    interface DateTimeFormatOptions {
        calendar?: string | undefined;
        dayPeriod?: "narrow" | "short" | "long" | undefined;
        numberingSystem?: string | undefined;
        dateStyle?: "full" | "long" | "medium" | "short" | undefined;
        timeStyle?: "full" | "long" | "medium" | "short" | undefined;
        hourCycle?: "h11" | "h12" | "h23" | "h24" | undefined;
    }
    type LocaleHourCycleKey = "h12" | "h23" | "h11" | "h24";
    type LocaleCollationCaseFirst = "upper" | "lower" | "false";
    interface LocaleOptions {
        baseName?: string;
        calendar?: string;
        caseFirst?: LocaleCollationCaseFirst;
        collation?: string;
        hourCycle?: LocaleHourCycleKey;
        language?: string;
        numberingSystem?: string;
        numeric?: boolean;
        region?: string;
        script?: string;
    }
    interface Locale extends LocaleOptions {
        baseName: string;
        language: string;
        maximize(): Locale;
        minimize(): Locale;
        toString(): UnicodeBCP47LocaleIdentifier;
    }
    const Locale: {
        new (tag: UnicodeBCP47LocaleIdentifier | Locale, options?: LocaleOptions): Locale;
    };
    type DisplayNamesFallback =
        | "code"
        | "none";
    type DisplayNamesType =
        | "language"
        | "region"
        | "script"
        | "calendar"
        | "dateTimeField"
        | "currency";
    type DisplayNamesLanguageDisplay =
        | "dialect"
        | "standard";
    interface DisplayNamesOptions {
        localeMatcher?: RelativeTimeFormatLocaleMatcher;
        style?: RelativeTimeFormatStyle;
        type: DisplayNamesType;
        languageDisplay?: DisplayNamesLanguageDisplay;
        fallback?: DisplayNamesFallback;
    }
    interface ResolvedDisplayNamesOptions {
        locale: UnicodeBCP47LocaleIdentifier;
        style: RelativeTimeFormatStyle;
        type: DisplayNamesType;
        fallback: DisplayNamesFallback;
        languageDisplay?: DisplayNamesLanguageDisplay;
    }
    interface DisplayNames {
        of(code: string): string | undefined;
        resolvedOptions(): ResolvedDisplayNamesOptions;
    }
    const DisplayNames: {
        prototype: DisplayNames;
        new (locales: LocalesArgument, options: DisplayNamesOptions): DisplayNames;
        supportedLocalesOf(locales?: LocalesArgument, options?: { localeMatcher?: RelativeTimeFormatLocaleMatcher; }): UnicodeBCP47LocaleIdentifier[];
    };
    interface CollatorConstructor {
        new (locales?: LocalesArgument, options?: CollatorOptions): Collator;
        (locales?: LocalesArgument, options?: CollatorOptions): Collator;
        supportedLocalesOf(locales: LocalesArgument, options?: CollatorOptions): string[];
    }
    interface DateTimeFormatConstructor {
        new (locales?: LocalesArgument, options?: DateTimeFormatOptions): DateTimeFormat;
        (locales?: LocalesArgument, options?: DateTimeFormatOptions): DateTimeFormat;
        supportedLocalesOf(locales: LocalesArgument, options?: DateTimeFormatOptions): string[];
    }
    interface NumberFormatConstructor {
        new (locales?: LocalesArgument, options?: NumberFormatOptions): NumberFormat;
        (locales?: LocalesArgument, options?: NumberFormatOptions): NumberFormat;
        supportedLocalesOf(locales: LocalesArgument, options?: NumberFormatOptions): string[];
    }
    interface PluralRulesConstructor {
        new (locales?: LocalesArgument, options?: PluralRulesOptions): PluralRules;
        (locales?: LocalesArgument, options?: PluralRulesOptions): PluralRules;
        supportedLocalesOf(locales: LocalesArgument, options?: { localeMatcher?: "lookup" | "best fit"; }): string[];
    }
}
interface PromiseFulfilledResult<T> {
    status: "fulfilled";
    value: T;
}
interface PromiseRejectedResult {
    status: "rejected";
    reason: any;
}
type PromiseSettledResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult;
interface PromiseConstructor {
    allSettled<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: PromiseSettledResult<Awaited<T[P]>>; }>;
    allSettled<T>(values: Iterable<T | PromiseLike<T>>): Promise<PromiseSettledResult<Awaited<T>>[]>;
}
interface Atomics {
    add(typedArray: BigInt64Array<ArrayBufferLike> | BigUint64Array<ArrayBufferLike>, index: number, value: bigint): bigint;
    and(typedArray: BigInt64Array<ArrayBufferLike> | BigUint64Array<ArrayBufferLike>, index: number, value: bigint): bigint;
    compareExchange(typedArray: BigInt64Array<ArrayBufferLike> | BigUint64Array<ArrayBufferLike>, index: number, expectedValue: bigint, replacementValue: bigint): bigint;
    exchange(typedArray: BigInt64Array<ArrayBufferLike> | BigUint64Array<ArrayBufferLike>, index: number, value: bigint): bigint;
    load(typedArray: BigInt64Array<ArrayBufferLike> | BigUint64Array<ArrayBufferLike>, index: number): bigint;
    or(typedArray: BigInt64Array<ArrayBufferLike> | BigUint64Array<ArrayBufferLike>, index: number, value: bigint): bigint;
    store(typedArray: BigInt64Array<ArrayBufferLike> | BigUint64Array<ArrayBufferLike>, index: number, value: bigint): bigint;
    sub(typedArray: BigInt64Array<ArrayBufferLike> | BigUint64Array<ArrayBufferLike>, index: number, value: bigint): bigint;
    wait(typedArray: BigInt64Array<ArrayBufferLike>, index: number, value: bigint, timeout?: number): "ok" | "not-equal" | "timed-out";
    notify(typedArray: BigInt64Array<ArrayBufferLike>, index: number, count?: number): number;
    xor(typedArray: BigInt64Array<ArrayBufferLike> | BigUint64Array<ArrayBufferLike>, index: number, value: bigint): bigint;
}
interface RegExpStringIterator<T> extends IteratorObject<T, BuiltinIteratorReturn, unknown> {
    [Symbol.iterator](): RegExpStringIterator<T>;
}
type FlatArray<Arr, Depth extends number> = {
    done: Arr;
    recur: Arr extends ReadonlyArray<infer InnerArr> ? FlatArray<InnerArr, [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][Depth]>
        : Arr;
}[Depth extends -1 ? "done" : "recur"];
namespace Intl {
    interface DateTimeFormatPartTypesRegistry {
        fractionalSecond: any;
    }
    interface DateTimeFormatOptions {
        formatMatcher?: "basic" | "best fit" | "best fit" | undefined;
        dateStyle?: "full" | "long" | "medium" | "short" | undefined;
        timeStyle?: "full" | "long" | "medium" | "short" | undefined;
        dayPeriod?: "narrow" | "short" | "long" | undefined;
        fractionalSecondDigits?: 1 | 2 | 3 | undefined;
    }
    interface DateTimeRangeFormatPart extends DateTimeFormatPart {
        source: "startRange" | "endRange" | "shared";
    }
    interface DateTimeFormat {
        formatRange(startDate: Date | number | bigint, endDate: Date | number | bigint): string;
        formatRangeToParts(startDate: Date | number | bigint, endDate: Date | number | bigint): DateTimeRangeFormatPart[];
    }
    interface ResolvedDateTimeFormatOptions {
        formatMatcher?: "basic" | "best fit" | "best fit";
        dateStyle?: "full" | "long" | "medium" | "short";
        timeStyle?: "full" | "long" | "medium" | "short";
        hourCycle?: "h11" | "h12" | "h23" | "h24";
        dayPeriod?: "narrow" | "short" | "long";
        fractionalSecondDigits?: 1 | 2 | 3;
    }
    type ListFormatLocaleMatcher = "lookup" | "best fit";
    type ListFormatType = "conjunction" | "disjunction" | "unit";
    type ListFormatStyle = "long" | "short" | "narrow";
    interface ListFormatOptions {
        localeMatcher?: ListFormatLocaleMatcher | undefined;
        type?: ListFormatType | undefined;
        style?: ListFormatStyle | undefined;
    }
    interface ResolvedListFormatOptions {
        locale: string;
        style: ListFormatStyle;
        type: ListFormatType;
    }
    interface ListFormat {
        format(list: Iterable<string>): string;
        formatToParts(list: Iterable<string>): { type: "element" | "literal"; value: string; }[];
        resolvedOptions(): ResolvedListFormatOptions;
    }
    const ListFormat: {
        prototype: ListFormat;
        new (locales?: LocalesArgument, options?: ListFormatOptions): ListFormat;
        supportedLocalesOf(locales: LocalesArgument, options?: Pick<ListFormatOptions, "localeMatcher">): UnicodeBCP47LocaleIdentifier[];
    };
}
interface AggregateError extends Error {
    errors: any[];
}
interface AggregateErrorConstructor {
    new (errors: Iterable<any>, message?: string): AggregateError;
    (errors: Iterable<any>, message?: string): AggregateError;
    readonly prototype: AggregateError;
}
var AggregateError: AggregateErrorConstructor;
interface PromiseConstructor {
    any<T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>>;
    any<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>>;
}
interface WeakRef<T extends WeakKey> {
    readonly [Symbol.toStringTag]: "WeakRef";
    deref(): T | undefined;
}
interface WeakRefConstructor {
    readonly prototype: WeakRef<any>;
    new <T extends WeakKey>(target: T): WeakRef<T>;
}
var WeakRef: WeakRefConstructor;
interface FinalizationRegistry<T> {
    readonly [Symbol.toStringTag]: "FinalizationRegistry";
    register(target: WeakKey, heldValue: T, unregisterToken?: WeakKey): void;
    unregister(unregisterToken: WeakKey): boolean;
}
interface FinalizationRegistryConstructor {
    readonly prototype: FinalizationRegistry<any>;
    new <T>(cleanupCallback: (heldValue: T) => void): FinalizationRegistry<T>;
}
var FinalizationRegistry: FinalizationRegistryConstructor;
interface Uint8Array<TArrayBuffer extends ArrayBufferLike> {
    at(index: number): number | undefined;
}
interface Uint8ClampedArray<TArrayBuffer extends ArrayBufferLike> {
    at(index: number): number | undefined;
}
interface Int16Array<TArrayBuffer extends ArrayBufferLike> {
    at(index: number): number | undefined;
}
interface Uint16Array<TArrayBuffer extends ArrayBufferLike> {
    at(index: number): number | undefined;
}
interface Int32Array<TArrayBuffer extends ArrayBufferLike> {
    at(index: number): number | undefined;
}
interface Uint32Array<TArrayBuffer extends ArrayBufferLike> {
    at(index: number): number | undefined;
}
interface Float32Array<TArrayBuffer extends ArrayBufferLike> {
    at(index: number): number | undefined;
}
interface Float64Array<TArrayBuffer extends ArrayBufferLike> {
    at(index: number): number | undefined;
}
interface BigInt64Array<TArrayBuffer extends ArrayBufferLike> {
    at(index: number): bigint | undefined;
}
interface BigUint64Array<TArrayBuffer extends ArrayBufferLike> {
    at(index: number): bigint | undefined;
}
interface ErrorOptions {
    cause?: unknown;
}
interface AggregateErrorConstructor {
    new (
        errors: Iterable<any>,
        message?: string,
        options?: ErrorOptions,
    ): AggregateError;
    (
        errors: Iterable<any>,
        message?: string,
        options?: ErrorOptions,
    ): AggregateError;
}
interface RegExpIndicesArray extends Array<[number, number] | undefined> {
    groups?: {
        [key: string]: [number, number];
    };
}
interface Uint8Array<TArrayBuffer extends ArrayBufferLike> {
    findLast<S extends number>(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => value is S,
        thisArg?: any,
    ): S | undefined;
    findLast(
        predicate: (value: number, index: number, array: this) => unknown,
        thisArg?: any,
    ): number | undefined;
    findLastIndex(
        predicate: (value: number, index: number, array: this) => unknown,
        thisArg?: any,
    ): number;
    toReversed(): Uint8Array<ArrayBuffer>;
    toSorted(compareFn?: (a: number, b: number) => number): Uint8Array<ArrayBuffer>;
    with(index: number, value: number): Uint8Array<ArrayBuffer>;
}
interface Uint8ClampedArray<TArrayBuffer extends ArrayBufferLike> {
    findLast<S extends number>(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => value is S,
        thisArg?: any,
    ): S | undefined;
    findLast(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number | undefined;
    findLastIndex(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number;
    toReversed(): Uint8ClampedArray<ArrayBuffer>;
    toSorted(compareFn?: (a: number, b: number) => number): Uint8ClampedArray<ArrayBuffer>;
    with(index: number, value: number): Uint8ClampedArray<ArrayBuffer>;
}
interface Int16Array<TArrayBuffer extends ArrayBufferLike> {
    findLast<S extends number>(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => value is S,
        thisArg?: any,
    ): S | undefined;
    findLast(
        predicate: (value: number, index: number, array: this) => unknown,
        thisArg?: any,
    ): number | undefined;
    findLastIndex(
        predicate: (value: number, index: number, array: this) => unknown,
        thisArg?: any,
    ): number;
    toReversed(): Int16Array<ArrayBuffer>;
    toSorted(compareFn?: (a: number, b: number) => number): Int16Array<ArrayBuffer>;
    with(index: number, value: number): Int16Array<ArrayBuffer>;
}
interface Uint16Array<TArrayBuffer extends ArrayBufferLike> {
    findLast<S extends number>(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => value is S,
        thisArg?: any,
    ): S | undefined;
    findLast(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number | undefined;
    findLastIndex(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number;
    toReversed(): Uint16Array<ArrayBuffer>;
    toSorted(compareFn?: (a: number, b: number) => number): Uint16Array<ArrayBuffer>;
    with(index: number, value: number): Uint16Array<ArrayBuffer>;
}
interface Int32Array<TArrayBuffer extends ArrayBufferLike> {
    findLast<S extends number>(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => value is S,
        thisArg?: any,
    ): S | undefined;
    findLast(
        predicate: (value: number, index: number, array: this) => unknown,
        thisArg?: any,
    ): number | undefined;
    findLastIndex(
        predicate: (value: number, index: number, array: this) => unknown,
        thisArg?: any,
    ): number;
    toReversed(): Int32Array<ArrayBuffer>;
    toSorted(compareFn?: (a: number, b: number) => number): Int32Array<ArrayBuffer>;
    with(index: number, value: number): Int32Array<ArrayBuffer>;
}
interface Uint32Array<TArrayBuffer extends ArrayBufferLike> {
    findLast<S extends number>(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => value is S,
        thisArg?: any,
    ): S | undefined;
    findLast(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number | undefined;
    findLastIndex(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number;
    toReversed(): Uint32Array<ArrayBuffer>;
    toSorted(compareFn?: (a: number, b: number) => number): Uint32Array<ArrayBuffer>;
    with(index: number, value: number): Uint32Array<ArrayBuffer>;
}
interface Float32Array<TArrayBuffer extends ArrayBufferLike> {
    findLast<S extends number>(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => value is S,
        thisArg?: any,
    ): S | undefined;
    findLast(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number | undefined;
    findLastIndex(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number;
    toReversed(): Float32Array<ArrayBuffer>;
    toSorted(compareFn?: (a: number, b: number) => number): Float32Array<ArrayBuffer>;
    with(index: number, value: number): Float32Array<ArrayBuffer>;
}
interface Float64Array<TArrayBuffer extends ArrayBufferLike> {
    findLast<S extends number>(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => value is S,
        thisArg?: any,
    ): S | undefined;
    findLast(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number | undefined;
    findLastIndex(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number;
    toReversed(): Float64Array<ArrayBuffer>;
    toSorted(compareFn?: (a: number, b: number) => number): Float64Array<ArrayBuffer>;
    with(index: number, value: number): Float64Array<ArrayBuffer>;
}
interface BigInt64Array<TArrayBuffer extends ArrayBufferLike> {
    findLast<S extends bigint>(
        predicate: (
            value: bigint,
            index: number,
            array: this,
        ) => value is S,
        thisArg?: any,
    ): S | undefined;
    findLast(
        predicate: (
            value: bigint,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): bigint | undefined;
    findLastIndex(
        predicate: (
            value: bigint,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number;
    toReversed(): BigInt64Array<ArrayBuffer>;
    toSorted(compareFn?: (a: bigint, b: bigint) => number): BigInt64Array<ArrayBuffer>;
    with(index: number, value: bigint): BigInt64Array<ArrayBuffer>;
}
interface BigUint64Array<TArrayBuffer extends ArrayBufferLike> {
    findLast<S extends bigint>(
        predicate: (
            value: bigint,
            index: number,
            array: this,
        ) => value is S,
        thisArg?: any,
    ): S | undefined;
    findLast(
        predicate: (
            value: bigint,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): bigint | undefined;
    findLastIndex(
        predicate: (
            value: bigint,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number;
    toReversed(): BigUint64Array<ArrayBuffer>;
    toSorted(compareFn?: (a: bigint, b: bigint) => number): BigUint64Array<ArrayBuffer>;
    with(index: number, value: bigint): BigUint64Array<ArrayBuffer>;
}
namespace Intl {
    interface NumberFormatOptionsUseGroupingRegistry {
        min2: never;
        auto: never;
        always: never;
    }
    interface NumberFormatOptionsSignDisplayRegistry {
        negative: never;
    }
    interface NumberFormatRangePartTypeRegistry extends NumberFormatPartTypeRegistry {
        approximatelySign: never;
    }
    type NumberFormatRangePartTypes = keyof NumberFormatRangePartTypeRegistry;
    interface NumberFormatOptions {
        roundingPriority?: "auto" | "morePrecision" | "lessPrecision" | undefined;
        roundingIncrement?: 1 | 2 | 5 | 10 | 20 | 25 | 50 | 100 | 200 | 250 | 500 | 1000 | 2000 | 2500 | 5000 | undefined;
        roundingMode?: "ceil" | "floor" | "expand" | "trunc" | "halfCeil" | "halfFloor" | "halfExpand" | "halfTrunc" | "halfEven" | undefined;
        trailingZeroDisplay?: "auto" | "stripIfInteger" | undefined;
    }
    interface ResolvedNumberFormatOptions {
        roundingPriority: "auto" | "morePrecision" | "lessPrecision";
        roundingMode: "ceil" | "floor" | "expand" | "trunc" | "halfCeil" | "halfFloor" | "halfExpand" | "halfTrunc" | "halfEven";
        roundingIncrement: 1 | 2 | 5 | 10 | 20 | 25 | 50 | 100 | 200 | 250 | 500 | 1000 | 2000 | 2500 | 5000;
        trailingZeroDisplay: "auto" | "stripIfInteger";
    }
    interface NumberRangeFormatPart {
        type: NumberFormatRangePartTypes;
        value: string;
        source: "startRange" | "endRange" | "shared";
    }
    type StringNumericLiteral = `${number}` | "Infinity" | "-Infinity" | "+Infinity";
    interface NumberFormat {
        format(value: number | bigint | StringNumericLiteral): string;
        formatToParts(value: number | bigint | StringNumericLiteral): NumberFormatPart[];
        formatRange(start: number | bigint | StringNumericLiteral, end: number | bigint | StringNumericLiteral): string;
        formatRangeToParts(start: number | bigint | StringNumericLiteral, end: number | bigint | StringNumericLiteral): NumberRangeFormatPart[];
    }
}
interface MapConstructor {
    groupBy<K, T>(
        items: Iterable<T>,
        keySelector: (item: T, index: number) => K,
    ): Map<K, T[]>;
}
interface PromiseWithResolvers<T> {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
}
interface PromiseConstructor {
    withResolvers<T>(): PromiseWithResolvers<T>;
}
interface Atomics {
    waitAsync(typedArray: Int32Array, index: number, value: number, timeout?: number): { async: false; value: "not-equal" | "timed-out"; } | { async: true; value: Promise<"ok" | "timed-out">; };
    waitAsync(typedArray: BigInt64Array, index: number, value: bigint, timeout?: number): { async: false; value: "not-equal" | "timed-out"; } | { async: true; value: Promise<"ok" | "timed-out">; };
}
interface SharedArrayBuffer {
    get growable(): boolean;
    get maxByteLength(): number;
    grow(newByteLength?: number): void;
}
interface SharedArrayBufferConstructor {
    new (byteLength: number, options?: { maxByteLength?: number; }): SharedArrayBuffer;
}
interface ReadonlySetLike<T> {
    keys(): Iterator<T>;
    has(value: T): boolean;
    readonly size: number;
}
interface Set<T> {
    union<U>(other: ReadonlySetLike<U>): Set<T | U>;
    intersection<U>(other: ReadonlySetLike<U>): Set<T & U>;
    difference<U>(other: ReadonlySetLike<U>): Set<T>;
    symmetricDifference<U>(other: ReadonlySetLike<U>): Set<T | U>;
    isSubsetOf(other: ReadonlySetLike<unknown>): boolean;
    isSupersetOf(other: ReadonlySetLike<unknown>): boolean;
    isDisjointFrom(other: ReadonlySetLike<unknown>): boolean;
}
interface ReadonlySet<T> {
    union<U>(other: ReadonlySetLike<U>): Set<T | U>;
    intersection<U>(other: ReadonlySetLike<U>): Set<T & U>;
    difference<U>(other: ReadonlySetLike<U>): Set<T>;
    symmetricDifference<U>(other: ReadonlySetLike<U>): Set<T | U>;
    isSubsetOf(other: ReadonlySetLike<unknown>): boolean;
    isSupersetOf(other: ReadonlySetLike<unknown>): boolean;
    isDisjointFrom(other: ReadonlySetLike<unknown>): boolean;
}
interface Float16Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    readonly BYTES_PER_ELEMENT: number;
    readonly buffer: TArrayBuffer;
    readonly byteLength: number;
    readonly byteOffset: number;
    at(index: number): number | undefined;
    copyWithin(target: number, start: number, end?: number): this;
    every(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;
    fill(value: number, start?: number, end?: number): this;
    filter(predicate: (value: number, index: number, array: this) => any, thisArg?: any): Float16Array<ArrayBuffer>;
    find(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number | undefined;
    findIndex(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number;
    findLast<S extends number>(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => value is S,
        thisArg?: any,
    ): S | undefined;
    findLast(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number | undefined;
    findLastIndex(
        predicate: (
            value: number,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number;
    forEach(callbackfn: (value: number, index: number, array: this) => void, thisArg?: any): void;
    includes(searchElement: number, fromIndex?: number): boolean;
    indexOf(searchElement: number, fromIndex?: number): number;
    join(separator?: string): string;
    lastIndexOf(searchElement: number, fromIndex?: number): number;
    readonly length: number;
    map(callbackfn: (value: number, index: number, array: this) => number, thisArg?: any): Float16Array<ArrayBuffer>;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;
    reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;
    reverse(): this;
    set(array: ArrayLike<number>, offset?: number): void;
    slice(start?: number, end?: number): Float16Array<ArrayBuffer>;
    some(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;
    sort(compareFn?: (a: number, b: number) => number): this;
    subarray(begin?: number, end?: number): Float16Array<TArrayBuffer>;
    toLocaleString(locales?: string | string[], options?: Intl.NumberFormatOptions): string;
    toReversed(): Float16Array<ArrayBuffer>;
    toSorted(compareFn?: (a: number, b: number) => number): Float16Array<ArrayBuffer>;
    toString(): string;
    valueOf(): this;
    with(index: number, value: number): Float16Array<ArrayBuffer>;
    [index: number]: number;
    [Symbol.iterator](): ArrayIterator<number>;
    entries(): ArrayIterator<[number, number]>;
    keys(): ArrayIterator<number>;
    values(): ArrayIterator<number>;
    readonly [Symbol.toStringTag]: "Float16Array";
}
interface Float16ArrayConstructor {
    readonly prototype: Float16Array<ArrayBufferLike>;
    new (length?: number): Float16Array<ArrayBuffer>;
    new (array: ArrayLike<number> | Iterable<number>): Float16Array<ArrayBuffer>;
    new <TArrayBuffer extends ArrayBufferLike = ArrayBuffer>(buffer: TArrayBuffer, byteOffset?: number, length?: number): Float16Array<TArrayBuffer>;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Float16Array<ArrayBuffer>;
    new (array: ArrayLike<number> | ArrayBuffer): Float16Array<ArrayBuffer>;
    readonly BYTES_PER_ELEMENT: number;
    of(...items: number[]): Float16Array<ArrayBuffer>;
    from(arrayLike: ArrayLike<number>): Float16Array<ArrayBuffer>;
    from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any): Float16Array<ArrayBuffer>;
    from(elements: Iterable<number>): Float16Array<ArrayBuffer>;
    from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Float16Array<ArrayBuffer>;
}
var Float16Array: Float16ArrayConstructor;
namespace Intl {
    type DurationFormatLocaleMatcher = "lookup" | "best fit";
    type DurationFormatStyle = "long" | "short" | "narrow" | "digital";
    type DurationFormatDisplayOption = "always" | "auto";
    type DurationFormatUnit =
        | "years"
        | "months"
        | "weeks"
        | "days"
        | "hours"
        | "minutes"
        | "seconds"
        | "milliseconds"
        | "microseconds"
        | "nanoseconds";
    type DurationFormatUnitSingular =
        | "year"
        | "month"
        | "week"
        | "day"
        | "hour"
        | "minute"
        | "second"
        | "millisecond"
        | "microsecond"
        | "nanosecond";
    type DurationFormatPart =
        | {
            type: "literal";
            value: string;
            unit?: DurationFormatUnitSingular;
        }
        | {
            type: Exclude<NumberFormatPartTypes, "literal">;
            value: string;
            unit: DurationFormatUnitSingular;
        };
    interface DurationFormatOptions {
        localeMatcher?: DurationFormatLocaleMatcher | undefined;
        numberingSystem?: string | undefined;
        style?: DurationFormatStyle | undefined;
        years?: "long" | "short" | "narrow" | undefined;
        yearsDisplay?: DurationFormatDisplayOption | undefined;
        months?: "long" | "short" | "narrow" | undefined;
        monthsDisplay?: DurationFormatDisplayOption | undefined;
        weeks?: "long" | "short" | "narrow" | undefined;
        weeksDisplay?: DurationFormatDisplayOption | undefined;
        days?: "long" | "short" | "narrow" | undefined;
        daysDisplay?: DurationFormatDisplayOption | undefined;
        hours?: "long" | "short" | "narrow" | "numeric" | "2-digit" | undefined;
        hoursDisplay?: DurationFormatDisplayOption | undefined;
        minutes?: "long" | "short" | "narrow" | "numeric" | "2-digit" | undefined;
        minutesDisplay?: DurationFormatDisplayOption | undefined;
        seconds?: "long" | "short" | "narrow" | "numeric" | "2-digit" | undefined;
        secondsDisplay?: DurationFormatDisplayOption | undefined;
        milliseconds?: "long" | "short" | "narrow" | "numeric" | undefined;
        millisecondsDisplay?: DurationFormatDisplayOption | undefined;
        microseconds?: "long" | "short" | "narrow" | "numeric" | undefined;
        microsecondsDisplay?: DurationFormatDisplayOption | undefined;
        nanoseconds?: "long" | "short" | "narrow" | "numeric" | undefined;
        nanosecondsDisplay?: DurationFormatDisplayOption | undefined;
        fractionalDigits?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | undefined;
    }
    interface DurationFormat {
        format(duration: Partial<Record<DurationFormatUnit, number>>): string;
        formatToParts(duration: Partial<Record<DurationFormatUnit, number>>): DurationFormatPart[];
        resolvedOptions(): ResolvedDurationFormatOptions;
    }
    interface ResolvedDurationFormatOptions {
        locale: UnicodeBCP47LocaleIdentifier;
        numberingSystem: string;
        style: DurationFormatStyle;
        years: "long" | "short" | "narrow";
        yearsDisplay: DurationFormatDisplayOption;
        months: "long" | "short" | "narrow";
        monthsDisplay: DurationFormatDisplayOption;
        weeks: "long" | "short" | "narrow";
        weeksDisplay: DurationFormatDisplayOption;
        days: "long" | "short" | "narrow";
        daysDisplay: DurationFormatDisplayOption;
        hours: "long" | "short" | "narrow" | "numeric" | "2-digit";
        hoursDisplay: DurationFormatDisplayOption;
        minutes: "long" | "short" | "narrow" | "numeric" | "2-digit";
        minutesDisplay: DurationFormatDisplayOption;
        seconds: "long" | "short" | "narrow" | "numeric" | "2-digit";
        secondsDisplay: DurationFormatDisplayOption;
        milliseconds: "long" | "short" | "narrow" | "numeric";
        millisecondsDisplay: DurationFormatDisplayOption;
        microseconds: "long" | "short" | "narrow" | "numeric";
        microsecondsDisplay: DurationFormatDisplayOption;
        nanoseconds: "long" | "short" | "narrow" | "numeric";
        nanosecondsDisplay: DurationFormatDisplayOption;
        fractionalDigits?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    }
    const DurationFormat: {
        prototype: DurationFormat;
        new (locales?: LocalesArgument, options?: DurationFormatOptions): DurationFormat;
        supportedLocalesOf(locales?: LocalesArgument, options?: { localeMatcher?: DurationFormatLocaleMatcher; }): UnicodeBCP47LocaleIdentifier[];
    };
}
interface IteratorObject<T, TReturn, TNext> {
    [Symbol.iterator](): IteratorObject<T, TReturn, TNext>;
    map<U>(callbackfn: (value: T, index: number) => U): IteratorObject<U, undefined, unknown>;
    filter<S extends T>(predicate: (value: T, index: number) => value is S): IteratorObject<S, undefined, unknown>;
    filter(predicate: (value: T, index: number) => unknown): IteratorObject<T, undefined, unknown>;
    take(limit: number): IteratorObject<T, undefined, unknown>;
    drop(count: number): IteratorObject<T, undefined, unknown>;
    flatMap<U>(callback: (value: T, index: number) => Iterator<U, unknown, undefined> | Iterable<U, unknown, undefined>): IteratorObject<U, undefined, unknown>;
    reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number) => T): T;
    reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number) => T, initialValue: T): T;
    reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => U, initialValue: U): U;
    toArray(): T[];
    forEach(callbackfn: (value: T, index: number) => void): void;
    some(predicate: (value: T, index: number) => unknown): boolean;
    every(predicate: (value: T, index: number) => unknown): boolean;
    find<S extends T>(predicate: (value: T, index: number) => value is S): S | undefined;
    find(predicate: (value: T, index: number) => unknown): T | undefined;
    readonly [Symbol.toStringTag]: string;
}
interface IteratorConstructor {
    from<T>(value: Iterator<T, unknown, undefined> | Iterable<T, unknown, undefined>): IteratorObject<T, undefined, unknown>;
}
var Iterator: IteratorConstructor;
interface PromiseConstructor {
    try<T, U extends unknown[]>(callbackFn: (...args: U) => T | PromiseLike<T>, ...args: U): Promise<Awaited<T>>;
}
interface Map<K, V> {
    getOrInsert(key: K, defaultValue: V): V;
    getOrInsertComputed(key: K, callback: (key: K) => V): V;
}
interface WeakMap<K extends WeakKey, V> {
    getOrInsert(key: K, defaultValue: V): V;
    getOrInsertComputed(key: K, callback: (key: K) => V): V;
}
interface Disposable {
    [Symbol.dispose](): void;
}
interface AsyncDisposable {
    [Symbol.asyncDispose](): PromiseLike<void>;
}
interface SuppressedError extends Error {
    error: any;
    suppressed: any;
}
interface SuppressedErrorConstructor {
    new (error: any, suppressed: any, message?: string): SuppressedError;
    (error: any, suppressed: any, message?: string): SuppressedError;
    readonly prototype: SuppressedError;
}
var SuppressedError: SuppressedErrorConstructor;
interface DisposableStack {
    readonly disposed: boolean;
    dispose(): void;
    use<T extends Disposable | null | undefined>(value: T): T;
    adopt<T>(value: T, onDispose: (value: T) => void): T;
    defer(onDispose: () => void): void;
    move(): DisposableStack;
    [Symbol.dispose](): void;
    readonly [Symbol.toStringTag]: string;
}
interface DisposableStackConstructor {
    new (): DisposableStack;
    readonly prototype: DisposableStack;
}
var DisposableStack: DisposableStackConstructor;
interface AsyncDisposableStack {
    readonly disposed: boolean;
    disposeAsync(): Promise<void>;
    use<T extends AsyncDisposable | Disposable | null | undefined>(value: T): T;
    adopt<T>(value: T, onDisposeAsync: (value: T) => PromiseLike<void> | void): T;
    defer(onDisposeAsync: () => PromiseLike<void> | void): void;
    move(): AsyncDisposableStack;
    [Symbol.asyncDispose](): Promise<void>;
    readonly [Symbol.toStringTag]: string;
}
interface AsyncDisposableStackConstructor {
    new (): AsyncDisposableStack;
    readonly prototype: AsyncDisposableStack;
}
var AsyncDisposableStack: AsyncDisposableStackConstructor;
interface IteratorObject<T, TReturn, TNext> extends Disposable {
}
interface AsyncIteratorObject<T, TReturn, TNext> extends AsyncDisposable {
}
namespace Intl {
    type FormattableTemporalObject = Temporal.PlainDate | Temporal.PlainYearMonth | Temporal.PlainMonthDay | Temporal.PlainTime | Temporal.PlainDateTime | Temporal.Instant;
    interface DateTimeFormat {
        format(date?: FormattableTemporalObject | Date | number): string;
        formatToParts(date?: FormattableTemporalObject | Date | number): DateTimeFormatPart[];
        formatRange(startDate: FormattableTemporalObject | Date | number, endDate: FormattableTemporalObject | Date | number): string;
        formatRangeToParts(startDate: FormattableTemporalObject | Date | number, endDate: FormattableTemporalObject | Date | number): DateTimeRangeFormatPart[];
    }
    interface Locale {
        getCalendars(): string[];
        getCollations(): string[];
        getHourCycles(): string[];
        getNumberingSystems(): string[];
        getTextInfo(): TextInfo;
        getTimeZones(): string[] | undefined;
        getWeekInfo(): WeekInfo;
    }
    interface TextInfo {
        direction?: "ltr" | "rtl";
    }
    interface WeekInfo {
        firstDay: number;
        weekend: number[];
    }
}
interface Atomics {
    pause(n?: number): void;
}
namespace Temporal {
    type CalendarLike = PlainDate | PlainDateTime | PlainMonthDay | PlainYearMonth | ZonedDateTime | string;
    type DurationLike = Duration | DurationLikeObject | string;
    type InstantLike = Instant | ZonedDateTime | string;
    type PlainDateLike = PlainDate | ZonedDateTime | PlainDateTime | DateLikeObject | string;
    type PlainDateTimeLike = PlainDateTime | ZonedDateTime | PlainDate | DateTimeLikeObject | string;
    type PlainMonthDayLike = PlainMonthDay | DateLikeObject | string;
    type PlainTimeLike = PlainTime | PlainDateTime | ZonedDateTime | TimeLikeObject | string;
    type PlainYearMonthLike = PlainYearMonth | YearMonthLikeObject | string;
    type TimeZoneLike = ZonedDateTime | string;
    type ZonedDateTimeLike = ZonedDateTime | ZonedDateTimeLikeObject | string;
    type PartialTemporalLike<T extends object> = {
        [P in Exclude<keyof T, "calendar" | "timeZone">]?: T[P] | undefined;
    };
    interface DateLikeObject {
        year?: number | undefined;
        era?: string | undefined;
        eraYear?: number | undefined;
        month?: number | undefined;
        monthCode?: string | undefined;
        day: number;
        calendar?: string | undefined;
    }
    interface DateTimeLikeObject extends DateLikeObject, TimeLikeObject {}
    interface DurationLikeObject {
        years?: number | undefined;
        months?: number | undefined;
        weeks?: number | undefined;
        days?: number | undefined;
        hours?: number | undefined;
        minutes?: number | undefined;
        seconds?: number | undefined;
        milliseconds?: number | undefined;
        microseconds?: number | undefined;
        nanoseconds?: number | undefined;
    }
    interface TimeLikeObject {
        hour?: number | undefined;
        minute?: number | undefined;
        second?: number | undefined;
        millisecond?: number | undefined;
        microsecond?: number | undefined;
        nanosecond?: number | undefined;
    }
    interface YearMonthLikeObject extends Omit<DateLikeObject, "day"> {}
    interface ZonedDateTimeLikeObject extends DateTimeLikeObject {
        timeZone: TimeZoneLike;
        offset?: string | undefined;
    }
    type DateUnit = "year" | "month" | "week" | "day";
    type TimeUnit = "hour" | "minute" | "second" | "millisecond" | "microsecond" | "nanosecond";
    type PluralizeUnit<T extends DateUnit | TimeUnit> =
        | T
        | {
            year: "years";
            month: "months";
            week: "weeks";
            day: "days";
            hour: "hours";
            minute: "minutes";
            second: "seconds";
            millisecond: "milliseconds";
            microsecond: "microseconds";
            nanosecond: "nanoseconds";
        }[T];
    interface DisambiguationOptions {
        disambiguation?: "compatible" | "earlier" | "later" | "reject" | undefined;
    }
    interface OverflowOptions {
        overflow?: "constrain" | "reject" | undefined;
    }
    interface TransitionOptions {
        direction: "next" | "previous";
    }
    interface RoundingOptions<Units extends DateUnit | TimeUnit> {
        smallestUnit?: PluralizeUnit<Units> | undefined;
        roundingIncrement?: number | undefined;
        roundingMode?: "ceil" | "floor" | "expand" | "trunc" | "halfCeil" | "halfFloor" | "halfExpand" | "halfTrunc" | "halfEven" | undefined;
    }
    interface RoundingOptionsWithLargestUnit<Units extends DateUnit | TimeUnit> extends RoundingOptions<Units> {
        largestUnit?: "auto" | PluralizeUnit<Units> | undefined;
    }
    interface ToStringRoundingOptions<Units extends DateUnit | TimeUnit> extends Pick<RoundingOptions<Units>, "smallestUnit" | "roundingMode"> {}
    interface ToStringRoundingOptionsWithFractionalSeconds<Units extends DateUnit | TimeUnit> extends ToStringRoundingOptions<Units> {
        fractionalSecondDigits?: "auto" | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | undefined;
    }
    namespace Now {
        function timeZoneId(): string;
        function instant(): Instant;
        function plainDateTimeISO(timeZone?: TimeZoneLike): PlainDateTime;
        function zonedDateTimeISO(timeZone?: TimeZoneLike): ZonedDateTime;
        function plainDateISO(timeZone?: TimeZoneLike): PlainDate;
        function plainTimeISO(timeZone?: TimeZoneLike): PlainTime;
    }
    interface PlainDateToStringOptions {
        calendarName?: "auto" | "always" | "never" | "critical" | undefined;
    }
    interface PlainDateToZonedDateTimeOptions {
        plainTime?: PlainTimeLike | undefined;
        timeZone: TimeZoneLike;
    }
    interface PlainDate {
        readonly calendarId: string;
        readonly era: string | undefined;
        readonly eraYear: number | undefined;
        readonly year: number;
        readonly month: number;
        readonly monthCode: string;
        readonly day: number;
        readonly dayOfWeek: number;
        readonly dayOfYear: number;
        readonly weekOfYear: number | undefined;
        readonly yearOfWeek: number | undefined;
        readonly daysInWeek: number;
        readonly daysInMonth: number;
        readonly daysInYear: number;
        readonly monthsInYear: number;
        readonly inLeapYear: boolean;
        toPlainYearMonth(): PlainYearMonth;
        toPlainMonthDay(): PlainMonthDay;
        add(duration: DurationLike, options?: OverflowOptions): PlainDate;
        subtract(duration: DurationLike, options?: OverflowOptions): PlainDate;
        with(dateLike: PartialTemporalLike<DateLikeObject>, options?: OverflowOptions): PlainDate;
        withCalendar(calendarLike: CalendarLike): PlainDate;
        until(other: PlainDateLike, options?: RoundingOptionsWithLargestUnit<DateUnit>): Duration;
        since(other: PlainDateLike, options?: RoundingOptionsWithLargestUnit<DateUnit>): Duration;
        equals(other: PlainDateLike): boolean;
        toPlainDateTime(time?: PlainTimeLike): PlainDateTime;
        toZonedDateTime(timeZone: TimeZoneLike): ZonedDateTime;
        toZonedDateTime(item: PlainDateToZonedDateTimeOptions): ZonedDateTime;
        toString(options?: PlainDateToStringOptions): string;
        toLocaleString(locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions): string;
        toJSON(): string;
        valueOf(): never;
        readonly [Symbol.toStringTag]: "Temporal.PlainDate";
    }
    interface PlainDateConstructor {
        new (isoYear: number, isoMonth: number, isoDay: number, calendar?: string): PlainDate;
        readonly prototype: PlainDate;
        from(item: PlainDateLike, options?: OverflowOptions): PlainDate;
        compare(one: PlainDateLike, two: PlainDateLike): number;
    }
    var PlainDate: PlainDateConstructor;
    interface PlainTimeToStringOptions extends ToStringRoundingOptionsWithFractionalSeconds<Exclude<TimeUnit, "hour">> {}
    interface PlainTime {
        readonly hour: number;
        readonly minute: number;
        readonly second: number;
        readonly millisecond: number;
        readonly microsecond: number;
        readonly nanosecond: number;
        add(duration: DurationLike): PlainTime;
        subtract(duration: DurationLike): PlainTime;
        with(timeLike: PartialTemporalLike<TimeLikeObject>, options?: OverflowOptions): PlainTime;
        until(other: PlainTimeLike, options?: RoundingOptionsWithLargestUnit<TimeUnit>): Duration;
        since(other: PlainTimeLike, options?: RoundingOptionsWithLargestUnit<TimeUnit>): Duration;
        equals(other: PlainTimeLike): boolean;
        round(roundTo: PluralizeUnit<TimeUnit>): PlainTime;
        round(roundTo: RoundingOptions<TimeUnit>): PlainTime;
        toString(options?: PlainTimeToStringOptions): string;
        toLocaleString(locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions): string;
        toJSON(): string;
        valueOf(): never;
        readonly [Symbol.toStringTag]: "Temporal.PlainTime";
    }
    interface PlainTimeConstructor {
        new (hour?: number, minute?: number, second?: number, millisecond?: number, microsecond?: number, nanosecond?: number): PlainTime;
        readonly prototype: PlainTime;
        from(item: PlainTimeLike, options?: OverflowOptions): PlainTime;
        compare(one: PlainTimeLike, two: PlainTimeLike): number;
    }
    var PlainTime: PlainTimeConstructor;
    interface PlainDateTimeToStringOptions extends PlainDateToStringOptions, PlainTimeToStringOptions {}
    interface PlainDateTime {
        readonly calendarId: string;
        readonly era: string | undefined;
        readonly eraYear: number | undefined;
        readonly year: number;
        readonly month: number;
        readonly monthCode: string;
        readonly day: number;
        readonly hour: number;
        readonly minute: number;
        readonly second: number;
        readonly millisecond: number;
        readonly microsecond: number;
        readonly nanosecond: number;
        readonly dayOfWeek: number;
        readonly dayOfYear: number;
        readonly weekOfYear: number | undefined;
        readonly yearOfWeek: number | undefined;
        readonly daysInWeek: number;
        readonly daysInMonth: number;
        readonly daysInYear: number;
        readonly monthsInYear: number;
        readonly inLeapYear: boolean;
        with(dateTimeLike: PartialTemporalLike<DateTimeLikeObject>, options?: OverflowOptions): PlainDateTime;
        withPlainTime(plainTime?: PlainTimeLike): PlainDateTime;
        withCalendar(calendar: CalendarLike): PlainDateTime;
        add(duration: DurationLike, options?: OverflowOptions): PlainDateTime;
        subtract(duration: DurationLike, options?: OverflowOptions): PlainDateTime;
        until(other: PlainDateTimeLike, options?: RoundingOptionsWithLargestUnit<DateUnit | TimeUnit>): Duration;
        since(other: PlainDateTimeLike, options?: RoundingOptionsWithLargestUnit<DateUnit | TimeUnit>): Duration;
        round(roundTo: PluralizeUnit<"day" | TimeUnit>): PlainDateTime;
        round(roundTo: RoundingOptions<"day" | TimeUnit>): PlainDateTime;
        equals(other: PlainDateTimeLike): boolean;
        toString(options?: PlainDateTimeToStringOptions): string;
        toLocaleString(locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions): string;
        toJSON(): string;
        valueOf(): never;
        toZonedDateTime(timeZone: TimeZoneLike, options?: DisambiguationOptions): ZonedDateTime;
        toPlainDate(): PlainDate;
        toPlainTime(): PlainTime;
        readonly [Symbol.toStringTag]: "Temporal.PlainDateTime";
    }
    interface PlainDateTimeConstructor {
        new (isoYear: number, isoMonth: number, isoDay: number, hour?: number, minute?: number, second?: number, millisecond?: number, microsecond?: number, nanosecond?: number, calendar?: string): PlainDateTime;
        readonly prototype: PlainDateTime;
        from(item: PlainDateTimeLike, options?: OverflowOptions): PlainDateTime;
        compare(one: PlainDateTimeLike, two: PlainDateTimeLike): number;
    }
    var PlainDateTime: PlainDateTimeConstructor;
    interface ZonedDateTimeToStringOptions extends PlainDateTimeToStringOptions {
        offset?: "auto" | "never" | undefined;
        timeZoneName?: "auto" | "never" | "critical" | undefined;
    }
    interface ZonedDateTimeFromOptions extends OverflowOptions, DisambiguationOptions {
        offset?: "use" | "ignore" | "prefer" | "reject" | undefined;
    }
    interface ZonedDateTime {
        readonly calendarId: string;
        readonly timeZoneId: string;
        readonly era: string | undefined;
        readonly eraYear: number | undefined;
        readonly year: number;
        readonly month: number;
        readonly monthCode: string;
        readonly day: number;
        readonly hour: number;
        readonly minute: number;
        readonly second: number;
        readonly millisecond: number;
        readonly microsecond: number;
        readonly nanosecond: number;
        readonly epochMilliseconds: number;
        readonly epochNanoseconds: bigint;
        readonly dayOfWeek: number;
        readonly dayOfYear: number;
        readonly weekOfYear: number | undefined;
        readonly yearOfWeek: number | undefined;
        readonly hoursInDay: number;
        readonly daysInWeek: number;
        readonly daysInMonth: number;
        readonly daysInYear: number;
        readonly monthsInYear: number;
        readonly inLeapYear: boolean;
        readonly offsetNanoseconds: number;
        readonly offset: string;
        with(zonedDateTimeLike: PartialTemporalLike<ZonedDateTimeLikeObject>, options?: ZonedDateTimeFromOptions): ZonedDateTime;
        withPlainTime(plainTime?: PlainTimeLike): ZonedDateTime;
        withTimeZone(timeZone: TimeZoneLike): ZonedDateTime;
        withCalendar(calendar: CalendarLike): ZonedDateTime;
        add(duration: DurationLike, options?: OverflowOptions): ZonedDateTime;
        subtract(duration: DurationLike, options?: OverflowOptions): ZonedDateTime;
        until(other: ZonedDateTimeLike, options?: RoundingOptionsWithLargestUnit<DateUnit | TimeUnit>): Duration;
        since(other: ZonedDateTimeLike, options?: RoundingOptionsWithLargestUnit<DateUnit | TimeUnit>): Duration;
        round(roundTo: PluralizeUnit<"day" | TimeUnit>): ZonedDateTime;
        round(roundTo: RoundingOptions<"day" | TimeUnit>): ZonedDateTime;
        equals(other: ZonedDateTimeLike): boolean;
        toString(options?: ZonedDateTimeToStringOptions): string;
        toLocaleString(locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions): string;
        toJSON(): string;
        valueOf(): never;
        startOfDay(): ZonedDateTime;
        getTimeZoneTransition(direction: "next" | "previous"): ZonedDateTime | null;
        getTimeZoneTransition(direction: TransitionOptions): ZonedDateTime | null;
        toInstant(): Instant;
        toPlainDate(): PlainDate;
        toPlainTime(): PlainTime;
        toPlainDateTime(): PlainDateTime;
        readonly [Symbol.toStringTag]: "Temporal.ZonedDateTime";
    }
    interface ZonedDateTimeConstructor {
        new (epochNanoseconds: bigint, timeZone: string, calendar?: string): ZonedDateTime;
        readonly prototype: ZonedDateTime;
        from(item: ZonedDateTimeLike, options?: ZonedDateTimeFromOptions): ZonedDateTime;
        compare(one: ZonedDateTimeLike, two: ZonedDateTimeLike): number;
    }
    var ZonedDateTime: ZonedDateTimeConstructor;
    interface DurationRelativeToOptions {
        relativeTo?: ZonedDateTimeLike | PlainDateLike | undefined;
    }
    interface DurationRoundingOptions extends DurationRelativeToOptions, RoundingOptionsWithLargestUnit<DateUnit | TimeUnit> {}
    interface DurationToStringOptions extends ToStringRoundingOptionsWithFractionalSeconds<Exclude<TimeUnit, "hour" | "minute">> {}
    interface DurationTotalOptions extends DurationRelativeToOptions {
        unit: PluralizeUnit<DateUnit | TimeUnit>;
    }
    interface Duration {
        readonly years: number;
        readonly months: number;
        readonly weeks: number;
        readonly days: number;
        readonly hours: number;
        readonly minutes: number;
        readonly seconds: number;
        readonly milliseconds: number;
        readonly microseconds: number;
        readonly nanoseconds: number;
        readonly sign: number;
        readonly blank: boolean;
        with(durationLike: PartialTemporalLike<DurationLikeObject>): Duration;
        negated(): Duration;
        abs(): Duration;
        add(other: DurationLike): Duration;
        subtract(other: DurationLike): Duration;
        round(roundTo: PluralizeUnit<"day" | TimeUnit>): Duration;
        round(roundTo: DurationRoundingOptions): Duration;
        total(totalOf: PluralizeUnit<"day" | TimeUnit>): number;
        total(totalOf: DurationTotalOptions): number;
        toString(options?: DurationToStringOptions): string;
        toLocaleString(locales?: Intl.LocalesArgument, options?: Intl.DurationFormatOptions): string;
        toJSON(): string;
        valueOf(): never;
        readonly [Symbol.toStringTag]: "Temporal.Duration";
    }
    interface DurationConstructor {
        new (years?: number, months?: number, weeks?: number, days?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number, microseconds?: number, nanoseconds?: number): Duration;
        readonly prototype: Duration;
        from(item: DurationLike): Duration;
        compare(one: DurationLike, two: DurationLike, options?: DurationRelativeToOptions): number;
    }
    var Duration: DurationConstructor;
    interface InstantToStringOptions extends PlainTimeToStringOptions {
        timeZone?: TimeZoneLike | undefined;
    }
    interface Instant {
        readonly epochMilliseconds: number;
        readonly epochNanoseconds: bigint;
        add(duration: DurationLike): Instant;
        subtract(duration: DurationLike): Instant;
        until(other: InstantLike, options?: RoundingOptionsWithLargestUnit<TimeUnit>): Duration;
        since(other: InstantLike, options?: RoundingOptionsWithLargestUnit<TimeUnit>): Duration;
        round(roundTo: PluralizeUnit<TimeUnit>): Instant;
        round(roundTo: RoundingOptions<TimeUnit>): Instant;
        equals(other: InstantLike): boolean;
        toString(options?: InstantToStringOptions): string;
        toLocaleString(locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions): string;
        toJSON(): string;
        valueOf(): never;
        toZonedDateTimeISO(timeZone: TimeZoneLike): ZonedDateTime;
        readonly [Symbol.toStringTag]: "Temporal.Instant";
    }
    interface InstantConstructor {
        new (epochNanoseconds: bigint): Instant;
        readonly prototype: Instant;
        from(item: InstantLike): Instant;
        fromEpochMilliseconds(epochMilliseconds: number): Instant;
        fromEpochNanoseconds(epochNanoseconds: bigint): Instant;
        compare(one: InstantLike, two: InstantLike): number;
    }
    var Instant: InstantConstructor;
    interface PlainYearMonthToPlainDateOptions {
        day: number;
    }
    interface PlainYearMonth {
        readonly calendarId: string;
        readonly era: string | undefined;
        readonly eraYear: number | undefined;
        readonly year: number;
        readonly month: number;
        readonly monthCode: string;
        readonly daysInYear: number;
        readonly daysInMonth: number;
        readonly monthsInYear: number;
        readonly inLeapYear: boolean;
        with(yearMonthLike: PartialTemporalLike<YearMonthLikeObject>, options?: OverflowOptions): PlainYearMonth;
        add(duration: DurationLike, options?: OverflowOptions): PlainYearMonth;
        subtract(duration: DurationLike, options?: OverflowOptions): PlainYearMonth;
        until(other: PlainYearMonthLike, options?: RoundingOptionsWithLargestUnit<"year" | "month">): Duration;
        since(other: PlainYearMonthLike, options?: RoundingOptionsWithLargestUnit<"year" | "month">): Duration;
        equals(other: PlainYearMonthLike): boolean;
        toString(options?: PlainDateToStringOptions): string;
        toLocaleString(locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions): string;
        toJSON(): string;
        valueOf(): never;
        toPlainDate(item: PlainYearMonthToPlainDateOptions): PlainDate;
        readonly [Symbol.toStringTag]: "Temporal.PlainYearMonth";
    }
    interface PlainYearMonthConstructor {
        new (isoYear: number, isoMonth: number, calendar?: string, referenceISODay?: number): PlainYearMonth;
        readonly prototype: PlainYearMonth;
        from(item: PlainYearMonthLike, options?: OverflowOptions): PlainYearMonth;
        compare(one: PlainYearMonthLike, two: PlainYearMonthLike): number;
    }
    var PlainYearMonth: PlainYearMonthConstructor;
    interface PlainMonthDayToPlainDateOptions {
        era?: string | undefined;
        eraYear?: number | undefined;
        year?: number | undefined;
    }
    interface PlainMonthDay {
        readonly calendarId: string;
        readonly monthCode: string;
        readonly day: number;
        with(monthDayLike: PartialTemporalLike<DateLikeObject>, options?: OverflowOptions): PlainMonthDay;
        equals(other: PlainMonthDayLike): boolean;
        toString(options?: PlainDateToStringOptions): string;
        toLocaleString(locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions): string;
        toJSON(): string;
        valueOf(): never;
        toPlainDate(item: PlainMonthDayToPlainDateOptions): PlainDate;
        readonly [Symbol.toStringTag]: "Temporal.PlainMonthDay";
    }
    interface PlainMonthDayConstructor {
        new (isoMonth: number, isoDay: number, calendar?: string, referenceISOYear?: number): PlainMonthDay;
        readonly prototype: PlainMonthDay;
        from(item: PlainMonthDayLike, options?: OverflowOptions): PlainMonthDay;
    }
    var PlainMonthDay: PlainMonthDayConstructor;
}
interface Uint8Array<TArrayBuffer extends ArrayBufferLike> {
    toBase64(
        options?: {
            alphabet?: "base64" | "base64url" | undefined;
            omitPadding?: boolean | undefined;
        },
    ): string;
    setFromBase64(
        string: string,
        options?: {
            alphabet?: "base64" | "base64url" | undefined;
            lastChunkHandling?: "loose" | "strict" | "stop-before-partial" | undefined;
        },
    ): {
        read: number;
        written: number;
    };
    toHex(): string;
    setFromHex(string: string): {
        read: number;
        written: number;
    };
}
interface Uint8ArrayConstructor {
    fromBase64(
        string: string,
        options?: {
            alphabet?: "base64" | "base64url" | undefined;
            lastChunkHandling?: "loose" | "strict" | "stop-before-partial" | undefined;
        },
    ): Uint8Array<ArrayBuffer>;
    fromHex(
        string: string,
    ): Uint8Array<ArrayBuffer>;
}
type ClassMemberDecoratorContext =
    | ClassMethodDecoratorContext
    | ClassGetterDecoratorContext
    | ClassSetterDecoratorContext
    | ClassFieldDecoratorContext
    | ClassAccessorDecoratorContext;
type DecoratorContext =
    | ClassDecoratorContext
    | ClassMemberDecoratorContext;
type DecoratorMetadataObject = Record<PropertyKey, unknown> & object;
type DecoratorMetadata = typeof globalThis extends { Symbol: { readonly metadata: symbol; }; } ? DecoratorMetadataObject : DecoratorMetadataObject | undefined;
interface ClassDecoratorContext<
    Class extends abstract new (...args: any) => any = abstract new (...args: any) => any,
> {
    readonly kind: "class";
    readonly name: string | undefined;
    addInitializer(initializer: (this: Class) => void): void;
    readonly metadata: DecoratorMetadata;
}
interface ClassMethodDecoratorContext<
    This = unknown,
    Value extends (this: This, ...args: any) => any = (this: This, ...args: any) => any,
> {
    readonly kind: "method";
    readonly name: string | symbol;
    readonly static: boolean;
    readonly private: boolean;
    readonly access: {
        has(object: This): boolean;
        get(object: This): Value;
    };
    addInitializer(initializer: (this: This) => void): void;
    readonly metadata: DecoratorMetadata;
}
interface ClassGetterDecoratorContext<
    This = unknown,
    Value = unknown,
> {
    readonly kind: "getter";
    readonly name: string | symbol;
    readonly static: boolean;
    readonly private: boolean;
    readonly access: {
        has(object: This): boolean;
        get(object: This): Value;
    };
    addInitializer(initializer: (this: This) => void): void;
    readonly metadata: DecoratorMetadata;
}
interface ClassSetterDecoratorContext<
    This = unknown,
    Value = unknown,
> {
    readonly kind: "setter";
    readonly name: string | symbol;
    readonly static: boolean;
    readonly private: boolean;
    readonly access: {
        has(object: This): boolean;
        set(object: This, value: Value): void;
    };
    addInitializer(initializer: (this: This) => void): void;
    readonly metadata: DecoratorMetadata;
}
interface ClassAccessorDecoratorContext<
    This = unknown,
    Value = unknown,
> {
    readonly kind: "accessor";
    readonly name: string | symbol;
    readonly static: boolean;
    readonly private: boolean;
    readonly access: {
        has(object: This): boolean;
        get(object: This): Value;
        set(object: This, value: Value): void;
    };
    addInitializer(initializer: (this: This) => void): void;
    readonly metadata: DecoratorMetadata;
}
interface ClassAccessorDecoratorTarget<This, Value> {
    get(this: This): Value;
    set(this: This, value: Value): void;
}
interface ClassAccessorDecoratorResult<This, Value> {
    get?(this: This): Value;
    set?(this: This, value: Value): void;
    init?(this: This, value: Value): Value;
}
interface ClassFieldDecoratorContext<
    This = unknown,
    Value = unknown,
> {
    readonly kind: "field";
    readonly name: string | symbol;
    readonly static: boolean;
    readonly private: boolean;
    readonly access: {
        has(object: This): boolean;
        get(object: This): Value;
        set(object: This, value: Value): void;
    };
    addInitializer(initializer: (this: This) => void): void;
    readonly metadata: DecoratorMetadata;
}
type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;
type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
type ParameterDecorator = (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) => void;
}