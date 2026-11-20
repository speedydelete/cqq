
import * as fs from 'node:fs/promises';
import {execSync} from 'node:child_process';

import {unexpectedError, DEEP_COPY_SYMBOL, deepCopy, getInternalPath, HasPos, error} from './base.js';


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

export let littleEndian = dataLayout.endianness === 'little';
export let bigEndian = dataLayout.endianness === 'big';


export class ByteArray {

    view: DataView<ArrayBuffer>;

    constructor(length: number);
    constructor(buffer: ArrayBuffer, offset?: number, length?: number);
    constructor(view: ArrayBufferView, offset?: number, length?: number);
    constructor(value: number | ArrayBuffer | ArrayBufferView, offset?: number, length?: number) {
        if (typeof value === 'number') {
            this.view = new DataView(new ArrayBuffer(value));
            return;
        }
        if (!(value instanceof ArrayBuffer)) {
            value = value.buffer as ArrayBuffer;
        }
        this.view = new DataView(value, offset, length);
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

    getInt8(i: number): number {
        return this.view.getInt8(i);
    }

    setInt8(i: number, value: number): void {
        this.view.setInt8(i, value);
    }

    getInt16(i: number): number {
        return this.view.getInt16(i, littleEndian);
    }

    setInt16(i: number, value: number): void {
        this.view.setInt16(i, value, littleEndian);
    }

    getInt32(i: number): number {
        return this.view.getInt32(i, littleEndian);
    }

    setInt32(i: number, value: number): void {
        this.view.setInt32(i, value, littleEndian);
    }

    getInt64(i: number): bigint {
        return this.view.getBigInt64(i, littleEndian);
    }

    setInt64(i: number, value: bigint): void {
        this.view.setBigInt64(i, value, littleEndian);
    }

    getUint8(i: number): number {
        return this.view.getUint8(i);
    }

    setUint8(i: number, value: number): void {
        this.view.setUint8(i, value);
    }

    getUint16(i: number): number {
        return this.view.getUint16(i, littleEndian);
    }

    setUint16(i: number, value: number): void {
        this.view.setUint16(i, value, littleEndian);
    }

    getUint32(i: number): number {
        return this.view.getUint32(i, littleEndian);
    }

    setUint32(i: number, value: number): void {
        this.view.setUint32(i, value, littleEndian);
    }

    getUint64(i: number): bigint {
        return this.view.getBigUint64(i, littleEndian);
    }

    setUint64(i: number, value: bigint): void {
        this.view.setBigUint64(i, value, littleEndian);
    }

    getUint(bits: number, i: number): bigint {
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

    setUint(bits: number, i: number, value: bigint): void {
        let size = dataLayout.getIntegerType(bits).size;
        for (let j = 0; j < size; j++) {
            if (value === 0n) {
                break;
            }
            let index = littleEndian ? j : (size - 1 - j);
            let byte = value % 256n;
            value >>= 8n;
            this.view.setUint8(index, Number(byte));
        }
    }

    getFloat16(i: number): number {
        return this.view.getFloat16(i, littleEndian);
    }

    setFloat16(i: number, value: number): void {
        this.view.setFloat16(i, value, littleEndian);
    }

    getFloat32(i: number): number {
        return this.view.getFloat32(i, littleEndian);
    }

    setFloat32(i: number, value: number): void {
        this.view.setFloat32(i, value, littleEndian);
    }

    getFloat64(i: number): number {
        return this.view.getFloat64(i, littleEndian);
    }

    setFloat64(i: number, value: number): void {
        this.view.setFloat64(i, value, littleEndian);
    }

    join(sep: string): string {
        return (new Uint8Array(this.view.buffer)).join(sep);
    }

}


// maybe make this better later???
// adapting it for specific usages???
let space0 = dataLayout.addressSpaces[0];


export namespace t {

    export let typeCache = new Map<string, Type>();

    export interface Name {
        module?: string;
        name: string;
    }

    export interface Base {
        type: string;
        _key: string;
        name?: Name;
        properties?: {[key: string]: Object};
        methods?: Method[];
    }

    export type Mobility = 'none' | 'fixed' | 'movable' | 'free';

    export interface BaseObject extends Base {
        size: number;
        align: number;
        preferredAlign: number;
        mut: boolean;
        volatile: boolean;
        mobility: Mobility;
        value?: ByteArray;
    }

    export function getKey(type: Type): string {
        if (type.type === 'never' || type.type === 'reference' || type.type === 'function') {
            return type._key;
        }
        let key = type._key;
        if (type.name !== undefined) {
            // this works because both the module and the name cannot have spaces
            let nameKey = `#[named`;
            if (module !== undefined) {
                nameKey += ` ${type.name.module}`;
            }
            nameKey += ` ${type.name.name}]`;
            key = `${nameKey} ${key};`
        }
        if ('mobility' in type && type.mobility !== 'none' && type.mobility !== 'fixed') {
            key = `${type.mobility} ${key}`;
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

    export const never = {
        type: 'never',
        _key: 'never',
    } as const satisfies Base;
    export type Never = typeof never;

    export const void_ = {
        type: 'void',
        _key: 'void',
        size: 0,
        align: 1,
        preferredAlign: 1,
        mut: false,
        volatile: false,
        mobility: 'none',
    } as const satisfies BaseObject;
    export type Void = BaseObject & typeof void_;
    typeCache.set(getKey(void_), void_);

    let i1 = dataLayout.getIntegerType(1);
    export const bool = {
        type: 'bool',
        _key: 'bool',
        size: i1.byteSize,
        align: i1.byteAlign,
        preferredAlign: i1.bytePreferredAlign,
        mut: false,
        volatile: false,
        mobility: 'none',
    } as const satisfies BaseObject;
    export type Bool = BaseObject & typeof bool;
    typeCache.set(getKey(bool), bool);

    export interface BaseInteger extends BaseObject {
        signed: boolean;
        bits: number;
    }

    let i8 = dataLayout.getIntegerType(8);
    export const char = {
        type: 'char',
        _key: 'char',
        size: i8.byteSize,
        align: i8.byteAlign,
        preferredAlign: i8.bytePreferredAlign,
        signed: false,
        bits: i8.bits,
        mut: false,
        volatile: false,
        mobility: 'none',
    } as const satisfies BaseInteger;
    export type Char = BaseInteger & typeof char;
    typeCache.set(getKey(char), char);

    export interface Int extends BaseInteger {
        type: 'int';
        signed: true;
    }

    export function int(bits: number): Int {
        let key = `int<${bits}>`;
        let value = typeCache.get(key);
        if (value !== undefined) {
            return value as Int;
        }
        let type = dataLayout.getIntegerType(bits);
        let out: Int = {
            type: 'int',
            _key: key,
            size: type.byteSize,
            align: type.byteAlign,
            preferredAlign: type.bytePreferredAlign,
            mut: false,
            volatile: false,
            mobility: 'none',
            signed: true,
            bits,
        };
        typeCache.set(getKey(out), out);
        return out;
    }

    export interface Uint extends BaseInteger {
        type: 'uint';
        signed: false;
    }

    export function uint(bits: number): Uint {
        let key = `uint<${bits}>`;
        let value = typeCache.get(key);
        if (value !== undefined) {
            return value as Uint;
        }
        let type = dataLayout.getIntegerType(bits);
        let out: Uint = {
            type: 'uint',
            _key: key,
            size: type.byteSize,
            align: type.byteAlign,
            preferredAlign: type.bytePreferredAlign,
            mut: false,
            volatile: false,
            mobility: 'none',
            signed: false,
            bits,
        };
        typeCache.set(getKey(out), out);
        return out;
    }

    export type Integer = Char | Int | Uint;
    export type SignedInteger = Extract<Integer, {signed: true}>;
    export type UnsignedInteger = Extract<Integer, {signed: false}>;

    export interface BaseFloating extends BaseObject {
        bits: number;
    }

    let float16Layout = dataLayout.floatingTypes[16];
    let float32Layout = dataLayout.floatingTypes[32];
    let float64Layout = dataLayout.floatingTypes[64];
    let float80Layout = dataLayout.floatingTypes[80];
    let float128Layout = dataLayout.floatingTypes[128];

    export const float16 = {
        type: 'float16',
        _key: 'float16',
        size: float16Layout.byteSize,
        align: float16Layout.byteAlign,
        preferredAlign: float16Layout.bytePreferredAlign,
        mut: false,
        volatile: false,
        mobility: 'none',
        bits: 16,
    } as const satisfies BaseFloating;
    export type Float16 = BaseFloating & typeof float16;
    typeCache.set(getKey(float16), float16);

    export const bfloat16 = {
        type: 'bfloat16',
        _key: 'bfloat16',
        size: float16Layout.byteSize,
        align: float16Layout.byteAlign,
        preferredAlign: float16Layout.bytePreferredAlign,
        mut: false,
        volatile: false,
        mobility: 'none',
        bits: 16,
    } as const satisfies BaseFloating;
    export type Bfloat16 = BaseFloating & typeof bfloat16;
    typeCache.set(getKey(bfloat16), bfloat16);

    export const float32 = {
        type: 'float32',
        _key: 'float32',
        size: float32Layout.byteSize,
        align: float32Layout.byteAlign,
        preferredAlign: float32Layout.bytePreferredAlign,
        mut: false,
        volatile: false,
        mobility: 'none',
        bits: 32,
    } as const satisfies BaseFloating;
    export type Float32 = BaseFloating & typeof float32;
    typeCache.set(getKey(float32), float32);

    export const float64 = {
        type: 'float64',
        _key: 'float64',
        size: float64Layout.byteSize,
        align: float64Layout.byteAlign,
        preferredAlign: float64Layout.bytePreferredAlign,
        mut: false,
        volatile: false,
        mobility: 'none',
        bits: 64,
    } as const satisfies BaseFloating;
    export type Float64 = BaseFloating & typeof float64;
    typeCache.set(getKey(float64), float64);

    export const float80 = {
        type: 'float80',
        _key: 'float80',
        size: float80Layout.byteSize,
        align: float80Layout.byteAlign,
        preferredAlign: float80Layout.bytePreferredAlign,
        mut: false,
        volatile: false,
        mobility: 'none',
        bits: 80,
    } as const satisfies BaseFloating;
    export type Float80 = BaseFloating & typeof float80;
    typeCache.set(getKey(float80), float80);

    export const float128 = {
        type: 'float128',
        _key: 'float128',
        size: float128Layout.byteSize,
        align: float128Layout.byteAlign,
        preferredAlign: float128Layout.bytePreferredAlign,
        mut: false,
        volatile: false,
        mobility: 'none',
        bits: 128,
    } as const satisfies BaseFloating;
    export type Float128 = BaseFloating & typeof float128;
    typeCache.set(getKey(float128), float128);

    export type Floating = Float16 | Bfloat16 | Float32 | Float64 | Float80 | Float128;

    export type Number = Integer | Floating;

    export type PrimitiveObject = Void | Bool | Number;
    export type Primitive = PrimitiveObject | Never;

    // derived object types

    export function setName<T extends Object>(type: T, module: string | undefined, name: string): T {
        let out = deepCopy(type);
        out.name = {module, name};
        return out as T;
    }

    export const int_ = setName(int(cTypeBits['int']), undefined, 'int');
    export const uint_ = setName(uint(cTypeBits['int']), undefined, 'uint');
    export const size = setName(uint(cTypeBits['size_t']), undefined, 'size');
    export const ssize = setName(int(cTypeBits['ptrdiff_t']), undefined, 'ssize');
    export const uintptr = setName(int(cTypeBits['uintptr_t']), undefined, 'uintptr');

    export function setMut<T extends Object>(type: T, mut: boolean): T {
        let out = deepCopy(type);
        out.mut = mut;
        let value = typeCache.get(getKey(out));
        if (value !== undefined) {
            return value as T;
        }
        return out;
    }

    export function setVolatile<T extends Object>(type: T, mut: boolean): T {
        let out = deepCopy(type);
        out.mut = mut;
        let value = typeCache.get(getKey(out));
        if (value !== undefined) {
            return value as T;
        }
        return out;
    }

    export function setMobility<T extends Object>(type: T, mobility: Mobility): T {
        let out = deepCopy(type);
        out.mobility = mobility;
        let value = typeCache.get(getKey(out));
        if (value !== undefined) {
            return value as T;
        }
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

    export function none<T extends Object>(type: T): T {
        return setMobility(type, 'none');
    }

    export function fixed<T extends Object>(type: T): T {
        return setMobility(type, 'fixed');
    }

    export function movable<T extends Object>(type: T): T {
        return setMobility(type, 'movable');
    }

    export function free<T extends Object>(type: T): T {
        return setMobility(type, 'free');
    }

    // non-primitive types

    export interface Pointer extends BaseObject {
        type: 'pointer';
        to: Type;
    }

    export function pointer(type: Type): Pointer {
        let key = `(${getKey(type)})*`;
        let value = typeCache.get(key);
        if (value !== undefined) {
            return value as Pointer;
        }
        let out: Pointer = {
            type: 'pointer',
            _key: key,
            size: space0.size,
            align: space0.align,
            preferredAlign: space0.preferredAlign,
            mut: false,
            volatile: false,
            mobility: 'fixed',
            to: type,
        };
        typeCache.set(getKey(out), out);
        return out;
    }

    export interface Reference extends Base {
        type: 'reference';
        value: Type;
    }

    export function reference(type: Object): Reference {
        let key = `(${getKey(type)})&`;
        let value = typeCache.get(key);
        if (value !== undefined) {
            return value as Reference;
        }
        let out: Reference = {
            type: 'reference',
            _key: key,
            value: type,
        };
        typeCache.set(getKey(out), out);
        return out;
    }

    export interface Array extends BaseObject {
        type: 'array';
        mobility: 'none';
        items: Object;
        len: number;
    }

    export function array(items: Object, len: number): Array {
        let key = `(${getKey(items)})[${len}]`;
        let value = typeCache.get(key);
        if (value !== undefined) {
            return value as Array;
        }
        let itemSize = Math.ceil(items.size / items.align) * items.align;
        let out: Array = {
            type: 'array',
            _key: key,
            size: itemSize * len,
            align: items.align,
            preferredAlign: items.preferredAlign,
            mut: false,
            volatile: false,
            mobility: 'none',
            items,
            len,
        };
        typeCache.set(getKey(out), out);
        return out;
    }

    export interface Parameter {
        type: Object;
        name?: string;
    }

    export interface Function extends Base {
        type: 'function';
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
        let value = typeCache.get(key);
        if (value !== undefined) {
            return value as Function;
        }
        let out: Function = {
            type: 'function',
            _key: key,
            returnType,
            params,
        };
        typeCache.set(getKey(out), out);
        return out;
    }

    export type StructMember = {name?: string, type: Object, offset: number};

    export type ParamStructMember = Omit<StructMember, 'offset'>;

    export interface Struct extends BaseObject {
        type: 'struct';
        members: StructMember[];
        hasHoles: boolean;
    }

    export interface StructLayout {
        members: StructMember[];
        size: number;
        align: number;
        preferredAlign: number;
        hasHoles: boolean;
        mobility: Mobility;
    }

    export function getStructLayout(members: ParamStructMember[]): StructLayout {
    }

    export function struct(members: ParamStructMember[]): Struct {
        let layout = getStructLayout(members);
        let key = `struct {${layout.members.map(member => {
            let out = `(${getKey(member.type)})`;
            if (member.name !== undefined) {
                out += ` ${member.name}`;
            }
            return out;
        }).join(', ')}}`;
        let value = typeCache.get(key);
        if (value !== undefined) {
            return value as Struct;
        }
        let out: Struct = {
            type: 'struct',
            _key: key,
            size: layout.size,
            align: layout.align,
            preferredAlign: layout.preferredAlign,
            mut: false,
            volatile: false,
            mobility: layout.mobility,
            members: layout.members,
            hasHoles: layout.hasHoles,
        };
        typeCache.set(getKey(out), out);
        return out;
    }

    export type UnionMember = {name: string, type: Object};

    export interface Union extends BaseObject {
        type: 'union';
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
        let value = typeCache.get(key);
        if (value !== undefined) {
            return value as Union;
        }
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
            mobility: 'free',
            members,
        };
    }

    export interface Slice extends BaseObject {
        type: 'slice';
        items: Object;
    }

    export const SLICE_LAYOUT = getStructLayout([{type: size}, {type: pointer(void_)}]);

    export function slice(items: Object): Slice {
        let key = `(${getKey(items)})[]`;
        let value = typeCache.get(key);
        if (value !== undefined) {
            return value as Slice;
        }
        let out: Slice = {
            type: 'slice',
            _key: key,
            size: SLICE_LAYOUT.size,
            align: SLICE_LAYOUT.align,
            preferredAlign: SLICE_LAYOUT.preferredAlign,
            mut: false,
            volatile: false,
            mobility: 'fixed',
            items,
        };
        typeCache.set(getKey(out), out);
        return out;
    }

    export interface Sum extends BaseObject {
        type: 'sum';
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
        let value = typeCache.get(key);
        if (value !== undefined) {
            return value as Sum;
        }
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
            mobility: 'free',
            members: members.map((member, i) => ({name: '_' + i, type: member})),
        };
        let layout = getStructLayout([{type: tagType}, {type: unionType}]);
        let tagOffset = (layout.members.find(member => member.type === tagType) as StructMember).offset;
        let memberOffset = (layout.members.find(member => member.type === unionType) as StructMember).offset;
        let out: Sum = {
            type: 'sum',
            _key: key,
            size: layout.size,
            align: layout.align,
            preferredAlign: layout.preferredAlign,
            mut: false,
            volatile: false,
            mobility: 'fixed',
            tagType,
            members,
            tagOffset,
            memberOffset,
        };
        typeCache.set(getKey(out), out);
        return out;
    }

    export type EnumMember = {name: string, value: ByteArray};

    export interface Enum extends BaseObject {
        type: 'enum';
        backing: Type;
        members: EnumMember[];
    }

    export type Object = PrimitiveObject | Pointer | Array | Struct | Union | Slice | Sum | Enum;
    export type NonVoidObject = Exclude<Object, Void>;

    export type Type = Object | Never | Reference | Function;

    export namespace meta {

        export const struct = t.setName(t.struct([
            {},
        ]), undefined, 'type.meta.struct');

    }

}

export type Type = t.Type;
