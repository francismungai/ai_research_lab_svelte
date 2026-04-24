<script lang="ts">
  import { page } from '$app/state';
  import { supabase } from '$lib/supabase';
  import { authState } from '$lib/auth.svelte';

  let isMobileMenuOpen = $state(false);
  
  let isLogged = $derived(!!authState.user);
  let userEmail = $derived(authState.user?.email ?? '');

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }
</script>

<nav class="bg-[#C53030] sticky top-0 z-50 shadow-md">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16 w-full">
      <div class="flex-1 flex justify-start items-center shrink-0">
        <a href="/">
          <img
            class="w-27.5 h-27.5 object-contain cursor-pointer transition-all duration-300 filter-[drop-shadow(0_0_1px_#fff)_drop-shadow(0_0_2px_#fff)_drop-shadow(0_0_3px_#fff)] hover:filter-[drop-shadow(0_0_1px_#fff)_drop-shadow(0_0_2px_#fff)_drop-shadow(0_0_4px_rgba(255,255,255,0.95))_drop-shadow(0_0_6px_rgba(220,240,255,0.8))]"
            src="/assets/logo-BHzomKBk.svg"
            alt="USD AI Research Logo"
          />
        </a>
      </div>

      <div class="hidden md:flex shrink-0 justify-center space-x-6">
        <a href="/people" class="text-white hover:text-gray-200 px-3 py-2 text-lg font-medium {page.url.pathname === '/people' ? 'bg-red-900 rounded-md shadow-inner' : ''}">People</a>
        <a href="/blog" class="text-white hover:text-gray-200 px-3 py-2 text-lg font-medium {page.url.pathname === '/blog' ? 'bg-red-900 rounded-md shadow-inner' : ''}">Blog</a>
        <a href="/publications" class="text-white hover:text-gray-200 px-3 py-2 text-lg font-medium {page.url.pathname === '/publications' ? 'bg-red-900 rounded-md shadow-inner' : ''}">Publications</a>
        <a href="/initiatives" class="text-white hover:text-gray-200 px-3 py-2 text-lg font-medium {page.url.pathname === '/initiatives' ? 'bg-red-900 rounded-md shadow-inner' : ''}">Initiatives</a>
        <a href="/opportunities" class="text-white hover:text-gray-200 px-3 py-2 text-lg font-medium {page.url.pathname === '/opportunities' ? 'bg-red-900 rounded-md shadow-inner' : ''}">Careers</a>
        <a href="/affiliates" class="text-white hover:text-gray-200 px-3 py-2 text-lg font-medium {page.url.pathname === '/affiliates' ? 'bg-red-900 rounded-md shadow-inner' : ''}">Affiliates</a>
        <a href="/contact" class="text-white hover:text-gray-200 px-3 py-2 text-lg font-medium {page.url.pathname === '/contact' ? 'bg-red-900 rounded-md shadow-inner' : ''}">Contact</a>
      </div>

      <div class="flex-1 flex justify-end items-center">
        <div class="hidden md:block">
          {#if isLogged}
            <div class="flex items-center gap-2">
              <span class="text-white/80 text-[11px] font-medium hidden lg:inline truncate max-w-[120px]" title={userEmail}>
                {userEmail}
              </span>
              <button onclick={handleLogout}
                class="bg-white text-[#C53030] px-3 py-1.5 rounded-md text-xs font-bold hover:bg-gray-100 transition shadow-sm cursor-pointer whitespace-nowrap">
                Log Out
              </button>
            </div>
          {:else}
            <a href="/login" class="bg-white text-[#C53030] px-5 py-2 rounded-md text-sm font-bold hover:bg-gray-100 transition shadow-sm">Log In</a>
          {/if}
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center">
          <button onclick={toggleMobileMenu} type="button" aria-label="Toggle mobile menu" class="text-white focus:outline-none">
            <i class="bx bx-menu text-3xl"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if isMobileMenuOpen}
  <div class="mobile-menu-container md:hidden bg-[#A52828] border-t border-red-400">
    <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
      <a href="/people" class="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-red-800 {page.url.pathname === '/people' ? 'bg-red-900 shadow-inner' : ''}">People</a>
      <a href="/blog" class="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-red-800 {page.url.pathname === '/blog' ? 'bg-red-900 shadow-inner' : ''}">Blog</a>
      <a href="/publications" class="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-red-800 {page.url.pathname === '/publications' ? 'bg-red-900 shadow-inner' : ''}">Publications</a>
      <a href="/initiatives" class="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-red-800 {page.url.pathname === '/initiatives' ? 'bg-red-900 shadow-inner' : ''}">Initiatives</a>
      <a href="/opportunities" class="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-red-800 {page.url.pathname === '/opportunities' ? 'bg-red-900 shadow-inner' : ''}">Careers</a>
      <a href="/affiliates" class="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-red-800 {page.url.pathname === '/affiliates' ? 'bg-red-900 shadow-inner' : ''}">Affiliates</a>
      <a href="/contact" class="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-red-800 {page.url.pathname === '/contact' ? 'bg-red-900 shadow-inner' : ''}">Contact</a>
      
      {#if isLogged}
        <div class="px-3 py-2 text-white/80 text-sm font-medium truncate" title={userEmail}>
          {userEmail}
        </div>
        <button onclick={handleLogout}
          class="text-white block w-full text-left px-3 py-2 rounded-md text-base font-bold bg-red-900 mt-1 cursor-pointer">
          Log Out
        </button>
      {:else}
        <a href="/login" class="text-white block px-3 py-2 rounded-md text-base font-bold bg-red-900 mt-2">Log In</a>
      {/if}
    </div>
  </div>
  {/if}
</nav>
