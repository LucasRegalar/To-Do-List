class Task  {
    constructor(taskText, id) {
        this.text = taskText;
        this.id = id;
        this.editMode = false;
    };

    edit(newText) {
        this.text = newText;
        console.log(this.text);
    };

    toggleEditMode() {
        this.editMode = !this.editMode;
    };

    displayHTML() {
        const editParagraphOrInput = this.editMode? `<div class="task task-edit"> <input value="${this.text}" class="task-edit-input" id="edit-input-${this.id}"/>` : `<div class="task"> <p>${this.text}</p>`
        const editBtnEditOrSave = this.editMode? `<button class="save-btn button" id="save-btn-${this.id}">SAVE</button>` : `<button class="edit-btn button" id="edit-btn-${this.id}">EDIT</button>`
        const editBtnDeleteOrCancel = this.editMode? `<button class="cancel-btn button" id="cancel-btn-${this.id}">CANCEL</button>` : `<button class="delete-btn button" id="delete-btn-${this.id}">DELETE</button>`
            const innerHTML = `
            
                ${editParagraphOrInput}
                <div class="btn-container">
                    ${editBtnEditOrSave}
                    ${editBtnDeleteOrCancel}
                </div>
            </div>`

            return innerHTML;
    };
}


class TaskList {
    constructor() {
        this.tasksArr = [];
        this.idCounter = 1;

        this.taskInput = document.getElementById("task-input");
        this.addTaskBtn = document.getElementById("add-task-btn");
        this.tasksContainer = document.getElementById("tasks-container");
        
        this.isEditModeActive = 0;

        this.addTaskBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (this.isEditModeActive !== 0) {
                alert("Please safe or cancel the active edit before performing other tasks.")
                return;
            }
            this.addTask();
        })

        this.tasksContainer.addEventListener("click", (e) => {
            const target = e.target;
            const clickedId = parseInt(e.target.id.split("-")[2]);
            const index = this.findIndexOfTask(clickedId);

            if (this.isEditModeActive !== 0) {
                if (this.isEditModeActive !== clickedId) {
                    alert("Please safe or cancel the active edit before performing other tasks.")
                    return;
                }
            }

            if(target.classList.contains("delete-btn")) {
                this.deleteTask(clickedId);
            } else if (target.classList.contains("edit-btn")) {
                this.tasksArr[index].toggleEditMode();
                this.displayTaskList();
                this.setFocusToEnd(`#edit-input-${clickedId}`);
                this.isEditModeActive = clickedId;
            } else if (target.classList.contains("save-btn")) {
                this.tasksArr[index].toggleEditMode();
                this.tasksArr[index].edit(document.getElementById(`edit-input-${clickedId}`).value);
                this.displayTaskList();
                this.isEditModeActive = 0;
            } else if (target.classList.contains("cancel-btn")) {
                if(document.getElementById(`edit-input-${clickedId}`).value !== this.tasksArr[index].text) {
                    if(!confirm("Are you sure you want to discard your changes?")) {
                        return;
                    }
                }
                this.tasksArr[index].toggleEditMode();
                this.displayTaskList();
                this.isEditModeActive = 0;
            } else {
                console.log("Unknown Button")
            }
        })
    }

    addTask() {
        if (!this.taskInput.value) {
            alert("Please insert a description to your task");
            return;
        } 
        this.tasksArr.push(new Task(this.taskInput.value, this.idCounter));
        this.idCounter ++;
        this.displayTaskList();
        this.taskInput.value = "";
        console.log(this.tasksArr);
    };

    deleteTask(id) {
        this.tasksArr = this.tasksArr.filter((element) => {
            if (element.id === id) {
                return false;
            }
            return true;
        })
        
        this.displayTaskList();
    };

    setFocusToEnd(cssSelector) {
        const input = this.tasksContainer.querySelector(cssSelector);
        input.focus();

        //Modern Browser that support .setSelectionRange
        if (input.setSelectionRange){
            input.setSelectionRange(input.value.length * 2, input.value.length * 2);
        } 
        //Older Browser that don't support .setSelectionRange
        else {
            input.selectionStart = input.SelectionEnd = input.value.length * 2;
        }
        
    }

    findIndexOfTask(taskId) {
        const index =  this.tasksArr.findIndex((task) => {
            if (task.id === taskId) {
                return true;
            }; 
        })
        return index;
    };

    displayTaskList() {
        this.tasksContainer.innerHTML = "";
        this.tasksArr.forEach((task) => {
            this.tasksContainer.innerHTML += task.displayHTML();
        })
    };

};


const taskList = new TaskList;