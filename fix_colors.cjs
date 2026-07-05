const fs = require('fs');

let content = fs.readFileSync('src/pages/dashboards/AdminDashboard.jsx', 'utf8');

// Backgrounds
content = content.replace(/backgroundColor: '#0f172a'/g, "backgroundColor: '#f8fafc'");
content = content.replace(/backgroundColor: '#1e293b'/g, "backgroundColor: '#ffffff'");
content = content.replace(/background: '#1e293b'/g, "background: '#ffffff'");

// Text Colors
content = content.replace(/color: 'white'/g, "color: '#0f172a'");
content = content.replace(/color: '#f8fafc'/g, "color: '#0f172a'");
content = content.replace(/color: '#94a3b8'/g, "color: '#64748b'");
content = content.replace(/color: '#e2e8f0'/g, "color: '#334155'");

// Borders
content = content.replace(/border: '1px solid #334155'/g, "border: '1px solid #e2e8f0'");
content = content.replace(/borderBottom: '1px solid #334155'/g, "borderBottom: '1px solid #e2e8f0'");
content = content.replace(/borderBottom: '2px solid #334155'/g, "borderBottom: '2px solid #e2e8f0'");
content = content.replace(/borderRight: '1px solid #334155'/g, "borderRight: '1px solid #e2e8f0'");
content = content.replace(/borderLeft: activeTab === tab.id \? '3px solid #60a5fa' : '3px solid transparent'/g, "borderLeft: activeTab === tab.id ? '3px solid #3b82f6' : '3px solid transparent'");

// Inputs & Buttons
content = content.replace(/backgroundColor: '#334155'/g, "backgroundColor: '#f1f5f9'");
content = content.replace(/border: '1px solid #475569'/g, "border: '1px solid #cbd5e1'");
content = content.replace(/e\.currentTarget\.style\.backgroundColor = '#475569'/g, "e.currentTarget.style.backgroundColor = '#e2e8f0'");
content = content.replace(/e\.currentTarget\.style\.backgroundColor = '#334155'/g, "e.currentTarget.style.backgroundColor = '#f1f5f9'");

// Sidebar Hovers
content = content.replace(/e\.currentTarget\.style\.color = 'white'/g, "e.currentTarget.style.color = '#0f172a'");
content = content.replace(/e\.currentTarget\.style\.color = '#94a3b8'/g, "e.currentTarget.style.color = '#64748b'");

// Fixes where text SHOULD be white
content = content.replace(/color: '#0f172a', border: 'none'/g, "color: 'white', border: 'none'");
content = content.replace(/backgroundColor: '#3b82f6', color: '#0f172a'/g, "backgroundColor: '#3b82f6', color: 'white'");
content = content.replace(/padding: '30px', color: '#0f172a'/g, "padding: '30px', color: 'white'");
content = content.replace(/color: '#0f172a' }}/g, "color: '#0f172a' }}"); 
content = content.replace(/Users size=\{28\} style=\{\{ color: '#0f172a' \}\}/g, "Users size={28} style={{ color: 'white' }}");
content = content.replace(/Building size=\{28\} style=\{\{ color: '#0f172a' \}\}/g, "Building size={28} style={{ color: 'white' }}");
content = content.replace(/Trophy size=\{28\} style=\{\{ color: '#0f172a' \}\}/g, "Trophy size={28} style={{ color: 'white' }}");

fs.writeFileSync('src/pages/dashboards/AdminDashboard.jsx', content);
console.log('Colors replaced successfully!');
