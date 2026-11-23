
import {execSync} from 'node:child_process';

import {Decimal} from 'decimal.js';

import {unexpectedError, getInternalPath, DEEP_COPY_SYMBOL, deepCopy, Position, EOF, MemberOperator, ExpressionPrefixOperator, ExpressionPostfixOperator, ExpressionBinaryOperator, CQQSymbol, Keyword} from './base.js';


export class BitTypeStorageData {

    bits: number;
    size: number;
    align: number;
    preferredAlign: number;

    byteSize: number;
    byteAlign: number;
    bytePreferredAlign: number;

    allocBytes: number;

    constructor(bits: number, align: number, preferredAlign?: number, size?: number) {
        preferredAlign ??= align;
        size ??= Math.ceil(bits / 8) * 8;
        this.bits = bits;
        this.size = size;
        this.align = align;
        this.preferredAlign = preferredAlign;
        this.byteSize = Math.ceil(size / 8);
        this.byteAlign = Math.ceil(align / 8);
        this.bytePreferredAlign = Math.ceil(preferredAlign / 8);
        this.allocBytes = Math.ceil(this.byteSize / this.byteAlign) * this.byteAlign;
    }

}


export class AddressSpace extends BitTypeStorageData {

    number: number;

    unstable: boolean = false;
    hasExternalData: boolean = false;

    indexBits: number;

    constructor(number: number, data: BitTypeStorageData, indexBits?: number) {
        super(data.bits, data.align, data.preferredAlign, data.size);
        this.number = number;
        this.indexBits = indexBits ?? data.bits;
    }

};


const MANGLING_TYPES = {
    'e': 'elf',
    'l': 'goff',
    'm': 'mips',
    'o': 'mach-o',
    'x': 'x86-coff',
    'w': 'coff',
    'a': 'xcoff',
} as const;

export class DataLayout {

    endianness: 'little' | 'big' = 'little';

    stackAlignment: number = 1;

    addressSpaces: {[key: number]: AddressSpace} = {};
    codeAddressSpaceNumber: number = 0;
    globalAddressSpaceNumber: number = 0;
    allocaAddressSpaceNumber: number = 0;
    get codeSpace(): AddressSpace {
        return this.addressSpaces[this.codeAddressSpaceNumber];
    }
    get globalSpace(): AddressSpace {
        return this.addressSpaces[this.globalAddressSpaceNumber];
    }
    get allocaSpace(): AddressSpace {
        return this.addressSpaces[this.allocaAddressSpaceNumber];
    }

    // DO NOT MODIFY, USE addIntegerType INSTEAD
    _integerTypes: BitTypeStorageData[] = [
        new BitTypeStorageData(8, 8, 8),
        new BitTypeStorageData(16, 16, 16),
        new BitTypeStorageData(32, 32, 32),
        new BitTypeStorageData(64, 32, 64),
    ];
    // DO NOT MOFIFY, USE addIntegerType INSTEAD
    _biggestIntegerType: BitTypeStorageData = new BitTypeStorageData(64, 32, 64);

    addIntegerType(type: BitTypeStorageData): void {
        this._integerTypes.push(type);
        this._integerTypes.sort((x, y) => x.bits - y.bits);
        if (type.bits > this._biggestIntegerType.bits) {
            this._biggestIntegerType = type;
        }
    }

    // DO NOT USE
    _cachedIntegerTypes: Map<number, BitTypeStorageData> = new Map();

    getIntegerType(bits: number): BitTypeStorageData {
        let value = this._cachedIntegerTypes.get(bits);
        if (value !== undefined) {
            return value;
        }
        if (bits >= this._biggestIntegerType.bits) {
            let type = this._biggestIntegerType;
            let out = new BitTypeStorageData(bits, type.align, type.preferredAlign, type.size);
            this._cachedIntegerTypes.set(bits, out);
            return out;
        }
        for (let type of this._integerTypes) {
            if (type.bits > bits) {
                let out = new BitTypeStorageData(bits, type.align, type.preferredAlign, type.size);
                this._cachedIntegerTypes.set(bits, out);
                return out;
            }
        }
        unexpectedError(`getIntegerType end reached`);
    }

    vectorTypes: {[key: number]: BitTypeStorageData} = {};
    vectorsAreElementAligned: boolean = false;

    getVectorType(len: number, items: BitTypeStorageData): BitTypeStorageData {
        if (len in this.vectorTypes) {
            return this.vectorTypes[len];
        }
        let align: number;
        if (this.vectorsAreElementAligned) {
            align = items.align;
        } else {
            align = 2**Math.ceil(Math.log2(len));
        }
        let preferredAlign = align;
        let bits = len * items.size;
        return new BitTypeStorageData(bits, align, preferredAlign);
    }

    floatingTypes: {[key: number]: BitTypeStorageData} = {
        16: new BitTypeStorageData(2, 2, 2),
        32: new BitTypeStorageData(4, 4, 4),
        64: new BitTypeStorageData(8, 8, 8),
        80: new BitTypeStorageData(10, 16, 16),
        128: new BitTypeStorageData(16, 16, 16),
    };

    aggregrateDataAlign: number = 1;
    aggregrateDataPreferredAlign: number = 1;

    functionPointerAlign: number = 1;
    functionPointerAlignIsIndependentOfFunctionAlign: boolean = false;

    mangling: 'elf' | 'goff' | 'mips' | 'mach-o' | 'x86-coff' | 'coff' | 'xcoff' = 'elf';

