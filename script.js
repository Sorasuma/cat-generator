
const model=document.getElementById("model");
const result=document.getElementById("result");

const ctx=model.getContext("2d");
const rctx=result.getContext("2d");


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
"пушистый":"assets/tails/пушистый.png",
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


function load(src){
return new Promise(resolve=>{
let img=new Image();
img.onload=()=>resolve(img);
img.src=src;
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
try{
let img=await load(src);
ctx.drawImage(img,0,0,200,300);
}catch(e){}
}

rctx.clearRect(0,0,200,300);

if(costume){
let img=await load(costume);
rctx.drawImage(img,0,0,200,300);
}

}


function create(id,obj,key){

let box=document.getElementById(id);

Object.keys(obj).forEach((name,i)=>{

let label=document.createElement("label");
label.className="option";

label.innerHTML=
`<input type="radio" name="${key}" ${i==0?"checked":""}><span>${name}</span>`;

label.querySelector("input").onchange=()=>{
selected[key]=name;
draw();
};

box.appendChild(label);

});

}


create("ears",parts.ears,"ears");
create("mane",parts.mane,"mane");
create("tails",parts.tails,"tails");


document.getElementById("costume").onchange=e=>{

let reader=new FileReader();

reader.onload=()=>{
costume=reader.result;
draw();
};

reader.readAsDataURL(e.target.files[0]);

};


document.getElementById("download").onclick=()=>{

let a=document.createElement("a");
a.download="costume.png";
a.href=result.toDataURL();
a.click();

};


draw();
