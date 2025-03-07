<script lang="ts">
	import { server_loads } from './../../.svelte-kit/generated/client/app.js';
	import { onMount, type Snippet } from 'svelte';

	const speed = 100;
	let isOpen = $state(false);

	let verified = $state(true);

	let components = $state([]);

	let currentPage = $state(0);

	let pages = [
		{ name: 'Home', snippet: homePage, icon: homeIcon },
		{ name: 'Routes', snippet: routesPage, icon: routesIcon },
		{ name: 'Components', snippet: componentsPage, icon: componentsIcon },
		{ name: 'Extensions', snippet: extensionsPage, icon: extensionsIcon },
		{ name: 'Settings', snippet: settingsPage, icon: settingsIcon }
	];

	let input: HTMLInputElement;

	function openMain() {
		isOpen = !isOpen;
		if (!verified && import.meta.hot && isOpen) {
			import.meta.hot.send('svelteDevTools:requestNewCode', window.navigator.userAgent);
		}
	}

	function verify() {
		if (import.meta.hot) {
			import.meta.hot?.send('svelteDevTools:authenticate', { attempt: input.value });
		}
	}

	function getActiveComponents() {
		if (import.meta.hot) {
			import.meta.hot.send('svelteDevTools:getComponents');
			import.meta.hot.on('svelteDevTools:sendComponents', (data) => {
				components = JSON.parse(data);
			});
		}
	}

	function checkForAuth() {
		if (import.meta.hot) {
			import.meta.hot.on('svelteDevTools:authenticated', (data) => {
				console.log(data);
				data ? (verified = true) : (verified = false);
			});
		}
	}

	onMount(() => {
		console.log(
			`%cSvelte DevTools%c Press Shift + ${false ? 'Option' : 'Alt'} + D to open DevTools`,
			'color: black; border-radius: 3px; padding: 2px 5px 1px 5px; background: #ee3d02;'
		);

		getActiveComponents();
		checkForAuth();
	});

	function openPage(e: MouseEvent, index: number) {
		console.log('Opening page', index);
	}
</script>

