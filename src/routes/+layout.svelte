<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { authState } from '$lib/auth.svelte';
  import './layout.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Toast from '$lib/components/Toast.svelte';

  let { children } = $props();

  onMount(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      authState.user = session?.user ?? null;
      authState.loading = false;
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      authState.user = session?.user ?? null;
      authState.loading = false;
    });

    return () => subscription.unsubscribe();
  });
</script>

<svelte:head>
  <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
</svelte:head>

<div class="font-sans text-gray-900 bg-cover bg-center bg-fixed bg-no-repeat min-h-screen flex flex-col" style="background-image: url('/assets/building-bg.jpeg');">
  <Navbar />
  <main class="flex-1 flex flex-col">
    {@render children()}
  </main>
  <Footer />
  <Toast />
</div>
