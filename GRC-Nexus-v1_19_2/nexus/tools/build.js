// node tools/build.js  → dist/nexus.html (un solo archivo para presentar o enviar)
const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..');let h=fs.readFileSync(path.join(root,'index.html'),'utf8');
h=h.replace(/<link rel="stylesheet" href="([^"]+)">/,(_,f)=>`<style>${fs.readFileSync(path.join(root,f),'utf8')}</style>`);
h=h.replace(/<script src="([^"]+)"><\/script>/g,(_,f)=>`<script>${fs.readFileSync(path.join(root,f),'utf8').replace(/<\/script>/g,'<\\/script>')}</script>`);
fs.mkdirSync(path.join(root,'dist'),{recursive:true});fs.writeFileSync(path.join(root,'dist/nexus.html'),h);console.log('dist/nexus.html',(h.length/1024).toFixed(0)+' KB');