    nativeIntegerWidths: number[] = [];

    constructor(str: string) {
        let match: RegExpMatchArray | null;
        for (let part of str.split('-')) {
            if (part === 'e') {
                this.endianness = 'little';
            } else if (part === 'E') {
                this.endianness = 'big';
            } else if (match = part.match(/^S(\d+)$/)) {
                this.stackAlignment = Number(match[1]);
                part = part.slice(match.length);
            } else if (match = part.match(/^P(\d+)$/)) {
                this.codeAddressSpaceNumber = Number(match[1]);
            } else if (match = part.match(/^G(\d+)$/)) {
                this.globalAddressSpaceNumber = Number(match[1]);
            } else if (match = part.match(/^A(\d+)$/)) {
                this.allocaAddressSpaceNumber = Number(match[1]);
            } else if (part.startsWith('p')) {
                part = part.slice(1);
                let unstable = false;
                let hasExternalData = false;
                while (part.startsWith('u') || part.startsWith('e')) {
                    if (part.startsWith('u')) {
                        unstable = true;
                    } else {
                        hasExternalData = true;
                    }
                    part = part.slice(1);
                }
                // address space number
                let spaceNumber = 0;
                if (match = part.match(/^(\d+)/)) {
                    spaceNumber = Number(match[1]);
                    part = part.slice(match[0].length);
                }
                // optional name
                if (part.startsWith('(')) {
                    part = part.slice(1);
                    while (!part.startsWith(')')) {
                        part = part.slice(1);
                    }
                    part = part.slice(1);
                }
                // colon
                if (!(match = part.match(/^:(\d+):(\d+)/))) {
                    unexpectedError('Invalid datalayout string (invalid pointer)');
                }
                part = part.slice(match[0].length);
                let bits = Number(part[1]);
                let align = Number(part[2]);
                let preferredAlign = align;
                let indexBits = bits;
                if (match = part.match(/^:(\d+)/)) {
                    preferredAlign = Number(match[1]);
                    part = part.slice(match[0].length);
                    if (match = part.match(/^:(\d+)/)) {
                        indexBits = Number(match[1]);
                        part = part.slice(match[0].length);
                    }
                }
                if (part.length !== 0) {
                    unexpectedError('Invalid datalayout string (invalid pointer)');
                }
                let data = new BitTypeStorageData(bits, align, preferredAlign);
                let space = new AddressSpace(spaceNumber, data, indexBits);
                space.unstable = unstable;
                space.hasExternalData = hasExternalData;
                this.addressSpaces[spaceNumber] = space;
            } else if (match = part.match(/^i(\d+):(\d+)(?::(\d+))?$/)) {
                let bits = Number(match[1]);
                let align = Number(match[2]);
                let preferredAlign = align;
                if (match[3] !== undefined) {
                    preferredAlign = Number(match[3]);
                }
                let value = new BitTypeStorageData(bits, align, preferredAlign);
                this.addIntegerType(value);
            } else if (match = part.match(/^v(\d+):(\d+)(?::(\d+))?$/)) {
                let bits = Number(match[1]);
                let align = Number(match[2]);
                let preferredAlign = align;
                if (match[3] !== undefined) {
                    preferredAlign = Number(match[3]);
                }
                let value = new BitTypeStorageData(bits, align, preferredAlign);
                this.addIntegerType(value);
            } else if (part === 've') {
                this.vectorsAreElementAligned = true;
            } else if (match = part.match(/^f(\d+):(\d+)(?::(\d+))?$/)) {
                let bits = Number(match[1]);
                let align = Number(match[2]);
                let preferredAlign = align;
                if (match[3] !== undefined) {
                    preferredAlign = Number(match[3]);
                }
                let value = new BitTypeStorageData(bits, align, preferredAlign);
                this.addIntegerType(value);
            } else if (match = part.match(/^a:(\d+)(?::(\d+))?$/)) {
                let align = Number(match[1]);
                let preferredAlign = align;
                if (match[2] !== undefined) {
                    preferredAlign = Number(match[2]);
                }
                this.aggregrateDataAlign = align;
                this.aggregrateDataPreferredAlign = preferredAlign;
            } else if (match = part.match(/^F([in])(\d+)$/)) {
                let type = match[1];
                let align = Number(match[2]);
                this.functionPointerAlign = align;
                this.functionPointerAlignIsIndependentOfFunctionAlign = type === 'i';
            } else if (match = part.match(/^m:([elmoxwa])$/)) {
                this.mangling = MANGLING_TYPES[match[1] as keyof typeof MANGLING_TYPES];
            } else if (part.startsWith('n')) {
                this.nativeIntegerWidths = part.slice(1).split(':').map(Number);
            } else {
                unexpectedError(`Invalid datalayout string`);
            }
        }
    }

};


let execSyncOptions: Parameters<typeof execSync>[1] = {stdio: ['ignore', 'ignore', 'inherit']};

