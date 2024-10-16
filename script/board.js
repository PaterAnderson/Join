sessionStorage.setItem('kanbanId', '');

const priorityMap = {
    "urgent": "../assets/icons/urgent.svg",
    "medium": "../assets/icons/medium.svg",
    "low": "../assets/icons/low.svg"
};

const categoryMap = {
    "User Story": "#0038FF",
    "Technical Task": "#1FD7C1;"
}

function initBoard() {
    getTasksFromFirebase();
    fetchAllContactNames();
}

async function loadFirebase(url) {
    let response = await fetch(url)
    let responseAsJson = response.json()
    return responseAsJson
}

async function processData(url) {
    try {
        data = await loadFirebase(url)
        return data
    } catch (error) {
        console.log(error)
    }
}

async function getTasksFromFirebase() {
    document.getElementById('to-do').innerHTML = ''
    document.getElementById('in-progress').innerHTML = ''
    document.getElementById('await-feedback').innerHTML = ''
    document.getElementById('done').innerHTML = ''
    try {
        let counter = 0
        array = await processData(`${BASE_URL}/tasks.json`)
        Object.keys(array).forEach(key => {

            let task = array[key]
            let id = task.kanbanId

            renderTask(task, id)

            counter++
        })
    } catch (error) {
        return
    } finally {
        checkIfTaskTrue()
    }
}

let to_do_kanban = false;
let in_progress_kanban = false;
let await_feedback_kanban = false;
let done_kanban = false;

function checkIfTaskTrue(){
    if (document.getElementById('to-do').querySelector('.card-board')) {
        to_do_kanban = false
    }else{
        to_do_kanban = true
    }

    if (document.getElementById('in-progress').querySelector('.card-board')) {
        in_progress_kanban = false
    }else{
        in_progress_kanban = true
    }

    if (document.getElementById('await-feedback').querySelector('.card-board')) {
        await_feedback_kanban = false
    }else{
        await_feedback_kanban = true
    }

    if (document.getElementById('done').querySelector('.card-board')) {
        done_kanban = false
    }else{
        done_kanban = true
    }

    renderNoTaskToDo()
}

function renderNoTaskToDo(){
    if (to_do_kanban) {
        document.getElementById('to-do').innerHTML = '<div id="no-task-in-kanban-to-do" class="no-task-in-kanban">No tasks To do</div>'
    }else{
        if(document.getElementById('no-task-in-kanban-to-do')){
            document.getElementById('no-task-in-kanban-to-do').remove()
        }
    }

    if (in_progress_kanban) {
        document.getElementById('in-progress').innerHTML = '<div id="no-task-in-kanban-in-progress" class="no-task-in-kanban">No tasks To do</div>'
    }else{
        if(document.getElementById('no-task-in-kanban-in-progress')){
            document.getElementById('no-task-in-kanban-in-progress').remove()
        }
    }

    if (await_feedback_kanban) {
        document.getElementById('await-feedback').innerHTML = '<div id="no-task-in-kanban-await-feedback" class="no-task-in-kanban">No tasks To do</div>'
    }else{
        if(document.getElementById('no-task-in-kanban-await-feedback')){
            document.getElementById('no-task-in-kanban-await-feedback').remove()
        }
    }

    if (done_kanban) {
        document.getElementById('done').innerHTML = '<div id="no-task-in-kanban-done" class="no-task-in-kanban">No tasks To do</div>'
    }else{
        if(document.getElementById('no-task-in-kanban-done')){
            document.getElementById('no-task-in-kanban-done').remove()
        }
    }
}

function renderTask(task, id) {
    let Elementid = document.getElementById(id)
    Elementid.innerHTML += returnTaskCard(task, returnPrio(task), categoryMap[task.category]);
    if ('subtasks' in task) {
        let subtask = returnSubtask(task)
        document.getElementById(`subtask${task.title}`).innerHTML = '';
        document.getElementById(`subtask${task.title}`).innerHTML = renderSubtask(subtask.total, subtask.done, subtask.percentage, task.title)
    }
    if ('assigned' in task) {
        let array = task.assigned
        let taskName = task.title
        renderAssignedContacts(array, taskName)
    }
    
    checkIfTaskTrue()
}

function renderAssignedContacts(array, taskName) {
    for (let i = 0; i < array.length; i++) {
        assingContacts(array, i, taskName)
    }
}

function assingContacts(contacts, i, taskName) {
    let id = document.getElementById(`contacts${taskName}`)
    id.innerHTML += returnAssignedContacts(contacts[i].color, getInitials(contacts[i].contact))
}

