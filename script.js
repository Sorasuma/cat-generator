const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


const parts = {

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



let selected = {

    ears:"прямые",
    mane:"умеренная",
    tails:"куцый"

};



function createButtons(){

    createGroup(
        "ears",
        parts.ears,
        "ears"
    );


    createGroup(
        "mane",
        parts.mane,
        "mane"
    );


    createGroup(
        "tails",
        parts.tails,
        "tails"
    );

}



function createGroup(id,data,type){

    const box=document.getElementById(id);


    Object.keys(data).forEach((name,index)=>{


        const label=document.createElement("label");


        const input=document.createElement("input");

        input.type="radio";

        input.name=type;

        input.value=name;


        if(index===0)
            input.checked=true;



        input.addEventListener(
            "change",
            ()=>{

                selected[type]=name;

                draw();

            }
        );



        const span=document.createElement("span");

        span.innerText=name;


        label.appendChild(input);

        label.appendChild(span);


        box.appendChild(label);


    });


}




function loadImage(src){

    return new Promise(resolve=>{

        const img=new Image();

        img.src=src;

        img.onload=()=>resolve(img);

    });

}



async function draw(){


    const body =
        await loadImage(parts.body);


    canvas.width=body.width;
    canvas.height=body.height;



    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.drawImage(
        body,
        0,
        0
    );



    const layers=[

        parts.mane[selected.mane],

        parts.ears[selected.ears],

        parts.tails[selected.tails]

    ];



    for(
        let layer of layers
    ){

        const img =
            await loadImage(layer);


        ctx.drawImage(
            img,
            0,
            0,
            canvas.width,
            canvas.height
        );

    }

}





document
.getElementById("download")
.addEventListener(
"click",
()=>{


const link=document.createElement("a");


link.download =
`кот_${selected.ears}_${selected.mane}_${selected.tails}.png`;


link.href =
canvas.toDataURL("image/png");


link.click();


});





document
.getElementById("random")
.addEventListener(
"click",
()=>{


function random(obj){

    const keys=
        Object.keys(obj);

    return keys[
        Math.floor(
            Math.random()*keys.length
        )
    ];

}


selected.ears=random(parts.ears);

selected.mane=random(parts.mane);

selected.tails=random(parts.tails);



document.querySelector(
`input[value="${selected.ears}"]`
).checked=true;


document.querySelector(
`input[value="${selected.mane}"]`
).checked=true;


document.querySelector(
`input[value="${selected.tails}"]`
).checked=true;



draw();


});




createButtons();

draw();
