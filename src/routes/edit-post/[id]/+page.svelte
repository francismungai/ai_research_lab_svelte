<script lang="ts">
  import { page } from "$app/state";
  import BlogEditor from "$lib/components/BlogEditor.svelte";
</script>

<svelte:head>
  <title>Edit Post | USD AI Research</title>
</svelte:head>

<!-- We pass the dynamic ID param natively mapped via SvelteKit -->
<BlogEditor postId={page.params.id} />
