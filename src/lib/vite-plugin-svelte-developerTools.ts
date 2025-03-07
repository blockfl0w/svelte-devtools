/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ViteDevServer } from 'vite';
import { parse } from 'svelte/compiler';
import * as fs from 'fs';
import crypto from 'crypto';

// Create a map to store discovered components
const discoveredComponents = new Map();

// The current code for authorization
let currentCode = generateAuthCode();

// export plugin
export default function componentTracker() {
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

			// Add the props to the components in the map
			discoveredComponents.forEach((item) => {
				const props = gatherStaticProps(item.path);

				discoveredComponents.set(item.path, {
					...item,
					props
				});
			});

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

			server.ws.on('svelteDevTools:requestNewCode', (data) => {
				currentCode = generateAuthCode();

				const os = detectOS(data);
				const browser = detectBrowser(data);

				// TODO: Make this output a lot easier to read and prettier to look at
				console.warn(
					`Someone using ${browser} on ${os} has requested read and write access through the svelte devtools`
				);
				console.warn(`If this person was you enter the code below in the browser.`);
				console.error('If it was not you, ignore this message and tell no one the code.');
				console.warn(`%cCode: ${currentCode}`, 'padding: 10px 0px 10px 0px');
			});

			server.ws.on('svelteDevTools:authenticate', (data, client) => {
				const success = authenticateUser(data.attempt);

				if (success) {
					client.send('svelteDevTools:authenticated', true);
				} else {
					client.send('svelteDevTools:authenticated', false);
				}
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

/**
 * Takes in a svelte component AST and returns its props and the values of the props at build time.
 *
 * @param componentPath - The path to the svelte component
 * @returns - An object with the props and their values
 */
function gatherStaticProps(componentPath: string) {
	let result = {};

	// In a try block to prevent crashes
	try {
		// Have to read the file with fs since the code is transformed by vite/svelte before it reaches the plugin
		const originalCode = fs.readFileSync(componentPath, 'utf-8');
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
							result = gatherStaticPropsFromASTIntoObj(statement.declarations[0].id);
						}
					} catch {
						// This runs when the variable declared is not with the $props() function
						// We can ignore this since its not actually an error
					}
				}
			});
		}
	} catch (e) {
		// Miscellaneous error handling
		console.error('error parsing ' + componentPath, e);
	}

	return result;
}

/**
 * Takes a segment of an AST from a svelte component that contains the $props() call. Then finds the props names and default values and returns then as a JS object.
 *
 * Please note that this function only copies objects with props on their first level. If there are nested objects they will be left undefined.
 * @param ast - an AST for a svelte component
 * @returns - a JS object with the props of the component
 */

function gatherStaticPropsFromASTIntoObj(ast: any) {
	// The result object
	const res: { [key: string]: any } = {};

	// Loop through the AST
	ast.properties.forEach((instance: any) => {
		// only run if the instance is a variable declaration
		if (instance.value.type !== 'AssignmentPattern') {
			return;
		}

		// If the right side of the assignment is a literal then assign the value to the left
		if (instance.value.right.type === 'Literal') {
			// add the object to the result object
			res[instance.value.left.name] = instance.value.right.value;

			// If the right side of the assignment is an object we have to loop through more of the ast to gather the data
		} else if (instance.value.right.type === 'ObjectExpression') {
			const obj: { [key: string]: any } = {};

			instance.value.right.properties.forEach((prop: any) => {
				obj[prop.key.name] = prop.value.value;
			});

			// add the object to the result object
			res[instance.value.left.name] = obj;
		}
	});

	return res;
}

// Generates a 24 character long random string with numbers and letters
function generateAuthCode() {
	return crypto.randomBytes(12).toString('hex');
}

/**
 * Detects the operating system of the user
 *
 * @param userAgent - The user agent of the user
 * @returns - The operating system of the user
 */
function detectOS(userAgent: string) {
	userAgent = userAgent.toLowerCase();
	return userAgent.indexOf('win') != -1
		? 'windows'
		: userAgent.indexOf('mac') != -1
			? 'mac'
			: userAgent.indexOf('linux') != -1
				? 'linux'
				: userAgent.indexOf('Android') != -1
					? 'android'
					: 'ios';
}

/**
 * Simple function to detect the browser of the user
 *
 * @param userAgent - the user agent of the user
 * @returns - the browser of the user
 */
function detectBrowser(userAgent: string) {
	userAgent = userAgent.toLowerCase();
	return userAgent.indexOf('firefox') != -1
		? 'firefox'
		: userAgent.indexOf('chrome') != -1
			? 'chrome'
			: userAgent.indexOf('safari') != -1
				? 'safari'
				: userAgent.indexOf('edge') != -1
					? 'edge'
					: userAgent.indexOf('opera') != -1
						? 'opera'
						: 'unknown';
}

/**
 * Used to allow
 * @param attempt - string attempt to long in with the current password
 */
function authenticateUser(attempt: string) {
	let success = false;

	if (attempt === currentCode) {
		success = true;

		// Add browser in to appData to not reauthenticate each time
	}

	return success;
}
