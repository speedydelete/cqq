
import {Position, HasPos, CQQError, EOF, ExpressionBinaryOperator, OverloadOperator, SYMBOLS, CQQSymbol, KEYWORDS, BasicKeyword} from './base.js';
import {Region, t, Type, Value, SymbolToken, IdentifierToken, KeywordToken, Token, STRING_TOKEN_NAMES, tokenToString, Scope, a} from './types.js';


type Matcher = 
    | EOF
    | Token['type']
    | BasicKeyword | 'intn' | 'uintn' | 'floatn'
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

    identifierExpression(): a.IdentifierExpression {
        let token = this.eat('identifier');
        let variable = this.scope.get(token.name);
        if (variable === undefined) {
            this.error(token, `Variable '${token.name}' is not defined`);
        }
        return {
            pos: token.pos,
            type: 'identifier-expression',
            exprType: variable.type,
            name: token.name,
        };
    }

    numberLiteralExpression(): a.NumberLiteralExpression {
        let token = this.eat('number-literal');
        return {
            pos: token.pos,
            type: 'number-literal-expression',
            exprType: t.numberLiteral,
            value: token.value,
        };
    }

    stringLiteralExpression(): a.StringLiteralExpression {
        let token = this.eat('string-literal');
        return {
            pos: token.pos,
            type: 'string-literal-expression',
            exprType: t.slice(t.char),
            value: token.value,
        };
    }

    readonly KEYWORD_LITERAL_VALUES: {[key: string]: Value} = {
        'never': {type: t.meta.never, value: 'todo: fill in'},
    };

    primaryExpression(expected: Type): a.Expression {
        if (this.match('identifier')) {
            return this.identifierExpression();
        } else if (this.match('number-literal')) {
            return this.numberLiteralExpression();
        } else if (this.match('string-literal')) {
            return this.stringLiteralExpression();
        } else if (this.match('(')) {
            this.advance();
            let out = this.expression(expected);
            this.eat(')');
            return out;
        } else if (this.match('keyword')) {
            let token = this.peek<'keyword'>();
            if (token.value in this.KEYWORD_LITERAL_VALUES) {
                this.advance();
                let value = this.KEYWORD_LITERAL_VALUES[token.value];
                return {
                    pos: token.pos,
                    type: 'keyword-literal-expression',
                    exprType: value.type,
                    value: value.value,
                }
            } else {
                this.error(undefined, `Invalid primary expression`);
            }
        } else {
            this.error(undefined, `Invalid primary expression`);
        }
    }

    getOperator(pos: HasPos, op: OverloadOperator, args: a.Expression[]): Type {
    }

    _startOperatorExpression(): a.Expression {
        if (this.match('+')) {
            
        }
    }

    _operatorExpression(left: a.Expression, minPrecedence: number): a.Expression {

    }

    operatorExpression(): a.Expression {
        let start = this._startOperatorExpression();
        return this._operatorExpression(start, 0);
    }

    expression(expected: Type): a.Expression {

    }

}
