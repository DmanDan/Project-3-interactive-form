const otherJobRole = document.getElementById('other-job-role');
const tShirtColor = document.getElementById('color');
const paymentSelect = document.getElementById('payment');
const payElements = document.querySelectorAll(".payment-methods > div");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const cardInput = document.getElementById("cc-num");
const cardExpMonth = document.getElementById("exp-month");
const cardExpYear = document.getElementById("exp-year");
const cardZip = document.getElementById("zip");
const cardCvv = document.getElementById("cvv");
const activities = document.getElementById("activities")
const activitiesHint = document.getElementById("activities-hint")
const activitiesCheckboxes = document.querySelectorAll("#activities-box input[type='checkbox']")






let totalCost = 0;
nameInput.focus();

//validations
//for text fields this is the regex, for the c/c date dropdowns ensure it has a selection, and set the class valid
function isValidName(name) {
    return /^[a-z ]+$/i.test(name);
}
function isValidEmail(email) {
    return /^[^@]+@[^@.]+\.[\w]+$/.test(email)
}
function isValidCard(card) {
    return /^[0-9]{13,16}$/.test(card)
}
function isValidZip(zip) {
    return /^[0-9]{5}$/.test(zip)
}
function isValidCvv(cvv) {
    return /^[0-9]{3}$/.test(cvv)
}
cardExpMonth.addEventListener("input", (e) =>{
    if (e.target.selectedIndex !== -1){
        e.target.parentNode.classList.remove('not-valid')
        e.target.parentNode.classList.add('valid')
    }
});
cardExpYear.addEventListener("input", (e) =>{
    if (e.target.selectedIndex !== -1){
        e.target.parentNode.classList.remove('not-valid')
        e.target.parentNode.classList.add('valid')
    }
});

//Listen for a change to the checkboxes in the activities.
//update total cost based off activities selected (increase if the box was marked, reduce if the box was unmarked)
//Disable or enable any activities that conflict or no longer conflict with time of selected activities
//Validate that at least one activity is selected
activities.addEventListener('change',(e) => {
    let checked = e.target.checked;
    let eventIsChecked = false;
    if (checked){
        totalCost+=parseInt(e.target.dataset.cost)
    }else{
        totalCost-=parseInt(e.target.dataset.cost)
    }
    document.getElementById('activities-cost').textContent = `Total: $${totalCost}`;
//Loop thru all events that have a specific time.
//Compare the times, if there is a conflict either set or remove a flag and enable or disable the checkbox.
//while looping ensure at least one activity is checked for validation      
        Array.from(activitiesCheckboxes).forEach(element => {
            if (e.target.dataset.dayAndTime && element !== e.target && element.dataset.dayAndTime){
                if (element.dataset.dayAndTime === e.target.dataset.dayAndTime){
                    element.disabled = checked;
                    element.parentNode.setAttribute("conflict",checked);
                }
            }
            if (element.checked){eventIsChecked = true;}
        })
        //set the class and hint properties to either show valid
        if (eventIsChecked){
            activities.className = "activities valid";
            activitiesHint.style.display = "none";
        }else{
            activities.className = "activities not-valid";
            activitiesHint.style.display = "inherit";
    }
});

//initialize with credit card selection and hide other payment information.
//Listen for a change in the payment type
//check the index of the payment information divisions against selected type, only show the one that matches.
paymentSelect.selectedIndex=1;
displayPaymentInfo();
function displayPaymentInfo(){
    for (let index = 1; index < payElements.length; index++) {
        payElements[index].hidden = (index !== paymentSelect.selectedIndex)
    }
}
paymentSelect.addEventListener('change',displayPaymentInfo)

//Disable the color selector
//Listen for a change in shirt style
//enable color select and shows only options that correspond with style selected
tShirtColor.disabled = true;
document.getElementById('shirt-designs').addEventListener('change',(e) => {
    tShirtColor.disabled = false;
    tShirtColor.selectedIndex= 0;
    Array.from(tShirtColor.options).forEach(element => {
        if (element.dataset.theme === e.target.value){
            element.hidden = false;
        } else {
            element.hidden = true;
        }
    });
});