function getInitials(name) {
    let nameParts = name.split(' ');
    let initials = nameParts.map(part => part.charAt(0).toUpperCase());
    return initials.join('');
}

function returnSubtask(task) {
    let done = 0;;
    let total = 0;

    let array = task.subtasks
    for (let i = 0; i < array.length; i++) {
        if (array[i].done === true) {
            done++
        }
        total++;
    }

    let percentage = (done / total) * 100;
    percentage = Math.round(percentage)

    return {
        done,
        total,
        percentage
    }
}

function returnPrio(task) {
    let prio = task.prio
    let prioSVG = priorityMap[prio]
    if (task.prio === '') {
        return
    }
    return prioSVG
}

async function getOpenTaskOverlay(taskName) {
    let overlay = document.getElementById('card-board-task-overlay')
    try {
        let data = await processData(`${BASE_URL}/tasks.json`)
        document.getElementById('card-board-overlay-background').classList.toggle('display-opacity-board')
        overlay.classList.add('overlay-add-task-transition')
        renderOverlay(data, taskName, overlay)
    } catch (error) {
        console.log(error)
    }
}

function renderOverlay(data, taskName, overlay) {
    Object.values(data).forEach(entry => {
        if (entry.title === taskName) {
            data = entry
            subtaskCollection = entry.subtasks
            overlay.innerHTML = returnTaskOverlay(data)
            if (data.prio) {
                document.getElementById('prio-card-overlay').innerHTML = renderPrio(data, returnPrio(entry))
            }
            if ('assigned' in data) {
                let assignedContainer = document.getElementById('render-assigned-content-overlay')
                document.getElementById('assigned-container-board').classList.remove('display-board-none')

                if (data.assigned.length > 4) {
                    assignedContainer.classList.add('overflow-card-board')
                }

                for (let i = 0; i < data.assigned.length; i++) {
                    assignedContainer.innerHTML += returnContactsCardOverlay(data.assigned[i].contact, getInitials(data.assigned[i].contact), data.assigned[i].color)
                }
            }
            if ('subtasks' in data) {
                let subtaskContainer = document.getElementById('render-subtasks-content-overlay')
                document.getElementById('subtask-container-board').classList.remove('display-board-none')

                if (data.subtasks.length > 3) {
                    subtaskContainer.classList.add('overflow-card-board')
                }

                for (let i = 0; i < data.subtasks.length; i++) {
                    subtaskContainer.innerHTML += returnSubtaskCardOverlay(data, i)

                }
            }
        }
    })
}

async function getEditTaskOvleray(taskName) {
    subtaskCollection = [];
    editTask = true
    try {
        let data = await processData(`${BASE_URL}/tasks.json`)
        editTaskOverlay(data, taskName)
    } catch (error) {
        console.log(error)
    }
}

function editTaskOverlay(data, taskName) {
    Object.values(data).forEach(entry => {
        if (entry.title === taskName) {
            data = entry
            document.getElementById('card-board-task-overlay').innerHTML = returnEditOverlay(data)

            if(entry.prio === 'low'){
                if(document.getElementById('prio_button3').classList.contains('white-bg')){
                    prioButton3()
                }
                prio = 'low'
            }

            if(entry.prio === 'medium'){
                if(document.getElementById('prio_button2').classList.contains('white-bg')){
                    prioButton2()
                }
                prio = 'medium'
            }

            if(entry.prio === 'urgent'){
                if(document.getElementById('prio_button1').classList.contains('white-bg')){
                    prioButton1()
                }
                prio = 'urgent'
            }

            document.getElementById('text_area').value = data.description

            if ('subtasks' in data) {
                for (let i = 0; i < data.subtasks.length; i++) {
                    let internTask = {
                        task: data.subtasks[i].task,
                        done: data.subtasks[i].done,
                        edit: false
                    }
                    subtaskCollection.push(internTask)
                }
            }

            if ('assigned' in data) {
                for (let i = 0; i < data.assigned.length; i++) {
                    selectedContacts.push({ contact: data.assigned[i].contact, color: data.assigned[i].color });
                    currentNumberOfSelectedContacts++;
                }
            }

            updateCheckedStatus();
            renderContacts();
            renderAllSubtasks();
            document.getElementById('circles_contacts_div').innerHTML = '';
            showContactsAsCircles();
        }

    })

}

let taskSave = {};


async function getEditToFirebase(taskName, callback) {
    try {
        data = await processData(`${BASE_URL}/tasks.json`)
        taskSave = data;
        callback(taskName)
    } catch (error) {
        console.log(error)
    }
}

let previoussubtasklength = 0;
let currentsubtasklength;
let prioEdit;

