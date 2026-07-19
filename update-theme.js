/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

const files = [
  'src/app/page.tsx',
  'src/app/dashboard/layout.tsx',
  'src/app/dashboard/DashboardClient.tsx',
  'src/app/dashboard/new/page.tsx',
  'src/app/interview/[id]/page.tsx',
  'src/app/interview/[id]/results/page.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content
    .replace(/\btext-slate-900\b/g, 'text-slate-900') // keeping slate-900 for general dark text
    .replace(/\bbg-indigo-600\b/g, 'bg-blue-700')
    .replace(/\bhover:bg-indigo-700\b/g, 'hover:bg-blue-800')
    .replace(/\bbg-indigo-50\b/g, 'bg-blue-50')
    .replace(/\btext-indigo-600\b/g, 'text-blue-700')
    .replace(/\btext-indigo-700\b/g, 'text-blue-800')
    .replace(/\btext-indigo-500\b/g, 'text-blue-600')
    .replace(/\bborder-indigo-100\b/g, 'border-blue-100')
    .replace(/\border-indigo-500\b/g, 'border-blue-500')
    .replace(/\border-indigo-600\b/g, 'border-blue-600')
    .replace(/\bring-indigo-500\b/g, 'ring-blue-500')
    .replace(/\bshadow-indigo-500\/20\b/g, 'shadow-blue-500/20')
    .replace(/\bbg-slate-900\b/g, 'bg-blue-950'); // Dark buttons

  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log('Updated ' + file);
  }
});
