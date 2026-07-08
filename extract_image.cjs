const fs = require('fs');
const path = require('path');

const loaderHtml = fs.readFileSync('src/pages/naspe-loader.html', 'utf8');
const match = loaderHtml.match(/src="data:image\/png;base64,([^"]+)"/);

if (match && match[1]) {
  const base64Data = match[1];
  const buffer = Buffer.from(base64Data, 'base64');
  
  const publicAssetsPath = path.join(__dirname, 'public', 'assets');
  if (!fs.existsSync(publicAssetsPath)) {
    fs.mkdirSync(publicAssetsPath, { recursive: true });
  }
  
  fs.writeFileSync(path.join(publicAssetsPath, 'naspe-mascot.png'), buffer);
  console.log('Image extracted and saved to public/assets/naspe-mascot.png');
} else {
  console.log('Base64 image not found in naspe-loader.html');
}
