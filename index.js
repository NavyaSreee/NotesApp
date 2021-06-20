//Getting access to required HTML Elements
const body = document.getElementsByTagName("body")[0];
const container = document.getElementsByClassName("container")[0];
const controls = document.getElementsByClassName("controls")[0];
const inputDiv = document.getElementsByClassName("inputArea")[0];
const inputTitle = document.querySelector(".inputArea input");
const inputContent = document.querySelector(".inputArea textarea");
const displayArea = document.getElementById("displayArea");
const trashBtn = document.getElementsByClassName("fa-trash")[0];
const closeBtn = document.getElementsByClassName("fa-times")[0];
const addBtn = document.getElementById("footer");
const bgClr = document.getElementById("bgClrs");

//Initializing required variables
let noteID = 1; 
let opndId = 0;
let opndTitle = "";
let opndContent = "";
let opndClr = "";
let clr = "#282828"; 
let ipAreaClr = "black"; 

/*console.log(screen.width);*/

// Event Listeners
document.addEventListener("DOMContentLoaded", displayNotes);  
addBtn.addEventListener("click", openInputArea); 
closeBtn.addEventListener("click", addNewNote); 
trashBtn.addEventListener("click", deleteNote); 
bgClr.addEventListener("click", function chgNoteBckgrndClr(e) {  
    const item = e.target; 

    console.log(item);
    const selectedClr = document.querySelectorAll(".selected"); //

    if(selectedClr.length == 0){    

        e.target.getElementsByClassName("fas")[0].classList.add("selected");
                
    } else {
        selectedClr[0].classList.remove("selected"); 
        e.target.getElementsByClassName("fas")[0].classList.add("selected"); 
    }
   
    clr = item.getAttribute("color"); 
    ipAreaClr = clr; 
    let cN = inputDiv.childNodes; 
    cN[3].style.background = ipAreaClr; 
    cN[5].style.background = ipAreaClr; 
    body.style.background = ipAreaClr; 
    container.style.background = ipAreaClr;
    controls.style.background = ipAreaClr;
    inputDiv.style.background = ipAreaClr;
    bgClr.style.background = ipAreaClr;
    
});



function Note(id, title, note, date, color){  
    this.id = id;
    this.title = title;
    this.note = note;
    this.date = date;
    this.color = color;
}


function getLclStrgData() {  
    return localStorage.getItem("notes") ? JSON.parse(localStorage.getItem("notes")) : [];
}


function openInputArea() {  
    inputDiv.style.display = "block";
    displayArea.style.display = "none";
}


function addNewNote() {   
    const newTitle = inputTitle.value;
    const newContent = inputContent.value;
    const varDate = new Date();  
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const yr = varDate.getFullYear();
    const mnth = months[varDate.getMonth()];
    const dateDigit = varDate.getDate();
    const hr = varDate.getHours();
    const min = varDate.getMinutes();
    const sec = varDate.getSeconds();
    let displayDate = '';
    if(min.toString().length == 1){  
        displayDate = dateDigit + ' ' + mnth + ' ' + yr + ', ' + hr + ':' + '0' + min ; 
    }
    else {
        displayDate = dateDigit + ' ' + mnth + ' ' + yr + ', ' + hr + ':' + min;
    }
   
    
    if(validateInput(newTitle, newContent)) {  

      if(chkExistingNote(newTitle, newContent)){
                
        let lclStrgData = getLclStrgData(); 
        let newNote = new Note(noteID, newTitle, newContent, displayDate, clr);
        noteID++;
        
        lclStrgData.push(newNote);  
               
        createNote(newNote); 

        localStorage.setItem("notes", JSON.stringify(lclStrgData)); 
        inputTitle.value = ""; 
        inputContent.value = "";

        inputDiv.style.display = "none"; 
        displayArea.style.display = "grid"; 
        setBackClrs(); 
    }
} 
    
}


function validateInput(title, content) { 
    if(title !== "" && content !== "") { 
        return true;
    } else {
        if(title === "") inputTitle.classList.add("warning"); 
        if(content === "") inputContent.classList.add("warning"); 
    }
    setTimeout( () => {
        inputTitle.classList.remove("warning"); 
        inputContent.classList.remove("warning"); 
    }, 1600);
}
 

