
import {C_TYPES, C_BOOL, C_UNSIGNED_CHAR, C_INT, C_UNSIGNED_INT, C_FLOAT, C_DOUBLE, C_POINTER, C_SIZE_T, C_PTRDIFF_T, C_UINTPTR_T} from './base.js';


export namespace t {

    export type BaseType = {type: string};

    export const NEVER = {type: 'never'} satisfies BaseType;
    export type Never = typeof NEVER;
    
    export type BaseObjectType = BaseType & {size: number, align: number, mut?: boolean, volatile?: boolean};

    export const VOID = {type: 'void', size: 0, align: 1} satisfies BaseObjectType;
    export type Void = BaseObjectType & typeof VOID;

    export type BaseIntegerType = BaseObjectType & {signed: boolean, bits: number};

    export const BOOL = {type: 'bool', size: C_BOOL.size, align: C_BOOL.align, signed: false, bits: C_BOOL.bits} satisfies BaseIntegerType;
    export type Bool = BaseObjectType & typeof BOOL;

    export const BYTE = {type: 'byte', size: C_UNSIGNED_CHAR.size, align: C_UNSIGNED_CHAR.align, signed: false, bits: C_UNSIGNED_CHAR.bits} satisfies BaseIntegerType;
    export type Byte = BaseObjectType & typeof BYTE;

    export const CHAR = {type: 'char', size: C_UNSIGNED_CHAR.size, align: C_UNSIGNED_CHAR.align, signed: false, bits: C_UNSIGNED_CHAR.bits} satisfies BaseIntegerType;
    export type Char = BaseObjectType & typeof CHAR;

    export type Int = BaseIntegerType & {type: 'int', signed: true};
    export function int(bits: number): Int {
        // insert complicated LLVM padding stuff here
        return {type: 'int', bits};
    }

    export type Uint = BaseIntegerType & {type: 'int', signed: true};

    export type Integer = Byte | Char | Int | Uint;
    export type SignedInteger = Extract<Integer, {signed: true}>;
    export type UnsignedInteger = Extract<Integer, {signed: false}>;

    export type Float = BaseObjectType & {type: 'float', bits: number};
    export function float(bits: number): Float {
        // insert complicated LLVM padding stuff here
        return {type: 'float', size: bits};
    }

    export type Number = Integer | Float;

    export type PrimitiveObject = Void | Bool | Number;
    export type Primitive = PrimitiveObject | Never;

    export function mut(value: Object): Object {
        let out = structuredClone(value);
        out.mut = true;
        return out;
    }

    export type Volatile = BaseObjectType & {type: 'volatile', value: Type};
    export function volatile(value: Object): Volatile {
        return {type: 'volatile', size: value.size, align: value.align, value};
    }

    export type Pointer = BaseObjectType & {type: 'pointer', value: Type};
    export function pointer(value: Type): Pointer {
        return {type: 'pointer', size: C_POINTER.size, align: C_POINTER.align, value};
    }

    export type Reference = BaseObjectType & {type: 'reference', value: Type};
    export function reference(value: Type): Reference {
        return {type: 'reference', size: C_POINTER.size, align: C_POINTER.align, value};
    }

    export type Array = BaseObjectType & {type: 'array', items: Object, len: number};
    export function array(items: Object, len: number): Array {
        return {type: 'array', size: items.size * len, align: items.align, items, len};
    }

    export type Parameter = {type: Object, name?: string};
    export type Function = BaseType & {type: 'function', returnType: Object, params: Parameter[]};
    export function function_(returnType: Object, params: Parameter[]): Function {
        return {type: 'function', returnType, params};
    }

    export type StructMember = {name?: string, type: Object, offset: number};
    export type Struct = BaseObjectType & {type: 'struct', members: StructMember[]};
    export type ParamStructMember = {name?: string, type: Object};
    export function struct(members: ParamStructMember[]): Struct {
        let size = 0;
        let maxAlign = 1;
        let out: StructMember[] = [];
        for (let i = 0; i < members.length; i++) {
            let member = Object.assign(structuredClone(members[i]), {offset: 0}) as StructMember;
            let align = member.type.align;
            maxAlign = Math.max(maxAlign, align);
            if (size % align !== 0) {
                size += align - (size % align);
            }
            member.offset = size;
            if (member.type !== undefined) {
                size += member.type.size;
            }
            out.push(member);
        }
        if (size % maxAlign !== 0) {
            size += maxAlign - (size % maxAlign);
        }
        return {type: 'struct', size, align: maxAlign, members: out};
    }

    export type Union = BaseObjectType & {type: 'union', members: UnionMember[]};
    export type UnionMember = {name?: string, type: Object};
    export function union(members: UnionMember[]): Union {
        let size = 0;
        let align = 1;
        for (let member of members) {
            size = Math.max(size, member.type.size);
            align = Math.max(align, member.type.align);
        }
        return {type: 'union', size, align, members};
    }

    const SLICE = struct([{type: SIZE}, {type: pointer(VOID)}]);
    export const SLICE_SIZE = SLICE.size;
    export const SLICE_ALIGN = SLICE.align;
    export type Slice = BaseObjectType & {type: 'slice', items: Object};
    export function slice(items: Object): Slice {
        return {type: 'slice', size: SLICE_SIZE, align: SLICE_ALIGN, items};
    }

    export type Sum = BaseObjectType & {type: 'sum', tag: Integer, members: Object[]};
    export function sum(members: Object[]): Sum {
        let tag: Integer = SIZE;
        for (let type of Object.values(UINTNS)) {
            if (type.size < tag.size && 1n ** BigInt(type.bits) > members.length) {
                tag = type;
            }
        }
        let size = 0;
        let align = 1;
        for (let member of members) {
            size = Math.max(size, member.size);
            align = Math.max(align, member.align);
        }
        size += tag.size;
        return {type: 'sum', size, align, tag, members};
    }

    export type EnumMember = {name: string, value: Value};
    export type Enum = BaseObjectType & {type: 'enum', backing: Type, members: EnumMember[]};

    export type Object = PrimitiveObject | Pointer | Array | Struct | Union | Slice | Sum | Enum;

    export type Type = Object | Never | Reference | Function;

    export type VoidValue = {type: Void};
    export type BoolValue = {type: Bool, value: boolean};
    export type IntegerValue = {type: Integer, value: bigint};

    export type Value<T extends Object = Object> =
        T extends Void ? undefined :
        T extends Bool ? boolean :
        T extends Exclude<Integer, Bool> ? bigint :
        T extends FloatN ? number :
        T extends Pointer ? [Value] :
        T extends Reference ? [Value] :
        T extends Array ? Value[] :
        T extends Struct ? Value[] :
        T extends Union ? Uint8Array :
        T extends Slice ? Value[] :
        T extends Sum ? {type: Type, value: Value} :
        T extends Enum ? Value :
        never
    ;

};

export type Type = t.Type;
