<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { showToast } from '$lib/components/Toast.svelte';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';

  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let passwordHint = $state('');
  
  let showPassword = $state(false);
  let showConfirmPassword = $state(false);
  let isSubmitting = $state(false);

  async function handleSignup(e: Event) {
    if (!email || !password || !confirmPassword) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    isSubmitting = true;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            password_hint: passwordHint || "",
          },
        },
      });

      if (error) {
        showToast(error.message, 'error');
      } else if (data?.user?.identities && data.user.identities.length === 0) {
        showToast('An account with this email already exists. Please sign in.', 'error');
      } else {
        showToast('Account created! Check your email to confirm your account.', 'success');
        setTimeout(() => {
          goto(`${base}/login`);
        }, 3000);
      }
    } catch (err) {
      showToast('An unexpected error occurred. Please try again.', 'error');
      console.error('Signup error:', err);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Create Password | USD AI Research</title>
</svelte:head>

<div class="py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center flex-1">
  <main class="w-full max-w-md bg-white/70 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10 mb-6">
    <div class="text-center mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Create Your Password</h1>
      <p class="text-sm font-medium text-gray-600 mt-2">Set up your account password and a hint to remember it</p>
    </div>

    <form class="space-y-5" onsubmit={handleSignup}>
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

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1.5" for="password">Create Password</label>
        <div class="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Minimum 6 characters"
            required
            bind:value={password}
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
        <label class="block text-sm font-bold text-gray-700 mb-1.5" for="confirm-password">Confirm Password</label>
        <div class="relative">
          <input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Re-enter your password"
            required
            bind:value={confirmPassword}
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
        <label class="block text-sm font-bold text-gray-700 mb-1.5" for="password-hint">Password Hint</label>
        <input
          id="password-hint"
          type="text"
          placeholder="A hint to help you remember (e.g., 'My pet name')"
          required
          bind:value={passwordHint}
          class="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C53030] focus:border-transparent transition-colors"
        />
        <p class="mt-1.5 text-[11px] font-bold text-gray-500">This hint will be shown if you forget your password.</p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        class="w-full py-3 px-4 mt-4 bg-gradient-to-r from-red-800 to-gray-900 text-white font-medium rounded-xl hover:from-red-700 hover:to-gray-800 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Creating account...' : 'Create Password & Sign In'}
      </button>

      <div class="text-center text-sm pt-4">
        <span class="text-gray-600 font-medium">Already have a password?</span>
        <a href="{base}/login" class="text-gray-800 hover:text-[#C53030] font-bold transition-colors ml-1">Sign in</a>
      </div>
    </form>
  </main>

  <a href="{base}/blog" class="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium transition-colors bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-white/30">
    <i class="bx bx-chevron-left text-lg mr-1"></i> Back to Blog
  </a>
</div>
