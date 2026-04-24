<script lang="ts">
  let activeTab = $state<'samples' | 'papers'>('samples');
  let searchQuery = $state('');
  let currentFilter = $state('All');
  let activeYearFilter = $state('All');
  let scrollY = $state(0);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  const filterOptions = [
    { label: "All", value: "All" },
    { label: "Medical Imaging", value: "Medical" },
    { label: "COVID-19", value: "COVID" },
    { label: "Machine Learning", value: "Learning" },
    { label: "Computer Vision", value: "Vision" },
    { label: "Healthcare AI", value: "Healthcare" },
    { label: "NLP", value: "NLP" },
    { label: "Security", value: "Security" }
  ];

  import { PUBLICATIONS_BY_YEAR } from '$lib/data/publicationsByYear';
  import { PUBLICATIONS, BOOKS } from '$lib/data/publications';

  const samples = PUBLICATIONS_BY_YEAR.flatMap(section => section.publications);
  const allPapers = PUBLICATIONS;
  const books = BOOKS;

  const availableYears = ['All', ...PUBLICATIONS_BY_YEAR.map(section => section.year)];
  let filteredYearSections = $derived(
    activeYearFilter === 'All' 
      ? PUBLICATIONS_BY_YEAR 
      : PUBLICATIONS_BY_YEAR.filter(section => section.year === activeYearFilter)
  );

  let filteredPapers = $derived(allPapers.filter(paper => {
    const text = `${paper.title} ${paper.authors || ''} ${paper.venue || ''} ${paper.year || ''}`.toLowerCase();
    const searchMatch = text.includes(searchQuery.toLowerCase());
    const filterMatch = currentFilter === 'All' || text.includes(currentFilter.toLowerCase());
    return searchMatch && filterMatch;
  }));
</script>

<svelte:window bind:scrollY={scrollY} />

<svelte:head>
  <title>Publications | USD AI Research</title>
  <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
</svelte:head>

