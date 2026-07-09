
let costume=null;

const model=document.getElementById("model");
const result=document.getElementById("result");

const mctx=model.getContext("2d");
const rctx=result.getContext("2d");

function loadImage(src){
return new Promise((resolve,reject)=>{
let img=new Image();
img.onload=()=>resolve(img);
img.onerror=reject;
img.src=src;
});
}

async function layer(ctx,path){
try{
let img=await loadImage(path);
ctx.drawImage(img,0,0,200,300);
}catch(e){}
}

async function createCat(){
let c=document.createElement("canvas");
c.width=200;c.height=300;
let ctx=c.getContext("2d");

await layer(ctx,"assets/body.png");

if(cheeks.value!=="none")
await layer(ctx,`assets/cheeks/${cheeks.value}.png`);

if(mane.value!=="none")
await layer(ctx,`assets/mane/${mane.value}.png`);

await layer(ctx,`assets/ears/${ears.value}.png`);
await layer(ctx,`assets/tails/${tail.value}.png`);

return c;
}

async function createMask(){
let c=document.createElement("canvas");
c.width=200;c.height=300;
let ctx=c.getContext("2d");

if(cutBody.checked) await layer(ctx,"assets/body.png");
if(cutCheeks.checked && cheeks.value!=="none") await layer(ctx,`assets/cheeks/${cheeks.value}.png`);
if(cutMane.checked && mane.value!=="none") await layer(ctx,`assets/mane/${mane.value}.png`);
if(cutEars.checked) await layer(ctx,`assets/ears/${ears.value}.png`);
if(cutTail.checked) await layer(ctx,`assets/tails/${tail.value}.png`);

return c;
}

async function render(){
mctx.clearRect(0,0,200,300);
let cat=await createCat();
mctx.drawImage(cat,0,0);

if(costume){
mctx.globalAlpha=.75;
mctx.drawImage(await loadImage(costume),0,0,200,300);
mctx.globalAlpha=1;
}
}

document.querySelectorAll("select").forEach(e=>e.onchange=render);

upload.onchange=e=>{
let r=new FileReader();
r.onload=()=>{costume=r.result;render()};
r.readAsDataURL(e.target.files[0]);
};

crop.onclick=async()=>{
if(!costume)return;

let mask=await createMask();
let img=await loadImage(costume);

let c=document.createElement("canvas");
c.width=200;c.height=300;

let ctx=c.getContext("2d");
ctx.drawImage(img,0,0,200,300);

let mode=document.querySelector('input[name="mode"]:checked').value;

ctx.globalCompositeOperation=mode==="inside"?"destination-in":"destination-out";
ctx.drawImage(mask,0,0);

rctx.clearRect(0,0,200,300);
rctx.drawImage(c,0,0);
};

download.onclick=()=>{
let name=filename.value||"costume";
if(!name.endsWith(".png"))name+=".png";

let a=document.createElement("a");
a.download=name;
a.href=result.toDataURL();
a.click();
};

render();
