<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { showToast } from '$lib/components/Toast.svelte';
  import { base } from '$app/paths';

  let email = $state('');
  let isSubmitting = $state(false);

  async function handleForgot(e: Event) {
    if (!email) {
      showToast('Please enter your email address.', 'error');
      return;
    }

    isSubmitting = true;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + base + '/reset-password',
      });

      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast('Password reset link sent! Check your email inbox.', 'success');
      }
    } catch (err) {
      showToast('An unexpected error occurred. Please try again.', 'error');
      console.error('Forgot password error:', err);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Forgot Password | USD AI Research</title>
</svelte:head>

<div class="py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center flex-1">
  <main class="w-full max-w-md bg-white/70 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10 mb-6">
    <div class="text-center mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Forgot Password</h1>
      <p class="text-sm font-medium text-gray-600 mt-2">Retrieve your password hint or contact an admin</p>
    </div>

    <form class="space-y-6" onsubmit={handleForgot}>
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
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        class="w-full py-3 px-4 bg-gradient-to-r from-red-800 to-gray-900 text-white font-medium rounded-xl hover:from-red-700 hover:to-gray-800 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Sending...' : 'Get Password Hint'}
      </button>

      <div class="flex flex-col items-center gap-3 pt-2">
        <a href="{base}/reset-password" class="text-[#C53030] hover:text-red-800 font-medium text-sm transition-colors">
          Still can't remember? Reset password
        </a>
        <a href="{base}/login" class="text-gray-500 hover:text-gray-800 font-medium text-sm transition-colors">
          Back to sign in
        </a>
      </div>
    </form>
  </main>

  <a href="{base}/blog" class="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium transition-colors bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-white/30">
    <i class="bx bx-chevron-left text-lg mr-1"></i> Back to Blog
  </a>
</div>
