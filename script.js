const typeTask = document.getElementById("taskTxt");
const displayItems = document.querySelector(".taskitems");
const contain = document.querySelector(".container");
const displayerrors = document.querySelector("p");

function addTask(){
    if (typeTask.value === ''|| typeTask.value===null){
        displayerrors.style.display = "inline";
        displayerrors.textContent = "Please Enter a task";
    }else{
        displayerrors.style.display = "none";
        //creating elements
        const li = document.createElement("li");
        const ischeck= document.createElement("span");
        const deleteTask = document.createElement("span");
        const showText = document.createElement("span");

        //adding classes
        ischeck.classList.add("ischecked");
        deleteTask.classList.add("delete");

        //add content to the elements
        showText.textContent = typeTask.value;
        ischeck.innerHTML=`<img src="icons/unchecked.svg" alt="unchecked"></span>`;
        deleteTask.innerHTML = `<img src="icons/cancel.svg" alt="Delete"></span>`;

        //append to html
        li.appendChild(ischeck);
        li.appendChild(showText);
        li.appendChild(deleteTask);
        displayItems.appendChild(li);

        ischeck.addEventListener('click', () => {
            check(ischeck, showText);
           
        });
        
        // This is wrong bcoz it doesn't wait for the button to be 
        // clicked
        /*
            ischeck.addEventListener('click', check(ischeck, showText));
        */
        deleteTask.addEventListener("click", () => {
            taskDelete(li);            
        });
    }
    typeTask.value='';
    saveData();  
}

function check(ischeck,showText){
    if(ischeck.innerHTML.includes('unchecked')){
        ischeck.innerHTML=`<img src="icons/checked.svg" alt="checked"></span>`;
        showText.style.textDecoration ="line-through";
    }else{
        ischeck.innerHTML=`<img src="icons/unchecked.svg" alt="unchecked"></span>`;
        showText.style.textDecoration ="none";
    }
    saveData();
}

function taskDelete(li){
        displayItems.removeChild(li); 
        saveData();  
}
/* 
from here i did by myself but used gpt to make it better. Below is what i did:

    function saveData(){ 
        localStorage.setItem("data",displayItems.innerHTML);
    }

    function showData(){ 
    displayItems.innerHTML= localStorage.setItem("data"); 
    }
    showData();

--1.This was not efficient bcoz it saves the whole html markup thus taking much space. 
--2.Also making it prone to cross site scripting.
--3.When i save and restore using innerHtml the event listeners are not loaded back up thus i have 
  to manually add them again.
--4.This approach is less flexible bcoz i was planning on adding filter, sorting and due dates but saving
  the data with innerhtml would make it not easy to do so since i would have parse the html inorder to
  extract the data back

*/

function escapeHTML(text) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}
// this is what no 4 means. i would do this code in the showData
function saveData() {
    const tasks = Array.from(displayItems.children).map(li => {
        return {
            text: li.querySelector('span:nth-child(2)').textContent,
            checked: li.querySelector('.ischecked img').src.includes('checked'),
            unchecked: li.querySelector('.ischecked img').src.includes('unchecked')
        };
    });
    localStorage.setItem("data", JSON.stringify(tasks));
}

function showData() {
    const data = JSON.parse(localStorage.getItem("data"));
    if (data) {
        data.forEach(task => {
            const li = document.createElement("li");
            const ischeck = document.createElement("span");
            const deleteTask = document.createElement("span");
            const showText = document.createElement("span");

            // Add classes
            ischeck.classList.add("ischecked");
            deleteTask.classList.add("delete");

            // Add content with escapeHTML to prevent XSS
            showText.textContent = escapeHTML(task.text);

            // Check if task was checked or unchecked
            if (task.unchecked === true) {
                // If unchecked, show unchecked icon and remove strike-through
                ischeck.innerHTML = `<img src="icons/unchecked.svg" alt="unchecked">`;
                showText.style.textDecoration = "none";
            }else if (task.checked === true) {
                // If checked, show checked icon and apply strike-through
                ischeck.innerHTML = `<img src="icons/checked.svg" alt="checked">`;
                showText.style.textDecoration = "line-through";
            }

            // Add delete button content
            deleteTask.innerHTML = `<img src="icons/cancel.svg" alt="Delete">`;

            // Append to HTML
            li.appendChild(ischeck);
            li.appendChild(showText);
            li.appendChild(deleteTask);
            displayItems.appendChild(li);

            // Event listeners for checking and deleting
            ischeck.addEventListener('click', () => {
                check(ischeck, showText);
            });
            deleteTask.addEventListener("click", () => {
                taskDelete(li);
            });
        });
    }
}


showData();