let cTypeBits: {[key: string]: number} = {}; 
let llvmIR: string;
try {
    llvmIR = execSync(`clang -S -emit-llvm -o - '${getInternalPath('src/data_getter.c')}'`, execSyncOptions).toString();
    execSync(`clang -o -ffreestanding '${getInternalPath('.a.out')}' '${getInternalPath('src/data_getter.c')}'`, execSyncOptions);
    let stdout = execSync(getInternalPath('.a.out')).toString();
    for (let line of stdout.split('\n')) {
        let match = line.match(/^(unsigned|signed) ([a-zA-Z0-9_]+) = (\d+)$/);
        if (match === null) {
            unexpectedError(`Invalid line in C data getter output`);
        }
        let key = match[2];
        let value = Math.log2(Number(match[3]) + 1);
        if (match[1] === 'signed') {
            value += 1;
        }
        cTypeBits[key] = value;
    }
} catch (error) {
    unexpectedError(`Failed to get C data`);
}

let dataLayoutStrLine = llvmIR.split('\n').find(line => line.startsWith('target datalayout'));
if (dataLayoutStrLine === undefined) {
    unexpectedError(`No datalayout string found in LLVM IR`);
}
let dataLayoutStr = dataLayoutStrLine.slice(dataLayoutStrLine.indexOf('=') + 1).trim();
export let dataLayout = new DataLayout(dataLayoutStr);

// maybe make this better later???
// adapting it for specific usages???
export let space0 = dataLayout.addressSpaces[0];

export let littleEndian = dataLayout.endianness === 'little';
export let bigEndian = dataLayout.endianness === 'big';


export let byteArrays = new Set<WeakRef<ArrayBuffer>>();

let encoder = new TextEncoder();
let decoder = new TextDecoder();

export class ByteArray {

    view: DataView<ArrayBuffer>;

    constructor(length: number);
    constructor(buffer: ArrayBuffer, offset?: number, length?: number);
    constructor(view: ArrayBufferView<ArrayBuffer>, offset?: number, length?: number);
    constructor(value: number | ArrayBuffer | ArrayBufferView<ArrayBuffer>, offset?: number, length?: number) {
        if (typeof value === 'number') {
            value = new ArrayBuffer(value);
        } else if (!(value instanceof ArrayBuffer)) {
            value = value.buffer as ArrayBuffer;
        }
        this.view = new DataView(value, offset, length);
        byteArrays.add(new WeakRef(this.view.buffer));
    }

    get buffer(): ArrayBuffer {
        return this.view.buffer;
    }

    get byteOffset(): number {
        return this.view.byteOffset;
    }

    get byteLength(): number {
        return this.view.byteLength;
    }

    get offset(): number {
        return this.view.byteOffset;
    }

    get length(): number {
        return this.view.byteLength;
    }

    [DEEP_COPY_SYMBOL](): ByteArray {
        return new ByteArray(this.buffer.slice());
    }

    [Symbol.iterator](): ArrayIterator<number> {
        return (new Uint8Array(this.buffer))[Symbol.iterator]();
    }

    getByte(i: number): number {
        return this.view.getUint8(i);
    }

    setByte(i: number, value: number): void {
        this.view.setUint8(i, value);
    }

    getUint(i: number, bits: number): bigint {
        let out = 0n;
        let size = dataLayout.getIntegerType(bits).size;
        for (let j = 0; j < size; j++) {
            if (j * 8 > bits) {
                break;
            }
            let index = littleEndian ? j : (size - 1 - j);
            out <<= 8n;
            out += BigInt(this.view.getUint8(i + index));
        }
        return out;
    }

    setUint(i: number, bits: number, value: bigint): void {
        let size = dataLayout.getIntegerType(bits).size;
        for (let j = 0; j < size; j++) {
            if (value === 0n) {
                break;
            }
            let index = littleEndian ? j : (size - 1 - j);
            let byte = value % 256n;
            value >>= 8n;
            this.view.setUint8(i + index, Number(byte));
        }
    }

    static fromUint(bits: number, value: bigint): ByteArray {
        let out = new ByteArray(dataLayout.getIntegerType(bits).size);
        out.setUint(bits, 0, value);
        return out;
    }

    getInt(i: number, bits: number): bigint {
        let out = this.getUint(i, bits);
        if (out > (1n << (BigInt(bits) - 1n))) {
            out += 1n << BigInt(bits);
        }
        return out;
    }

    setInt(i: number, bits: number, value: bigint): void {
        if (value < 0) {
            value += 1n << BigInt(bits);
        }
        this.setUint(i, bits, value);
    }

    static fromInt(bits: number, value: bigint): ByteArray {
        let out = new ByteArray(dataLayout.getIntegerType(bits).size);
        out.setInt(bits, 0, value);
        return out;
    }

    getFloat16(i: number): number {
        return this.view.getFloat16(i, littleEndian);
    }

    setFloat16(i: number, value: number): void {
        this.view.setFloat16(i, value, littleEndian);
    }
    
    static fromFloat16(value: number): ByteArray {
        let out = new ByteArray(2);
        out.setFloat16(0, value);
        return out;
    }

    getFloat32(i: number): number {
        return this.view.getFloat32(i, littleEndian);
    }

    setFloat32(i: number, value: number): void {
        this.view.setFloat32(i, value, littleEndian);
    }

    static fromFloat32(value: number): ByteArray {
        let out = new ByteArray(4);
        out.setFloat32(0, value);
        return out;
    }

    getFloat64(i: number): number {
        return this.view.getFloat64(i, littleEndian);
    }

    setFloat64(i: number, value: number): void {
        this.view.setFloat64(i, value, littleEndian);
    }

    static fromFloat64(value: number): ByteArray {
        let out = new ByteArray(8);
        out.setFloat64(0, value);
        return out;
    }

