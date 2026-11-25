
import {Decimal} from 'decimal.js';

import {deepCopy, Position, EOF, CQQSymbol, Keyword} from './base.js';
import {BitTypeStorageData, cTypeBits, dataLayout, POINTERS, ByteArray, Region} from './memory.js';


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

    export type FloatingTypeName = 'float16' | 'float32' | 'float64';

    export interface BaseFloating<Type extends FloatingTypeName> extends BaseObject<Type> {
        bits: number;
    }

    export type Float16 = BaseFloating<'float16'>;
    export type Float32 = BaseFloating<'float32'>;
    export type Float64 = BaseFloating<'float64'>;

    export type Floating = Float16 | Float32 | Float64;

    export function isFloating(type: Type): type is Floating {
        return type.type === 'float16' || type.type === 'float32' || type.type === 'float64';
    }

    const FLOAT_TYPE_DATA: {[K in FloatingTypeName]: BitTypeStorageData} = {
        'float16': dataLayout.floatingTypes[16],
        'float32': dataLayout.floatingTypes[32],
        'float64': dataLayout.floatingTypes[64],
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

    export interface ComptimeNumber extends BaseObject<'comptime_number'> {
        // empty
    }

    export const comptimeNumber: ComptimeNumber = {
        type: 'comptime_number',
        _key: 'comptime_number',
        size: 0,
        align: 0,
        preferredAlign: 0,
        mut: false,
        volatile: false,
    }

    export type Number = Integer | Floating | ComptimeNumber;

    export interface Auto extends BaseType<'auto'> {
        // empty
    }

    export const auto: Auto = {
        type: 'auto',
        _key: 'auto',
    };

    export type Primitive = Never | Void | Bool | Number | Auto;
    export type PrimitiveObject = Extract<Primitive, BaseObject<string>>;

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
            size: POINTERS.size,
            align: POINTERS.align,
            preferredAlign: POINTERS.preferredAlign,
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
        itemSize: number;
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
            itemSize,
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
                throw new Error(`Two union members with the same name`);
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
        of: Object;
        members: EnumMember[];
    }

    export type Derived = Pointer | Reference | Array | Function | Struct | Union | Slice | Sum | Enum;
    export type DerivedObject = Extract<Derived, BaseObject<string>>;

    // Bool | Int | Uint | Float16 | Float32 | Float64 | ComptimeNumber | Auto | Pointer | Reference | Array | Function | Struct | Union | Slice | Sum | Enum
    export type Type = Primitive | Derived;

    export type Object = Extract<Type, BaseObject<string>>;
    export type NonVoidObject = Exclude<Object, Void>;
    export type NonObject = Exclude<Type, Object>;

    export function isObject(type: Type): type is Object {
        return !(type.type === 'never' || type.type === 'auto' || type.type === 'reference' || type.type === 'function');
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
            ['item_size', t.size],
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
            } else if (t.isFloating(type)) {
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
                throw new Error(`Type ${type.type} is not representable in code and should not be present`);
            }
        }

    }

    export interface Value {
        type: Type;
        value: ByteArray;
    }

    export type AnyJSValueOfType = undefined | boolean | number | bigint | Decimal | ByteArray | Value | AnyJSValueOfType[] | {[key: string]: AnyJSValueOfType} | {ptr: ByteArray, len: bigint};

    export type JSValueOfType<T extends t.Object> =
        T extends t.Void ? undefined :
        T extends t.Bool ? boolean :
        T extends t.Int ? number | bigint :
        T extends t.Uint ? number | bigint :
        T extends t.Floating ? number :
        T extends t.ComptimeNumber ? Decimal :
        T extends t.Pointer ? ByteArray :
        T extends t.Array ? AnyJSValueOfType[] :
        T extends t.Struct ? {[key: string]: AnyJSValueOfType} :
        T extends t.Union ? Value :
        T extends t.Slice ? {ptr: ByteArray, len: bigint} :
        T extends t.Sum ? Value :
        T extends t.Enum ? AnyJSValueOfType :
        never
    ;

    function _writeValue(out: ByteArray, type: t.Object, value: AnyJSValueOfType): void {
        if (type.type === 'void') {
            // do nothing
        } else if (type.type === 'bool') {
            if (typeof value !== 'boolean') {
                throw new Error(`Invalid JS value for writing to CQQ boolean type: '${value}' of type ${typeof value} (expected boolean)`);
            }
            out.setInt(0, 8, (value as boolean) ? 1n : 0n);
        } else if (type.type === 'int') {
            if (!(typeof value === 'number' || typeof value === 'bigint')) {
                throw new Error(`Invalid JS value for writing to CQQ int type: '${value}' of type ${typeof value} (expected number or bigint)`);
            }
            out.setInt(0, type.bits, BigInt(value));
        } else if (type.type === 'uint') {
            if (!(typeof value === 'number' || typeof value === 'bigint')) {
                throw new Error(`Invalid JS value for writing to CQQ uint type: '${value}' of type ${typeof value} (expected number or bigint)`);
            }
            out.setUint(0, type.bits, BigInt(value));
        } else if (type.type === 'float16') {
            if (typeof value !== 'number') {
                throw new Error(`Invalid JS value for writing to CQQ float16 type: '${value}' of type ${typeof value} (expected number)`);
            }
            out.setFloat16(0, value);
        } else if (type.type === 'float32') {
            if (typeof value !== 'number') {
                throw new Error(`Invalid JS value for writing to CQQ float32 type: '${value}' of type ${typeof value} (expected number)`);
            }
            out.setFloat32(0, value);
        } else if (type.type === 'float64') {
            if (typeof value !== 'number') {
                throw new Error(`Invalid JS value for writing to CQQ float64 type: '${value}' of type ${typeof value} (expected number)`);
            }
            out.setFloat64(0, value);
        } else if (type.type === 'comptime_number') {
            throw new Error(`Cannot write comptime number`);
        } else if (type.type === 'pointer') {
            if (!(value instanceof ByteArray)) {
                throw new Error(`Invalid JS value for writing to CQQ pointer type: '${value}' of type ${typeof value} (expected ByteArray)`);
            }
        } else if (type.type === 'array') {
            for (let i = 0; i < type.len; i++) {
                _writeValue(out.slice(i * type.itemSize), type.items, (value as AnyJSValueOfType[])[i]);
            }
        } else if (type.type === 'struct') {
            if (!(typeof value === 'object' && value !== null)) {
                throw new Error(`Invalid JS value for writing to CQQ struct type: '${value}' of type ${typeof value} (expected object)`);
            }
            for (let member of type.members.concat(type.inheritsFrom)) {
                if (member.name === undefined) {
                    throw new Error(`Cannot construct CQQ struct with unnamed members`);
                }
                if (!(member.name in value)) {
                    throw new Error(`CQQ struct key '${member.name}' is missing in JS initializer`);
                }
                let toWrite = (value as {[key: string]: AnyJSValueOfType})[member.name];
                _writeValue(out, member.type, toWrite);
            }
        } else if (type.type === 'union') {
            if (!(typeof value === 'object' && value !== null && ('type' in value && typeof value.type === 'object' && value.type !== null) && ('value' in value))) {
                throw new Error(`Invalid JS value for writing to CQQ union type: '${value}' of type ${typeof value} (expected object that conforms to TS type cqq/src/types.ts:Value)`);
            }
            _writeValue(out, value.type as t.Object, value.value as AnyJSValueOfType);
        } else if (type.type === 'slice') {
            throw new Error(`Slices are not supported at compile time yet`);
        } else if (type.type === 'sum') {
            if (!(typeof value === 'object' && value !== null && ('type' in value && typeof value.type === 'object' && value.type !== null) && ('value' in value))) {
                throw new Error(`Invalid JS value for writing to CQQ union type: '${value}' of type ${typeof value} (expected object that conforms to TS type cqq/src/types.ts:Value)`);
            }
            _writeValue(out, value.type as t.Object, value.value as AnyJSValueOfType);
        } else if (type.type === 'enum') {
            _writeValue(out, type.of, value);
        } else {
            throw new Error(`Invalid type: '${type satisfies never}'`);
        }
    }

    export function writeValue<T extends t.Object>(out: ByteArray, type: T, value: JSValueOfType<T>): void {
        _writeValue(out, type, value);
    }

    export function createValue<T extends t.Object>(type: T, value: JSValueOfType<T>): Value {
        if (type.type === 'comptime_number') {
            if (!(value instanceof Decimal)) {
                throw new Error(`Invalid JS value for writing to CQQ comptime_number type: '${value}' of type ${typeof value} (expected Decimal)`);
            }
            return {type, value: ByteArray.fromDecimal(value)};
        } else {
            let out = new ByteArray(type.size);
            _writeValue(out, type, value);
            return {type, value: out};
        }
    }

    export let methods = new Map<string, a.FunctionDeclaration[]>();
    export function getMethods(type: Type): a.FunctionDeclaration[] {
        return methods.get(getKey(type)) ?? [];
    }

}

