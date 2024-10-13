const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-Indicator]");
const generateBtn = document.querySelector(".generate-btn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[]}|\;:"<>/?;"';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength circle color grey
setIndicator("#ccc")

// set password length
function handleSlider(){ //iska kam hai password ui pe reflect krwata hai
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //kuch aur bhi krna hai
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100/ (max - min) + "% 100%"); 
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow= `0px 0px 12px 1px ${color}`;

}

function getRndInteger( min, max){
    return Math.floor(Math.random() * (max-min)) + min;

}

function generateRandomNumber(){
    return getRndInteger(0,9);

}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbols(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");

    } else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
    
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    console.log("Copy text", passwordDisplay.value)
    //to make copy wala
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(Array){
    //Fisher Yates Method
    for(let i=0;i<Array.length-1;i++){
        //randam j, find out using randam function
        const j = Math.floor(Math.random() * (i+1));
        const temp = Array[i];
        Array[i] = Array[j];
        Array[j]= temp;
    }
    let str = "";
    Array.forEach((el) => (str += el));
    return str;

}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) =>{
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}


allCheckBox.forEach( (checkbox) =>{
    checkbox.addEventListener('change' , handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) =>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    console.log("hellooo")
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected
    if(checkCount == 0) return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    //lets start the journey to find new password
    console.log("Starting the jurney");
    //remove old password
    password = "";

    //lets put the stuff metioned by checkboxes

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numberCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolCheck.checked){
    //     password += generateSymbols();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    
    if(numberCheck.checked)
        funcArr.push(generateRandomNumber);
    
    if(symbolCheck.checked)
        funcArr.push(generateSymbols);

    //compulsry addition

    for(let i =0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    console.log("Compulsry addition done ");
    //remaining addition
    for(let i=0; i<passwordLength-funcArr.length;i++){
        let rndIndex = getRndInteger(0, funcArr.length);
        password += funcArr[rndIndex]();
    }

    console.log("Remaining addition done ");

    //suffle the password

    password = shufflePassword(Array.from(password));
    console.log("shuffiling  done ");

    //show in ui
    passwordDisplay.value = password;
    console.log("UI addition done ");

    //calculate strength
    calcStrength();
});