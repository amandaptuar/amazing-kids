const fs = require('fs');

const loaderHtml = fs.readFileSync('src/pages/naspe-loader.html', 'utf8');

// Extract style
const styleMatch = loaderHtml.match(/<style>([\s\S]*?)<\/style>/);
let styleContent = styleMatch ? styleMatch[0] : '';

// Change the background to transparent as requested
styleContent = styleContent.replace(/background:radial-gradient[^;]+;/, 'background: transparent; backdrop-filter: blur(10px);');

// Change the cream body background so it doesn't affect the main site
styleContent = styleContent.replace(/body\{[^}]+\}/, '');

// Extract markup
const markupMatch = loaderHtml.match(/<!-- ============ LOADER MARKUP[\s\S]*?<!-- ============ END LOADER MARKUP ============ -->/);
const markupContent = markupMatch ? markupMatch[0] : '';

// Extract script
const scriptMatch = loaderHtml.match(/<script>([\s\S]*?)<\/script>/);
const scriptContent = scriptMatch ? scriptMatch[0] : '';

let indexHtml = fs.readFileSync('index.html', 'utf8');

// Ensure we don't inject multiple times
if (!indexHtml.includes('naspe-loader')) {
  // Inject into head
  indexHtml = indexHtml.replace('</head>', `  ${styleContent}\n  </head>`);

  // Inject into body
  indexHtml = indexHtml.replace('<body>', `<body>\n  ${markupContent}\n  ${scriptContent}\n`);

  fs.writeFileSync('index.html', indexHtml);
  console.log('Loader injected successfully!');
} else {
  console.log('Loader is already injected.');
}
