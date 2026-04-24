<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { authState } from '$lib/auth.svelte';

  // State
  let posts = $state<any[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    try {
      const { data, error: err } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (err) throw err;
      posts = data || [];
    } catch (err: any) {
      console.error("Error fetching posts:", err);
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
</script>

<svelte:head>
  <title>Blog | USD AI Research</title>
</svelte:head>

<div class="py-4 px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
  <main class="max-w-7xl mx-auto px-6 py-10 md:px-12 bg-white/60 backdrop-blur-sm rounded-[2.5rem] shadow-2xl border border-white/20 min-h-[calc(100vh-8rem)] flex flex-col w-full">
    
    <section class="text-center mb-8">
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-[#C53030] tracking-tight mb-4">Blog</h1>
      <p class="text-base md:text-lg text-gray-700 max-w-3xl mx-auto font-medium">
        Insights, research highlights, and technical deep-dives from the USD AI Research Lab. 
        Explore our latest work in artificial intelligence, machine learning, and computer vision.
      </p>

      <!-- Write Post button (shown when logged in) -->
      {#if authState.user}
        <a
          href="/create-post"
          class="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-[#C53030] text-white font-bold text-sm rounded-xl hover:bg-red-800 transition-colors shadow-md"
        >
          <i class="bx bx-edit-alt text-lg"></i>
          Write a Post
        </a>
      {/if}
    </section>

    <!-- Handle States -->
    {#if loading}
      <div class="flex-1 flex flex-col items-center justify-center py-16">
        <div class="w-8 h-8 border-4 border-gray-200 border-t-[#C53030] rounded-full animate-spin mb-4"></div>
        <p class="text-gray-500 font-medium text-sm">Loading posts...</p>
      </div>
    {:else if error || posts.length === 0}
      <div class="flex-1 flex flex-col items-center justify-center py-16">
        <div class="w-20 h-20 mb-6 bg-gray-200/60 rounded-full flex items-center justify-center shadow-inner">
          <i class="bx bx-edit-alt text-4xl text-gray-500"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">No posts found</h3>
        <p class="text-gray-600 font-medium">Check back soon for new content!</p>
      </div>
    {:else}
      <!-- Posts grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 flex-1 w-full">
        {#each posts as post}
          <a href="/blog/{post.slug}" class="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#C53030] transition-all duration-300 flex flex-col">
            {#if post.cover_image_url}
              <div class="h-44 overflow-hidden">
                <img src={post.cover_image_url} alt={post.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            {:else}
              <div class="h-44 bg-linear-to-br from-red-50 to-gray-100 flex items-center justify-center">
                <i class="bx bx-file-blank text-5xl text-gray-300"></i>
              </div>
            {/if}

            <div class="p-5 flex flex-col flex-1">
              <div class="flex items-center gap-2 mb-3 flex-wrap">
                {#each (post.tags || []).slice(0, 3) as tag}
                  <span class="inline-block px-2 py-0.5 bg-red-50 text-[#C53030] text-[10px] font-bold rounded-full border border-red-100">
                    {tag}
                  </span>
                {/each}
              </div>
              <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#C53030] transition-colors line-clamp-2 leading-snug">
                {post.title}
              </h3>
              <p class="text-sm text-gray-600 font-medium mb-4 line-clamp-3 flex-1">
                {post.excerpt || ""}
              </p>
              <div class="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 mt-auto">
                <span class="font-bold">{post.author_name || "Unknown"}</span>
                <span class="font-medium">{formatDate(post.published_at)}</span>
              </div>
            </div>
          </a>
        {/each}
      </div>
    {/if}

    <section class="mt-auto pt-8 border-t border-gray-300/60 w-full">
      <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-4">About This Blog</h3>
      <p class="text-gray-700 mb-6 font-medium leading-relaxed">
        The USD AI Research Lab Blog features technical deep-dives into our research, explaining complex concepts in accessible terms. Our goal is to bridge the gap between academic research and practical understanding, sharing insights that benefit the broader AI community.
      </p>
      <div class="flex flex-wrap gap-4 md:gap-6">
        <a href="/publications" class="inline-flex items-center text-[#C53030] hover:text-red-800 font-bold transition-colors">
          View All Publications
          <i class="bx bx-right-arrow-alt text-lg ml-1"></i>
        </a>
        <a href="/people" class="inline-flex items-center text-[#C53030] hover:text-red-800 font-bold transition-colors">
          Meet Our Team
          <i class="bx bx-right-arrow-alt text-lg ml-1"></i>
        </a>
      </div>
    </section>
  </main>
</div>
