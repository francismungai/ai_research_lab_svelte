const fs = require('fs');
const files = fs.readdirSync('../ai_research_lab').filter(f => f.endsWith('.html'));
files.forEach(f => {
  const content = fs.readFileSync('../ai_research_lab/' + f, 'utf8');
  const match = content.match(/<main[^>]*class="([^"]*max-w-[^"]*)"/);
  if (match) {
    const classes = match[1].split(' ');
    const maxWidth = classes.find(c => c.startsWith('max-w-'));
    console.log(f + ': ' + maxWidth);
  } else {
    console.log(f + ': No max-w found');
  }
});