function createNote(item) {  
    const newDiv = document.createElement("div"); 
    newDiv.classList.add("newinputArea"); 
    newDiv.setAttribute("data-id", item.id); 
    newDiv.setAttribute("data-color", item.color); 
    let newTitle = document.createElement("h3"); 
    newTitle.innerText = item.title;
    let newNote = document.createElement("h5"); 
    newNote.innerHTML = item.note;
    let showDate = document.createElement("span"); 
    showDate.innerHTML = item.date;
    
    newDiv.appendChild(newTitle);
    newDiv.appendChild(newNote);
    newDiv.appendChild(showDate);
    displayArea.appendChild(newDiv);

    newDiv.style.background = item.color; 

    newDiv.addEventListener("mouseenter", function() {  
        newDiv.style.transform = "scale(1.1)"; 
    })

    newDiv.addEventListener("mouseleave", function() {  
        newDiv.style.transform = "scale(1)";
    })
    
    newDiv.addEventListener("dblclick", function(e) { 
            displayArea.style.display = "none"; 
            newDiv.classList.add("inputArea");  
            inputDiv.style.display = "block"; 
            
            opndId = newDiv.dataset.id; 
            opndTitle = newDiv.childNodes[0].innerHTML;
            opndContent = newDiv.childNodes[1].innerHTML;
            
            opndClr = newDiv.dataset.color; 
            clr = opndClr; 
                                
            document.querySelector(".inputArea input").value =  opndTitle; 
            document.querySelector(".inputArea textarea").value = opndContent;   
            document.querySelector(".inputArea input").style.background = opndClr;  
            document.querySelector(".inputArea textarea").style.background = opndClr;
            body.style.background = opndClr;
            container.style.background = opndClr;
            controls.style.background = opndClr;
            inputDiv.style.background = opndClr;
            bgClr.style.background = opndClr;
            
            addSlctdClass(); 
        
    })
    
}

function chkExistingNote(title, content) {
    if(opndId == 0) { //If an existing note isn't opened, opndId would be Zero.
        return true;
    }else if(opndTitle === title && opndContent === content && opndClr === clr) {
        let lclStrgData = getLclStrgData();
        console.log(lclStrgData);
        let existingOpenedNote = lclStrgData.filter(item => {
            return item.id === parseInt(opndId);
        })
        let toBeAddedExistingNote = existingOpenedNote[0];
        createNote(toBeAddedExistingNote); 
        inputDiv.style.display = "none"; 
        displayArea.style.display = "grid"; 
        resetOpndValues();
        setBackClrs();
    } else {
        reOpndNoteDelFromLclStrg(opndId); 
        return true; 
    }
}


function addSlctdClass() {
    const opndClrClass = document.getElementsByClassName(opndClr)[0];
    const iElmnt = opndClrClass.childNodes[0];
    iElmnt.classList.add("selected");
}

function resetOpndValues() {
    opndId = 0;
    opndTitle = "";
    opndContent = "";
    opndClr = ""; 
}


function setBackClrs() {
    clr = "#282828";
    ipAreaClr = "black"; 
    let cN = inputDiv.childNodes;
    cN[3].style.background = ipAreaClr; 
    cN[5].style.background = ipAreaClr;
    body.style.background = ipAreaClr;
    container.style.background = ipAreaClr;
    controls.style.background = ipAreaClr;
    inputDiv.style.background = ipAreaClr;
    bgClr.style.background = ipAreaClr;

    const selectedClr = document.querySelectorAll(".selected");  
    
    if(selectedClr.length == 1)  
    document.getElementsByClassName("selected")[0].classList.remove("selected");

}


function reOpndNoteDelFromLclStrg(n) { 
    let lclStrgData = getLclStrgData();
    /*console.log(typeof(n)); */
    let newlclStrgData = lclStrgData.filter(item =>{ 
       /* console.log(typeof(item));
        console.log(Array.isArray(item)); */
        return item.id !== parseInt(n); 
    })
    
    localStorage.setItem("notes", JSON.stringify(newlclStrgData)); 
    resetOpndValues();
}


function displayNotes() {  
    let lclStrgData = getLclStrgData();
    if(lclStrgData.length > 0){   
        noteID = lclStrgData[lclStrgData.length-1].id;
        noteID++;
    } else {
        noteID = 1;
    }

    lclStrgData.forEach(item => {  
        createNote(item);
    })

}
 

function deleteNote() {
    setBackClrs(); 
    reOpndNoteDelFromLclStrg(opndId); 
    document.querySelector(".inputArea input").value = ""; 
    document.querySelector(".inputArea textarea").value = "";
    inputDiv.style.display = "none";  
    displayArea.style.display = "grid"; 
    console.log(opndId);
}

