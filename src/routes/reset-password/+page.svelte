<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { showToast } from '$lib/components/Toast.svelte';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';

  let newPassword = $state('');
  let confirmNewPassword = $state('');
  let passwordHint = $state('');
  
  let showPassword = $state(false);
  let showConfirmPassword = $state(false);
  let isSubmitting = $state(false);

  onMount(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        showToast("You can now set your new password below.", "info");
      }
    });
  });

  async function handleReset(e: Event) {
    if (!newPassword || !confirmNewPassword) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    isSubmitting = true;

    try {
      const updatePayload: any = { password: newPassword };

      if (passwordHint) {
        updatePayload.data = { password_hint: passwordHint };
      }

      const { error } = await supabase.auth.updateUser(updatePayload);

      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast('Password updated successfully! Redirecting to sign in...', 'success');
        setTimeout(() => {
          goto(`${base}/login`);
        }, 2000);
      }
    } catch (err) {
      showToast('An unexpected error occurred. Please try again.', 'error');
      console.error('Reset password error:', err);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Reset Password | USD AI Research</title>
</svelte:head>

<div class="py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center flex-1">
  <main class="w-full max-w-md bg-white/70 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10 mb-6">
    <div class="text-center mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Reset Password</h1>
      <p class="text-sm font-medium text-gray-600 mt-2">Set a new password for your account</p>
    </div>

    <div class="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-3 rounded-xl text-sm font-medium mb-6">
      Enter your new password below.
    </div>

    <form class="space-y-5" onsubmit={handleReset}>
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1.5" for="new-password">New Password</label>
        <div class="relative">
          <input
            id="new-password"
            type={showPassword ? "text" : "password"}
            placeholder="Minimum 6 characters"
            required
            bind:value={newPassword}
            class="w-full pl-4 pr-10 py-3 bg-white/50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C53030] focus:border-transparent transition-colors"
          />
          <button
            type="button"
            onclick={() => showPassword = !showPassword}
            class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#C53030] transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-[#C53030]/50"
          >
            <i class="bx text-xl {showPassword ? 'bx-hide' : 'bx-show'}"></i>
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1.5" for="confirm-new-password">Confirm New Password</label>
        <div class="relative">
          <input
            id="confirm-new-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Re-enter new password"
            required
            bind:value={confirmNewPassword}
            class="w-full pl-4 pr-10 py-3 bg-white/50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C53030] focus:border-transparent transition-colors"
          />
          <button
            type="button"
            onclick={() => showConfirmPassword = !showConfirmPassword}
            class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#C53030] transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-[#C53030]/50"
          >
            <i class="bx text-xl {showConfirmPassword ? 'bx-hide' : 'bx-show'}"></i>
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1.5" for="password-hint">
          New Password Hint <span class="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          id="password-hint"
          type="text"
          placeholder="A hint to help you remember"
          bind:value={passwordHint}
          class="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C53030] focus:border-transparent transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        class="w-full py-3 px-4 mt-4 bg-gradient-to-r from-red-800 to-gray-900 text-white font-medium rounded-xl hover:from-red-700 hover:to-gray-800 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Resetting password...' : 'Reset Password'}
      </button>

      <div class="text-center pt-4">
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