    slice(start: number = 0, end: number = -1): ByteArray {
        if (start < 0) {
            start += this.length;
        }
        if (end < 0) {
            end += this.length;
        }
        return new ByteArray(this, start, end - start);
    }

    setSlice(i: number, value: ArrayBuffer | ArrayBufferView<ArrayBuffer>): void {
        let view: DataView;
        if (value instanceof ArrayBuffer) {
            view = new DataView(value);
        } else {
            view = new DataView(value.buffer);
        }
        for (let j = 0; j < view.byteLength; j++) {
            this.view.setUint8(i + j, view.getUint8(j));
        }
    }

    getString(i: number, bytes: number): string {
        return decoder.decode(new Uint8Array(this.buffer, i, bytes));
    }

    setString(i: number, value: string): void {
        this.setSlice(i, encoder.encode(value));
    }

    static fromString(value: string): ByteArray {
        return new ByteArray(encoder.encode(value));
    }

    // `Decimal` values strictly deal with
    // UTF-8 encoded strings that take up the whole buffer
    // so there is no setDecimal method
    // or index for the getDecimal method

    getDecimal(): Decimal {
        return Decimal(this.getString(0, this.length));
    }
    
    static fromDecimal(value: Decimal): ByteArray {
        return ByteArray.fromString(value.toString());
    }

    join(sep: string): string {
        return (new Uint8Array(this.view.buffer)).join(sep);
    }

}


export class Region {

    regions: Set<Region>;

    constructor(parent?: Region) {
        this.regions = new Set();
        if (parent) {
            parent.add(this);
        }
    }

    [Symbol.iterator](): ArrayIterator<Region> {
        return this.regions[Symbol.iterator]();
    }

    add(other: Region): void {
        this.regions.add(other);
    }

    contains(other: Region): boolean {
        if (this === other) {
            return true;
        }
        for (let value of this.regions) {
            if (value === other || value.contains(other)) {
                return true;
            }
        }
        return false;
    }

}


export namespace t {

    export interface Name {
        file: string;
        name: string;
    }

    export interface BaseType<Type extends string> {
        type: Type;
        _key: string;
        name?: Name;
    }

    export interface BaseObject<Type extends string> extends BaseType<Type> {
        size: number;
        align: number;
        preferredAlign: number;
        mut: boolean;
        volatile: boolean;
        value?: ByteArray;
    }

    export let typeProperties = new Map<string, Value>();

    export function getKey(type: Type): string {
        if (!isObject(type)) {
            return type._key;
        }
        let key = type._key;
        if (type.name !== undefined) {
            // this works because both the module and the name cannot have spaces
            key = `#[named ${type.name.file} ${type.name.name}] ${key};`;
        }
        if (type.volatile) {
            key = `volatile ${key}`;
        }
        if (type.mut) {
            key = `mut ${key}`;
        }
        if (type.value !== undefined) {
            key = `${key} #[value ${type.value.join(', ')}]`;
        }
        return key;
    }

    // primitive types

    export interface Never extends BaseType<'never'> {
        // empty
    }

    export const never: Never = {
        type: 'never',
        _key: 'never',
    };

    export interface Void extends BaseObject<'void'> {
        // empty
    }

    export const void_: Void = {
        type: 'void',
        _key: 'void',
        size: 0,
        align: 1,
        preferredAlign: 1,
        mut: false,
        volatile: false,
    };

    export interface Bool extends BaseObject<'bool'> {
        // empty
    }

    let i1 = dataLayout.getIntegerType(1);
    export const bool: Bool = {
        type: 'bool',
        _key: 'bool',
        size: i1.byteSize,
        align: i1.byteAlign,
        preferredAlign: i1.bytePreferredAlign,
        mut: false,
        volatile: false,
    };

    export interface BaseInteger<Type extends string, Signed extends boolean> extends BaseObject<Type> {
        signed: Signed;
        bits: number;
    }

    export type Int = BaseInteger<'int', true>;
    export function int(bits: number): Int {
        let data = dataLayout.getIntegerType(bits);
        return {
            type: 'int',
            _key: `int<${bits}>`,
            size: data.byteSize,
            align: data.byteAlign,
            preferredAlign: data.bytePreferredAlign,
            signed: true,
            bits: data.bits,
            mut: false,
            volatile: false,
        };
    }

    export type Uint = BaseInteger<'uint', false>;
    export function uint(bits: number): Uint {
        let data = dataLayout.getIntegerType(bits);
        return {
            type: 'uint',
            _key: `uint<${bits}>`,
            size: data.byteSize,
            align: data.byteAlign,
            preferredAlign: data.bytePreferredAlign,
            signed: false,
            bits: data.bits,
            mut: false,
            volatile: false,
        };
    }

    export const char = t.int(8);
    export const int_ = t.int(cTypeBits['int']);
    export const uint_ = t.uint(cTypeBits['int']);
    export const size = t.uint(cTypeBits['size_t']);
    export const ssize = t.int(cTypeBits['ptrdiff_t']);

    export type Integer = Int | Uint;
    export type SignedInteger = Extract<Integer, {signed: true}>;
    export type UnsignedInteger = Extract<Integer, {signed: false}>;

    export type FloatingTypeName = 'float16' | 'bfloat16' | 'float32' | 'float64' | 'float80' | 'float128';

    export interface BaseFloating<Type extends FloatingTypeName> extends BaseObject<Type> {
        bits: number;
    }

