<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { showToast } from '$lib/components/Toast.svelte';
  import { goto } from '$app/navigation';
  import { authState } from '$lib/auth.svelte';
  import { marked } from 'marked';

  let { postId = null }: { postId?: string | null } = $props();

  let title = $state('');
  let excerpt = $state('');
  let tags = $state('');
  let coverUrl = $state('');
  let content = $state('');
  
  let currentTab = $state('write'); // 'write', 'preview', 'split'
  let isSaving = $state(false);
  let isPublishing = $state(false);
  let isUnsaved = $state(false);

  // Derived HTML rendering using marked
  function getPreview(md: string) {
    if (!md.trim()) return '<p class="text-gray-400 italic">Start writing to see your preview here...</p>';
    try {
      return marked.parse(md);
    } catch (e) {
      return '<p class="text-red-500">Error parsing markdown</p>';
    }
  }

  let previewHtml = $derived(getPreview(content));

  onMount(async () => {
    // Basic Auth Check
    if (!authState.loading && !authState.user) {
      goto('/login');
    }

    if (postId) {
      try {
        const { data, error } = await supabase.from('blog_posts').select('*').eq('id', postId).single();
        if (data) {
          title = data.title || '';
          excerpt = data.excerpt || '';
          tags = (data.tags || []).join(', ');
          coverUrl = data.cover_image_url || '';
          content = data.content || '';
          isUnsaved = false;
        }
      } catch (err) {
        showToast('Error loading post', 'error');
      }
    }
  });

  function handleContentInput() {
    isUnsaved = true;
  }

  // Keyboard save shortcut
  function handleKeydown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      savePost('draft');
    }
  }

  function generateSlug(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").substring(0, 80);
  }

  async function savePost(status: 'draft' | 'published') {
    if (!title) {
      showToast("Please enter a post title.", "error");
      return;
    }
    if (status === 'published' && !content.trim()) {
      showToast("Please write some content before publishing.", "error");
      return;
    }

    const slug = generateSlug(title);
    if (!slug) {
      showToast("Title must contain valid characters.", "error");
      return;
    }

    if (status === 'published') isPublishing = true;
    else isSaving = true;

    const postData: any = {
      title,
      slug,
      content,
      excerpt,
      cover_image_url: coverUrl || null,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      status,
      author_id: authState.user?.id,
      author_name: authState.user?.email,
      updated_at: new Date().toISOString()
    };

    if (status === 'published') {
      postData.published_at = new Date().toISOString();
    }

    try {
      if (postId) {
        const { error } = await supabase.from('blog_posts').update(postData).eq('id', postId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('blog_posts').insert(postData).select().single();
        if (error) throw error;
        postId = data.id;
        window.history.replaceState({}, "", `/edit-post/${postId}`);
      }

      isUnsaved = false;
      showToast(status === 'published' ? 'Post published!' : 'Draft saved!', 'success');

      if (status === 'published') {
        setTimeout(() => goto('/blog'), 1000);
      }
    } catch (err: any) {
      if (err.code === '23505') {
        showToast("A post with this title/slug already exists.", "error");
      } else {
        showToast("Error saving post.", "error");
        console.error(err);
      }
    } finally {
      isSaving = false;
      isPublishing = false;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<style>
  /* Markdown preview styles using global modifiers for injected HTML */
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

<!-- Top bar -->
<header class="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
    <div class="flex items-center gap-4">
      <a href="/blog" class="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm">
        <i class="bx bx-arrow-back text-lg mr-1.5"></i> Back to Blog
      </a>
      <div class="hidden sm:block h-5 w-px bg-gray-200"></div>
      <span class="hidden sm:inline text-xs font-medium {isUnsaved ? 'text-amber-500' : 'text-green-500'}">
        <i class="bx bx-cloud text-sm mr-1"></i>
        {isUnsaved ? 'Unsaved changes' : 'Saved'}
      </span>
    </div>

    <div class="flex items-center gap-2">
      <button onclick={() => savePost('draft')} disabled={isSaving} class="px-3 py-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-200 cursor-pointer disabled:opacity-70">
        {isSaving ? 'Saving...' : 'Save Draft'}
      </button>
      <button onclick={() => savePost('published')} disabled={isPublishing} class="px-4 py-1.5 text-xs font-bold text-white bg-[#C53030] hover:bg-red-800 rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-70">
        {isPublishing ? 'Publishing...' : 'Publish'}
      </button>
    </div>
  </div>
</header>

<main class="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 bg-gray-50/50">
  <div class="mb-6 space-y-4">
    <input bind:value={title} oninput={() => isUnsaved = true} type="text" placeholder="Post title..." class="w-full text-3xl md:text-4xl font-extrabold text-gray-900 placeholder-gray-300 bg-transparent border-none outline-none focus:ring-0" />
    
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="flex-1">
        <input bind:value={excerpt} oninput={() => isUnsaved = true} type="text" placeholder="Write a brief excerpt or summary..." class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C53030]" />
      </div>
      <div class="sm:w-64">
        <input bind:value={tags} oninput={() => isUnsaved = true} type="text" placeholder="Tags (comma-separated)" class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C53030]" />
      </div>
    </div>
    
    <div>
      <input bind:value={coverUrl} oninput={() => isUnsaved = true} type="text" placeholder="Cover image URL (optional)" class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C53030]" />
    </div>
  </div>

  <div class="flex items-center gap-1 mb-3 border-b border-gray-200">
    <button onclick={() => currentTab = 'write'} class="px-4 py-2 text-sm font-bold border-b-2 transition-colors cursor-pointer {currentTab === 'write' ? 'border-[#C53030] text-[#C53030]' : 'border-transparent text-gray-500 hover:text-gray-800'}">
      <i class="bx bx-edit text-base mr-1"></i>Write
    </button>
    <button onclick={() => currentTab = 'preview'} class="px-4 py-2 text-sm font-bold border-b-2 transition-colors cursor-pointer {currentTab === 'preview' ? 'border-[#C53030] text-[#C53030]' : 'border-transparent text-gray-500 hover:text-gray-800'}">
      <i class="bx bx-show text-base mr-1"></i>Preview
    </button>
    <button onclick={() => currentTab = 'split'} class="px-4 py-2 text-sm font-bold border-b-2 transition-colors hidden md:inline-flex cursor-pointer {currentTab === 'split' ? 'border-[#C53030] text-[#C53030]' : 'border-transparent text-gray-500 hover:text-gray-800'}">
      <i class="bx bx-columns text-base mr-1"></i>Split
    </button>
  </div>

  <div class="flex-1 flex gap-4 min-h-[500px]">
    {#if currentTab === 'write' || currentTab === 'split'}
      <div class="flex-1 flex flex-col {currentTab === 'split' ? 'w-1/2' : ''}">
        <textarea bind:value={content} oninput={handleContentInput} placeholder="Write your post in markdown..." class="flex-1 w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-[#C53030] leading-relaxed font-mono"></textarea>
      </div>
    {/if}

    {#if currentTab === 'preview' || currentTab === 'split'}
      <div class="flex-1 bg-white border border-gray-200 rounded-xl px-6 py-5 overflow-y-auto {currentTab === 'split' ? 'w-1/2' : ''}">
        <div class="prose max-w-none">
          <!-- Render raw HTML utilizing @html operator -->
          {@html previewHtml}
        </div>
      </div>
    {/if}
  </div>
</main>
