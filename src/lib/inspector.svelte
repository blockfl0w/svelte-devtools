<script>
	const speed = 100;
	let isOpen = false;

	let verified = false;

	function openMain() {
		isOpen = !isOpen;
	}

	function verify() {
		verified = true;
	}

	function openHome() {
		console.log('Home clicked');
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
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Pages for the devtool -->
{#snippet codeConformation()}
	<div class="devtool-code-conformation">
		<div>
			<h4>Before we get started</h4>
			<p>
				Attackers can potentially affect your project or system through svelte devtools to ensure
				safety enter the code we have sent to your console!
			</p>
		</div>
		<div>
			<input type="text" placeholder="Enter your code here" />
			<button class="button" onclick={verify}>Confirm</button>
		</div>
	</div>
{/snippet}

{#snippet nav()}
	<nav>
		<ul>
			{@render navItem(homeIcon, 'Home', openHome)}
		</ul>
	</nav>
{/snippet}

<!-- Local components -->
{#snippet navItem(icon, text, event)}
	<li class="devtool-nav-item">
		<button onclick={event}>
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
	<svg
		width="22"
		height="22"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		class="home-icon"
	>
		<path
			d="M15 13V21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0392 21 19.5305 21 19V10C21.0001 9.7091 20.9367 9.42165 20.8142 9.15775C20.6918 8.89384 20.5132 8.65983 20.291 8.47203L13.291 2.47303C12.93 2.16794 12.4726 2.00055 12 2.00055C11.5274 2.00055 11.07 2.16794 10.709 2.47303L3.709 8.47203C3.4868 8.65983 3.30824 8.89384 3.18579 9.15775C3.06333 9.42165 2.99993 9.7091 3 10V19C3 19.5305 3.21071 20.0392 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H9V13C9 12.7348 9.10536 12.4805 9.29289 12.2929C9.48043 12.1054 9.73478 12 10 12H14C14.2652 12 14.5196 12.1054 14.7071 12.2929C14.8946 12.4805 15 12.7348 15 13Z"
			fill="currentColor"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

<style>
	.container {
		--accent: #ff3e00;
		--bg: #000;
		--text-muted: #9c9c9c;
		position: fixed;
		bottom: 1vh;
		width: 100%;
		display: flex;
		justify-content: center;
		font-family: system-ui;
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
		width: 50%;
		height: 30vh;
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
		/* overflow: hidden; */
	}
	.devtool-content {
		display: flex;
		justify-content: center;
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
	.devtool-code-conformation:first-child h4 {
		margin: 0;
		font-size: 1.5rem;
		color: white;
	}
	.devtool-code-conformation input {
		background-color: transparent;
		border: var(--text-muted) 2px solid;
		border-radius: 0.5rem;
		color: white;
		padding-inline: 1rem;
		padding-block: 0.5rem;
	}
	.button {
		background-color: var(--accent);
		color: #000;
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
	nav {
		display: flex;
		padding-inline: 0.5rem;
		width: 22px;
		overflow: hidden;
		transition: width, 0.4s;
		border-radius: 0.9rem 0 0 0.9rem;
		border-right: 1px solid var(--text-muted);
		padding-block: 0.5rem;
	}
	nav:hover {
		width: 85px;
		transition: width, 0.4s;
	}
	ul {
		padding: 0;
		margin: 0;
	}

	.devtool-main-content {
		display: flex;
		height: 100%;
		width: 100%;
	}
</style>
