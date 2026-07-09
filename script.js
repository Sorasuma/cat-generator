
let costume=null;
let cutMode='inside';

const p=document.getElementById('preview').getContext('2d');
const r=document.getElementById('result').getContext('2d');

function loadImg(s){return new Promise((a,b)=>{let i=new Image();i.onload=()=>a(i);i.onerror=b;i.src=s})}
async function layer(c,s){try{c.drawImage(await loadImg(s),0,0,200,300)}catch(e){}}

async function model(){
let c=document.createElement('canvas');c.width=200;c.height=300;
let x=c.getContext('2d');
await layer(x,'assets/body.png');
await layer(x,`assets/mane/${mane.value}.png`);
await layer(x,`assets/ears/${ears.value}.png`);
await layer(x,`assets/tails/${tail.value}.png`);
return c;
}

async function mask(){
let c=document.createElement('canvas');c.width=200;c.height=300;
let x=c.getContext('2d');
if(cutBody.checked) await layer(x,'assets/body.png');
if(cutMane.checked) await layer(x,`assets/mane/${mane.value}.png`);
if(cutEars.checked) await layer(x,`assets/ears/${ears.value}.png`);
if(cutTail.checked) await layer(x,`assets/tails/${tail.value}.png`);
return c;
}

async function render(){
p.clearRect(0,0,200,300);
let m=await model();p.drawImage(m,0,0);
if(costume)p.drawImage(await loadImg(costume),0,0,200,300);
}
document.querySelectorAll('select').forEach(e=>e.onchange=render);

upload.onchange=e=>{let f=new FileReader();f.onload=()=>{costume=f.result;render()};f.readAsDataURL(e.target.files[0])}

crop.onclick=async()=>{
r.clearRect(0,0,200,300); if(!costume)return;
let c=document.createElement('canvas');c.width=200;c.height=300;
let x=c.getContext('2d');x.drawImage(await loadImg(costume),0,0,200,300);
x.globalCompositeOperation=cutMode==='inside'?'destination-in':'destination-out';
x.drawImage(await mask(),0,0);r.drawImage(c,0,0);
}

save.onclick=()=>{
let a=document.createElement('a');a.download=(filename.value||'costume')+'.png';a.href=result.toDataURL();a.click();
}
render();