    export type Float16 = BaseFloating<'float16'>;
    export type Bfloat16 = BaseFloating<'bfloat16'>;
    export type Float32 = BaseFloating<'float32'>;
    export type Float64 = BaseFloating<'float64'>;
    export type Float80 = BaseFloating<'float80'>;
    export type Float128 = BaseFloating<'float128'>;

    export type Floating = Float16 | Bfloat16 | Float32 | Float64 | Float80 | Float128;

    const FLOAT_TYPE_DATA: {[K in FloatingTypeName]: BitTypeStorageData} = {
        'float16': dataLayout.floatingTypes[16],
        'bfloat16': dataLayout.floatingTypes[16],
        'float32': dataLayout.floatingTypes[32],
        'float64': dataLayout.floatingTypes[64],
        'float80': dataLayout.floatingTypes[80],
        'float128': dataLayout.floatingTypes[128],
    };

    export function float<T extends FloatingTypeName>(type: T): BaseFloating<T> {
        let data = FLOAT_TYPE_DATA[type];
        return {
            type,
            _key: type,
            size: data.byteSize,
            align: data.byteAlign,
            preferredAlign: data.bytePreferredAlign,
            mut: false,
            volatile: false,
            bits: data.bits,
        };
    }

    export interface NumberLiteral extends BaseType<'number-literal'> {
        // empty
    }

    export const numberLiteral: NumberLiteral = {
        type: 'number-literal',
        _key: '#[number_literal]',
    }

    export interface Auto extends BaseType<'auto'> {
        // empty
    }

    export const auto: Auto = {
        type: 'auto',
        _key: 'auto',
    };

    export type Number = Integer | Floating;

    export type PrimitiveObject = Void | Bool | Number;
    export type Primitive = PrimitiveObject | Never | NumberLiteral | Auto;

    // derived object types

    export function setName<T extends Object>(type: T, file: string, name: string): T {
        let out = deepCopy(type);
        out.name = {file, name};
        return out as T;
    }

    export function setMut<T extends Object>(type: T, mut: boolean): T {
        let out = deepCopy(type);
        out.mut = mut;
        return out;
    }

    export function setVolatile<T extends Object>(type: T, mut: boolean): T {
        let out = deepCopy(type);
        out.mut = mut;
        return out;
    }

    export function mut<T extends Object>(type: T): T {
        return setMut(type, true);
    }

    export function const_<T extends Object>(type: T): T {
        return setMut(type, false);
    }

    export function volatile<T extends Object>(type: T): T {
        return setVolatile(type, true);
    }

    export function nonvolatile<T extends Object>(type: T): T {
        return setVolatile(type, false);
    }

    // non-primitive types

    export interface Pointer extends BaseObject<'pointer'> {
        to: Type;
    }

    export function pointer(type: Type): Pointer {
        return {
            type: 'pointer',
            _key: `(${getKey(type)})*`,
            size: space0.size,
            align: space0.align,
            preferredAlign: space0.preferredAlign,
            mut: false,
            volatile: false,
            to: type,
        };
    }

    export interface Reference extends BaseType<'reference'> {
        to: Object;
    }

    export function reference(type: Object): Reference {
        return {
            type: 'reference',
            _key: `(${getKey(type)})&`,
            to: type,
        };;
    }

    export interface Array extends BaseObject<'array'> {
        items: Object;
        len: number;
    }

    export function array(items: Object, len: number): Array {
        let itemSize = Math.ceil(items.size / items.align) * items.align;
        return {
            type: 'array',
            _key: `(${getKey(items)})[${len}]`,
            size: itemSize * len,
            align: items.align,
            preferredAlign: items.preferredAlign,
            mut: false,
            volatile: false,
            items,
            len,
        };
    }

    export interface Parameter {
        type: Object;
        name?: string;
    }

    export interface Function extends BaseType<'function'> {
        returnType: Object;
        params: Parameter[];
    }

    export function function_(returnType: Object, params: Parameter[]): Function {
        let key = `(${getKey(returnType)})(${params.map(param => {
            let out = `(${getKey(param.type)})`;
            if (param.name) {
                out += ` ${param.name}`;
            }
            return out;
        })}).join(', ')})`;
        return {
            type: 'function',
            _key: key,
            returnType,
            params,
        };;
    }

    export interface StructMember {
        type: Object;
        name?: string;
        value?: ByteArray;
        offset: number;
    };

    export interface Struct extends BaseObject<'struct'> {
        inheritsFrom: StructMember[];
        members: StructMember[];
    }

    export type ParamStructMember = Omit<StructMember, 'offset'>;

    export interface StructLayout {
        members: StructMember[];
        size: number;
        align: number;
        preferredAlign: number;
    }

    function getPermutations<T>(array: T[]): T[][] {
        if (array.length <= 1) {
            return [array];
        }
        let out: T[][] = [];
        for (let i = 0; i < array.length; i++) {
            let current = array[i];
            let remaining = array.slice(0, i).concat(array.slice(i + 1));
            for (let perm of getPermutations(remaining)) {
                out.push([current, ...perm]);
            }
        }
        return out;
    }

    function getStructLayoutNoReorder(members: ParamStructMember[]): StructLayout {
        let out: StructMember[] = [];
        let size = 0;
        let align = 1;
        let preferredAlign = 1;
        for (let member of members) {
            align = Math.max(align, member.type.align);
            preferredAlign = Math.max(preferredAlign, member.type.preferredAlign);
            if (size % member.type.align !== 0) {
                size += (size - member.type.align);
            }
            out.push({
                type: member.type,
                name: member.name,
                value: member.value,
                offset: size,
            });
        }
        return {
            members: out,
            size,
            align,
            preferredAlign,
        };
    }

