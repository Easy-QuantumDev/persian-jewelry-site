const plus = document.querySelector(".plus");
const minus = document.querySelector(".minus");
const number = document.querySelector(".qty-number");


let count = 1;


plus.addEventListener("click",()=>{
    count++;
    number.innerHTML = count;
});


minus.addEventListener("click",()=>{
    if(count > 1){
        count--;
        number.innerHTML = count;
    }
});