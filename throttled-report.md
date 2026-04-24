## Network Throttling Benchmarking Results (/publications)

*Note: All metrics represent the median of 5 runs (after 1 warm-up run).* 

| Network Profile | Framework | Median Score | FCP | LCP | TTI | TBT |
|---|---|---|---|---|---|---|
| **Slow 3G** | Vanilla | 0 | 4.15 s | 4.15 s | 0 ms | 0 ms |
| | Svelte 5 | 84 | 2.67 s | 2.67 s | 7.29 s | 41 ms |
| **Fast 3G** | Vanilla | 89 | 1.69 s | 1.69 s | 6.99 s | 29 ms |
| | Svelte 5 | 89 | 1.51 s | 1.51 s | 1.88 s | 80 ms |
| **Fast Broadband** | Vanilla | 98 | 772 ms | 772 ms | 772 ms | 0 ms |
| | Svelte 5 | 98 | 1.23 s | 1.23 s | 1.24 s | 0 ms |
