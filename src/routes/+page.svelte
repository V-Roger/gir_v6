<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h1>Virgil Roger</h1>
<div>{@html JSON.stringify(data)}</div>