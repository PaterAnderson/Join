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

    changeContact(oldTaskName, taskName)
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

async function POSTfirebase() {
    try {
        await fetch(`${BASE_URL}` + `/tasks.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskSave)
        })

    } catch (error) {
        console.log(error)
    } finally {
        taskSave = {};
    }
}

async function markSubtaskDone(i, taskName) {
    let checkmark = document.getElementById(`checkmark${i}`)
    let text = document.getElementById(`subtask-text${i}`)
    if (subtaskCollection[i].done === true) {
        subtaskCollection[i].done = !subtaskCollection[i].done
        checkmark.src = "../assets/icons/check-mark-subtask-overlay-unchecked.svg"
        text.style.textDecoration = ''
    } else {
        subtaskCollection[i].done = !subtaskCollection[i].done
        checkmark.src = "../assets/icons/check-mark-subtask-ovleray-checked.svg"
        text.style.textDecoration = 'line-through'
    }

    let callback = pushSubtaskDone
    await getEditToFirebase(taskName, callback)

}

async function changePrio(prioTask, taskName) {
    prioEdit = prioTask
    document.getElementById(`priocard${taskName}`).src = priorityMap[prioTask];
    document.getElementById(`priocard${taskName}`).onerror = null;

    let callback = pushUrgent
    await getEditToFirebase(taskName, callback)
}

function changeContact(oldTaskName) {
    document.getElementById(`contacts${oldTaskName}`).innerHTML = ''
    renderAssignedContacts(selectedContacts, oldTaskName)
}

function pushUrgent(taskName) {
    Object.assign(taskSave[taskName], {
        prio: prioEdit
    })
    POSTfirebase();
}

function pushSubtaskDone(taskName) {
    Object.assign(taskSave[taskName], {
        subtasks: subtaskCollection.map(item => ({ ...item, edit: undefined }))
    })

    let subtaskValue = returnSubtask(taskSave[taskName])
    changeSubtaskValue(subtaskValue.done, subtaskValue.total, subtaskValue.percentage, taskName)
    POSTfirebase();
}

function changeSubtaskValue(done, total, percentage, taskName) {
    let totalNumbers = document.getElementById('total' + `${taskName}`)
    let progressSubtask = document.getElementById('progress' + `${taskName}`)

    totalNumbers.innerText = `${done}/${total} Subtasks`
    progressSubtask.style.width = `${percentage}%`
}

function setPositionMarker(id) {
    let input = document.getElementById(id);
    let valueLength = input.value.length;
    input.setSelectionRange(valueLength, valueLength)
}

function closeCardOverlay() {
    document.getElementById('card-board-overlay-background').classList.add('display-opacity-board')
    document.getElementById('card-board-task-overlay').classList.remove('overlay-add-task-transition')
    setTimeout(() => {
        document.getElementById('card-board-task-overlay').innerHTML = ''
    }, 250)
    subtaskCollection = [];
    selectedContacts = [];
    currentNumberOfSelectedContacts = 0;
    prio = '';
    editTask = false
}


let currentDraggingElement;
let currentDraggingId;
let nextDraggingId;
let draggingStatus;

function startDragging(elementid, kanbanId) {
    currentDraggingElement = elementid;
    currentDraggingId = kanbanId;
    draggingStatus = true;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(id) {
    let callback = changeKanbanId
    getEditToFirebase(currentDraggingElement, callback)
    nextDraggingId = id;
    document.getElementById(id).classList.remove('hilighting-kanban')
}

function changeKanbanId(taskName) {
    Object.assign(taskSave[taskName], {
        kanbanId: nextDraggingId
    })
    renderDraggedElement(taskName)
    draggingStatus = false;
    POSTfirebase();
}

async function getDataForRenderStatus() {
    await getEditToFirebase(currentDraggingElement, checkDraggingStatusRender)
}

function checkDraggingStatusRender(taskName) {
    if (draggingStatus === true) {
        renderTask(taskSave[taskName], currentDraggingId)
    }
    draggingStatus = false
    
}

function renderDraggedElement(taskName) {
    renderTask(taskSave[taskName], nextDraggingId)
    checkIfTaskTrue()
    
}

async function deleteTaskFromBoard(taskName) {
    document.getElementById(taskName).remove()
    closeCardOverlay()

    let callback = deleteTask
    await getEditToFirebase(taskName, callback)
    setTimeout(() => {
        checkIfTaskTrue()
    },200)
}

function deleteTask(taskName) {
    delete taskSave[taskName]
    POSTfirebase();
}

function hilightDrag(id) {
    document.getElementById(id).classList.add('hilighting-kanban')
}

function removehilightDrag(id) {
    document.getElementById(id).classList.remove('hilighting-kanban')
}

function ondragRemoveCurrentElement() {
    if (document.getElementById(currentDraggingElement)) {
        document.getElementById(currentDraggingElement).remove()
    }
}

function searcFocus() {
    document.querySelector('.search-input').addEventListener('input', () => {
        let query = document.querySelector('.search-input').value.toLocaleLowerCase()
        let cards = document.querySelectorAll('.card-board')

        cards.forEach((card) => {
            let cardtitle = card.querySelector('.card-board-title').textContent.toLocaleLowerCase()
            let carddescription = card.querySelector('.card-board-description').textContent.toLocaleLowerCase()

            if (cardtitle.includes(query) || carddescription.includes(query)) {
                card.style.display = 'flex'
            } else {
                card.style.display = 'none'
            }
            
        });

        let allCardsAreNone = Array.from(cards).every(card => card.style.display === 'none');

        if (allCardsAreNone) {
            document.getElementById('error-message-search').innerText = 'Kein Task gefunden!';
        } else {
            document.getElementById('error-message-search').innerHTML = '';
        }
    });

}


let longPressTimer;
let isDragging = false;
let draggedElement = null;
let dropTarget = null;
let parentStartId = null;
let milliseconds = 0;
let interval;
let touching = false;
let canDrop = false

function returnNone(){
    return;
}

// Funktion, um zu erkennen, ob ein Longtouch stattgefunden hat
async function startLongTouch(event, task, kanban) {
    console.log('C')
    touching = true;
    startTouchCounter()
    console.log(milliseconds + 'test1')
    await getEditToFirebase(task, returnNone)
    setTimeout(() => {
        if(milliseconds >= 490){
        console.log('erfolg')
        canDrop = true;
        startDragging(task, kanban)
        draggedElement = event.target.closest('.card-board');
        const parentElement = draggedElement.closest('.kanban-card-board');
        parentStartId = parentElement ? parentElement.id : null;
        isDragging = true;
        ondragRemoveCurrentElement()
        createDragStatusElement()
        }else{
            console.log('abbruch')
            console.log(milliseconds + 'test2')
        }
        console.log('E')
    }, 600);

}


// Funktion, die ausgelöst wird, wenn das Element während des Longtouches bewegt wird
function onTouchMove(event) {
    if (isDragging) { {
            event.preventDefault(); // Verhindert das Standardverhalten

            const followElement = document.getElementById('drag-status');
            console.log(followElement)
        
            if (followElement) {
                const touch2 = event.touches[0];
                followElement.style.left = touch2.pageX + 'px';
                followElement.style.top = touch2.pageY + 'px';
            }
        
            // Finde das aktuelle Ziel unter dem Finger
            const touch = event.touches[0];
            dropTarget = document.elementFromPoint(touch.clientX, touch.clientY).closest('.kanban-card-board');
        
        }
    }
}

function createDragStatusElement() {
    const dragStatus = document.createElement('div');
    dragStatus.id = 'drag-status';
    document.body.appendChild(dragStatus);

    // Style für das Element setzen (alternativ könntest du dies im CSS machen)
    dragStatus.style.position = 'absolute';
    dragStatus.style.width = '50px';
    dragStatus.style.height = '50px';
    dragStatus.style.backgroundColor = 'white';
    dragStatus.style.border = '1px solid black';
    dragStatus.style.boxShadow = '0px 0px 5px rgba(0, 0, 0, 0.2)';
    dragStatus.style.borderRadius = '5px';
    dragStatus.style.pointerEvents = 'none';
    dragStatus.style.top = '0'
    dragStatus.style.left = '0' // Verhindert, dass das Element klickbar ist
}


function startTouchCounter() {
    interval = setInterval(function() {
        milliseconds += 10;  // Erhöhe die Variable um 10 Millisekunden
        console.log(milliseconds + " ms");
        console.log(touching)
        switch(true){
            case(milliseconds === 710 || !touching):
            milliseconds = 0;
            clearTimeout(interval)
            break;
        }
    }, 10);  // Das Intervall ist 10 Millisekunden
}

function onDrop(event) {
    if(canDrop){
        console.log('B')
        if (dropTarget && dropTarget.classList.contains('kanban-card-board')) {
            // Simuliere das ondrop-Event
            moveTo(dropTarget.id)
        }else {
            // Aufruf der Funktion, wenn kein gültiges Drop-Target vorhanden ist
            handleNoDropTarget();
        }
        if(document.getElementById('drag-status')){
            document.getElementById('drag-status').remove()
        }
        canDrop = false;
        milliseconds = 0;
    }else{
        console.log('A')
        milliseconds = 0;  // Stoppe den Long-Touch-Timer, wenn der Finger losgelassen wird
        if (isDragging) {
            isDragging = false;  // Beende das Dragging
        }
        if(document.getElementById('drag-status')){
            document.getElementById('drag-status').remove()
        }
        touching = false;
    }


    draggedElement = null;
    dropTarget = null;
}

// Funktion, die ausgeführt wird, wenn der Benutzer den Finger loslässt
function endLongTouch(event) {
    console.log('A')
    clearTimeout(milliseconds);  // Stoppe den Long-Touch-Timer, wenn der Finger losgelassen wird
    if (isDragging) {
        isDragging = false;  // Beende das Dragging
    }
}

function handleNoDropTarget() {
    renderTask(taskSave[draggedElement.id], parentStartId)
    checkIfTaskTrue()
}
