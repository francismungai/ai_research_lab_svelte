<script lang="ts">
  import { page } from "$app/state";
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { marked } from 'marked';
  import { base } from '$app/paths';

  let post = $state<any>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    try {
      const { data, error: err } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', page.params.slug)
        .single();
        
      if (err) throw err;
      post = data;
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  });

  function formatDate(isoString: string) {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  let htmlContent = $derived(post?.content ? marked.parse(post.content) : '');
</script>

<svelte:head>
  <title>{post?.title || 'Blog Post'} | USD AI Research</title>
</svelte:head>

<div class="py-4 px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
  <main class="max-w-7xl mx-auto px-6 py-10 md:px-12 bg-white/70 backdrop-blur-sm rounded-[2.5rem] shadow-2xl border border-white/20 min-h-[calc(100vh-8rem)] w-full">
    
    <a href="{base}/blog" class="inline-flex items-center text-gray-500 hover:text-[#C53030] font-medium mb-8 transition-colors">
      <i class="bx bx-left-arrow-alt text-xl mr-1"></i> Back to Blog
    </a>

    {#if loading}
      <div class="flex flex-col items-center justify-center py-16">
        <div class="w-8 h-8 border-4 border-gray-200 border-t-[#C53030] rounded-full animate-spin mb-4"></div>
      </div>
    {:else if error || !post}
      <div class="text-center py-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
        <p class="text-gray-600">The post you're looking for doesn't exist or an error occurred.</p>
      </div>
    {:else}
      <article>
        <header class="mb-10">
          <div class="flex items-center gap-2 mb-4 flex-wrap">
            {#each (post.tags || []) as tag}
              <span class="inline-block px-3 py-1 bg-red-50 text-[#C53030] text-xs font-bold rounded-full border border-red-100">
                {tag}
              </span>
            {/each}
          </div>
          
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>
          
          <p class="text-lg md:text-xl text-gray-600 font-medium mb-6">
            {post.excerpt}
          </p>
          
          <div class="flex items-center gap-4 text-sm font-medium text-gray-500 border-t border-gray-100 pt-6">
            <div class="flex items-center">
              <i class="bx bx-user-circle text-xl mr-2"></i>
              {post.author_name || 'Anonymous'}
            </div>
            <div class="flex items-center">
              <i class="bx bx-calendar text-lg mr-2"></i>
              {formatDate(post.published_at)}
            </div>
          </div>
        </header>

        {#if post.cover_image_url}
          <div class="w-full aspect-video rounded-2xl overflow-hidden mb-10 shadow-md">
            <img src={post.cover_image_url} alt={post.title} class="w-full h-full object-cover" />
          </div>
        {/if}

        <div class="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          {@html htmlContent}
        </div>
      </article>
    {/if}
  </main>
</div>

<style>
  :global(.prose h1) { font-size: 2rem; font-weight: 800; margin-bottom: 0.75rem; color: #111827; }
  :global(.prose h2) { font-size: 1.5rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #111827; }
  :global(.prose h3) { font-size: 1.25rem; font-weight: 700; margin-top: 1.25rem; margin-bottom: 0.5rem; color: #111827; }
  :global(.prose p) { margin-bottom: 1rem; line-height: 1.75; color: #374151; }
  :global(.prose ul), :global(.prose ol) { margin-bottom: 1rem; padding-left: 1.5rem; }
  :global(.prose ul) { list-style-type: disc; }
  :global(.prose ol) { list-style-type: decimal; }
  :global(.prose li) { margin-bottom: 0.25rem; line-height: 1.75; color: #374151; }
  :global(.prose code) { background: #f3f4f6; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.875rem; color: #c53030; }
  :global(.prose pre) { background: #1f2937; color: #e5e7eb; padding: 1rem; border-radius: 0.75rem; overflow-x: auto; margin-bottom: 1rem; }
  :global(.prose pre code) { background: none; padding: 0; color: inherit; font-size: 0.875rem; }
  :global(.prose blockquote) { border-left: 4px solid #c53030; padding-left: 1rem; margin-bottom: 1rem; color: #6b7280; font-style: italic; }
  :global(.prose a) { color: #c53030; text-decoration: underline; }
  :global(.prose img) { max-width: 100%; border-radius: 0.75rem; margin: 1rem 0; }
  :global(.prose hr) { border-color: #e5e7eb; margin: 1.5rem 0; }
  :global(.prose strong) { font-weight: 700; color: #111827; }
</style>