<div class="flex-1 flex flex-col">
  <div class="py-4 px-4 sm:px-6 lg:px-8">
    <main class="max-w-7xl mx-auto w-full px-6 py-10 md:px-12 bg-white/70 backdrop-blur-sm rounded-[2.5rem] shadow-2xl border border-white/20 min-h-[calc(100vh-8rem)]">
      <div class="mb-10">
        <h1 class="text-4xl lg:text-5xl font-bold text-[#C53030] tracking-tight mb-2">Publications</h1>
        <p class="text-gray-700 text-lg font-medium max-w-2xl">
          Research output from the USD AI Research Lab — journals, conferences, books & preprints
        </p>
      </div>

      <section class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-1.5 h-6 bg-[#C53030] rounded-full"></div>
          <h2 class="text-2xl font-bold text-gray-900">Books</h2>
        </div>

        <div class="relative group">
          <div class="flex overflow-x-auto gap-6 pb-4 pt-2 snap-x no-scrollbar cursor-grab active:cursor-grabbing">
            {#each books as book}
            <a href={book.publisherUrl || book.amazonUrl || 'javascript:void(0)'} target="_blank" class="shrink-0 snap-start transition-transform duration-300 hover:-translate-y-2 hover:drop-shadow-xl">
              <img src={book.imageUrl} alt={book.title} class="h-48 md:h-56 lg:h-64 w-auto rounded-lg object-contain bg-white/50 p-2 border border-gray-200" />
            </a>
            {/each}
          </div>
        </div>
      </section>

      <div class="flex border-b border-gray-300 mb-6">
        <button
          onclick={() => activeTab = 'samples'}
          class="px-6 py-3 text-sm font-bold border-b-2 transition-colors {activeTab === 'samples' ? 'border-[#C53030] text-[#C53030]' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'}"
        >
          Few Samples
          <span class="ml-2 text-xs px-2 py-0.5 rounded-full {activeTab === 'samples' ? 'bg-red-100 text-[#C53030]' : 'bg-gray-200 text-gray-600'}">{samples.length}</span>
        </button>
        <button
          onclick={() => activeTab = 'papers'}
          class="px-6 py-3 text-sm font-bold border-b-2 transition-colors {activeTab === 'papers' ? 'border-[#C53030] text-[#C53030]' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'}"
        >
          Research Papers
          <span class="ml-2 text-xs px-2 py-0.5 rounded-full {activeTab === 'papers' ? 'bg-red-100 text-[#C53030]' : 'bg-gray-200 text-gray-600'}">{allPapers.length}</span>
        </button>
      </div>

      <section class="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 p-2 md:p-6 shadow-inner min-h-125">
        {#if activeTab === 'samples'}
          <div id="tab-content-samples">
            <div class="mb-6 flex flex-wrap gap-2">
              {#each availableYears as year}
                <button
                  onclick={() => activeYearFilter = year}
                  class="px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 shadow-sm {activeYearFilter === year ? 'bg-[#C53030] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
                >
                  {year}
                </button>
              {/each}
            </div>

            <div class="space-y-8">
              {#each filteredYearSections as section}
                <div class="bg-white/60 p-5 rounded-xl border border-gray-100 shadow-sm">
                  <div class="mb-4 pb-2 border-b border-gray-200 flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
                    <h3 class="text-2xl font-bold text-gray-900">{section.year}</h3>
                    {#if section.summary}
                      <p class="text-sm font-medium text-gray-500">{section.summary}</p>
                    {/if}
                  </div>
                  
                  <ul class="space-y-3">
                    {#each section.publications as sample}
                      <li class="group relative pl-4 py-3 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-200">
                        <div class="absolute left-0 top-3 bottom-3 w-1 bg-gray-300 group-hover:bg-[#C53030] rounded-r-md transition-colors"></div>
                        <div class="text-sm md:text-base text-gray-800 leading-relaxed">
                          <span class="text-gray-500 font-medium">{sample.authors}:</span>
                          <span class="font-bold text-gray-900">{sample.title}</span>,
                          <span class="text-blue-700 font-medium">{sample.venue}</span>
                          <span class="text-green-700 font-bold">({sample.year})</span>
                          {#if sample.linkUrl}
                          <a href={sample.linkUrl} target="_blank" class="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold transition-colors bg-green-100 text-green-800 hover:bg-green-200 border border-green-200">
                            {sample.linkLabel || 'Link'}
                          </a>
                          {/if}
                        </div>
                      </li>
                    {/each}
                  </ul>

                  {#if section.conferenceProceedings || section.bookChapters}
                    <div class="mt-4 pt-3 border-t border-gray-100 text-sm bg-gray-50/50 p-3 rounded-lg">
                      {#if section.conferenceProceedings}
                        <div class="mb-1"><span class="font-bold text-gray-700">Conference Proceedings:</span> <span class="text-gray-600">{section.conferenceProceedings}</span></div>
                      {/if}
                      {#if section.bookChapters}
                        <div><span class="font-bold text-gray-700">Book Chapters:</span> <span class="text-gray-600">{section.bookChapters}</span></div>
                      {/if}
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {:else}
          <div id="tab-content-papers">
            <div class="mb-4">
              <div class="relative">
                <i class="bx bx-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                <input
                  bind:value={searchQuery}
                  placeholder="Search papers by title, author, or keyword..."
                  class="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C53030] focus:border-transparent bg-white shadow-sm"
                  type="text"
                />
              </div>
            </div>

            <div class="mb-6 flex flex-wrap gap-2">
              {#each filterOptions as option}
                <button
                  onclick={() => currentFilter = option.value}
                  class="px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 shadow-sm {currentFilter === option.value ? 'bg-[#C53030] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
                >
                  {option.label}
                </button>
              {/each}
            </div>

            <div class="mb-4 text-xs font-bold text-gray-500">
              Showing {filteredPapers.length} paper{filteredPapers.length !== 1 ? 's' : ''}
            </div>

            <div class="grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-2">
              {#each filteredPapers as paper}
                <div class="paper-card group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#C53030] hover:shadow-lg transition-all duration-300">
                  <div class="p-5">
                    <div class="flex justify-between items-start mb-3">
                      <h3 class="text-sm sm:text-base font-bold text-gray-900 leading-snug pr-3 group-hover:text-[#C53030] transition-colors line-clamp-2">
                        {paper.title}
                      </h3>
                    </div>
                    <p class="text-xs text-gray-600 mb-2 font-medium">
                      {paper.authors}
                    </p>
                    <div class="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <span class="font-bold text-gray-900">{paper.year}</span><span>·</span>
                      <span class="line-clamp-1 font-medium">{paper.venue}</span>
                    </div>
                    {#if paper.paperUrl}
                    <div class="mt-2">
                      <a href={paper.paperUrl} target="_blank" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-colors bg-red-50 text-[#C53030] hover:bg-red-100 border border-red-100">
                        View Link <i class='bx bx-link-external'></i>
                      </a>
                    </div>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </section>
    </main>
  </div>
</div>

<!-- Floating Scroll Buttons -->
<div class="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
  {#if scrollY > 300}
    <button 
      onclick={scrollToTop} 
      class="w-12 h-12 bg-[#C53030]/90 backdrop-blur-sm text-white rounded-full shadow-xl flex items-center justify-center hover:bg-[#A02020] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl" 
      aria-label="Scroll to top"
    >
      <i class='bx bx-up-arrow-alt text-2xl'></i>
    </button>
  {/if}
  <button 
    onclick={scrollToBottom} 
    class="w-12 h-12 bg-white/90 backdrop-blur-sm text-[#C53030] border border-gray-200 rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 hover:text-[#A02020] hover:border-gray-300 transition-all duration-300 hover:translate-y-1 hover:shadow-2xl" 
    aria-label="Scroll to bottom"
  >
    <i class='bx bx-down-arrow-alt text-2xl'></i>
  </button>
</div>
