
function cliError(message: string): never {
    console.error(`Error: ${message}`);
    process.exit(1);
}


let argv = process.argv;
let i = 2;

export let args = new class {

    sourceFiles: string[] = [];
    outputPath: string = 'a.out';

    target: string = 'native';
};

const ARG_FUNCS: {[key: string]: string | (() => void)} = {

    '-o'(): void {
        args.outputPath = argv[++i];
    },

    '-target'(): void {
        args.target = argv[++i];
    },

};

const INLINE_PARAM_ARG_FUNCS: {[key: string]: string | ((value: string) => void)} = {

};

while (i < argv.length) {
    let arg = argv[i];
    if (arg.startsWith('-')) {
        if (arg in ARG_FUNCS) {
            let value = ARG_FUNCS[arg];
            while (typeof value === 'string') {
                value = ARG_FUNCS[value];
            }
            value();
        } else if (arg.slice(0, 2) in INLINE_PARAM_ARG_FUNCS) {
            let value = INLINE_PARAM_ARG_FUNCS[arg.slice(0, 2)];
            while (typeof value === 'string') {
                value = INLINE_PARAM_ARG_FUNCS[value];
            }
            value(arg.slice(2));
        } else {
            cliError(`Unknown argument: '${arg}'`);
        }
    } else {
        args.sourceFiles.push(arg);
    }
    i++;
}
