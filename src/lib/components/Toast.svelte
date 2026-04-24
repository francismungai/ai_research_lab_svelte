<script lang="ts" module>
  // Simple global toast state manager using Svelte 5 runes
  export const toastState = $state({
    message: '',
    type: 'info' as 'info' | 'success' | 'error',
    visible: false
  });

  export function showToast(message: string, type: 'info' | 'success' | 'error' = 'info') {
    toastState.message = message;
    toastState.type = type;
    toastState.visible = true;

    setTimeout(() => {
      toastState.visible = false;
    }, 3500);
  }
</script>

{#if toastState.visible}
  <div class="fixed top-20 right-4 z-[9999] px-6 py-3 rounded-lg shadow-2xl transition-opacity animate-in fade-in duration-300 text-white font-medium
    {toastState.type === 'error' ? 'bg-red-600' : 
     toastState.type === 'success' ? 'bg-green-600' : 'bg-gray-800'}">
    {toastState.message}
  </div>
{/if}