export type Type = t.Type;

export type Value = t.Value;


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

    export interface BaseExpression<Type extends string> extends BaseNode<Type> {
        exprType: t.Type;
    }

    export interface IdentifierExpression extends BaseExpression<'identifier-expression'> {
        name: string;
    }

    export interface ValueExpression extends BaseExpression<'value-expression'> {
        value: ByteArray;
    }

    export type MemberOperator = '.' | '->' | '::';

    export interface MemberExpression extends BaseExpression<'member-expression'> {
        value: Expression;
        op: MemberOperator;
        member: Identifier;
    }

    export interface ExpressionArgument extends BaseExpression<'expression-argument'> {
        value: Expression;
    }

    export interface KeywordArgument extends BaseExpression<'keyword-argument'> {
        name: Identifier;
        value: Expression;
    }

    export type Argument = ExpressionArgument | KeywordArgument;

    export interface CallExpression extends BaseExpression<'call-expression'> {
        func: Expression;
        args: Argument[];
    }

    export interface StatementExpression extends BaseExpression<'statement-expression'> {
        data: BlockStatement;
    }

    export type Expression = IdentifierExpression | ValueExpression | MemberExpression | CallExpression | StatementExpression;

    export type ExpressionNode = Expression | Argument;

    export interface BaseStatement<Type extends string> extends BaseNode<Type> {
        // empty
    }

    export interface ExpressionStatement extends BaseStatement<'expression-statement'> {
        value: Expression;
    }

    export interface BlockStatement extends BaseStatement<'block-statement'> {
        scope: Scope;
        data: Statement[];
    }

    export interface VariableDeclaration extends BaseStatement<'variable-declaration'> {
        name: string;
        mut: boolean;
        varType?: Expression;
        value: Expression | undefined;
    }

    export interface FunctionParameter {
        name: Identifier;
        type: Expression;
    }

    export interface FunctionDeclaration extends BaseStatement<'function-declaration'> {
        name: Identifier;
        returnType: Expression;
        params: FunctionParameter[];
        body: BlockStatement;
    }

    export type Statement = ExpressionStatement | BlockStatement | VariableDeclaration | FunctionDeclaration;

    export type StatementNode = Statement;

    export type Node = Expression | Statement;

}
