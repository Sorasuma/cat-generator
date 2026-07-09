
const model=document.getElementById("model");
const result=document.getElementById("result");

const ctx=model.getContext("2d");
const rctx=result.getContext("2d");

let costume=null;

function loadImage(src){
return new Promise(resolve=>{
const img=new Image();
img.onload=()=>resolve(img);
img.src=src;
});
}

async function draw(){

ctx.clearRect(0,0,200,300);

let layers=[
"assets/body.png",
`assets/mane/${mane.value}.png`,
`assets/ears/${ears.value}.png`,
`assets/tails/${tail.value}.png`
];

for(const src of layers){
try{
const img=await loadImage(src);
ctx.drawImage(img,0,0,200,300);
}catch(e){}
}

rctx.clearRect(0,0,200,300);

if(costume){
const img=await loadImage(costume);
rctx.drawImage(img,0,0,200,300);
}

}

document.querySelectorAll("select").forEach(el=>{
el.addEventListener("change",draw);
});

document.getElementById("costume").addEventListener("change",e=>{
const reader=new FileReader();
reader.onload=()=>{
costume=reader.result;
draw();
};
reader.readAsDataURL(e.target.files[0]);
});


document.getElementById("download").onclick=()=>{

let name=document.getElementById("filename").value.trim();

if(!name) name="costume";

if(!name.endsWith(".png")) name+=".png";

const link=document.createElement("a");
link.download=name;
link.href=result.toDataURL("image/png");
link.click();

};


draw();
