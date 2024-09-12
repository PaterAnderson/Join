const BASE_URL = "https://join-projekt-85028-default-rtdb.europe-west1.firebasedatabase.app/guest"

const priorityMap = {
    "urgent": "../assets/icons/urgent.svg",
    "medium": "../assets/icons/medium.svg",
    "low": "../assets/icons/low.svg"
};

function initBoard() {
    getTasks()
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


async function getTasks() {
    document.getElementById('to-do')
    try {
        let counter = 0
        array = await processData(`${BASE_URL}/tasks.json`)
        Object.keys(array).forEach(key => {

            let task = array[key]

            renderTask(task, counter)

            counter++
        })
    } catch (error) {
        console.log(error)
    }
}

function renderTask(task, i) {
    let id = document.getElementById('to-do')
    console.log(task)
    let subtask = returnSubtask(task)
    id.innerHTML += returnTaskCard(task, i, returnPrio(task), subtask.total, subtask.done, subtask.percentage);
    renderAssignedContacts(task, i)
}

function renderAssignedContacts(task, counter){
    for (let i = 0; i < task.assigned.length; i++) {
        assingContacts(task.assigned, i, counter)
    }
}

function assingContacts(contacts, i, counter) {
    let id = document.getElementById(`contacts${counter}`)
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
        if (array[i].edit === true) {
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
    return prioSVG
}

function returnAssignedContacts(color, name) {
    return `<div class="card-board-contact-icon" style="background-color:${color};">${name}</div>`
}


function returnTaskCard(task, i, prioSVG, open, done, progress) {
    return `        <div class="card-board">
                        <div class="card-category">${task.category}</div>
                        <div class="card-board-text-wrap">
                            <div class="card-board-title">${task.title}</div>
                            <div class="card-board-description">${task.description}</div>
                        </div>
                        <div class="card-board-subtask">
                            <div class="card-board-subtask-progress-wrap">
                                <div class="card-board-subtask-progress-background">
                                    <div class="card-board-subtask-progress" style="width: ${progress}%;"></div>
                                </div>
                            </div>
                            <div class="card-board-subtask-number">${done}/${open} Subtasks</div>
                        </div>
                        <div class="card-board-contact-urgent-wrapper">
                            <div class="card-board-contacts" id="contacts${i}">
                            </div>
                            <div class="card-board-urgent">
                                <div class="card-board-urgent-icon"><img src=${prioSVG}>
                                </div>
                            </div>
                        </div>
                    </div>`
}