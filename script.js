const model=document.getElementById("model");
const cut=document.getElementById("cut");

const ctx=model.getContext("2d");
const cutCtx=cut.getContext("2d");

const parts={
body:"assets/body.png",
ears:{
"прямые":"assets/ears/прямые.png",
"вислые":"assets/ears/вислые.png",
"длинные":"assets/ears/длинные.png",
"раскосые":"assets/ears/раскосые.png",
"кёрл":"assets/ears/кёрл.png"
},
mane:{
"умеренная":"assets/mane/умеренная.png",
"пушистая":"assets/mane/пушистая.png",
"пышная":"assets/mane/пышная.png"
},
tails:{
"куцый":"assets/tails/куцый.png",
"тонкий":"assets/tails/тонкий.png",
"гладкий":"assets/tails/гладкий.png",
"умеренный":"assets/tails/умеренный.png",
"пушистый":"assets/tails/pушистый.png",
"пышный":"assets/tails/пышный.png",
"беличий":"assets/tails/беличий.png"
}
};

let selected={
ears:"прямые",
mane:"умеренная",
tails:"куцый"
};

let costume=null;

function img(src){
return new Promise(resolve=>{
let i=new Image();
i.src=src;
i.onload=()=>resolve(i);
});
}

async function draw(){

ctx.clearRect(0,0,200,300);

for(let src of [
parts.body,
parts.mane[selected.mane],
parts.ears[selected.ears],
parts.tails[selected.tails]
]){
let i=await img(src);
ctx.drawImage(i,0,0,200,300);
}

if(costume){
cutCtx.clearRect(0,0,200,300);
let c=await img(costume);
cutCtx.drawImage(c,0,0,200,300);
}
}

function makeButtons(id,obj,key){
let box=document.getElementById(id);

Object.keys(obj).forEach((name,i)=>{
let label=document.createElement("label");
label.className="option";

label.innerHTML=`
<input type="radio" name="${key}" value="${name}" ${i==0?"checked":""}>
<span>${name}</span>
`;

label.querySelector("input").onchange=e=>{
selected[key]=e.target.value;
draw();
};

box.appendChild(label);
});
}

makeButtons("ears",parts.ears,"ears");
makeButtons("mane",parts.mane,"mane");
makeButtons("tails",parts.tails,"tails");


document.getElementById("costume").onchange=e=>{
let reader=new FileReader();
reader.onload=()=> {
costume=reader.result;
draw();
};
reader.readAsDataURL(e.target.files[0]);
};


document.getElementById("download").onclick=()=>{

let link=document.createElement("a");
link.download="обрезанный_костюм.png";
link.href=cut.toDataURL("image/png");
link.click();

};

draw();
