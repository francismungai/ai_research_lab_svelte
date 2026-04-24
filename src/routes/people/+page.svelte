<script lang="ts">
  let { data } = $props();

  let activeRole = $state("All");
  let activeLetter = $state("All");

  const roles = ["All", "Faculty", "Postdoc", "PhD Students", "Masters Students", "Undergraduate", "Alumni"];
  const alphabet = ["All", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

  const roleKeywords: Record<string, string[]> = {
    "Faculty": ["professor", "chair", "director", "faculty"],
    "Postdoc": ["postdoc", "post-doctoral"],
    "PhD Students": ["phd"],
    "Masters Students": ["master"],
    "Undergraduate": ["undergraduate", "bachelor", "bsc"],
    "Alumni": ["alumni", "graduate", "former"],
  };

  const people = data.people;

  let filteredPeople = $derived(people.filter((person: any) => {
    let cleanName = person.name.replace(/^(Prof\.|Dr\.)\s*/i, "").trim();
    let firstLetter = cleanName.charAt(0).toUpperCase();
    let roleText = person.role.toLowerCase();

    let matchesRole = activeRole === "All" ? true : (roleKeywords[activeRole] || []).some(k => roleText.includes(k));
    let matchesLetter = activeLetter === "All" ? true : firstLetter === activeLetter;

    return matchesRole && matchesLetter;
  }));
</script>

<svelte:head>
  <title>People | USD AI Research</title>
  <style>
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  </style>
</svelte:head>

<div class="py-4 px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
  <main class="max-w-7xl mx-auto w-full px-6 py-10 md:px-12 bg-white/70 backdrop-blur-sm rounded-[2.5rem] shadow-2xl border border-white/20 min-h-[calc(100vh-8rem)] flex flex-col">
    <div class="text-center mb-10">
      <h1 class="text-4xl lg:text-5xl font-bold text-[#C53030] tracking-tight mb-4">People</h1>
      <p class="text-gray-700 text-lg font-medium max-w-3xl mx-auto leading-relaxed">
        Meet the brilliant minds behind our AI research lab - faculty, students, and alumni who are shaping the future of artificial intelligence.
      </p>
    </div>

    <div class="mb-10 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border-b border-gray-200 pb-6">
        <span class="text-sm font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Filter by:</span>
        <div class="flex flex-wrap gap-2">
          {#each roles as role}
            <button 
              onclick={() => activeRole = role}
              class="px-4 py-1.5 text-sm font-bold rounded-lg transition-colors border-2 {activeRole === role ? 'bg-[#C53030] text-white border-[#C53030]' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900'}">
              {role}
            </button>
          {/each}
        </div>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <span class="text-sm font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Start with:</span>
        <div class="flex overflow-x-auto gap-2 hide-scrollbar pb-2 sm:pb-0">
          {#each alphabet as letter}
            <button 
              onclick={() => activeLetter = letter}
              class="px-3 py-1.5 text-sm font-bold rounded-lg transition-colors border-2 shrink-0 {activeLetter === letter ? 'bg-[#C53030] text-white border-[#C53030]' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900'}">
              {letter}
            </button>
          {/each}
        </div>
      </div>
    </div>

    <!-- People Grid dynamically tracking $derived filteredPeople -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
      {#each filteredPeople as person}
        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-[#C53030] transition-all duration-300 flex flex-col items-center text-center group cursor-pointer animate-in fade-in zoom-in-95 duration-300">
          {#if person.img}
          <div class="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-gray-100 group-hover:border-[#C53030] transition-colors duration-300 flex items-center justify-center">
            <img src={person.img} alt={person.name} class="w-full h-full object-cover {person.name === 'Dr. Rodrigue Rizk' ? 'object-top' : ''}" />
          </div>
          {:else}
          <div class="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-50 flex items-center justify-center group-hover:border-[#C53030] group-hover:bg-red-50 transition-colors duration-300">
            <i class="bx bx-user text-4xl text-gray-300 group-hover:text-[#C53030]"></i>
          </div>
          {/if}
          
          <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#C53030] transition-colors">{person.name}</h3>
          <p class="text-sm font-medium text-gray-600 mb-4 flex-1">{person.role}</p>
          
          {#if person.scholar || person.dblp}
          <div class="mt-auto flex gap-3 text-xs font-bold w-full justify-center border-t border-gray-100 pt-4">
            {#if person.scholar}
            <a href={person.scholar} target="_blank" class="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center">
              <i class="bx bxl-google mr-1"></i> Scholar
            </a>
            {/if}
            {#if person.scholar && person.dblp}
            <span class="text-gray-300">|</span>
            {/if}
            {#if person.dblp}
            <a href={person.dblp} target="_blank" class="text-orange-600 hover:text-orange-800 transition-colors inline-flex items-center">
              <i class="bx bx-library mr-1"></i> DBLP
            </a>
            {/if}
          </div>
          {/if}
        </div>
      {/each}
    </div>

    <!-- Pagination/Count Tracker Footer -->
    <div class="mt-auto border-t border-gray-200 pt-8 flex flex-col items-center gap-4">
      <div class="text-sm text-gray-500 font-bold tracking-wide">
        Showing {filteredPeople.length > 0 ? '1' : '0'}-{filteredPeople.length} of {people.length} people
      </div>

      <div class="flex items-center gap-2">
        <button class="px-4 py-2 text-sm font-bold rounded-lg transition-colors bg-gray-100 text-gray-400 cursor-not-allowed" disabled>← Prev</button>
        <button class="w-10 h-10 text-sm font-bold rounded-lg transition-colors bg-[#C53030] text-white shadow-md">1</button>
        <button class="px-4 py-2 text-sm font-bold rounded-lg transition-colors bg-white text-gray-600 border border-gray-200 hover:border-[#C53030] hover:text-[#C53030]">Next →</button>
      </div>
    </div>
  </main>
</div>
