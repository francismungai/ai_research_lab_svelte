<script lang="ts">
  import { base } from '$app/paths';
  let activeAccordion = $state<string | null>('current');

  function toggle(id: string) {
    activeAccordion = activeAccordion === id ? null : id;
  }
</script>

<svelte:head>
  <title>Career Opportunities | USD AI Research</title>
</svelte:head>

<div class="py-4 px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
  <main class="max-w-7xl mx-auto w-full px-6 py-10 md:px-12 bg-white/70 backdrop-blur-sm rounded-[2.5rem] shadow-2xl border border-white/20 min-h-[calc(100vh-8rem)] flex flex-col">
    <div class="text-center mb-10">
      <h1 class="text-4xl lg:text-5xl font-bold text-[#C53030] tracking-tight mb-6">Career Opportunities</h1>
      <div class="max-w-3xl mx-auto text-left space-y-4 text-gray-700 font-medium">
        <p>
          We are continuously looking for highly motivated and talented people to contribute to our research in AI, machine learning, and computer vision. Our positions are competitive and limited to maintain a focused, research-driven group.
        </p>
        <p>
          Before applying, please review our recent <a href="{base}/publications" class="text-[#C53030] font-bold hover:underline">publications</a> to ensure alignment with our research directions.
        </p>
        <p class="text-sm text-gray-500 italic font-bold">Due to high volume, we may not respond to every inquiry individually.</p>
      </div>
    </div>

    <section class="mb-12 space-y-3">
      <!-- Current Openings -->
      <div class="accordion-item border border-[#C53030] rounded-xl overflow-hidden bg-white shadow-sm">
        <button onclick={() => toggle('current')} class="accordion-btn w-full flex items-center justify-between p-4 md:p-5 bg-[#C53030] hover:bg-red-800 transition-colors text-white">
          <h3 class="text-lg md:text-xl font-bold">Current Openings</h3>
          <i class="bx bx-chevron-down text-2xl transition-transform duration-300 {activeAccordion === 'current' ? 'rotate-180' : ''}"></i>
        </button>
        {#if activeAccordion === 'current'}
        <div class="accordion-content p-5 md:p-6 bg-white animate-in fade-in slide-in-from-top-2 duration-300">
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 bg-[#C53030] rounded-full mt-2.5 shrink-0"></div>
            <div class="flex-1">
              <div class="flex flex-wrap items-center gap-3 mb-2">
                <h4 class="text-lg font-bold text-gray-900">Computational Scientists in Biomedical and Clinical AI Research</h4>
                <span class="text-xs font-bold text-[#C53030] bg-red-50 px-3 py-1 rounded-full border border-red-200">Open until filled</span>
              </div>
              <p class="text-gray-700 mb-4 leading-relaxed text-sm md:text-base font-medium">
                The USD Artificial Intelligence (AI) Research Lab at the University of South Dakota is seeking Computational Scientists to support ongoing projects within the South Dakota Biomedical Computation Collaborative (SDBCC). The research focuses on foundational machine learning models on large-scale biomedical and clinical datasets, including multi-omics, medical imaging, and EHRs.
              </p>
              <a href="https://yourfuture.sdbor.edu/postings/46923" target="_blank" class="inline-flex items-center px-4 py-2 bg-[#C53030] text-white font-bold rounded-lg hover:bg-red-800 transition-colors shadow-sm">
                Apply Now <i class="bx bx-link-external ml-2"></i>
              </a>
            </div>
          </div>
        </div>
        {/if}
      </div>

      <!-- PhD Students -->
      <div class="accordion-item border border-[#C53030] rounded-xl overflow-hidden bg-white shadow-sm">
        <button onclick={() => toggle('phd')} class="accordion-btn w-full flex items-center justify-between p-4 md:p-5 bg-[#C53030] hover:bg-red-800 transition-colors text-white">
          <h3 class="text-lg md:text-xl font-bold">PhD Students</h3>
          <i class="bx bx-chevron-down text-2xl transition-transform duration-300 {activeAccordion === 'phd' ? 'rotate-180' : ''}"></i>
        </button>
        {#if activeAccordion === 'phd'}
        <div class="accordion-content p-5 md:p-6 bg-white space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div>
            <h4 class="font-bold text-gray-900 mb-2">Requirements</h4>
            <p class="text-gray-700 font-medium">Strong foundations in ML, computer vision, NLP, statistics, probability, or applied mathematics. MSc or equivalent required.</p>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 mb-2">Application Requirements</h4>
            <div class="bg-gray-50 border-l-4 border-[#C53030] p-4 rounded-r-lg">
              <p class="text-gray-700 font-medium mb-2">
                Send your application to
                <a href="mailto:usd.airesearch.lab@gmail.com" class="text-[#C53030] hover:underline">usd.airesearch.lab@gmail.com</a> |
                <a href="mailto:kc.santosh@usd.edu" class="text-[#C53030] hover:underline">kc.santosh@usd.edu</a>
              </p>
              <ul class="list-disc list-inside text-gray-700 font-medium space-y-1 ml-2">
                <li>CV</li>
                <li>Transcript</li>
                <li>Motivational letter explaining interest in working with us</li>
              </ul>
            </div>
          </div>
        </div>
        {/if}
      </div>

      <!-- Postdoctoral Researchers -->
      <div class="accordion-item border border-[#C53030] rounded-xl overflow-hidden bg-white shadow-sm">
        <button onclick={() => toggle('postdoc')} class="accordion-btn w-full flex items-center justify-between p-4 md:p-5 bg-[#C53030] hover:bg-red-800 transition-colors text-white">
          <h3 class="text-lg md:text-xl font-bold">Postdoctoral Researchers</h3>
          <i class="bx bx-chevron-down text-2xl transition-transform duration-300 {activeAccordion === 'postdoc' ? 'rotate-180' : ''}"></i>
        </button>
        {#if activeAccordion === 'postdoc'}
        <div class="accordion-content p-5 md:p-6 bg-white space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div>
            <h4 class="font-bold text-gray-900 mb-2">Requirements</h4>
            <p class="text-gray-700 font-medium">Proven track record with publications at top ML/AI venues (NeurIPS, ICML, ICLR, AAAI, IJCAI, AISTATS). Evidence of research independence and leadership potential.</p>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 mb-2">Application Requirements</h4>
            <div class="bg-gray-50 border-l-4 border-[#C53030] p-4 rounded-r-lg">
              <p class="text-gray-700 font-medium mb-2">
                Send your application to
                <a href="mailto:usd.airesearch.lab@gmail.com" class="text-[#C53030] hover:underline">usd.airesearch.lab@gmail.com</a>
              </p>
              <ul class="list-disc list-inside text-gray-700 font-medium space-y-1 ml-2">
                <li>CV including publication list</li>
                <li>Contact information of two referees</li>
                <li>Research statement (1-2 pages) including past contributions and rationale for joining USD AI Research Lab</li>
              </ul>
            </div>
          </div>
        </div>
        {/if}
      </div>

      <!-- Master's Students -->
      <div class="accordion-item border border-[#C53030] rounded-xl overflow-hidden bg-white shadow-sm">
        <button onclick={() => toggle('masters')} class="accordion-btn w-full flex items-center justify-between p-4 md:p-5 bg-[#C53030] hover:bg-red-800 transition-colors text-white">
          <h3 class="text-lg md:text-xl font-bold">Master's Students</h3>
          <i class="bx bx-chevron-down text-2xl transition-transform duration-300 {activeAccordion === 'masters' ? 'rotate-180' : ''}"></i>
        </button>
        {#if activeAccordion === 'masters'}
        <div class="accordion-content p-5 md:p-6 bg-white space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div>
            <h4 class="font-bold text-gray-900 mb-2">Requirements</h4>
            <p class="text-gray-700 font-medium">Interest in AI research through thesis projects, independent studies, or research assistantships. Strong programming skills and coursework in ML or related areas preferred.</p>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 mb-2">Application Requirements</h4>
            <div class="bg-gray-50 border-l-4 border-[#C53030] p-4 rounded-r-lg">
              <p class="text-gray-700 font-medium mb-2">
                Send your application to
                <a href="mailto:usd.airesearch.lab@gmail.com" class="text-[#C53030] hover:underline">usd.airesearch.lab@gmail.com</a>
              </p>
              <ul class="list-disc list-inside text-gray-700 font-medium space-y-1 ml-2">
                <li>CV and academic transcripts</li>
                <li>Brief statement of research interests</li>
                <li>Portfolio of relevant coursework or projects</li>
              </ul>
            </div>
          </div>
        </div>
        {/if}
      </div>

      <!-- Undergraduate Students -->
      <div class="accordion-item border border-[#C53030] rounded-xl overflow-hidden bg-white shadow-sm">
        <button onclick={() => toggle('undergrad')} class="accordion-btn w-full flex items-center justify-between p-4 md:p-5 bg-[#C53030] hover:bg-red-800 transition-colors text-white">
          <h3 class="text-lg md:text-xl font-bold">Undergraduate Students</h3>
          <i class="bx bx-chevron-down text-2xl transition-transform duration-300 {activeAccordion === 'undergrad' ? 'rotate-180' : ''}"></i>
        </button>
        {#if activeAccordion === 'undergrad'}
        <div class="accordion-content p-5 md:p-6 bg-white space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div>
            <h4 class="font-bold text-gray-900 mb-2">Requirements</h4>
            <p class="text-gray-700 font-medium mb-2">Strong academic performance and completion of relevant coursework in computer science, mathematics, or statistics.</p>
            <p class="text-gray-700 font-medium">Gain hands-on research experience through independent study projects, summer research programs, or senior capstone projects.</p>
          </div>
          <div class="bg-red-50 border-l-4 border-[#C53030] p-4 rounded-r-lg">
            <p class="text-red-800 font-bold">Contact us to discuss available opportunities and project alignment.</p>
          </div>
        </div>
        {/if}
      </div>

      <!-- Research Visits -->
      <div class="accordion-item border border-[#C53030] rounded-xl overflow-hidden bg-white shadow-sm">
        <button onclick={() => toggle('visits')} class="accordion-btn w-full flex items-center justify-between p-4 md:p-5 bg-[#C53030] hover:bg-red-800 transition-colors text-white">
          <h3 class="text-lg md:text-xl font-bold">Research Visits & Internships</h3>
          <i class="bx bx-chevron-down text-2xl transition-transform duration-300 {activeAccordion === 'visits' ? 'rotate-180' : ''}"></i>
        </button>
        {#if activeAccordion === 'visits'}
        <div class="accordion-content p-5 md:p-6 bg-white space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div>
            <h4 class="font-bold text-gray-900 mb-2">Requirements</h4>
            <p class="text-gray-700 font-medium mb-2">Open to researchers and students from all levels seeking short-term or long-term research collaborations.</p>
            <p class="text-gray-700 font-medium">Whether you are a visiting scholar, intern, or collaborative researcher, we welcome inquiries for research visits and internship opportunities.</p>
          </div>
          <div class="bg-red-50 border-l-4 border-[#C53030] p-4 rounded-r-lg">
            <p class="text-red-800 font-bold">Please include your research background, duration of visit/internship, and research interests in your inquiry.</p>
          </div>
        </div>
        {/if}
      </div>
    </section>

    <div class="grid md:grid-cols-2 gap-8 border-t border-gray-300 pt-8 mt-auto">
      <div>
        <h3 class="text-2xl font-bold text-[#C53030] mb-4">Important Notes</h3>
        <div class="space-y-4">
          <div>
            <h4 class="font-bold text-gray-900">Review Process</h4>
            <p class="text-gray-700 font-medium text-sm">Applications reviewed on rolling basis. We cannot respond to emails that don't follow instructions.</p>
          </div>
          <div>
            <h4 class="font-bold text-gray-900">Funding</h4>
            <p class="text-gray-700 font-medium text-sm">Support through research assistantships, teaching assistantships, or external fellowships.</p>
          </div>
          <div>
            <p class="text-gray-700 font-medium text-sm">For general inquiries, visit our <a href="{base}/contact" class="text-[#C53030] hover:underline">Contact page.</a></p>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-2xl font-bold text-[#C53030] mb-4">Research Collaborations</h3>
        <p class="text-gray-700 font-medium text-sm mb-3">We are always interested in collaborating. For inquiries, please include:</p>
        <ul class="list-disc list-inside text-gray-700 font-medium text-sm space-y-1 ml-2">
          <li>Your research background and affiliation</li>
          <li>Specific areas of mutual interest</li>
          <li>Proposed timeline and objectives</li>
          <li>Available resources and funding</li>
        </ul>
      </div>
    </div>
  </main>
</div>
