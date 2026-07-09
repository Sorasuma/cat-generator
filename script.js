
const model=document.getElementById("model");
const result=document.getElementById("result");
const ctx=model.getContext("2d");
const rctx=result.getContext("2d");

let costume=null;

function load(src){
return new Promise(resolve=>{
let img=new Image();
img.onload=()=>resolve(img);
img.src=src;
});
}

async function makeMask(){

let mask=document.createElement("canvas");
mask.width=200;
mask.height=300;
let m=mask.getContext("2d");

if(useBody.checked) await draw(m,"assets/body.png");
if(useEars.checked) await draw(m,`assets/ears/${ears.value}.png`);
if(useMane.checked && mane.value!="none") await draw(m,`assets/mane/${mane.value}.png`);
if(useTail.checked) await draw(m,`assets/tails/${tail.value}.png`);

return mask;
}

async function draw(c,src){
try{
let img=await load(src);
c.drawImage(img,0,0,200,300);
}catch(e){}
}

async function crop(){

ctx.clearRect(0,0,200,300);
rctx.clearRect(0,0,200,300);

let mask=await makeMask();

ctx.drawImage(mask,0,0);

if(!costume) return;

let img=await load(costume);

let cut=document.createElement("canvas");
cut.width=200;
cut.height=300;

let c=cut.getContext("2d");

c.drawImage(img,0,0,200,300);
c.globalCompositeOperation="destination-in";
c.drawImage(mask,0,0);

rctx.drawImage(cut,0,0);

ctx.globalAlpha=.75;
ctx.drawImage(cut,0,0);
ctx.globalAlpha=1;

updateSummary();
}

function updateSummary(){
let a=[];
if(useBody.checked)a.push("тело");
if(useEars.checked)a.push("уши: "+ears.value);
if(useMane.checked)a.push("грива: "+mane.value);
if(useTail.checked)a.push("хвост: "+tail.value);

summary.textContent="Выбрано: "+a.join(", ");
}

document.querySelectorAll("input,select").forEach(x=>{
x.onchange=updateSummary;
});

costume.onchange=e=>{
let r=new FileReader();
r.onload=()=>costume=r.result;
r.readAsDataURL(e.target.files[0]);
};

crop.onclick=crop;

download.onclick=()=>{
let n=filename.value.trim()||"costume";
if(!n.endsWith(".png"))n+=".png";
let a=document.createElement("a");
a.download=n;
a.href=result.toDataURL();
a.click();
};

updateSummary();
