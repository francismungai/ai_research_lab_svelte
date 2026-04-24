import fs from "fs";
import puppeteer from "puppeteer";
import lighthouse from "lighthouse";

const PORT = 8041;
const NUM_RUNS = 5; // The number of recorded runs for the median
const WARMUP_RUNS = 1; // Discarded runs to warm up JIT/Caches

// Define specific network condition presets
const networkProfiles = {
  "Slow 3G": {
    rttMs: 400,
    throughputKbps: 400,
    requestLatencyMs: 400,
    downloadThroughputKbps: 400,
    uploadThroughputKbps: 400,
    cpuSlowdownMultiplier: 4,
  },
  "Fast 3G": {
    rttMs: 150,
    throughputKbps: 1.6 * 1024,
    requestLatencyMs: 150,
    downloadThroughputKbps: 1.6 * 1024,
    uploadThroughputKbps: 750,
    cpuSlowdownMultiplier: 4,
  },
  "Fast Broadband": {
    rttMs: 40,
    throughputKbps: 10 * 1024,
    requestLatencyMs: 0,
    downloadThroughputKbps: 10 * 1024,
    uploadThroughputKbps: 10 * 1024,
    cpuSlowdownMultiplier: 1,
  },
};

const urlToTest = {
  vanilla: "http://localhost:8000/publications.html",
  svelte: "http://localhost:4173/publications",
};

// --- Helper Functions ---

// Calculate the median of an array of numbers
const getMedian = (arr) => {
  if (arr.length === 0) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 !== 0 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};

// Format milliseconds into a readable string (seconds or ms)
const formatTime = (ms) =>
  ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${Math.round(ms)} ms`;

// --- Core Lighthouse Runner ---

async function runLighthouse(url, profileName) {
  // headless: true is the standard for modern Puppeteer (v22+)
  const browser = await puppeteer.launch({
    args: [`--remote-debugging-port=${PORT}`],
    headless: true,
  });

  const options = {
    logLevel: "silent", // Changed from error to silent to keep your console clean during loops
    output: "json",
    onlyCategories: ["performance"],
    port: PORT,
    throttlingMethod: "devtools",
    throttling: networkProfiles[profileName],
  };

  try {
    const runnerResult = await lighthouse(url, options);
    await browser.close();

    const metrics = runnerResult.lhr.audits;

    // Return raw numeric values (ms) for accurate math, not the string display values
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

async function runTestSuite(url, profileName, frameworkName) {
  console.log(`\n▶ Starting suite for ${frameworkName} on [${profileName}]`);

  // 1. Warm-up runs (discarded)
  for (let i = 0; i < WARMUP_RUNS; i++) {
    process.stdout.write(`  [Warmup ${i + 1}/${WARMUP_RUNS}] Running... `);
    await runLighthouse(url, profileName);
    console.log(`Done.`);
  }

  // 2. Actual recorded runs
  const results = { fcp: [], lcp: [], tti: [], tbt: [], score: [] };

  for (let i = 0; i < NUM_RUNS; i++) {
    process.stdout.write(`  [Run ${i + 1}/${NUM_RUNS}] Recording... `);
    const res = await runLighthouse(url, profileName);
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

  // 3. Calculate medians
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
  console.log(`Starting Aggregated Throttled Benchmark Suite`);
  console.log(
    `Settings: ${NUM_RUNS} runs per test, ${WARMUP_RUNS} warm-up run(s)\n`,
  );
  console.log(`=================================================`);

  let markdownTable = `## Network Throttling Benchmarking Results (/publications)\n\n`;
  markdownTable += `*Note: All metrics represent the median of ${NUM_RUNS} runs (after ${WARMUP_RUNS} warm-up run).* \n\n`;
  markdownTable += `| Network Profile | Framework | Median Score | FCP | LCP | TTI | TBT |\n`;
  markdownTable += `|---|---|---|---|---|---|---|\n`;

  for (const profile of Object.keys(networkProfiles)) {
    const vResult = await runTestSuite(
      urlToTest.vanilla,
      profile,
      "Vanilla JS",
    );
    const sResult = await runTestSuite(urlToTest.svelte, profile, "Svelte 5");

    markdownTable += `| **${profile}** | Vanilla | ${vResult.score} | ${vResult.fcp} | ${vResult.lcp} | ${vResult.tti} | ${vResult.tbt} |\n`;
    markdownTable += `| | Svelte 5 | ${sResult.score} | ${sResult.fcp} | ${sResult.lcp} | ${sResult.tti} | ${sResult.tbt} |\n`;
  }

  console.log("\n==================================");
  console.log("All suites complete. Compiling report...");
  fs.writeFileSync("throttled-report.md", markdownTable);
  console.log("✅ Report saved to throttled-report.md");
}

run();
