/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ViteDevServer } from 'vite';
import { parse } from 'svelte/compiler';
import * as fs from 'fs';

// export plugin
export default function componentTracker() {
	// Create a map to store discovered components
	const discoveredComponents = new Map();

	return {
		name: 'svelte-component-tracker',

		// Runs when Vite is transforming the code
		// This is useful when finding components and their props
		transform(code: string, id: string) {
			// Only process .svelte files
			if (
				!id.endsWith('.svelte') ||
				id.includes('node_modules') ||
				id.includes('.svelte-kit/') ||
				id.includes('__svelte') ||
				id.includes('generated/')
			) {
				return null;
			}

			// here we try to find the props
			// wrapped in a try-catch block to prevent the plugin from crashing the build since not every svelte file can be parsed / has props
			try {
				// Have to read the file with fs since the code is transformed by vite/svelte before it reaches the plugin
				const originalCode = fs.readFileSync(id, 'utf-8');
				const ast = parse(originalCode);

				if (ast.instance) {
					/* 
                    https://astexplorer.net/ can show the structure of a svelte AST. 
                    Currently not aiming to support "legacy mode" so all we are looking for currently is the $props() function to find props
                    */

					ast.instance.content.body.forEach((statement: any) => {
						// Check every variable declaration for $props() function
						if (statement.type === 'VariableDeclaration') {
							try {
								// wrapped in a try-catch block to prevent crashes
								if (statement.declarations[0].init.callee.name === '$props') {
									// convert the AST obj to a JS obj and reduce information to needed data
									const props = convertASTObjectToJSON(statement.declarations[0].id);
								}
							} catch (e) {
								// This runs when the variable declared is not with the $props() function
								console.error('pass', id);
							}
						}
					});
				}
			} catch (e) {
				// Miscellaneous error handling
				console.error('error parsing ' + id, e);
			}

			// Get the name of the component from the file path
			const componentName = (id.split('/').pop() || '').replace('.svelte', '');

			// Filter out svelte files that are used by sveltekit like +page.svelte and etc
			if (
				componentName.indexOf('+') === -1 &&
				componentName !== 'root' &&
				componentName !== 'layout'
			) {
				discoveredComponents.set(id, {
					name: componentName,
					path: id
				});
			}

			// Don't modify the code
			return {
				code: code,
				map: null
			};
		},
		configureServer(server: ViteDevServer) {
			server.ws.on('svelteDevTools:getComponents', (data, client) => {
				client.send(
					'svelteDevTools:sendComponents',
					JSON.stringify(Array.from(discoveredComponents.values()))
				);
			});

			// server.ws.on('connection', () => {
			// 	server.ws.send('svelteDevTools:sendComponents', {
			// 		msg: JSON.stringify(Array.from(discoveredComponents.values())),
			// 		type: 'test'
			// 	});
			// });
		}
	};
}

function convertASTObjectToJSON(ast: any) {
	//TODO: Add recursion for multi level objs
	if (ast.type !== 'ObjectPattern') return null;

	const result: { [key: string]: any } = {};

	ast.properties.forEach((property: any) => {
		result[property.key.name as string] = property.value.right.value;
	});

	return result;
}