function editDataInArray(taskName) {
    let date = document.getElementById('input_due_date').value
    let discription = document.getElementById('text_area').value
    let title = document.getElementById('title_input').value
    let oldTaskName = taskName
    prioEdit = taskSave[oldTaskName].prio

    if (taskName !== title) {
        for (let key in taskSave) {
            if (key.includes(taskName)) {
                let newKey = key.replace(taskName, title);
                taskSave[newKey] = taskSave[key];
                delete taskSave[key];
            }
        }

        taskName = title
    }

    Object.assign(taskSave[taskName], {
        date: date,
        description: discription,
        title: title,
        subtasks: subtaskCollection.map(item => ({ ...item, edit: undefined })),
        assigned: selectedContacts,
        prio: prioEdit
    })

    changeValue(oldTaskName, taskName);
    let subtaskValue = returnSubtask(taskSave[taskName])
    currentsubtasklength = taskSave[taskName].subtasks.length;
    checkSubtaskTotal(taskName, oldTaskName)
    if(document.getElementById(`subtask${taskName}`).innerHTML.trim() !== ""){
        changeSubtaskValue(subtaskValue.done, subtaskValue.total, subtaskValue.percentage, taskName)
    }
    previoussubtasklength = currentsubtasklength;
    editTask = false
    setTimeout(() => {
        document.getElementById('card-board-overlay-background').classList.add('display-opacity-board')
        getOpenTaskOverlay(taskName)
    }, 400)

    changeContact(taskName)
    POSTfirebase();
    selectedContacts = [];
    currentNumberOfSelectedContacts = 0;
    prio = '';
}

 function checkSubtaskTotal(taskName){
    console.log(currentsubtasklength)
     if(taskSave[taskName].subtasks.length === 0){
        document.getElementById(`subtask${taskName}`).replaceChildren()
     }

     if(previoussubtasklength === 0 && currentsubtasklength > 0){
        let subtask = returnSubtask(taskSave[taskName])
        document.getElementById(`subtask${taskName}`).innerHTML = '';
        document.getElementById(`subtask${taskName}`).innerHTML = renderSubtask(subtask.total, subtask.done, subtask.percentage, taskSave[taskName].title)
    }
 }

function changeValue(oldTaskName, taskName) {
    let changeTitle = document.getElementById('task-title' + `${oldTaskName}`)
    changeTitle.innerText = taskSave[taskName].title
    changeTitle.id = 'task-title' + `${taskSave[taskName].title}`

    let changeContacts = document.getElementById(`contacts${oldTaskName}`)
    changeContacts.id = 'contacts' + `${taskSave[taskName].title}` 

    let changeDescirptio = document.getElementById('task-description' + `${oldTaskName}`)
    changeDescirptio.innerText = taskSave[taskName].description
    changeDescirptio.id = 'task-description' + `${taskSave[taskName].title}`

    let changeButtonForTaskOverlay = document.getElementById(`${oldTaskName}`)
    changeButtonForTaskOverlay.onclick = function () {
        getOpenTaskOverlay(taskName)
    }
    changeButtonForTaskOverlay.id = `${taskSave[taskName].title}`

    let changeOkButtonForEdit = document.getElementById(`firebase-button${oldTaskName}`)
    changeOkButtonForEdit.onclick = function () {
        let callback = editDataInArray
        getEditToFirebase(taskName, callback)
    }

    let priocard = document.getElementById(`priocard${oldTaskName}`)
    priocard.id = `priocard${taskName}`

    if(document.getElementById(`subtask${oldTaskName}`).innerHTML.trim() !== ""){
        let totalNumbers = document.getElementById('total' + `${oldTaskName}`)
        let progressSubtask = document.getElementById('progress' + `${oldTaskName}`)
        let subtask = document.getElementById(`subtask${oldTaskName}`)
    
        totalNumbers.id = 'total' + `${taskSave[taskName].title}`
        progressSubtask.id = 'progress' + `${taskSave[taskName].title}`
        subtask.id = 'subtask' + `${taskSave[taskName].title}`
    }


    changeOkButtonForEdit.id = `firebase-button${taskSave[taskName].title}`
    let urgent = document.getElementById('prio_button1')
    let medium = document.getElementById('prio_button2')
    let low = document.getElementById('prio_button3')

    urgent.onclick = function () {
        changePrio('urgent', taskName)
        prioButton1()
    }

    medium.onclick = function () {
        changePrio('medium', taskName)
        prioButton2()
    }

    low.onclick = function () {
        changePrio('low', taskName)
        prioButton3()
    }
}

