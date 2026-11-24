
import {execSync} from 'node:child_process';

import {Decimal} from 'decimal.js';

import {getInternalPath, DEEP_COPY_SYMBOL} from './base.js';


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
        throw new Error(`getIntegerType end reached`);
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
                    throw new Error('Invalid datalayout string (invalid pointer)');
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
                    throw new Error('Invalid datalayout string (invalid pointer)');
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
                throw new Error(`Invalid datalayout string`);
            }
        }
    }

};


let execSyncOptions: Parameters<typeof execSync>[1] = {stdio: ['ignore', 'ignore', 'inherit']};

export let cTypeBits: {[key: string]: number} = {}; 
let llvmIR: string;
try {
    llvmIR = execSync(`clang -S -emit-llvm -o - '${getInternalPath('src/data_getter.c')}'`, execSyncOptions).toString();
    execSync(`clang -o -ffreestanding '${getInternalPath('.a.out')}' '${getInternalPath('src/data_getter.c')}'`, execSyncOptions);
    let stdout = execSync(getInternalPath('.a.out')).toString();
    for (let line of stdout.split('\n')) {
        let match = line.match(/^(unsigned|signed) ([a-zA-Z0-9_]+) = (\d+)$/);
        if (match === null) {
            throw new Error(`Invalid line in C data getter output`);
        }
        let key = match[2];
        let value = Math.log2(Number(match[3]) + 1);
        if (match[1] === 'signed') {
            value += 1;
        }
        cTypeBits[key] = value;
    }
} catch (error) {
    throw new Error(`Failed to get C data`);
}

let dataLayoutStrLine = llvmIR.split('\n').find(line => line.startsWith('target datalayout'));
if (dataLayoutStrLine === undefined) {
    throw new Error(`No datalayout string found in LLVM IR`);
}
let dataLayoutStr = dataLayoutStrLine.slice(dataLayoutStrLine.indexOf('=') + 1).trim();
export let dataLayout = new DataLayout(dataLayoutStr);

// maybe make this better later???
// adapting it for specific usages???
export const POINTERS = dataLayout.addressSpaces[0];

export let littleEndian = dataLayout.endianness === 'little';
export let bigEndian = dataLayout.endianness === 'big';


let encoder = new TextEncoder();
let decoder = new TextDecoder();

export let liveAllocations = new Set<WeakRef<ArrayBuffer>>();

let pointerSpaces = new Map<ArrayBuffer, bigint>();
let reversePointerSpaces = new Map<bigint, ArrayBuffer>();
const POINTER_SPACE_SHIFT = BigInt(POINTERS.size / 2);

export class ByteArray {

    readonly buffer: ArrayBuffer;
    readonly view: DataView<ArrayBuffer>;

