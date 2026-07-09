
const preview=document.getElementById("preview");
const result=document.getElementById("result");

const pctx=preview.getContext("2d");
const rctx=result.getContext("2d");

let costume=null;


function load(src){
return new Promise((resolve,reject)=>{
let img=new Image();
img.onload=()=>resolve(img);
img.onerror=()=>reject(src);
img.src=src;
});
}


async function drawLayer(ctx,path){
try{
let img=await load(path);
ctx.drawImage(img,0,0,200,300);
}catch(e){}
}


async function createModel(){

let c=document.createElement("canvas");
c.width=200;
c.height=300;

let ctx=c.getContext("2d");

await drawLayer(ctx,"assets/body.png");
await drawLayer(ctx,`assets/mane/${mane.value}.png`);
await drawLayer(ctx,`assets/ears/${ears.value}.png`);
await drawLayer(ctx,`assets/tails/${tail.value}.png`);

return c;
}


async function createCutMask(){

let c=document.createElement("canvas");
c.width=200;
c.height=300;

let ctx=c.getContext("2d");

if(cutBody.checked)
await drawLayer(ctx,"assets/body.png");

if(cutMane.checked && mane.value!="none")
await drawLayer(ctx,`assets/mane/${mane.value}.png`);

if(cutEars.checked)
await drawLayer(ctx,`assets/ears/${ears.value}.png`);

if(cutTail.checked)
await drawLayer(ctx,`assets/tails/${tail.value}.png`);

return c;
}


async function render(){

pctx.clearRect(0,0,200,300);

let model=await createModel();

pctx.drawImage(model,0,0);


if(costume){

let img=await load(costume);

pctx.globalAlpha=.75;
pctx.drawImage(img,0,0,200,300);
pctx.globalAlpha=1;

}

}


async function crop(){

rctx.clearRect(0,0,200,300);

if(!costume) return;

let mask=await createCutMask();

let img=await load(costume);

let c=document.createElement("canvas");
c.width=200;
c.height=300;

let ctx=c.getContext("2d");

ctx.drawImage(img,0,0,200,300);

ctx.globalCompositeOperation="destination-in";
ctx.drawImage(mask,0,0);

rctx.drawImage(c,0,0);

}


document.querySelectorAll("select").forEach(el=>{
el.addEventListener("change",render);
});


document.getElementById("upload").onchange=e=>{
let reader=new FileReader();

reader.onload=()=>{
costume=reader.result;
render();
};

reader.readAsDataURL(e.target.files[0]);
};


document.getElementById("crop").onclick=crop;


document.getElementById("save").onclick=()=>{

let name=document.getElementById("filename").value.trim() || "costume";

if(!name.endsWith(".png"))
name+=".png";

let a=document.createElement("a");
a.download=name;
a.href=result.toDataURL("image/png");
a.click();

};


render();
