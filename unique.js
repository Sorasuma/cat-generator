let costume = null;

const model = document.getElementById("model");
const result = document.getElementById("result");

const mctx = model.getContext("2d");
const rctx = result.getContext("2d");

const uniqueSelect = document.getElementById("uniqueSelect");

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => resolve(img);
        img.onerror = reject;

        img.src = src;
    });
}

async function createMask() {

    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 300;

    const ctx = canvas.getContext("2d");

    try {
        const cat = await loadImage(`assets/unique/${uniqueSelect.value}`);
        ctx.drawImage(cat, 0, 0, 200, 300);
    } catch (e) {}

    return canvas;
}

async function render() {

    mctx.clearRect(0, 0, 200, 300);

    try {

        const cat = await loadImage(`assets/unique/${uniqueSelect.value}`);

        mctx.drawImage(cat, 0, 0, 200, 300);

    } catch (e) {
        console.error(e);
    }

    if (costume) {

        const img = await loadImage(costume);

        mctx.globalAlpha = 0.75;
        mctx.drawImage(img, 0, 0, 200, 300);
        mctx.globalAlpha = 1;

    }

}

uniqueSelect.addEventListener("change", render);

document.getElementById("upload").addEventListener("change", e => {

    const reader = new FileReader();

    reader.onload = () => {

        costume = reader.result;
        render();

    };

    reader.readAsDataURL(e.target.files[0]);

});

document.getElementById("crop").addEventListener("click", async () => {

    if (!costume) return;

    const img = await loadImage(costume);
    const mask = await createMask();

    const canvas = document.createElement("canvas");

    canvas.width = 200;
    canvas.height = 300;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0, 200, 300);

    const mode = document.querySelector("[name=mode]:checked").value;

    ctx.globalCompositeOperation =
        mode === "inside"
            ? "destination-in"
            : "destination-out";

    ctx.drawImage(mask, 0, 0);

    rctx.clearRect(0, 0, 200, 300);
    rctx.drawImage(canvas, 0, 0);

});

document.getElementById("download").addEventListener("click", () => {

    let name = document.getElementById("filename").value || "costume";

    if (!name.endsWith(".png")) {
        name += ".png";
    }

    const link = document.createElement("a");

    link.download = name;
    link.href = result.toDataURL("image/png");

    link.click();

});

render();
