
const model = document.getElementById("model");
const result = document.getElementById("result");
const ctx = model.getContext("2d");
const rctx = result.getContext("2d");

const costumeInput = document.getElementById("costume");
const cropButton = document.getElementById("crop");

let costume = null;

function loadImage(src){
    return new Promise((resolve,reject)=>{
        const img = new Image();
        img.onload = ()=>resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function drawLayer(context, src){
    try{
        const img = await loadImage(src);
        context.drawImage(img,0,0,200,300);
    }catch(e){}
}

async function createMask(){
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 300;
    const c = canvas.getContext("2d");

    if(useBody.checked)
        await drawLayer(c,"assets/body.png");

    if(useEars.checked)
        await drawLayer(c,`assets/ears/${ears.value}.png`);

    if(useMane.checked && mane.value !== "none")
        await drawLayer(c,`assets/mane/${mane.value}.png`);

    if(useTail.checked)
        await drawLayer(c,`assets/tails/${tail.value}.png`);

    return canvas;
}

async function crop(){

    ctx.clearRect(0,0,200,300);
    rctx.clearRect(0,0,200,300);

    const mask = await createMask();

    if(costume){
        const img = await loadImage(costume);

        const cut = document.createElement("canvas");
        cut.width = 200;
        cut.height = 300;

        const c = cut.getContext("2d");

        c.drawImage(img,0,0,200,300);
        c.globalCompositeOperation = "destination-in";
        c.drawImage(mask,0,0);

        rctx.drawImage(cut,0,0);

        ctx.drawImage(mask,0,0);
        ctx.globalAlpha = 0.75;
        ctx.drawImage(cut,0,0);
        ctx.globalAlpha = 1;

    }else{
        ctx.drawImage(mask,0,0);
    }

    updateSummary();
}

function updateSummary(){
    let arr=[];
    if(useBody.checked) arr.push("тело");
    if(useEars.checked) arr.push("уши: "+ears.value);
    if(useMane.checked) arr.push("грива: "+mane.value);
    if(useTail.checked) arr.push("хвост: "+tail.value);

    document.getElementById("summary").textContent =
        "Выбрано: " + (arr.join(", ") || "ничего");
}

costumeInput.addEventListener("change",e=>{
    const reader = new FileReader();
    reader.onload=()=>{
        costume=reader.result;
    };
    reader.readAsDataURL(e.target.files[0]);
});

cropButton.addEventListener("click",crop);

document.querySelectorAll("input,select").forEach(el=>{
    el.addEventListener("change",updateSummary);
});

download.onclick=()=>{
    let name=document.getElementById("filename").value.trim() || "costume";
    if(!name.endsWith(".png")) name+=".png";

    const a=document.createElement("a");
    a.download=name;
    a.href=result.toDataURL("image/png");
    a.click();
};

updateSummary();