    constructor(length: number);
    constructor(__internal_do_not_use_this_constructor: ByteArray | ArrayBuffer, offset: number, length: number);
    constructor(value: number | ByteArray | ArrayBuffer, offset: number = 0, length: number = 0) {
        if (typeof value === 'number') {
            this.buffer = new ArrayBuffer(value);
            liveAllocations.add(new WeakRef(this.buffer));
            length = value;
        } else if (value instanceof ByteArray) {
            this.buffer = value.buffer;
            offset += value.offset;
        } else {
            this.buffer = value;
            liveAllocations.add(new WeakRef(this.buffer));
        }
        this.view = new DataView(this.buffer, offset, length);
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

    // data manipulation methods

    getByte(offset: number): number {
        return this.view.getUint8(offset);
    }

    setByte(offset: number, value: number): void {
        this.view.setUint8(offset, value);
    }

    getUint(offset: number, bits: number): bigint {
        let out = 0n;
        let size = dataLayout.getIntegerType(bits).size;
        for (let i = 0; i < size; i++) {
            if (i * 8 > bits) {
                break;
            }
            let index = littleEndian ? i : (size - 1 - i);
            out <<= 8n;
            out += BigInt(this.view.getUint8(offset + index));
        }
        return out;
    }

    setUint(offset: number, bits: number, value: bigint): void {
        let size = dataLayout.getIntegerType(bits).size;
        for (let i = 0; i < size; i++) {
            if (value === 0n) {
                break;
            }
            let index = littleEndian ? i : (size - 1 - i);
            let byte = value % 256n;
            value >>= 8n;
            this.view.setUint8(offset + index, Number(byte));
        }
    }

   static fromUint(bits: number, value: bigint): ByteArray {
        let out = new ByteArray(dataLayout.getIntegerType(bits).size);
        out.setUint(bits, 0, value);
        return out;
    }

    getInt(offset: number, bits: number): bigint {
        let out = this.getUint(offset, bits);
        if (out > (1n << (BigInt(bits) - 1n))) {
            out += 1n << BigInt(bits);
        }
        return out;
    }

    setInt(offset: number, bits: number, value: bigint): void {
        if (value < 0) {
            value += 1n << BigInt(bits);
        }
        this.setUint(offset, bits, value);
    }

    static fromInt(bits: number, value: bigint): ByteArray {
        let out = new ByteArray(dataLayout.getIntegerType(bits).size);
        out.setInt(bits, 0, value);
        return out;
    }

    getFloat16(offset: number): number {
        return this.view.getFloat16(offset, littleEndian);
    }

    setFloat16(offset: number, value: number): void {
        this.view.setFloat16(offset, value, littleEndian);
    }

    static fromFloat16(value: number): ByteArray {
        let out = new ByteArray(2);
        out.setFloat16(0, value);
        return out;
    }

    getFloat32(offset: number): number {
        return this.view.getFloat32(offset, littleEndian);
    }

    setFloat32(offset: number, value: number): void {
        this.view.setFloat32(offset, value, littleEndian);
    }

    static fromFloat32(value: number): ByteArray {
        let out = new ByteArray(4);
        out.setFloat32(0, value);
        return out;
    }

    getFloat64(offset: number): number {
        return this.view.getFloat64(offset, littleEndian);
    }

    setFloat64(offset: number, value: number): void {
        this.view.setFloat64(offset, value, littleEndian);
    }

    static fromFloat64(value: number): ByteArray {
        let out = new ByteArray(8);
        out.setFloat64(0, value);
        return out;
    }

    getString(offset: number, bytes: number): string {
        return decoder.decode(new Uint8Array(this.buffer, offset, bytes));
    }

    setString(offset: number, value: string): void {
        this.setSlice(offset, encoder.encode(value));
    }

    static fromString(value: string): ByteArray {
        let buffer = encoder.encode(value).buffer;
        return new ByteArray(buffer, 0, buffer.byteLength);
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

    // non-data-manipulation methods

    slice(start: number = 0, end: number = -1): ByteArray {
        if (start < 0) {
            start += this.length;
        }
        if (end < 0) {
            end += this.length;
        }
        // the offsetting is done in the constructor
        // so it doesn't need to be done here
        return new ByteArray(this, start, end - start);
    }

    setSlice(offset: number, value: ArrayBuffer | ArrayBufferView<ArrayBuffer>): void {
        let array: Uint8Array;
        if (value instanceof ArrayBuffer) {
            array = new Uint8Array(value);
        } else {
            array = new Uint8Array(value.buffer);
        }
        for (let i = 0; i < array.length; i++) {
            this.view.setUint8(offset + i, array[i]);
        }
    }

    [DEEP_COPY_SYMBOL](): ByteArray {
        let out = new ByteArray(this.length);
        out.setSlice(0, this);
        return out;
    }

    [Symbol.iterator](): ArrayIterator<number> {
        return (new Uint8Array(this.buffer))[Symbol.iterator]();
    }

    getPointerTo(offset: number): ByteArray {
        let space = pointerSpaces.get(this.buffer);
        if (space === undefined) {
            space = BigInt(pointerSpaces.size);
            pointerSpaces.set(this.buffer, space);
            reversePointerSpaces.set(space, this.buffer);
        }
        let value = (space << POINTER_SPACE_SHIFT) | BigInt(this.offset + offset);
        return ByteArray.fromUint(POINTERS.bits, value);
    }

    derefAsPointer(offset: number): ByteArray {
        let value = this.getUint(offset, POINTERS.bits);
        let space = value >> POINTER_SPACE_SHIFT;
        let ptrOffset = value & (POINTER_SPACE_SHIFT - 1n);
        let buffer = reversePointerSpaces.get(space);
        if (buffer === undefined) {
            throw new Error(`Cannot find pointer in space ${space} with offset ${ptrOffset}`);
        }
        return new ByteArray(buffer, 0, buffer.byteLength);
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
