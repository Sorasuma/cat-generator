
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

async function addLayer(context,src){
try{
let img=await load(src);
context.drawImage(img,0,0,200,300);
}catch(e){}
}

async function makeMask(){

let mask=document.createElement("canvas");
mask.width=200;
mask.height=300;

let m=mask.getContext("2d");

if(useBody.checked)
await addLayer(m,"assets/body.png");

if(useEars.checked)
await addLayer(m,`assets/ears/${ears.value}.png`);

if(useMane.checked)
await addLayer(m,`assets/mane/${mane.value}.png`);

if(useTail.checked)
await addLayer(m,`assets/tails/${tail.value}.png`);

return mask;
}

async function draw(){

ctx.clearRect(0,0,200,300);
rctx.clearRect(0,0,200,300);

let mask=await makeMask();

ctx.drawImage(mask,0,0);

if(!costume) return;

let source=await load(costume);

let cut=document.createElement("canvas");
cut.width=200;
cut.height=300;

let c=cut.getContext("2d");

c.drawImage(source,0,0,200,300);

c.globalCompositeOperation="destination-in";

if(alphaMode.checked){

// учитываем прозрачность выбранных PNG слоев
c.drawImage(mask,0,0);

}else{

// обычный режим по собранной форме
c.drawImage(mask,0,0);

}

rctx.drawImage(cut,0,0);

ctx.globalAlpha=.75;
ctx.drawImage(cut,0,0);
ctx.globalAlpha=1;

}

document.querySelectorAll("select,input").forEach(el=>{
el.onchange=draw;
});

costume.onchange=e=>{
let reader=new FileReader();
reader.onload=()=>{
costume=reader.result;
draw();
};
reader.readAsDataURL(e.target.files[0]);
};

download.onclick=()=>{
let name=filename.value.trim() || "costume";
if(!name.endsWith(".png")) name+=".png";

let a=document.createElement("a");
a.download=name;
a.href=result.toDataURL("image/png");
a.click();
};

draw();
