/* A deliberately small, HTML-disabled Markdown renderer for local AI records. */
(()=>{'use strict';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function inline(text,depth=0){
 if(depth>6)return escape(text);
 const pattern=/(`+)([^`\n]+?)\1|\[([^\]\n]+)\]\(([^\s)]+)\)|\*\*([^\n]+?)\*\*|__([^\n]+?)__|\*([^*\n]+?)\*|~~([^\n]+?)~~/g;
 let out='',pos=0,m;
 while((m=pattern.exec(text))){out+=escape(text.slice(pos,m.index));pos=pattern.lastIndex;
  if(m[1])out+='<code>'+escape(m[2])+'</code>';
  else if(m[3]){let url='';try{const u=new URL(m[4]);if(['https:','http:'].includes(u.protocol))url=u.href;}catch{}
   out+=url?'<a href="'+escape(url)+'" target="_blank" rel="noopener noreferrer">'+inline(m[3],depth+1)+'</a>':inline(m[3],depth+1);
  }else{const value=m[5]||m[6]||m[7]||m[8],tag=m[5]||m[6]?'strong':m[7]?'em':'del';out+='<'+tag+'>'+inline(value,depth+1)+'</'+tag+'>';}
 }
 return out+escape(text.slice(pos));
}
function render(input,depth=0){
 const lines=String(input??'').slice(0,200000).replace(/\r\n?/g,'\n').split('\n');
 if(depth>8)return '<pre>'+escape(lines.join('\n'))+'</pre>';
 const out=[];let i=0;
 const special=l=>/^\s*(?:#{1,6}\s|>|[-*+]\s|\d+[.)]\s|`{3,}|~{3,}|(?:[-*_]\s*){3,}$)/.test(l);
 const cells=line=>line.trim().replace(/^\||\|$/g,'').split(/(?<!\\)\|/).map(x=>x.trim().replace(/\\\|/g,'|'));
 while(i<lines.length){const line=lines[i];if(!line.trim()){i++;continue;}
  const fence=line.match(/^\s*(`{3,}|~{3,})([^\s]*)\s*$/);
  if(fence){const body=[];i++;while(i<lines.length&&!new RegExp('^\\s*'+fence[1][0]+'{'+fence[1].length+',}\\s*$').test(lines[i]))body.push(lines[i++]);if(i<lines.length)i++;out.push('<pre><code>'+escape(body.join('\n'))+'</code></pre>');continue;}
  const heading=line.match(/^\s*(#{1,6})\s+(.+?)\s*#*\s*$/);
  if(heading){const n=heading[1].length;out.push('<h'+n+'>'+inline(heading[2])+'</h'+n+'>');i++;continue;}
  if(/^\s*(?:[-*_]\s*){3,}$/.test(line)){out.push('<hr>');i++;continue;}
  if(/^\s*>/.test(line)){const body=[];while(i<lines.length&&/^\s*>/.test(lines[i]))body.push(lines[i++].replace(/^\s*>\s?/,''));out.push('<blockquote>'+render(body.join('\n'),depth+1)+'</blockquote>');continue;}
  if(line.includes('|')&&i+1<lines.length&&/^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[i+1])){
   const headers=cells(line);i+=2;const body=[];while(i<lines.length&&lines[i].trim()&&lines[i].includes('|')){const row=cells(lines[i++]);body.push('<tr>'+headers.map((_,j)=>'<td>'+inline(row[j]||'')+'</td>').join('')+'</tr>');}
   out.push('<div class="e2-md-table"><table><thead><tr>'+headers.map(x=>'<th>'+inline(x)+'</th>').join('')+'</tr></thead><tbody>'+body.join('')+'</tbody></table></div>');continue;
  }
  const list=line.match(/^\s*([-*+]|\d+[.)])\s+(.+)$/);
  if(list){const ordered=/^\d/.test(list[1]),tag=ordered?'ol':'ul',items=[];const start=ordered?parseInt(list[1],10):1;
   while(i<lines.length){const m=lines[i].match(/^\s*([-*+]|\d+[.)])\s+(.+)$/);if(!m||/^\d/.test(m[1])!==ordered)break;let value=m[2];i++;while(i<lines.length&&/^\s{2,}\S/.test(lines[i])&&!special(lines[i]))value+='\n'+lines[i++].trim();items.push('<li>'+inline(value).replace(/\n/g,'<br>')+'</li>');}
   out.push('<'+tag+(ordered?' start="'+start+'"':'')+'>'+items.join('')+'</'+tag+'>');continue;
  }
  const paragraph=[line];i++;while(i<lines.length&&lines[i].trim()&&!special(lines[i])&&!(lines[i].includes('|')&&/^\s*\|?\s*:?-{3,}/.test(lines[i+1]||'')))paragraph.push(lines[i++]);out.push('<p>'+inline(paragraph.join('\n')).replace(/\n/g,'<br>')+'</p>');
 }
 return out.join('');
}
window.E2Markdown={render};
})();
