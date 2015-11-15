/// <reference path="../node/node.d.ts" />

declare module "resolve" {
    type Callback<T> = (err: any, res: T) => void;
    
    /**
     * Asynchronously resolve the module path string id into  cb(err, res [, pkg]),
     * where pkg (if defined) is the data from package.json.
     */
    function resolve(id: string, opts: resolve.ResolveOptions, callback: (err: any, res: string, pkg?: any) => void): void;

    namespace resolve {
        interface ResolveOptions {
            /** directory to begin resolving from */
            basedir?: string;
            /** package.json  data applicable to the module being loaded */
            package?: any;
            /** array of file extensions to search in order */
            extensions?: string[];
            /** how to read files asynchronously */
            readFile?: (file: string, callback: Callback<any>) => void;
            /** function to asynchronously test whether a file exists */
            isFile?: (file: string, callback: Callback<boolean>) => void;
            /** transform the parsed package.json contents before looking at the "main" field */
            packageFilter?: (pkg: any, pkgfile: string) => any;
            /**
             * transform a path within a package
             * @param pkg - package data
             * @param path - the path being resolved
             * @param relativePath - the path relative from the package.json location
             * @returns a relative path that will be joined from the package.json location
             */
            pathFilter?: (pkg: any, path: string, relativePath: string) => string;
            /**
             * require.paths array to use if nothing is found on the normal node_modules
             * recursive walk (probably don't use this)
             */
            paths?: string[];
            /**
             * directory (or directories) in which to recursively look for modules.
             * default:  "node_modules"
             */
            moduleDirectory?: string;
        }

        interface ResolveSyncOptions {
            /** directory to begin resolving from */
            basedir?: string;
            /** package.json  data applicable to the module being loaded */
            extensions?: string[];
            /** how to read files synchronously */
            readFile?: (file: string) => any;
            /** function to synchronously test whether a file exists */
            isFile?: (file: string) => boolean;
            /** transform the parsed package.json contents before looking at the "main" field */
            packageFilter?: (pkg: any, pkgfile: string) => any;
            /**
             * require.paths array to use if nothing is found on the normal node_modules
             * recursive walk (probably don't use this)
             */
            paths?: string[];
            /**
             * directory (or directories) in which to recursively look for modules.
             * default:  "node_modules"
             */
            moduleDirectory?: string;
        }

        /**
         * Synchronously resolve the module path string id, returning the result
         * and throwing an error when id can't be resolved.
         */
        function sync(id: string, opts: ResolveSyncOptions): string;
        
        /**
         * Return whether a package is in core.
         */
        function isCore(pkg: string): boolean;
    }

    export = resolve;
}