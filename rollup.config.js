import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete'

const production = !process.env.ROLLUP_WATCH;

function onwarn(warning, handler) {
  if (warning.message === 'A11y: Avoid using autofocus') return // use responsibly
  if (warning.message === 'A11y: avoid tabindex values above zero') return // remove if possible
  if (warning.message === 'A11y: <a> element should have an href attribute') return
	if (warning.message === 'A11y: A form label must be associated with a control') return
  handler(warning)
}

const preprocess = sveltePreprocess({
  preserve: ['systemjs-importmap'],
  postcss: {
    plugins: [
      require('postcss-nested'),
      require('tailwindcss')('./tailwind.config.js'),
    ],
  },
})

const buildDirectory = 'public/'

export default [{
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'es',
		dir: buildDirectory+'build',
		name: 'app',
	},
	plugins: [
		del({ targets: buildDirectory+'build' }),
    svelte({ preprocess, customElement: true, include: /\.wc\.svelte$/ }),
		svelte({
      customElement: false,
      exclude: /\.wc\.svelte$/,
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write(buildDirectory+'/build/bundle.css');
			},
			preprocess,
		}),
		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production
		}),
		typescript({ sourceMap: !production }),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload(buildDirectory),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
}, 
{
	input: 'src/preview.ts',
	output: {
		// format: 'iife',
		// file: buildDirectory+'preview/bundle.js',
		sourcemap: true,
		name: 'preview',
		format: 'es',
		dir: buildDirectory+'preview',
	},
	plugins: [
		del({ targets: buildDirectory+'/preview' }),
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write(buildDirectory+'/build/bundle.css');
			},
			preprocess,
		}),
		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		typescript({ sourceMap: !production }),
		production && terser()
	],
	watch: {
		clearScreen: false
	}
}];