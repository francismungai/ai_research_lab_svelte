<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { showToast } from '$lib/components/Toast.svelte';
  import { goto } from '$app/navigation';

  let email = $state('');
  let password = $state('');
  let showPassword = $state(false);
  let isSubmitting = $state(false);

  async function handleLogin(e: Event) {
    if (!email || !password) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    isSubmitting = true;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast('Signed in successfully! Redirecting...', 'success');
        setTimeout(() => {
          goto('/blog');
        }, 1200);
      }
    } catch (err) {
      showToast('An unexpected error occurred. Please try again.', 'error');
      console.error('Login error:', err);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Login | USD AI Research</title>
</svelte:head>

<div class="py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center flex-1">
  <main class="w-full max-w-md bg-white/70 backdrop-blur-sm rounded-[2.5rem] shadow-2xl border border-white/20 p-8 md:p-10">
    <div class="text-center mb-8">
      <img src="/assets/logo-BHzomKBk.svg" alt="USD AI Logo" class="h-12 w-auto mx-auto mb-4" />
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Sign In</h1>
      <p class="text-sm font-medium text-gray-600 mt-2">Sign in with your USD email to access the research lab portal</p>
    </div>

    <form class="space-y-5" onsubmit={handleLogin}>
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1.5" for="email">USD Email Address</label>
        <input
          id="email"
          type="email"
          placeholder="your.name@usd.edu"
          required
          bind:value={email}
          class="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C53030] focus:border-transparent transition-colors"
        />
        <p class="mt-1.5 text-[11px] font-bold text-gray-500">Accepts @usd.edu or @coyotes.usd.edu emails</p>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1.5" for="password">Password</label>
        <div class="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            required
            bind:value={password}
            class="w-full pl-4 pr-12 py-3 bg-white/50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C53030] focus:border-transparent transition-colors"
          />
          <button
            type="button"
            onclick={() => showPassword = !showPassword}
            class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#C53030] transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-[#C53030]/50"
            title="Toggle password visibility"
          >
            <i class="bx text-xl {showPassword ? 'bx-hide' : 'bx-show'}"></i>
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        class="w-full py-3 px-4 bg-[#C53030] text-white font-bold rounded-xl hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>

      <div class="flex items-center justify-between text-sm pt-2">
        <a href="/signup" class="text-[#C53030] hover:text-red-800 font-bold transition-colors">Sign Up</a>
        <a href="/forgot-password" class="text-gray-500 hover:text-gray-800 font-bold transition-colors">Forgot password?</a>
      </div>
    </form>

    <div class="mt-8 p-5 bg-gray-50/80 border border-gray-200 rounded-xl shadow-inner">
      <h4 class="text-sm font-extrabold text-gray-900 mb-3 uppercase tracking-wider">Access Levels</h4>
      <div class="space-y-2.5 text-xs text-gray-700">
        <div class="flex items-center gap-3">
          <span class="w-2.5 h-2.5 bg-purple-500 rounded-full shrink-0"></span>
          <span><strong class="text-gray-900">Admin:</strong> Full control, manage all posts</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0"></span>
          <span><strong class="text-gray-900">Reviewer:</strong> Edit and publish all posts</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="w-2.5 h-2.5 bg-green-500 rounded-full shrink-0"></span>
          <span><strong class="text-gray-900">Author:</strong> Write and edit your own posts</span>
        </div>
      </div>
    </div>

    <div class="mt-8 text-center border-t border-gray-200 pt-6">
      <a href="/blog" class="inline-flex items-center text-gray-600 hover:text-[#C53030] font-bold transition-colors">
        <i class="bx bx-left-arrow-alt text-lg mr-1"></i> Back to Blog
      </a>
    </div>
  </main>
</div>
