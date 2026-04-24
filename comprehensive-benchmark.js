import fs from "fs";
import puppeteer from "puppeteer";
import lighthouse from "lighthouse";

const PORT = 8041;
const NUM_RUNS = 5; // Recorded runs
const WARMUP_RUNS = 1; // Discarded runs

const routes = [
  {
    name: "Home",
    vanilla: "http://localhost:8000/index.html",
    svelte: "http://localhost:4173/",
  },
  {
    name: "People",
    vanilla: "http://localhost:8000/people.html",
    svelte: "http://localhost:4173/people",
  },
  {
    name: "Publications",
    vanilla: "http://localhost:8000/publications.html",
    svelte: "http://localhost:4173/publications",
  },
  {
    name: "Blog",
    vanilla: "http://localhost:8000/blog.html",
    svelte: "http://localhost:4173/blog",
  },
  {
    name: "Careers",
    vanilla: "http://localhost:8000/opportunities.html",
    svelte: "http://localhost:4173/opportunities",
  },
  {
    name: "Initiatives",
    vanilla: "http://localhost:8000/initiatives.html",
    svelte: "http://localhost:4173/initiatives",
  },
];

// --- Helpers ---
const getMedian = (arr) => {
  if (arr.length === 0) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 !== 0 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};

const formatTime = (ms) =>
  ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${Math.round(ms)} ms`;

// --- Core Runner ---
async function runLighthouse(url) {
  const browser = await puppeteer.launch({
    args: [`--remote-debugging-port=${PORT}`],
    headless: true,
  });

  const options = {
    logLevel: "silent",
    output: "json",
    onlyCategories: ["performance"],
    port: PORT,
    // Note: No custom throttling passed here, so Lighthouse defaults
    // to simulated Fast 3G / Mobile CPU slowdown.
  };

  try {
    const runnerResult = await lighthouse(url, options);
    await browser.close();

    const metrics = runnerResult.lhr.audits;
    return {
      fcp: metrics["first-contentful-paint"]?.numericValue || 0,
      lcp: metrics["largest-contentful-paint"]?.numericValue || 0,
      tti: metrics["interactive"]?.numericValue || 0,
      tbt: metrics["total-blocking-time"]?.numericValue || 0,
      score: runnerResult.lhr.categories.performance.score * 100,
    };
  } catch (error) {
    console.error(`\nFailed to benchmark ${url}:`, error.message);
    if (browser) await browser.close();
    return null;
  }
}

// --- Multi-Run Aggregator ---
async function runTestSuite(url, frameworkName) {
  // 1. Warm-up
  for (let i = 0; i < WARMUP_RUNS; i++) {
    process.stdout.write(`    [Warmup] Running... `);
    await runLighthouse(url);
    console.log(`Done.`);
  }

  // 2. Record
  const results = { fcp: [], lcp: [], tti: [], tbt: [], score: [] };
  for (let i = 0; i < NUM_RUNS; i++) {
    process.stdout.write(`    [Run ${i + 1}/${NUM_RUNS}] `);
    const res = await runLighthouse(url);
    if (res) {
      results.fcp.push(res.fcp);
      results.lcp.push(res.lcp);
      results.tti.push(res.tti);
      results.tbt.push(res.tbt);
      results.score.push(res.score);
      console.log(`Score: ${Math.round(res.score)}`);
    } else {
      console.log(`Failed.`);
    }
  }

  // 3. Medians
  return {
    score: Math.round(getMedian(results.score)),
    fcp: formatTime(getMedian(results.fcp)),
    lcp: formatTime(getMedian(results.lcp)),
    tti: formatTime(getMedian(results.tti)),
    tbt: formatTime(getMedian(results.tbt)),
  };
}

// --- Main Execution ---
async function run() {
  console.log("Starting Comprehensive Multi-Run Benchmark Suite...\n");
  console.log(
    `Settings: ${NUM_RUNS} recorded runs, ${WARMUP_RUNS} warm-up per page.`,
  );
  console.log(
    "⚠️ This will run Lighthouse 72 times. It will take several minutes.\n",
  );

  let markdownTable = `## Comprehensive Benchmarking Results\n\n`;
  markdownTable += `*Testing default Lighthouse simulated throttling (Mobile). Metrics are the median of ${NUM_RUNS} runs.*\n\n`;
  markdownTable += `| Route | Framework | Score | FCP | LCP | TTI | TBT |\n`;
  markdownTable += `|---|---|---|---|---|---|---|\n`;

  for (const route of routes) {
    console.log(`\nAnalyzing [${route.name}]`);

    console.log(`  ▶ Vanilla JS (${route.vanilla})`);
    const vResult = await runTestSuite(route.vanilla, "Vanilla");

    console.log(`  ▶ Svelte 5 (${route.svelte})`);
    const sResult = await runTestSuite(route.svelte, "Svelte");

    markdownTable += `| **${route.name}** | Vanilla | ${vResult.score} | ${vResult.fcp} | ${vResult.lcp} | ${vResult.tti} | ${vResult.tbt} |\n`;
    markdownTable += `| | Svelte 5 | ${sResult.score} | ${sResult.fcp} | ${sResult.lcp} | ${sResult.tti} | ${sResult.tbt} |\n`;
  }

  console.log("\n==================================");
  fs.writeFileSync("comprehensive-report.md", markdownTable);
  console.log("✅ Report saved to comprehensive-report.md");
}

run();
