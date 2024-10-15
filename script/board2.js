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



function onTouchMove(event) {
    if (isDragging) { {
            event.preventDefault(); 

            const followElement = document.getElementById('drag-status');
            console.log(followElement)
        
            if (followElement) {
                const touch2 = event.touches[0];
                followElement.style.left = touch2.pageX + 'px';
                followElement.style.top = touch2.pageY + 'px';
            }
        
            const touch = event.touches[0];
            dropTarget = document.elementFromPoint(touch.clientX, touch.clientY).closest('.kanban-card-board');
        
        }
    }
}

function createDragStatusElement() {
    const dragStatus = document.createElement('div');
    dragStatus.id = 'drag-status';
    document.body.appendChild(dragStatus);

    
    dragStatus.style.position = 'absolute';
    dragStatus.style.width = '50px';
    dragStatus.style.height = '50px';
    dragStatus.style.backgroundColor = 'white';
    dragStatus.style.border = '1px solid black';
    dragStatus.style.boxShadow = '0px 0px 5px rgba(0, 0, 0, 0.2)';
    dragStatus.style.borderRadius = '5px';
    dragStatus.style.pointerEvents = 'none';
    dragStatus.style.top = '0'
    dragStatus.style.left = '0' 
}


function startTouchCounter() {
    interval = setInterval(function() {
        milliseconds += 10;  
        console.log(milliseconds + " ms");
        console.log(touching)
        switch(true){
            case(milliseconds === 710 || !touching):
            milliseconds = 0;
            clearTimeout(interval)
            break;
        }
    }, 10); 
}

function onDrop(event) {
    if(canDrop){
        console.log('B')
        if (dropTarget && dropTarget.classList.contains('kanban-card-board')) {
            moveTo(dropTarget.id)
        }else {
            handleNoDropTarget();
        }
        if(document.getElementById('drag-status')){
            document.getElementById('drag-status').remove()
        }
        canDrop = false;
        milliseconds = 0;
    }else{
        console.log('A')
        milliseconds = 0; 
        if (isDragging) {
            isDragging = false; 
        }
        if(document.getElementById('drag-status')){
            document.getElementById('drag-status').remove()
        }
        touching = false;
    }


    draggedElement = null;
    dropTarget = null;
}


function endLongTouch(event) {
    console.log('A')
    clearTimeout(milliseconds);
    if (isDragging) {
        isDragging = false;
    }
}

function handleNoDropTarget() {
    renderTask(taskSave[draggedElement.id], parentStartId)
    checkIfTaskTrue()
}