<div class="container">
	<div class="devtool-mini">
		<button onclick={openMain}>
			{@render svelteLogo()}
		</button>
		<p>{speed}ms</p>
	</div>
	<div class="devtool-main-window" class:isOpen={!isOpen}>
		<div class="devtool-content">
			{#if !verified}
				{@render codeConformation()}
			{:else}
				<div class="devtool-main-content">
					{@render nav()}
					<div class="devtool-content">
						{#each pages as page, index}
							{#if page.snippet && currentPage === index}
								{@render page.snippet()}
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Pages for the devtool -->
{#snippet codeConformation()}
	<div class="devtool-code-conformation">
		<div>
			<h2>Before we get started</h2>
			<p>
				Attackers can potentially affect your project or system through svelte devtools to ensure
				safety enter the code we have sent to your console!
			</p>
		</div>
		<div>
			<input type="text" placeholder="Enter your code here" bind:this={input} />
			<button class="button" onclick={verify}>Confirm</button>
		</div>
	</div>
{/snippet}

{#snippet homePage()}
	<div>
		<div>
			<div class="">
				{@render svelteLogo()}
				<h2><span>Svelte</span> Devtools</h2>
			</div>
			<p>Version 0.0.0</p>
		</div>
		<div class="devtool-home-buttons">
			<a class="devtool-home-button" href="https://svelte.dev/docs/svelte/overview">
				{@render svelteLogo()}
			</a>
			<a class="devtool-home-button" href="https://svelte.dev/docs/svelte/overview">
				{@render svelteLogo()} <span>KIT</span>
			</a>
			<button class="devtool-home-button">
				<div>
					{@render componentsIcon()}
					<p>Components</p>
				</div>
			</button>
			<button class="devtool-home-button">
				<div>
					{@render routesIcon()}
					<p>Routes</p>
				</div>
			</button>
		</div>
	</div>
{/snippet}

{#snippet routesPage()}
	<div>
		<h2>Routes</h2>
	</div>
{/snippet}

{#snippet extensionsPage()}
	<div>
		<h2>Routes</h2>
	</div>
{/snippet}

{#snippet componentsPage()}
	<div>
		<h2>Routes</h2>
	</div>
{/snippet}

{#snippet settingsPage()}
	<div>
		<h2>Routes</h2>
	</div>
{/snippet}

<!-- Local components -->
{#snippet nav()}
	<nav>
		{@render svelteLogo()}
		<ul>
			{#each pages as page, index}
				{#if page.icon}
					{@render navItem(page.icon, page.name, index)}
				{/if}
			{/each}
		</ul>
	</nav>
{/snippet}

{#snippet navItem(icon: Snippet, text: string, menuIndex: number)}
	<li class="devtool-nav-item">
		<button onclick={(e) => openPage(e, menuIndex)}>
			{@render icon()}
			{text}
		</button>
	</li>
{/snippet}

<!-- Icons -->
{#snippet svelteLogo()}
	<svg
		version="1.1"
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		x="0px"
		y="0px"
		viewBox="0 0 93.2 112"
		style="enable-background:new 0 0 93.2 112;"
		xml:space="preserve"
		class="devtool-logo"
		fill="currentColor"
		class:logoActive={isOpen}
	>
		<path
			d="M87.3,14.8L87.3,14.8C76.9-0.1,56.3-4.5,41.5,5L15.4,21.6c-7.1,4.5-12,11.8-13.5,20c-1.2,6.9-0.2,14,3.1,20.2
        c-2.2,3.4-3.8,7.2-4.5,11.2C-1,81.5,1,90.2,5.9,97.2c10.4,14.9,30.9,19.3,45.8,9.8l26.1-16.6c7.1-4.5,12-11.8,13.5-20
        c1.2-6.9,0.2-14-3.1-20.2c2.2-3.4,3.8-7.2,4.5-11.2C94.2,30.5,92.2,21.8,87.3,14.8z M79.8,36.2c-0.2,0.8-0.4,1.6-0.6,2.4l-0.5,1.5
        l-1.3-1c-3.1-2.3-6.5-4-10.2-5.1l-1-0.3l0.1-1c0.1-1.4-0.3-2.7-1.1-3.9c-1.5-2.2-4.2-3.1-6.7-2.5c-0.6,0.2-1.1,0.4-1.6,0.7
        L30.8,43.7c-1.3,0.8-2.2,2.1-2.4,3.6c-0.3,1.5,0.1,3.1,1,4.4c1.5,2.2,4.2,3.1,6.7,2.5c0.6-0.2,1.1-0.4,1.6-0.7l10-6.3
        c1.6-1,3.4-1.8,5.3-2.3c8.4-2.2,17.3,1.1,22.2,8.2c3,4.2,4.2,9.4,3.3,14.5c-0.9,5-3.8,9.4-8.1,12.1L44.2,96.3
        c-1.6,1-3.4,1.8-5.3,2.3h0c-8.4,2.2-17.3-1.1-22.2-8.2c-3-4.2-4.2-9.4-3.3-14.5c0.2-0.8,0.4-1.6,0.6-2.4l0.5-1.5l1.3,1
        c3.1,2.3,6.5,4,10.2,5.1l1,0.3l-0.1,1c-0.1,1.4,0.3,2.8,1.1,3.9c1.5,2.2,4.2,3.1,6.7,2.5c0.6-0.2,1.1-0.4,1.6-0.7l26.1-16.6
        c1.3-0.8,2.2-2.1,2.5-3.6c0.3-1.5-0.1-3.1-1-4.4c-1.5-2.2-4.2-3.1-6.7-2.5c-0.6,0.2-1.1,0.4-1.6,0.7l-10,6.3c-1.6,1-3.4,1.8-5.3,2.3
        C31.9,69.4,23,66.1,18,58.9c-3-4.2-4.2-9.4-3.3-14.5c0.9-5,3.8-9.4,8.1-12.1L49,15.7c1.6-1,3.4-1.8,5.3-2.3
        c8.4-2.2,17.3,1.1,22.2,8.2C79.5,25.9,80.7,31.1,79.8,36.2z"
		/>
	</svg>
{/snippet}

{#snippet homeIcon()}
	<svg width="22" height="22" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M11 17.4164V10.7497C11 10.5287 10.9122 10.3168 10.7559 10.1605C10.5996 10.0042 10.3877 9.9164 10.1667 9.9164H6.83333C6.61232 9.9164 6.40036 10.0042 6.24408 10.1605C6.0878 10.3168 6 10.5287 6 10.7497V17.4164M1 8.24973C0.999942 8.00729 1.05278 7.76775 1.15482 7.54783C1.25687 7.3279 1.40566 7.13289 1.59083 6.9764L7.42417 1.97723C7.72499 1.72299 8.10613 1.5835 8.5 1.5835C8.89387 1.5835 9.27501 1.72299 9.57583 1.97723L15.4092 6.9764C15.5943 7.13289 15.7431 7.3279 15.8452 7.54783C15.9472 7.76775 16.0001 8.00729 16 8.24973V15.7497C16 16.1918 15.8244 16.6157 15.5118 16.9282C15.1993 17.2408 14.7754 17.4164 14.3333 17.4164H2.66667C2.22464 17.4164 1.80072 17.2408 1.48816 16.9282C1.17559 16.6157 1 16.1918 1 15.7497V8.24973Z"
			stroke="#5E6576"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet routesIcon()}
	<svg width="22" height="22" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M11.8333 1.58337H16M16 1.58337V5.75004M16 1.58337L11 6.58337M5.16667 1.58337H1M1 1.58337V5.75004M1 1.58337L7.52333 8.10671C7.83728 8.42051 8.0854 8.79386 8.25311 9.20485C8.42082 9.61583 8.50476 10.0562 8.5 10.5V17.4167"
			stroke="#5E6576"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet componentsIcon()}
	<svg width="22" height="22" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M6.83333 16V5.16667C6.83333 4.94565 6.74554 4.73369 6.58926 4.57741C6.43298 4.42113 6.22101 4.33333 6 4.33333H1.83333C1.61232 4.33333 1.40036 4.42113 1.24408 4.57741C1.0878 4.73369 1 4.94565 1 5.16667V15.1667C1 15.3877 1.0878 15.5996 1.24408 15.7559C1.40036 15.9122 1.61232 16 1.83333 16H11.8333C12.0543 16 12.2663 15.9122 12.4226 15.7559C12.5789 15.5996 12.6667 15.3877 12.6667 15.1667V11C12.6667 10.779 12.5789 10.567 12.4226 10.4107C12.2663 10.2545 12.0543 10.1667 11.8333 10.1667H1M11 1H15.1667C15.6269 1 16 1.3731 16 1.83333V6C16 6.46024 15.6269 6.83333 15.1667 6.83333H11C10.5398 6.83333 10.1667 6.46024 10.1667 6V1.83333C10.1667 1.3731 10.5398 1 11 1Z"
			stroke="#5E6576"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet extensionsIcon()}
	<svg width="22" height="22" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M12.159 2.99174C12.2638 3.0966 12.3946 3.17162 12.538 3.20907C12.6814 3.24652 12.8322 3.24505 12.9749 3.2048C13.1175 3.16456 13.2469 3.08699 13.3495 2.98011C13.4522 2.87322 13.5245 2.74089 13.559 2.59674C13.6455 2.23666 13.8265 1.90614 14.0832 1.63922C14.3399 1.37231 14.6631 1.17864 15.0195 1.07818C15.376 0.977709 15.7528 0.974069 16.1111 1.06763C16.4694 1.16119 16.7963 1.34858 17.0581 1.61048C17.3199 1.87239 17.5072 2.19935 17.6007 2.5577C17.6941 2.91605 17.6903 3.29282 17.5897 3.64923C17.4892 4.00564 17.2954 4.3288 17.0284 4.58542C16.7614 4.84204 16.4308 5.02286 16.0707 5.10924C15.9266 5.14374 15.7942 5.21606 15.6873 5.31874C15.5804 5.42142 15.5029 5.55075 15.4626 5.6934C15.4224 5.83605 15.4209 5.98685 15.4584 6.13026C15.4958 6.27367 15.5708 6.40449 15.6757 6.50924L17.0782 7.91091C17.265 8.09771 17.4132 8.31948 17.5143 8.56355C17.6154 8.80762 17.6674 9.06922 17.6674 9.33341C17.6674 9.59759 17.6154 9.85919 17.5143 10.1033C17.4132 10.3473 17.265 10.5691 17.0782 10.7559L15.6757 12.1584C15.5709 12.2633 15.4401 12.3383 15.2967 12.3757C15.1533 12.4132 15.0025 12.4117 14.8599 12.3715C14.7172 12.3312 14.5879 12.2537 14.4852 12.1468C14.3825 12.0399 14.3102 11.9076 14.2757 11.7634C14.1892 11.4033 14.0083 11.0728 13.7516 10.8059C13.4949 10.539 13.1716 10.3453 12.8152 10.2448C12.4587 10.1444 12.082 10.1407 11.7237 10.2343C11.3653 10.3279 11.0384 10.5152 10.7766 10.7772C10.5148 11.0391 10.3275 11.366 10.2341 11.7244C10.1406 12.0827 10.1444 12.4595 10.245 12.8159C10.3456 13.1723 10.5393 13.4955 10.8063 13.7521C11.0733 14.0087 11.4039 14.1895 11.764 14.2759C11.9082 14.3104 12.0405 14.3827 12.1474 14.4854C12.2543 14.5881 12.3319 14.7174 12.3721 14.8601C12.4123 15.0027 12.4138 15.1535 12.3764 15.2969C12.3389 15.4403 12.2639 15.5712 12.159 15.6759L10.7565 17.0776C10.5697 17.2644 10.348 17.4126 10.1039 17.5137C9.85982 17.6148 9.59822 17.6668 9.33403 17.6668C9.06985 17.6668 8.80825 17.6148 8.56418 17.5137C8.3201 17.4126 8.09834 17.2644 7.91153 17.0776L6.50903 15.6751C6.40428 15.5702 6.27346 15.4952 6.13005 15.4577C5.98664 15.4203 5.83584 15.4218 5.6932 15.462C5.55055 15.5023 5.42122 15.5798 5.31853 15.6867C5.21585 15.7936 5.14353 15.9259 5.10903 16.0701C5.02253 16.4302 4.84161 16.7607 4.58489 17.0276C4.32818 17.2945 4.00496 17.4882 3.64852 17.5886C3.29208 17.6891 2.9153 17.6927 2.55699 17.5992C2.19867 17.5056 1.87177 17.3182 1.60995 17.0563C1.34813 16.7944 1.16086 16.4675 1.06741 16.1091C0.973968 15.7508 0.977733 15.374 1.07832 15.0176C1.1789 14.6612 1.37267 14.338 1.63967 14.0814C1.90667 13.8248 2.23725 13.644 2.59737 13.5576C2.74151 13.5231 2.87385 13.4508 2.98073 13.3481C3.08762 13.2454 3.16518 13.1161 3.20543 12.9734C3.24568 12.8308 3.24715 12.68 3.2097 12.5366C3.17225 12.3931 3.09722 12.2623 2.99237 12.1576L1.58987 10.7559C1.40306 10.5691 1.25487 10.3473 1.15377 10.1033C1.05266 9.85919 1.00063 9.59759 1.00063 9.33341C1.00063 9.06922 1.05266 8.80762 1.15377 8.56355C1.25487 8.31948 1.40306 8.09771 1.58987 7.91091L2.99237 6.50841C3.09712 6.40355 3.22794 6.32853 3.37135 6.29107C3.51476 6.25362 3.66556 6.2551 3.8082 6.29534C3.95085 6.33559 4.08018 6.41315 4.18287 6.52004C4.28555 6.62692 4.35787 6.75926 4.39237 6.90341C4.47887 7.26349 4.65979 7.59401 4.91651 7.86093C5.17322 8.12784 5.49644 8.3215 5.85288 8.42197C6.20932 8.52244 6.5861 8.52608 6.94442 8.43252C7.30273 8.33895 7.62963 8.15157 7.89145 7.88966C8.15327 7.62776 8.34054 7.30079 8.43399 6.94245C8.52743 6.5841 8.52367 6.20732 8.42308 5.85091C8.3225 5.49451 8.12873 5.17135 7.86173 4.91473C7.59473 4.65811 7.26415 4.47729 6.90403 4.39091C6.75989 4.35641 6.62755 4.28409 6.52067 4.18141C6.41378 4.07872 6.33622 3.94939 6.29597 3.80674C6.25572 3.6641 6.25425 3.5133 6.2917 3.36989C6.32915 3.22648 6.40418 3.09566 6.50903 2.99091L7.91153 1.58924C8.09834 1.40243 8.3201 1.25424 8.56418 1.15314C8.80825 1.05204 9.06985 1 9.33403 1C9.59822 1 9.85982 1.05204 10.1039 1.15314C10.348 1.25424 10.5697 1.40243 10.7565 1.58924L12.159 2.99174Z"
			stroke="#5E6576"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet settingsIcon()}
	<svg width="22" height="22" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M14.3333 3.33337H6.83333M9.33333 11.6667H1.83333M9.33333 11.6667C9.33333 13.0474 10.4526 14.1667 11.8333 14.1667C13.214 14.1667 14.3333 13.0474 14.3333 11.6667C14.3333 10.286 13.214 9.16671 11.8333 9.16671C10.4526 9.16671 9.33333 10.286 9.33333 11.6667ZM6 3.33337C6 4.71409 4.88071 5.83337 3.5 5.83337C2.11929 5.83337 1 4.71409 1 3.33337C1 1.95266 2.11929 0.833374 3.5 0.833374C4.88071 0.833374 6 1.95266 6 3.33337Z"
			stroke="#5E6576"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

<style>
	@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

	/* h1, */
	h2
	/* h3, */
	/* h4, */
	/* h5, */
	/* h6  */ {
		font-family: var(--font-heading);
	}
	.container {
		--accent: #ff3e00;
		--bg: #17191c;
		--text-muted: #d9d9d9;
		--border: #23272f;
		--fg: #1c1e22;
		--subtle: #5e6576;
		--font-heading: 'DM Serif Display', serif;
		--font-body: 'Fira Sans', sans-serif;
		position: fixed;
		bottom: 1vh;
		width: 100%;
		display: flex;
		justify-content: center;
		font-family: system-ui;
		font-family: var(--font-body);
	}
	.devtool-mini {
		display: flex;
		gap: 1rem;
		background-color: var(--bg);
		border-radius: 999px;
		padding-block: 0.5rem;
		padding-inline: 1rem;
		align-items: center;
		color: var(--text-muted);
		z-index: 9999;
	}
	.devtool-mini p {
		margin: 0;
	}

	.devtool-logo {
		width: 1.25rem;
		pointer-events: none;
		transition: fill 0.4s;
	}
	.logoActive {
		fill: var(--accent);
		transition: fill 0.4s;
	}

	.devtool-mini button {
		border: none;
		background-color: transparent;
		color: var(--text-muted);
		padding: 0;
		display: flex;
		height: min-content;
		cursor: pointer;
	}
	.isOpen {
		width: 0px !important;
		height: 0px !important;
		padding: 0 !important;
	}
	.isOpen .devtool-content {
		opacity: 0;
	}
	.devtool-content {
		width: 100%;
		height: 100%;
		opacity: 1;
		transition: opacity 0.4s;
	}
	.devtool-main-window {
		position: fixed;
		bottom: 1vh;
		width: 60%;
		height: 40vh;
		display: flex;
		justify-content: center;
		background-color: var(--bg);
		border-radius: 1rem;
		align-items: center;
		color: var(--text-muted);
		transition:
			width 0.4s,
			height 0.4s,
			padding 0.4s;
		z-index: 9998;
		box-shadow:
			0 4px 8px 0 rgba(0, 0, 0, 0.2),
			0 6px 20px 0 rgba(0, 0, 0, 0.19);
		/* overflow: hidden; */
	}
	.devtool-content {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.devtool-code-conformation {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		align-items: center;
		width: 70%;
	}
	.devtool-code-conformation:first-child {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		text-align: center;
		align-items: center;
	}
	.devtool-code-conformation:first-child h2 {
		margin: 0;
		font-size: 1.875rem;
		color: white;
	}
	.devtool-code-conformation input {
		background-color: transparent;
		border: var(--border) 2px solid;
		border-radius: 0.5rem;
		color: white;
		padding-inline: 1rem;
		padding-block: 0.5rem;
	}
	.button {
		background-color: var(--accent);
		color: white;
		border: none;
		padding-inline: 1rem;
		padding-block: 0.5rem;
		border-radius: 0.3rem;
		font-weight: 500;
		cursor: pointer;
	}
	.button:hover {
		background-color: #ff6d40;
	}

	/* Nav styles */
	.devtool-nav-item {
		list-style: none;
	}

	.devtool-nav-item button {
		all: unset;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}
	.devtool-nav-item:hover {
		color: var(--accent);
		/* opacity: ; */
		cursor: pointer;
	}
	.devtool-nav-item:hover svg path {
		stroke: var(--accent);
	}
	nav {
		display: flex;
		padding-inline: 0.75rem;
		width: calc(22px - 0.75rem / 2.5);
		overflow: hidden;
		transition: width, 0.4s;
		border-radius: 0.9rem 0 0 0.9rem;
		border-right: 1px solid var(--border);
		padding-block: 0.5rem;
		background-color: var(--fg);
	}
	nav:hover {
		width: 135px;
		transition: width, 0.4s;
	}
	ul {
		padding: 0;
		margin: 0;
		display: flex;
		gap: 1rem;
		flex-direction: column;
	}

	.devtool-main-content {
		display: flex;
		height: 100%;
		width: 100%;
	}
</style>
