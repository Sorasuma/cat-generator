
let costume = null;
let offsetX = 0;
let offsetY = 0;

let dragging = false;

let startMouseX = 0;
let startMouseY = 0;

let startOffsetX = 0;
let startOffsetY = 0;

const model = document.getElementById("model");
const result = document.getElementById("result");

const mctx = model.getContext("2d");
const rctx = result.getContext("2d");

function loadImage(src){
    return new Promise((resolve, reject)=>{
        const img = new Image();
        img.onload = ()=>resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function layer(ctx, path){
    try{
        const image = await loadImage(path);
        ctx.drawImage(image, 0, 0, 200, 300);
    }catch(e){}
}


// Порядок слоев:
// тело
// грива
// щеки (поверх гривы)
// уши
// хвост
async function createCat(){

    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 300;

    const ctx = canvas.getContext("2d");

    await layer(ctx, "assets/body.png");

    if(mane.value !== "none"){
        await layer(ctx, `assets/mane/${mane.value}.png`);
    }

    if(cheeks.value !== "none"){
        await layer(ctx, `assets/cheeks/${cheeks.value}.png`);
    }

    await layer(ctx, `assets/ears/${ears.value}.png`);
    await layer(ctx, `assets/tails/${tail.value}.png`);

    return canvas;
}


// Маска использует такой же порядок слоев
async function createMask(){

    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 300;

    const ctx = canvas.getContext("2d");

    if(cutBody.checked){
        await layer(ctx, "assets/body.png");
    }

    if(cutMane.checked && mane.value !== "none"){
        await layer(ctx, `assets/mane/${mane.value}.png`);
    }

    if(cutCheeks.checked && cheeks.value !== "none"){
        await layer(ctx, `assets/cheeks/${cheeks.value}.png`);
    }

    if(cutEars.checked){
        await layer(ctx, `assets/ears/${ears.value}.png`);
    }

    if(cutTail.checked){
        await layer(ctx, `assets/tails/${tail.value}.png`);
    }

    return canvas;
}


async function render(){

    mctx.clearRect(0,0,200,300);

    const cat = await createCat();
    mctx.drawImage(cat,0,0);

    if(costume){

        const img = await loadImage(costume);

        mctx.globalAlpha = 0.75;
        mctx.drawImage(img, offsetX, offsetY, 200, 300);
        mctx.globalAlpha = 1;

    }

}


document.querySelectorAll("select").forEach(select=>{
    select.addEventListener("change", render);
});


document.getElementById("upload").addEventListener("change", e=>{

    const reader = new FileReader();

    reader.onload = ()=>{
        costume = reader.result;
        offsetX = 0;
        offsetY = 0;
        render();
    };

    reader.readAsDataURL(e.target.files[0]);
});


document.getElementById("crop").addEventListener("click", async()=>{

    if(!costume) return;

    const img = await loadImage(costume);
    const mask = await createMask();

    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 300;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, offsetX, offsetY, 200, 300);

    const mode = document.querySelector("[name=mode]:checked").value;

    ctx.globalCompositeOperation =
        mode === "inside"
        ? "destination-in"
        : "destination-out";

    ctx.drawImage(mask,0,0);

    rctx.clearRect(0,0,200,300);
    rctx.drawImage(canvas,0,0);
});


document.getElementById("download").addEventListener("click",()=>{

    let name = document.getElementById("filename").value || "costume";

    if(!name.endsWith(".png")){
        name += ".png";
    }

    const link = document.createElement("a");
    link.download = name;
    link.href = result.toDataURL("image/png");
    link.click();
});


render();

model.addEventListener("mousedown", e => {

    if (!costume) return;

    dragging = true;

    const rect = model.getBoundingClientRect();

    const scaleX = model.width / rect.width;
    const scaleY = model.height / rect.height;

    startMouseX = (e.clientX - rect.left) * scaleX;
    startMouseY = (e.clientY - rect.top) * scaleY;

    startOffsetX = offsetX;
    startOffsetY = offsetY;

});

window.addEventListener("mousemove", e => {

    if (!dragging) return;

    const rect = model.getBoundingClientRect();

    const scaleX = model.width / rect.width;
    const scaleY = model.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    offsetX = startOffsetX + (mouseX - startMouseX);
    offsetY = startOffsetY + (mouseY - startMouseY);

    render();

});

window.addEventListener("mouseup", () => {

    dragging = false;

});

document.addEventListener("keydown", e => {

    if (!costume) return;

    // Не реагируем, если пользователь печатает в поле имени файла
    if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA"
    ) {
        return;
    }

    const step = e.shiftKey ? 10 : 1;

    switch (e.key) {

        case "ArrowLeft":
            offsetX -= step;
            break;

        case "ArrowRight":
            offsetX += step;
            break;

        case "ArrowUp":
            offsetY -= step;
            break;

        case "ArrowDown":
            offsetY += step;
            break;

        default:
            return;
    }

    e.preventDefault();
    render();

});
