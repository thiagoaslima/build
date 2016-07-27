// https://medium.com/@jonnysamps/angular-2-bundling-with-rollup-4738d0148a2c#.fgw0073ci

// rollup.config.vendor.js
import typescript from 'rollup-plugin-typescript';
import nodeResolve from 'rollup-plugin-node-resolve';

// Custom Rollup Plugin to resolve rxjs deps
// Thanks to https://github.com/IgorMinar/new-world-test/blob/master/es6-or-ts-bundle/rollup.config.js
class RollupNG2 {
	constructor(options) {
		this.options = options;
	}
	resolveId(id, _from) {
		console.log('resolve', id, _from)
		if (id.startsWith('rxjs/')) {
			debugger;
			return `${__dirname}/node_modules/rxjs-es/${id.replace('rxjs/', '')}.js`;
		}
	}
}

const rollupNG2 = config => new RollupNG2(config);

export default {
	entry: 'step2/main.ts',
	dest: 'dist/build.es2015.js',
	format: 'iife',
	sourceMap: true,
    
	plugins: [
		typescript(),
		rollupNG2(),
		nodeResolve({ jsnext: true, main: true })
	]
}