export const palettes={red:['#f0eef0','#ffd4d6','#ff9a9f','#ef626b','#bd2d3c'],blue:['#eef1f4','#c7e5ff','#7bbbf0','#388bd0','#155b99'],green:['#ebedf0','#9be9a8','#40c463','#30a14e','#216e39'],purple:['#f0eef4','#e0d2ff','#b89aeb','#8a63cd','#593997'],amber:['#f2f0e9','#ffe7ad','#ffc862','#eaa02d','#ab6816']};
export const escapeXML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const shade=(hex,f)=>'#'+hex.slice(1).match(/../g).map(v=>Math.max(0,Math.min(255,Math.round(parseInt(v,16)*f))).toString(16).padStart(2,'0')).join('');
export function customPalette(hex){return ['#f0eef0',... [0.25,0.5,0.75,1].map(t=>'#'+hex.slice(1).match(/../g).map(v=>Math.round(255*(1-t)+parseInt(v,16)*t).toString(16).padStart(2,'0')).join(''))];}
export function chartSVG(data,{view='iso',rotation=45,height=100,palette=palettes.red}={}){
 const {cells,names,columns}=data,max=Math.max(...cells.flat()),rows=cells.length;
 const color=n=>palette[n===0?0:Math.min(4,Math.ceil(n/max*4))];
 const labels=data.headers.length===columns?data.headers:Array.from({length:columns},(_,i)=>String(i+1));
 let body='';
 if(view==='flat'){
 const size=Math.min(65,990/columns,440/rows),left=(1200-columns*size)/2+35,top=(650-rows*size)/2;
 labels.forEach((label,x)=>{body+=`<text x="${left+x*size+size/2}" y="${top-18}" text-anchor="middle" font-size="13">${escapeXML(label)}</text>`;});
 cells.forEach((r,y)=>{body+=`<text x="${left-14}" y="${top+y*size+size/2}" text-anchor="end" dominant-baseline="middle" font-size="15">${escapeXML(names[y])}</text>`;r.forEach((n,x)=>{body+=`<rect x="${left+x*size}" y="${top+y*size}" width="${size-4}" height="${size-4}" rx="2" fill="${color(n)}"><title>${escapeXML(names[y])}, ${escapeXML(labels[x])}: ${n}</title></rect>`;});});
 }else{
 const a=rotation*Math.PI/180,c=Math.cos(a),s=Math.sin(a),size=20,gap=1.3;
 const project=(x,y,z=0)=>[(x*c-y*s), (x*s+y*c)*.5-z];
 let blocks=[],points=[],annotations=[];
 cells.forEach((r,y)=>r.forEach((n,x)=>{
 const x0=x*size,y0=y*size,x1=x0+size-gap,y1=y0+size-gap,h=3+(max?height*n/max:0);
 const verts=[[x0,y0,0],[x1,y0,0],[x1,y1,0],[x0,y1,0],[x0,y0,h],[x1,y0,h],[x1,y1,h],[x0,y1,h]].map(p=>project(...p));points.push(...verts);
 const faces=[];
 if(s>0)faces.push({ids:[1,2,6,5],f:.72});else faces.push({ids:[0,3,7,4],f:.72});
 if(c>0)faces.push({ids:[3,2,6,7],f:.88});else faces.push({ids:[0,1,5,4],f:.88});
 faces.push({ids:[4,5,6,7],f:1});
 blocks.push({depth:project(x0+size/2,y0+size/2)[1],verts,faces,n,x,y});
 }));
 names.forEach((name,y)=>{const p=project(s>=0?columns*size+18:-18,y*size+8);annotations.push({p,label:name});points.push(p);});
 labels.forEach((label,x)=>{const p=project(x*size+8,c>=0?rows*size+18:-18);annotations.push({p,label});points.push(p);});
 const minX=Math.min(...points.map(p=>p[0])),maxX=Math.max(...points.map(p=>p[0])),minY=Math.min(...points.map(p=>p[1])),maxY=Math.max(...points.map(p=>p[1]));
 const scale=Math.min(1040/(maxX-minX+40),510/(maxY-minY+35)),ox=(1200-(maxX-minX)*scale)/2-minX*scale,oy=(650-(maxY-minY)*scale)/2-minY*scale;
 const xy=p=>`${(ox+p[0]*scale).toFixed(2)},${(oy+p[1]*scale).toFixed(2)}`;
 blocks.sort((a,b)=>a.depth-b.depth).forEach(b=>{body+=`<g><title>${escapeXML(names[b.y])}, ${escapeXML(labels[b.x])}: ${b.n}</title>`;b.faces.forEach(face=>{body+=`<polygon points="${face.ids.map(i=>xy(b.verts[i])).join(' ')}" fill="${shade(color(b.n),face.f)}" stroke="${shade(color(b.n),face.f)}" stroke-width="0.4"/>`;});body+='</g>';});
 annotations.forEach(({p,label})=>{body+=`<text x="${ox+p[0]*scale}" y="${oy+p[1]*scale}" font-size="13" text-anchor="middle" dominant-baseline="middle">${escapeXML(label)}</text>`;});
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 650" width="1200" height="650" font-family="Arial, Helvetica, sans-serif" fill="#637984"><rect width="1200" height="650" fill="white"/>${body}</svg>`;
}
