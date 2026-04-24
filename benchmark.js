import fs from "fs";
import puppeteer from "puppeteer";
import lighthouse from "lighthouse";

const PORT = 8041; // Port used by Lighthouse for Chrome debugging

async function runLighthouse(url) {
  const browser = await puppeteer.launch({
    args: [`--remote-debugging-port=${PORT}`],
    headless: "new",
  });

  const options = {
    logLevel: "info",
    output: "json",
    onlyCategories: ["performance"],
    port: PORT,
  };

  try {
    const runnerResult = await lighthouse(url, options);
    await browser.close();

    const metrics = runnerResult.lhr.audits;
    return {
      fcp: metrics["first-contentful-paint"]?.displayValue,
      lcp: metrics["largest-contentful-paint"]?.displayValue,
      tti: metrics["interactive"]?.displayValue,
      tbt: metrics["total-blocking-time"]?.displayValue,
      score: Math.round(runnerResult.lhr.categories.performance.score * 100),
    };
  } catch (error) {
    console.error(`Failed to benchmark ${url}:`, error.message);
    await browser.close();
    return null;
  }
}

async function run() {
  console.log("Starting Benchmark Suite...");

  console.log(
    "\nAnalyzing Vanilla JS (http://localhost:8000/publications.html) ...",
  );
  const vanilla = await runLighthouse(
    "http://localhost:8000/publications.html",
  );

  console.log("\nAnalyzing SvelteKit (http://localhost:4173/publications) ...");
  const svelte = await runLighthouse("http://localhost:4173/publications");

  const markdownTable = `
## Benchmarking Results: Core Web Vitals & Performance

| Metric | Vanilla JS (localhost:8000) | Svelte 5 (localhost:4173) |
|---|---|---|
| **Performance Score** | ${vanilla ? vanilla.score : "N/A"} | ${svelte ? svelte.score : "N/A"} |
| **First Contentful Paint (FCP)** | ${vanilla ? vanilla.fcp : "N/A"} | ${svelte ? svelte.fcp : "N/A"} |
| **Largest Contentful Paint (LCP)** | ${vanilla ? vanilla.lcp : "N/A"} | ${svelte ? svelte.lcp : "N/A"} |
| **Time to Interactive (TTI)** | ${vanilla ? vanilla.tti : "N/A"} | ${svelte ? svelte.tti : "N/A"} |
| **Total Blocking Time (TBT)** | ${vanilla ? vanilla.tbt : "N/A"} | ${svelte ? svelte.tbt : "N/A"} |
`;

  console.log("\n==================================");
  console.log(markdownTable);
  fs.writeFileSync("benchmark-report.md", markdownTable);
  console.log("Report saved to benchmark-report.md");
}

run();
