<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<aside>
	<img src="/assets/logo_vroger.svg" alt="Logo de Virgil Roger" width="100" />
	<nav>
		<a href="/home">Home</a>
		<a href="/bio">Bio</a>
	</nav>
</aside>

<section>
	{@render children()}
</section>
