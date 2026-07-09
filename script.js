
let costume=null;
const model=document.getElementById("model"), result=document.getElementById("result");
const mctx=model.getContext("2d"), rctx=result.getContext("2d");

function img(src){return new Promise((res,rej)=>{let i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src})}
async function layer(ctx,path){try{ctx.drawImage(await img(path),0,0,200,300)}catch(e){}}

async function createCat(){
let c=document.createElement("canvas");c.width=c.height=300;let x=c.getContext("2d");
await layer(x,"assets/body.png");
if(cheeks.value!="none")await layer(x,`assets/cheeks/${cheeks.value}.png`);
if(mane.value!="none")await layer(x,`assets/mane/${mane.value}.png`);
await layer(x,`assets/ears/${ears.value}.png`);
await layer(x,`assets/tails/${tail.value}.png`);
return c;
}

async function createMask(){
let c=document.createElement("canvas");c.width=c.height=300;let x=c.getContext("2d");
if(cutBody.checked)await layer(x,"assets/body.png");
if(cutCheeks.checked&&cheeks.value!="none")await layer(x,`assets/cheeks/${cheeks.value}.png`);
if(cutMane.checked&&mane.value!="none")await layer(x,`assets/mane/${mane.value}.png`);
if(cutEars.checked)await layer(x,`assets/ears/${ears.value}.png`);
if(cutTail.checked)await layer(x,`assets/tails/${tail.value}.png`);
return c;
}
async function render(){
mctx.clearRect(0,0,200,300);
mctx.drawImage(await createCat(),0,0);
if(costume){mctx.globalAlpha=.75;mctx.drawImage(await img(costume),0,0,200,300);mctx.globalAlpha=1}
}
document.querySelectorAll("select").forEach(e=>e.onchange=render);
upload.onchange=e=>{let r=new FileReader();r.onload=()=>{costume=r.result;render()};r.readAsDataURL(e.target.files[0])};
crop.onclick=async()=>{
if(!costume)return;
let c=document.createElement("canvas");c.width=c.height=300;let x=c.getContext("2d");
x.drawImage(await img(costume),0,0,200,300);
x.globalCompositeOperation=document.querySelector("[name=mode]:checked").value=="inside"?"destination-in":"destination-out";
x.drawImage(await createMask(),0,0);
rctx.clearRect(0,0,200,300);rctx.drawImage(c,0,0);
};
download.onclick=()=>{let a=document.createElement("a");a.download=(filename.value||"costume")+".png";a.href=result.toDataURL();a.click()};
render();
