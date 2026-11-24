
import {Position, HasPos, CQQError, EOF, PrefixOperator, PostfixOperator, BinaryOperator, SYMBOLS, CQQSymbol, KEYWORDS, BasicKeyword} from './base.js';
import {Region} from './memory.js';
import {t, Type, Value, SymbolToken, IdentifierToken, KeywordToken, Token, STRING_TOKEN_NAMES, tokenToString, Scope, a} from './types.js';


type Matcher = 
    | EOF
    | Token['type']
    | BasicKeyword | 'intn' | 'uintn'
    | CQQSymbol
    | `identifier ${string}`
    | Matcher[]
;

type MatcherReturnType<T extends Matcher> =
    T extends EOF ? EOF :
    T extends Token['type'] ? Extract<Token, {type: T}> :
    T extends BasicKeyword ? KeywordToken<T> :
    T extends 'intn' | 'uintn' ? (T extends `${infer T extends 'int' | 'uint'}n` ? KeywordToken<`${T}${number}`> : never) :
    T extends CQQSymbol ? SymbolToken<T> :
    T extends `identifier ${string}` ? IdentifierToken :
    // T extends (infer U)[] ? MatcherReturnType<U> :
    T extends any[] ? Token :
    never
;

type PrefixOperatorToken = MatcherReturnType<PrefixOperator>;
type PostfixOperatorToken = MatcherReturnType<PostfixOperator>;
type BinaryOperatorToken = MatcherReturnType<BinaryOperator>;

