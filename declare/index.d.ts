declare module "*.png" {
    const x: string;
    export = x;
}

declare module "*.json" {
    const x: any;
    export = x;
}

declare function require(path: string): any;

declare namespace require {
    function context(directory: string, useSubdirectories?: boolean, regExp?: RegExp): (path: string) => any;
}