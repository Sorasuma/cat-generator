
const model=document.getElementById("model");
const result=document.getElementById("result");
const ctx=model.getContext("2d");
const rctx=result.getContext("2d");

let costume=null;

const status=document.getElementById("status");

function img(src){
return new Promise((resolve,reject)=>{
let i=new Image();
i.onload=()=>resolve(i);
i.onerror=()=>reject(src);
i.src=src;
});
}

async function layer(c,src){
try{
let i=await img(src);
c.drawImage(i,0,0,200,300);
return true;
}catch(e){
status.textContent="Не найден: "+src;
return false;
}
}

async function createMask(){
let c=document.createElement("canvas");
c.width=200;c.height=300;
let x=c.getContext("2d");

if(bodyCheck.checked) await layer(x,"assets/body.png");
if(earsCheck.checked) await layer(x,`assets/ears/${ears.value}.png`);
if(maneCheck.checked && mane.value!="none") await layer(x,`assets/mane/${mane.value}.png`);
if(tailCheck.checked) await layer(x,`assets/tails/${tail.value}.png`);

return c;
}

async function render(){
ctx.clearRect(0,0,200,300);
rctx.clearRect(0,0,200,300);

let mask=await createMask();
ctx.drawImage(mask,0,0);

if(costume){
let i=await img(costume);
ctx.globalAlpha=.8;
ctx.drawImage(i,0,0,200,300);
ctx.globalAlpha=1;
}
}

async function crop(){
rctx.clearRect(0,0,200,300);
let mask=await createMask();

if(!costume)return;

let i=await img(costume);
let c=document.createElement("canvas");
c.width=200;c.height=300;

let x=c.getContext("2d");
x.drawImage(i,0,0,200,300);
x.globalCompositeOperation="destination-in";
x.drawImage(mask,0,0);

rctx.drawImage(c,0,0);
}

document.querySelectorAll("input,select").forEach(e=>{
e.onchange=render;
});

document.getElementById("costume").onchange=e=>{
let r=new FileReader();
r.onload=()=>{
costume=r.result;
render();
};
r.readAsDataURL(e.target.files[0]);
};

document.getElementById("crop").onclick=crop;

document.getElementById("download").onclick=()=>{
let n=document.getElementById("filename").value.trim()||"costume";
if(!n.endsWith(".png"))n+=".png";
let a=document.createElement("a");
a.download=n;
a.href=result.toDataURL();
a.click();
};

render();
