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
        console.log(error)
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

function editDataInArray(taskName) {
    let date = document.getElementById('input_due_date').value
    let discription = document.getElementById('text_area').value
    let title = document.getElementById('title_input').value
    let oldTaskName = taskName

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
    changeSubtaskValue(subtaskValue.done, subtaskValue.total, subtaskValue.percentage, taskName)

    editTask = false
    setTimeout(() => {
        document.getElementById('card-board-overlay-background').classList.add('display-opacity-board')
        getOpenTaskOverlay(taskName)
    }, 400)
    POSTfirebase();
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

    let totalNumbers = document.getElementById('total' + `${oldTaskName}`)
    let progressSubtask = document.getElementById('progress' + `${oldTaskName}`)

    totalNumbers.id = 'total' + `${taskSave[taskName].title}`
    progressSubtask.id = 'progress' + `${taskSave[taskName].title}`


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
        await fetch('https://join-projekt-85028-default-rtdb.europe-west1.firebasedatabase.app/guest/tasks.json', {
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
        checkmark.src = "/assets/icons/check-mark-subtask-overlay-unchecked.svg"
        text.style.textDecoration = ''
    } else {
        subtaskCollection[i].done = !subtaskCollection[i].done
        checkmark.src = "/assets/icons/check-mark-subtask-ovleray-checked.svg"
        text.style.textDecoration = 'line-through'
    }

    let callback = pushSubtaskDone
    await getEditToFirebase(taskName, callback)

}

let prioEdit = ''

async function changePrio(prioTask, taskName) {
    prioEdit = prioTask
    document.getElementById(`priocard${taskName}`).src = priorityMap[prioTask];
    document.getElementById(`priocard${taskName}`).onerror = null;

    let callback = pushUrgent
    await getEditToFirebase(taskName, callback)
}

function changeContact(taskName) {
    document.getElementById(`contacts${taskName}`).innerHTML = ''
    renderAssignedContacts(selectedContacts, taskName)
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

function changeZindex() {
    document.getElementById('list_of_contacts_outside').classList.toggle('z-index-3')
}

function removeZindex() {
    document.getElementById('list_of_contacts_outside').classList.remove('z-index-3')
}

function closeCardOverlay() {
    document.getElementById('card-board-overlay-background').classList.add('display-opacity-board')
    document.getElementById('card-board-task-overlay').classList.remove('overlay-add-task-transition')
    setTimeout(() => {
        document.getElementById('card-board-task-overlay').innerHTML = ''
    }, 250)
    subtaskCollection = [];
    selectedContacts = [];
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
}

async function deleteTaskFromBoard(taskName) {
    document.getElementById(taskName).remove()
    closeCardOverlay()

    let callback = deleteTask
    await getEditToFirebase(taskName, callback)
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
        let card = document.querySelectorAll('.card-board')

        card.forEach((card) => {
            let cardtitle = card.querySelector('.card-board-title').textContent.toLocaleLowerCase()

            if (cardtitle.includes(query)) {
                card.style.display = 'flex'
            } else {
                card.style.display = 'none'
            }
        })
    })

}

function updateOnClickBasedOnWidth() {
    let elements = document.querySelectorAll('.add-task-board');

    elements.forEach(element => {
        if (window.innerWidth <= 990) {
            element.onclick = function() {
                goToLink('add_task.html');
            };
        } else {
            element.onclick = function() {
                addTaskBoardOverlayToggle();
            };
        }
    });
}

updateOnClickBasedOnWidth();

window.addEventListener('resize', updateOnClickBasedOnWidth);