    export function getStructLayout(members: ParamStructMember[]): StructLayout {
        let out: StructLayout = getStructLayoutNoReorder(members);
        for (let perm of getPermutations(members)) {
            let layout = getStructLayoutNoReorder(perm);
            if (layout.size < out.size) {
                out = layout;
            }
        }
        return out;
    }

    export function struct(inheritsFrom: Object[], members: ParamStructMember[]): Struct {
        members = members.concat(inheritsFrom.map((type, i) => ({type, name: `#[extends ${i}]`})));
        let layout = getStructLayout(members);
        let key = `struct {${layout.members.map(member => {
            let out = `#[offset ${member.offset}] (${getKey(member.type)})`;
            if (member.name !== undefined) {
                out += ` ${member.name}`;
            }
            return out;
        }).join(', ')}}`;
        return {
            type: 'struct',
            _key: key,
            size: layout.size,
            align: layout.align,
            preferredAlign: layout.preferredAlign,
            mut: false,
            volatile: false,
            inheritsFrom: layout.members.filter(member => member.name && member.name.startsWith('#[extends ')),
            members: layout.members.filter(member => !(member.name && member.name.startsWith('#[extends '))),
        };
    }

    export function structHasHoles(type: Struct): boolean {
        let members = type.inheritsFrom.concat(type.members);
        members.sort((x, y) => x.offset - y.offset)
        let expected = 0;
        for (let member of members) {
            if (member.offset !== expected) {
                return true;
            }
            expected += member.type.size;
        }
        return false;
    }

    export function createStruct(...data: (Object | [Object] | [string, Object] | [string, Object, ByteArray])[]): Struct {
        let inheritsFrom: Object[] = [];
        let members: ParamStructMember[] = [];
        for (let member of data) {
            if (!Array.isArray(member)) {
                inheritsFrom.push(member);
            } else {
                let type: Object;
                let name: string | undefined;
                let value: ByteArray | undefined;
                if (member.length === 1) {
                    type = member[0];
                    name = undefined;
                    value = undefined;
                } else if (member.length === 2) {
                    type = member[1];
                    name = member[0];
                    value = undefined;
                } else {
                    type = member[1];
                    name = member[0];
                    value = member[2];
                }
                members.push({type, name, value});
            }
        }
        return struct(inheritsFrom, members);
    }

    export interface UnionMember {
        name: string;
        type: Object;
    }

    export interface Union extends BaseObject<'union'> {
        members: UnionMember[];
    }

    export function union(members: UnionMember[]): Union {
        members = members.sort((x, y) => {
            if (x.name < y.name) {
                return -1;
            } else if (x.name > y.name) {
                return 1;
            } else {
                unexpectedError(`Two union members with the same name`);
            }
        });
        let key = `union {${members.map(member => `(${getKey(member.type)}) ${member.name}`).join(', ')}}`;
        let size = 0;
        let align = 1;
        let preferredAlign = 1;
        for (let member of members) {
            size = Math.max(size, member.type.size);
            align = Math.max(align, member.type.align);
            preferredAlign = Math.max(preferredAlign, member.type.preferredAlign);
        }
        return {
            type: 'union',
            _key: key,
            size,
            align,
            preferredAlign,
            mut: false,
            volatile: false,
            members,
        };
    }

    export interface Slice extends BaseObject<'slice'> {
        items: Object;
        lenOffset: number;
        ptrOffset: number;
    }

    export function slice(items: Object): Slice {
        let layout = getStructLayout([{type: size, name: 'len'}, {type: pointer(items), name: 'ptr'}]);
        let lenOffset = (layout.members.find(x => x.name === 'len') as StructMember).offset;
        let ptrOffset = (layout.members.find(x => x.name === 'ptr') as StructMember).offset;
        return {
            type: 'slice',
            _key: `(${getKey(items)})[]`,
            size: layout.size,
            align: layout.align,
            preferredAlign: layout.preferredAlign,
            mut: false,
            volatile: false,
            lenOffset,
            ptrOffset,
            items,
        };
    }

    export const string = t.slice(t.char);

    export interface Sum extends BaseObject<'sum'> {
        tagType: Uint;
        members: Object[];
        tagOffset: number;
        memberOffset: number;
    }

    export function sum(members: Object[]): Sum {
        let members2: Object[] = [];
        for (let member of members) {
            if (members2.some(x => getKey(x) === getKey(member))) {
                continue;
            }
            members2.push(member);
        }
        members = members2.sort((x, y) => {
            if (getKey(x) < getKey(y)) {
                return -1;
            } else {
                return 1;
            }
        });
        let key = members.map(member => getKey(member)).join(' | ');
        let tagType = uint(Math.ceil(Math.log2(members.length)));
        let unionSize = 0;
        let unionAlign = 1;
        let unionPreferredAlign = 1;
        for (let member of members) {
            unionSize = Math.max(unionSize, member.size);
            unionAlign = Math.max(unionAlign, member.align);
            unionPreferredAlign = Math.max(unionPreferredAlign, member.align);
        }
        let unionType: Union = {
            type: 'union',
            _key: `#[internal_sum_type_union ${key}]`,
            size: unionSize,
            align: unionAlign,
            preferredAlign: unionPreferredAlign,
            mut: false,
            volatile: false,
            members: members.map((member, i) => ({name: '_' + i, type: member})),
        };
        let layout = getStructLayout([{type: tagType}, {type: unionType}]);
        let tagOffset = (layout.members.find(member => member.type === tagType) as StructMember).offset;
        let memberOffset = (layout.members.find(member => member.type === unionType) as StructMember).offset;
        return {
            type: 'sum',
            _key: key,
            size: layout.size,
            align: layout.align,
            preferredAlign: layout.preferredAlign,
            mut: false,
            volatile: false,
            tagType,
            members,
            tagOffset,
            memberOffset,
        };
    }

    export function optional(type: Object): Sum {
        return sum([type, void_]);
    }

    export interface EnumMember {
        name: string;
        value: ByteArray;
    }

    export interface Enum extends BaseObject<'enum'> {
        of: Type;
        members: EnumMember[];
    }

    export type DerivedObject = Pointer | Array | Struct | Union | Slice | Sum | Enum;
    export type Derived = DerivedObject | Reference | Function;

    export type Object = PrimitiveObject | DerivedObject;
    export type NonVoidObject = Exclude<Object, Void>;

    export type Type = Primitive | Derived;

    export function isObject(type: Type): type is Object {
        return !(type.type === 'never' || type.type === 'number-literal' || type.type === 'auto' || type.type === 'reference' || type.type === 'function');
    }

    export function isEqual(x: Type, y: Type): boolean {
        return getKey(x) === getKey(y);
    }

    export namespace meta {

        export const never = t.createStruct();

        export const value = t.slice(t.uint(8));

        export const base_object = t.createStruct(
            ['size', t.size],
            ['align', t.size],
            ['preferred_align', t.size],
            ['mut', t.bool],
            ['volatile', t.bool],
            ['value', t.optional(meta.value)],
        );

        export const void_ = t.createStruct(
            base_object,
        );

        export const bool = t.createStruct(
            base_object,
        );

        export const integer = t.createStruct(
            base_object,
            ['signed', t.bool],
            ['bits', t.size],
        );

        export const float = t.createStruct(
            base_object,
            ['bits', t.size],
        );

        export const number = t.sum([integer, float]);

        export const primitive_object = t.sum([void_, bool, integer, float]);
        export const primitive = t.sum([never, void_, bool, integer, float]);

        export const pointer = t.createStruct(
            base_object,
            ['to', meta.type],
        );

        export const reference = t.createStruct(
            base_object,
            ['to', meta.object],
        );

        export const array = t.createStruct(
            base_object,
            ['items', meta.object],
            ['len', t.size],
        );

        export const parameter = t.createStruct(
            ['type', meta.object],
            ['name', t.optional(t.string)],
        );

        export const function_ = t.createStruct(
            base_object,
            ['return_type', meta.object],
            ['params', t.slice(parameter)],
        );

        export const struct_member = t.createStruct(
            ['type', meta.object],
            ['name', t.optional(t.string)],
            ['value', t.optional(meta.value)],
            ['offset', t.size],
        );

        export const struct = t.createStruct(
            base_object,
            ['inherits_from', t.slice(struct_member)],
            ['members', t.slice(struct_member)],
        );

        export const union_member = t.createStruct(
            ['name', t.string],
            ['type', meta.object],
        );

        export const union = t.createStruct(
            base_object,
            ['members', t.slice(union_member)],
        );

        export const slice = t.createStruct(
            base_object,
            ['items', meta.object],
            ['len_offset', t.size],
            ['ptr_offset', t.size],
        );

        export const sum = t.createStruct(
            base_object,
        );

        export const enum_member = t.createStruct(
            ['name', t.string],
            ['value', meta.value],
        );

        export const enum_ = t.createStruct(
            base_object,
            ['of', meta.type],
            ['members', t.slice(enum_member)],
        );

        export const derived_object = t.sum([pointer, array, struct, union, slice, sum, enum_]);
        export const derived = t.sum([pointer, reference, array, function_, struct, union, slice, sum, enum_]);

        export const object = t.sum([void_, bool, integer, float, pointer, array, struct, union, slice, sum, enum_]);
        export const type = t.sum([never, void_, bool, integer, float, pointer, reference, array, function_, struct, union, slice, sum, enum_]);

        export function get(type: Type): Type {
            if (type.type === 'never') {
                return meta.never;
            } else if (type.type === 'void' || type.type === 'bool') {
                return meta.base_object;
            } else if (type.type === 'int' || type.type === 'uint') {
                return meta.integer;
            } else if (type.type === 'bfloat16' || type.type === 'float16' || type.type === 'float32' || type.type === 'float64' || type.type === 'float80' || type.type === 'float128') {
                return meta.float;
            } else if (type.type === 'pointer') {
                return meta.pointer;
            } else if (type.type === 'reference') {
                return meta.reference;
            } else if (type.type === 'array') {
                return meta.array;
            } else if (type.type === 'function') {
                return meta.function_;
            } else if (type.type === 'struct') {
                return meta.struct;
            } else if (type.type === 'union') {
                return meta.union;
            } else if (type.type === 'sum') {
                return meta.sum;
            } else if (type.type === 'slice') {
                return meta.slice;
            } else if (type.type === 'enum') {
                return meta.enum_;
            } else {
                unexpectedError(`Type ${type.type} is not representable in code and should not be present`);
            }
        }

    }

}

