const productAI = {

    name: "گردنبند مرواریدی رزگلد",

    material: "rose gold pearl necklace",

    category: "luxury jewelry"

};



const generateBtn =
    document.querySelector("#generateAI");


const promptBox =
    document.querySelector(".prompt-result");



let selectedStyle = "Luxury";

let selectedModel = "Model 1";




// انتخاب استایل و مدل

const aiButtons = document.querySelectorAll(
    ".ai-options button, .ai-model-options button"
);



aiButtons.forEach(btn => {


    btn.addEventListener("click", () => {


        const parent = btn.parentElement;



        parent.querySelectorAll("button")
            .forEach(item => {

                item.classList.remove("active");

            });



        btn.classList.add("active");



        // تشخیص اینکه مربوط به مدل است یا استایل

        if (parent.classList.contains("ai-options")) {

            selectedStyle = btn.innerText;

        }
        else {

            selectedModel = btn.innerText;

        }



    });


});





// ساخت پرامپت

generateBtn.addEventListener(
    "click",
    () => {


        const prompt = `

Create a realistic luxury jewelry photo.

Product:
${productAI.name}


Material:
${productAI.material}


Model:
${selectedModel}


Style:
${selectedStyle}



The model is wearing this exact jewelry.

Keep necklace design unchanged.

Realistic skin texture.

Professional fashion photography.

Luxury brand campaign style.

Studio lighting.

Ultra realistic.

`;



        generateBtn.addEventListener(
            "click",
            async () => {


                const prompt = `

Create a realistic luxury jewelry photo.

Product:
${productAI.name}

Material:
${productAI.material}

Model:
${selectedModel}

Style:
${selectedStyle}

The model is wearing this exact jewelry.

Luxury fashion photography.

Ultra realistic.

`;



                generateBtn.innerHTML =
                    "⏳ در حال ساخت تصویر...";



                const response = await fetch(
                    "http://127.0.0.1:8000/generate-image",
                    {


                        method: "POST",


                        headers: {

                            "Content-Type": "application/json"

                        },


                        body: JSON.stringify({

                            prompt: prompt

                        })


                    });



                const data = await response.json();



                promptBox.innerHTML = `

<img 
src="${data.image}"
class="ai-result-image"
>


`;



                generateBtn.innerHTML =
                    "✨ نمایش روی مدل";


            });



        promptBox.style.display = "block";


    });