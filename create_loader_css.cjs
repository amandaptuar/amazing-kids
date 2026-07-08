const fs = require('fs');

const loaderHtml = fs.readFileSync('src/pages/naspe-loader.html', 'utf8');

// Extract style
const styleMatch = loaderHtml.match(/<style>([\s\S]*?)<\/style>/);
let styleContent = styleMatch ? styleMatch[1] : '';

// Remove root variables as we can keep them or remove them (we will keep them)
// Change background of #naspe-loader
styleContent = styleContent.replace(/background:radial-gradient[^;]+;/, 'background: transparent; backdrop-filter: blur(8px); WebkitBackdropFilter: blur(8px);');

// Remove body, html styles
styleContent = styleContent.replace(/html,body\{[^}]+\}/, '');
styleContent = styleContent.replace(/body\{[^}]+\}/, '');
// Remove demo-page and replay-btn styles
styleContent = styleContent.replace(/\/\* ============ demo page behind loader ============ \*\/[\s\S]*/, '');

fs.writeFileSync('src/components/GlobalLoader.css', styleContent.trim());
console.log('GlobalLoader.css created successfully!');