export type Type = t.Type;

export interface Value {
    type: Type;
    value: ByteArray;
}


export interface BaseToken<Type extends string> {
    type: Type;
    pos: Position;
}

export interface SymbolToken<T extends CQQSymbol = CQQSymbol> extends BaseToken<'symbol'> {
    value: T;
}

export interface IdentifierToken extends BaseToken<'identifier'> {
    name: string;
}

export interface KeywordToken<T extends Keyword = Keyword> extends BaseToken<'keyword'> {
    value: T;
}

export interface NumberLiteralToken extends BaseToken<'number-literal'> {
    value: Decimal;
    raw: string;
}

export interface StringLiteralToken extends BaseToken<'string-literal'> {
    value: ByteArray;
    raw: string;
}

export type Token = SymbolToken | IdentifierToken | KeywordToken | NumberLiteralToken | StringLiteralToken;

export const STRING_TOKEN_NAMES: {[K in Token['type']]: string} = {
    'symbol': 'symbol',
    'identifier': 'identifier',
    'keyword': 'keyword',
    'number-literal': 'number-literal',
    'string-literal': 'string literal',
};

export function getTokenRaw(token: Token): string {
    if (token.type === 'identifier') {
        return token.name;
    } else if (token.type === 'number-literal' || token.type === 'string-literal') {
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


export interface VariableData {
    name: string;
    type: Type;
    region: Region;
    const?: boolean;
    value?: ByteArray;
}

export class Scope {

    parent: Scope | undefined;
    variables: Map<string, VariableData>;
    functions: Map<string, VariableData[]>;
    region: Region;

    constructor(parent?: Scope) {
        this.parent = parent;
        this.variables = new Map();
        this.functions = new Map();
        if (parent) {
            this.region = new Region(parent.region);
        } else {
            this.region = new Region();
        }
    }

    get(name: string): VariableData | undefined {
        let value = this.variables.get(name);
        if (value) {
            return value;
        } else if (this.parent) {
            return this.parent.get(name);
        } else {
            return undefined;
        }
    }

    set(name: string, value: VariableData): void {
        this.variables.set(name, value);
    }

    getFunction(name: string): VariableData[] | undefined {
        return this.functions.get(name);
    }

    addFunction(name: string, value: VariableData): void {
        let old = this.functions.get(name);
        if (old !== undefined) {
            old.push(value);
        } else {
            this.functions.set(name, [value]);
        }
    }

}


export namespace a {

    export interface BaseNode<Type extends string> {
        pos: Position;
        type: Type;
    }

    export interface Identifier extends BaseNode<'identifier'> {
        name: string;
    }

    export interface BaseExpression<Type extends string> extends BaseNode<`${Type}-expression`> {
        exprType: t.Type;
    }

    export interface IdentifierExpression extends BaseExpression<'identifier'> {
        name: string;
    }

    export interface NumberLiteralExpression extends BaseExpression<'number-literal'> {
        value: Decimal;
    }

    export interface StringLiteralExpression extends BaseExpression<'string-literal'> {
        value: ByteArray;
    }

    export interface KeywordLiteralExpression extends BaseExpression<'keyword-literal'> {
        value: ByteArray;
    }

    export interface CompoundLiteralElement extends BaseNode<'compound-literal-element'> {
        key: string | number | undefined;
        value: Value;
    }

    export interface CompoundLiteralExpression extends BaseExpression<'compound-literal'> {
        data: CompoundLiteralElement[];
    }

    export interface PrefixExpression extends BaseExpression<'prefix'> {
        op: ExpressionPrefixOperator;
        value: Expression;
    }

    export interface PostfixExpression extends BaseExpression<'postfix'> {
        op: ExpressionPostfixOperator;
        value: Expression;
    }

    export interface BinaryExpression extends BaseExpression<'binary'> {
        op: ExpressionBinaryOperator;
        value: Expression;
    }

    export interface MemberExpression extends BaseExpression<'member'> {
        op: MemberOperator;
        value: Expression;
        member: Identifier;
    }

    export interface IndexExpression extends BaseExpression<'index'> {
        object: Expression;
        indices: Expression[];
    }

    export interface CallExpression extends BaseExpression<'call'> {
        func: Expression;
        args: Expression[];
    }

    export interface ConditionalExpression extends BaseExpression<'conditional'> {
        test: Expression;
        ifTrue: Expression;
        ifFalse: Expression;
    }

    export interface StatementExpression extends BaseExpression<'statement'> {
        data: BlockStatement;
    }

    export type Expression = IdentifierExpression | NumberLiteralExpression | StringLiteralExpression | KeywordLiteralExpression | CompoundLiteralExpression | PrefixExpression | PostfixExpression | BinaryExpression | MemberExpression | IndexExpression | CallExpression | ConditionalExpression | StatementExpression;

    export type ExpressionNode = Expression | CompoundLiteralElement;

    export interface BaseStatement<Type extends string> extends BaseNode<`${Type}-statement`> {
        // empty
    }

    export interface ExpressionStatement extends BaseStatement<'expression'> {
        value: Expression;
    }

    export interface BlockStatement extends BaseStatement<'block'> {
        scope: Scope;
        data: Statement[];
    }

    export type Statement = ExpressionStatement;

    export type StatementNode = Statement;

    export type Node = Expression | Statement;

}