//shows and hides the field to enter a custom Job role if the "other" job title is selected
otherJobRole.hidden=true;
document.getElementById('title').addEventListener('change',(e) => {
    if(e.target.value === 'other') {
        otherJobRole.hidden = false;
    }
    else {
        otherJobRole.hidden = true;
    }
});
//listen for checkboxes to be focused and unfocused. apply a class to highlight/un-highlight each label.
Array.from(activitiesCheckboxes).forEach(element => {
    element.addEventListener('focus',(e)=>{
        e.target.parentNode.classList.add('focus');
    })
    element.addEventListener('blur',(e)=>{
        e.target.parentNode.classList.remove('focus');
    })
})
//event listener to validate in real time.
//modified from the course "Regular Expressions in JS: Validating a Username"
//modifications set error message based on the case, and set valid/not-valid class.
function createListener(validator) {
    return e => {
        const text = e.target.value;
        const valid = validator(text);
        const showTip = !valid;
        const tooltip = e.target.nextElementSibling;
        tooltip.textContent = errorMessage(e.target,text);  
        showOrHideTip(showTip, tooltip);
        if (valid){
            e.target.parentNode.classList.remove("not-valid");
            e.target.parentNode.classList.add("valid");
        }else{
            e.target.parentNode.classList.remove("valid");
            e.target.parentNode.classList.add("not-valid");
        };
    }
}
//determine the error message's for invalid entry
function errorMessage(element, text){
    if (element === nameInput){
        if (text === ""){
            return "Name field cannot be blank";
        }else{
            return "Name field can only contain letters"
        }
    }else if(element === emailInput){
        if (text === ""){
            return "Email field cannot be blank";
        }else{
            return "Email address must be formatted correctly (contain an @ and .) "
        }
    }else if(element === cardInput){return "Credit card number must be between 13 - 16 digits"
    }else if(element ===  cardZip){return "Zip Code must be 5 digits"
    }else if(element ===  cardCvv){return "CVV must be 3 digits"
    }
}
// show element when show is true, hide when false
function showOrHideTip(show, element) {
    if (show) {
      element.style.display = "inherit";
    } else {
      element.style.display = "none";
    }
}
//create the event listeners with the above functions.
nameInput.addEventListener("input", createListener(isValidName));
emailInput.addEventListener("input", createListener(isValidEmail));
cardInput.addEventListener("input", createListener(isValidCard));
cardZip.addEventListener("input", createListener(isValidZip));
cardCvv.addEventListener("input", createListener(isValidCvv));

//checks if an elements parent has a class name of valid. If not set it to not-valid and display the sibling hint.
function parentValid(element){
    if(!element.parentNode.classList.contains('valid')){
        element.parentNode.classList.add("not-valid");
        if(element.nextElementSibling){element.nextElementSibling.style.display = "inherit";}
        return false;
    }
    return true;
}
//On submit, ensure that all required fields have Valid tags, 
//Check name and email. Then if credit card is selected, check all the c/c fields. 
//Finally check the fieldset for the activities.
//If any of these fail, display errors, display tooltips as to why they failed, and prevent the submit, 
document.querySelector("form").addEventListener('submit',(e)=>{
    if(!(parentValid(emailInput)&parentValid(nameInput))){e.preventDefault()}
    if (paymentSelect.selectedIndex === 1&&
        (!(parentValid(cardCvv)&
           parentValid(cardZip)&
           parentValid(cardInput)&
           parentValid(cardExpMonth)&
           parentValid(cardExpYear)
          ))){
        e.preventDefault()
    }
    if (activities.className !== "activities valid"){
        activities.className = "activities not-valid";
        activitiesHint.style.display = "inherit";
        e.preventDefault();
    }
});