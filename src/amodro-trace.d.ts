
declare module 'amodro-trace' {

    interface IFileResult {
        id: string;
        path: string;
        contents: string;
    }

    interface ITraceResult {
        errors: any[];
        traced: IFileResult[];
    }

    interface IOptions {}
    interface IAmdOptions {}
    function AmodroTrace(options: IOptions, amdOptions: IAmdOptions): Promise<ITraceResult>;

    export = AmodroTrace;
}
/*
declare module AmodroTrace {
    interface IOptions {};
    interface IAmdConfig {};
    export function AmodroTraceModule (options: IOptions, amdConfig: IAmdConfig): Promise<any>;
    export = AmodroTraceModule;
}*/