function matcherToString(matcher: Matcher): string {
    if (matcher === EOF) {
        return `end of file`;
    } else if (typeof matcher === 'string') {
        if (KEYWORDS.has(matcher as BasicKeyword)) {
            return `keyword '${matcher}'`;
        } else if (SYMBOLS.has(matcher as CQQSymbol)) {
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
        throw new CQQError(pos, message);
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
            if (SYMBOLS.has(matcher as CQQSymbol)) {
                return token.type === 'symbol' && token.value === matcher;
            } else if (KEYWORDS.has(matcher as BasicKeyword)) {
                return token.type === 'keyword' && token.value === matcher;
            } else if (matcher === 'intn' || matcher === 'uintn') {
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
            if (error instanceof CQQError) {
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
            if (error instanceof CQQError) {
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


export class Parser extends BaseParser {

    scope: Scope;
    globalRegion: Region;

    constructor(tokens: Token[], scope: Scope, globalRegion: Region) {
        super(tokens);
        this.scope = scope;
        this.globalRegion = globalRegion;
    }

    identifier(): a.Identifier {
        let token = this.eat('identifier');
        return {
            pos: token.pos,
            type: 'identifier',
            name: token.name,
        }
    }

    readonly KEYWORD_LITERALS: string[] = [
        // copied from base.ts
        'true', 'false', 'null',
        'never', 'void', 'bool', 'int', 'uint', 'float16', 'float32', 'float64', 'size', 'ssize', 'char', 'string', 'type', 'any', 'code',
    ];

    primaryExpression(): a.Expression {
        if (this.match('identifier')) {
            return this.identifier();
        } else if (this.match('number-literal')) {
            let token = this.advance<'number-literal'>();
            return {
                pos: token.pos,
                type: 'number-literal',
                value: token.value,
            };
        } else if (this.match('string-literal')) {
            let token = this.advance<'string-literal'>();
            return {
                pos: token.pos,
                type: 'string-literal',
                value: token.value,
            };
        } else if (this.match('(')) {
            let token = this.advance();
            let out = this.expression();
            this.eat(')');
            return {
                pos: token.pos,
                type: 'parenthesized-expression',
                value: out,
            };
        } else if (this.match('keyword')) {
            let token = this.peek<'keyword'>();
            if (token.value in this.KEYWORD_LITERALS) {
                this.advance();
                return {
                    pos: token.pos,
                    type: 'keyword-literal',
                    value: token.value,
                }
            } else {
                this.error(undefined, `Invalid primary expression`);
            }
        } else {
            this.error(undefined, `Invalid primary expression`);
        }
    }

    mutVolatilePrefixExpression(): a.Expression {
        let ops: PrefixOperatorToken[] = [];
        while (this.match(['mut', 'volatile'])) {
            ops.unshift(this.advance<PrefixOperator>());
        }
        let out = this.primaryExpression();
        for (let token of ops) {
            out = {
                pos: token.pos,
                type: 'prefix-expression',
                op: token.value,
                value: out,
            };
        }
        return out;
    }

    postfixCallIndexMemberExpression(): a.Expression {
        let out = this.mutVolatilePrefixExpression();
        while (true) {
            if (this.match(['*', '&'])) {
                // normal postfix operator
                let op = this.advance<PostfixOperator>();
                out = {
                    pos: op.pos,
                    type: 'postfix-expression',
                    op: op.value,
                    value: out,
                };
            } else if (this.match('[')) {
                // index expression
                let op = this.advance();
                let indices: a.Expression[] = [];
                while (true) {
                    if (this.match(']')) {
                        break;
                    }
                    indices.push(this.expression());
                    if (this.match(',')) {
                        this.advance();
                        continue;
                    } else {
                        break;
                    }
                }
                this.eat(']');
                out = {
                    pos: op.pos,
                    type: 'index-expression',
                    value: out,
                    indices,
                };
            } else if (this.match('(')) {
                // function call
                let op = this.advance();
                let args: a.Argument[] = [];
                while (true) {
                    if (this.match(')')) {
                        break;
                    }
                    if (this.match('identifier', '=')) {
                        let name = this.identifier();
                        let token = this.advance();
                        let value = this.expression();
                        args.push({
                            pos: token.pos,
                            type: 'keyword-argument',
                            name,
                            value,
                        });
                    } else {
                        let value = this.expression();
                        args.push({
                            pos: value.pos,
                            type: 'expression-argument',
                            value,
                        })
                    }
                    if (this.match(',')) {
                        this.advance();
                        continue;
                    } else {
                        break;
                    }
                }
                this.eat(']');
                out = {
                    pos: op.pos,
                    type: 'call-expression',
                    func: out,
                    args,
                };
            } else if (this.match(['.', '->', '::'])) {
                let op = this.advance<BinaryOperator>();
                let right = this.mutVolatilePrefixExpression();
                out = {
                    pos: op.pos,
                    type: 'binary-expression',
                    op: op.value,
                    left: out,
                    right,
                }
            } else {
                break;
            }
        }
        return out;
    }

    nonMutVolatilePrefixExpression(): a.Expression {
        let ops: PrefixOperatorToken[] = [];
        while (this.match(['+', '-', '~', '*', '&', '!', 'decltype', 'typeof'])) {
            ops.unshift(this.advance<PrefixOperator>());
        }
        let out = this.primaryExpression();
        for (let token of ops) {
            out = {
                pos: token.pos,
                type: 'prefix-expression',
                op: token.value,
                value: out,
            };
        }
        return out;
    }

    extendsBinaryExpression(): a.Expression {
        let left = this.nonMutVolatilePrefixExpression();
        while (this.match('extends')) {
            let op = this.advance<BinaryOperator>();
            let right = this.nonMutVolatilePrefixExpression();
            left = {
                pos: op.pos,
                type: 'binary-expression',
                op: op.value,
                left,
                right,
            };
        }
        return left;
    }

    rangeBinaryExpression(): a.Expression {
        let left = this.extendsBinaryExpression();
        while (this.match(['..<', '..='])) {
            let op = this.advance<BinaryOperator>();
            let right = this.extendsBinaryExpression();
            left = {
                pos: op.pos,
                type: 'binary-expression',
                op: op.value,
                left,
                right,
            };
        }
        return left;
    }

    mulDivModBinaryExpression(): a.Expression {
        let left = this.rangeBinaryExpression();
        while (this.match(['*', '/', '%'])) {
            let op = this.advance<BinaryOperator>();
            let right = this.rangeBinaryExpression();
            left = {
                pos: op.pos,
                type: 'binary-expression',
                op: op.value,
                left,
                right,
            };
        }
        return left;
    }

    addSubBinaryExpression(): a.Expression {
        let left = this.mulDivModBinaryExpression();
        while (this.match(['+', '-'])) {
            let op = this.advance<BinaryOperator>();
            let right = this.mulDivModBinaryExpression();
            left = {
                pos: op.pos,
                type: 'binary-expression',
                op: op.value,
                left,
                right,
            };
        }
        return left;
    }

    shiftBinaryExpression(): a.Expression {
        let left = this.addSubBinaryExpression();
        while (this.match(['<<', '>>'])) {
            let op = this.advance<BinaryOperator>();
            let right = this.addSubBinaryExpression();
            left = {
                pos: op.pos,
                type: 'binary-expression',
                op: op.value,
                left,
                right,
            };
        }
        return left;
    }

    relationalBinaryExpression(): a.Expression {
        let left = this.shiftBinaryExpression();
        while (this.match(['<', '<=', '>', '>='])) {
            let op = this.advance<BinaryOperator>();
            let right = this.shiftBinaryExpression();
            left = {
                pos: op.pos,
                type: 'binary-expression',
                op: op.value,
                left,
                right,
            };
        }
        return left;
    }

    equalityBinaryExpression(): a.Expression {
        let left = this.relationalBinaryExpression();
        while (this.match(['==', '!=', '~=', '~!='])) {
            let op = this.advance<BinaryOperator>();
            let right = this.relationalBinaryExpression();
            left = {
                pos: op.pos,
                type: 'binary-expression',
                op: op.value,
                left,
                right,
            };
        }
        return left;
    }

    bitwiseANDBinaryExpression(): a.Expression {
        let left = this.equalityBinaryExpression();
        while (this.match('&')) {
            let op = this.advance<BinaryOperator>();
            let right = this.equalityBinaryExpression();
            left = {
                pos: op.pos,
                type: 'binary-expression',
                op: op.value,
                left,
                right,
            };
        }
        return left;
    }

    bitwiseXORBinaryExpression(): a.Expression {
        let left = this.bitwiseANDBinaryExpression();
        while (this.match('^')) {
            let op = this.advance<BinaryOperator>();
            let right = this.bitwiseANDBinaryExpression();
            left = {
                pos: op.pos,
                type: 'binary-expression',
                op: op.value,
                left,
                right,
            };
        }
        return left;
    }

    bitwiseORBinaryExpression(): a.Expression {
        let left = this.bitwiseXORBinaryExpression();
        while (this.match('|')) {
            let op = this.advance<BinaryOperator>();
            let right = this.bitwiseXORBinaryExpression();
            left = {
                pos: op.pos,
                type: 'binary-expression',
                op: op.value,
                left,
                right,
            };
        }
        return left;
    }

    logicalANDBinaryExpression(): a.Expression {
        let left = this.bitwiseORBinaryExpression();
        while (this.match('&&')) {
            let op = this.advance<BinaryOperator>();
            let right = this.bitwiseORBinaryExpression();
            left = {
                pos: op.pos,
                type: 'binary-expression',
                op: op.value,
                left,
                right,
            };
        }
        return left;
    }

    logicalXORBinaryExpression(): a.Expression {
        let left = this.logicalANDBinaryExpression();
        while (this.match('^^')) {
            let op = this.advance<BinaryOperator>();
            let right = this.logicalANDBinaryExpression();
            left = {
                pos: op.pos,
                type: 'binary-expression',
                op: op.value,
                left,
                right,
            };
        }
        return left;
    }

    logicalORBinaryExpression(): a.Expression {
        let left = this.logicalXORBinaryExpression();
        while (this.match('||')) {
            let op = this.advance<BinaryOperator>();
            let right = this.logicalXORBinaryExpression();
            left = {
                pos: op.pos,
                type: 'binary-expression',
                op: op.value,
                left,
                right,
            };
        }
        return left;
    }

    conditionalExpression(): a.Expression {
        let condition = this.logicalORBinaryExpression();
        if (!this.match('?')) {
            return condition;
        }
        let op = this.advance();
        let ifTrue = this.expression();
        this.eat(':');
        let ifFalse = this.expression();
        return {
            pos: op.pos,
            type: 'conditional-expression',
            condition,
            ifTrue,
            ifFalse,
        }
    }

    expression(): a.Expression {
        let left = this.conditionalExpression();
        if (!this.match(['=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>='])) {
            return left;
        }
        let op = this.advance<BinaryOperator>();
        let right = this.expression();
        return {
            pos: op.pos,
            type: 'binary-expression',
            op: op.value,
            left,
            right,
        };
    }

}
