var events = [
    {
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 240000,
        date: "06/01/2017",
    },
    {
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 250000,
        date: "06/01/2018",
    },
    {
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 257000,
        date: "06/01/2019",
    },
    {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 130000,
        date: "06/01/2017",
    },
    {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 140000,
        date: "06/01/2018",
    },
    {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 150000,
        date: "06/01/2019",
    },
    {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 40000,
        date: "06/01/2017",
    },
    {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 45000,
        date: "06/01/2018",
    },
    {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 50000,
        date: "06/01/2019",
    },
];

function buildDropDown(){
    let dropdownMenu = document.getElementById("eventDropDown");
    dropdownMenu.innerHTML = "";

    let currentEvents = getEventData();
    let distinctCities = [...new Set(currentEvents.map((event) => event.city))];

    const dropdownTemplate = document.getElementById("dropdownItemTemplate");
    let dropdownItemNode = document.importNode(dropdownTemplate.content, true);
    let dropdownItemLink = dropdownItemNode.querySelector("a");
    dropdownItemLink.innerText = "All Cities";
    dropdownItemLink.setAttribute("data-string", "All");
    dropdownMenu.appendChild(dropdownItemNode);

    for(i = 0; i < distinctCities.length; i++){
        let cityName = distinctCities[i];
        let itemNode = document.importNode(
            dropdownTemplate.content,
            true
        );
        let anchorTag = itemNode.querySelector("a");
        anchorTag.innerText = cityName;
        anchorTag.setAttribute("data-string", cityName);
        dropdownMenu.appendChild(itemNode);
    }

    displayEventData(currentEvents);
    displayStats(currentEvents);
    document.getElementById("location").textContent = "All Events";
}

function displayEventData(currentEvents){
    const eventTable = document.getElementById("eventTable");
    const template = document.getElementById("tableRowTemplate");

    eventTable.innerHTML = "";
    for(i = 0; i < currentEvents.length; i++){
        let event = currentEvents[i];
        let tableRow = document.importNode(template.content, true);
        tableRow.querySelector("[data-id='event']").textContent = event.event;
        tableRow.querySelector("[data-id='city']").textContent = event.city;
        tableRow.querySelector("[data-id='state']").textContent = event.state;
        tableRow.querySelector("[data-id='attendance']").textContent = event.attendance.toLocaleString();
        tableRow.querySelector("[data-id='date']").textContent = (new Date(event.date)).toLocaleDateString();
        tableRow.querySelector("tr").setAttribute("data-event", event.id);
        eventTable.appendChild(tableRow);
    }
}

function calculateStats(currentEvents){
    let total = 0;
    let average = 0;
    let most = 0;
    let least = currentEvents[0].attendance;

    for(i = 0; i < currentEvents.length; i++){
        let cattend = currentEvents[i].attendance;

        total += cattend;
        if(cattend > most){
            most = cattend;
        }
        if(cattend < least){
            least = cattend;
        }
    }
    average = total/currentEvents.length;

    let stats = {
        total: total,
        average: average,
        most: most,
        least, least
    }
    return stats;
}

function displayStats(currentEvents){
    let stats = calculateStats(currentEvents);

    document.getElementById("total").textContent = stats.total.toLocaleString();
    document.getElementById("average").textContent = Math.round(stats.average).toLocaleString();
    document.getElementById("most").textContent = stats.most.toLocaleString();
    document.getElementById("least").textContent = stats.least.toLocaleString();
}

function getEventData(){
    let data = localStorage.getItem("es-eventdata");

    if(data == null){
        let identifiedEvents = events.map(event => {
            event.id = generateId();
            return event;
        })

        localStorage.setItem("es-eventdata", JSON.stringify(identifiedEvents));
        data = localStorage.getItem("es-eventdata");
    }

    let currentEvents = JSON.parse(data);

    if(currentEvents.some(event => event.id == undefined)){
        currentEvents.forEach(event => event.id = generateId());
        localStorage.setItem("es-eventdata", JSON.stringify(currentEvents));
    }

    return currentEvents;
}

function viewFilteredEvents(dropdownItem){
    let cityName = dropdownItem.getAttribute("data-string");
    let allEvents = getEventData();

    let filteredEvents = allEvents.filter(
        event => {
            if(cityName == "All") {return true;}
            return event.city.toLowerCase() == cityName.toLowerCase();
        }
    );

    displayStats(filteredEvents);
    displayEventData(filteredEvents);
    document.getElementById("location").textContent = cityName == "All" ? "All Events" : cityName;
}

function saveNewEvent(){
    let name = document.getElementById("ename").value;
    let city = document.getElementById("ecity").value;

    let stateSelect = document.getElementById("estate");
    let selectedIndex = stateSelect.selectedIndex;
    let state = stateSelect.options[selectedIndex].text;
    
    let attendance = parseInt(document.getElementById("eattend").value);

    let dateValue = document.getElementById("edate").value;
    dateValue = new Date(dateValue + "T00:00");
    let date = dateValue.toLocaleDateString();

    let newevent = {
        event: name,
        city: city,
        state: state,
        attendance: attendance,
        date: date,
        id: generateId()
    }

    let events = getEventData();
    events.push(newevent);

    localStorage.setItem("es-eventdata", JSON.stringify(events));
    buildDropDown();
    document.getElementById("newEventForm").reset();
}

function generateId() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    );
}

function editEvent(eventRow){
    let eventId = eventRow.getAttribute('data-event');
    let currentEvents = getEventData();
    let event = currentEvents.find((eventObject) => eventObject.id == eventId);

    document.getElementById("editid").value = event.id;
    document.getElementById("editname").value = event.event;
    document.getElementById("editcity").value = event.city;

    let editState = document.getElementById("editstate");
    editState.selectedIndex = [...editState.options].findIndex(option => option.text == event.state);

    document.getElementById("editattend").value = event.attendance;

    let eventDate = (new Date(event.date)).toISOString().split("T")[0];
    document.getElementById("editdate").value = eventDate;
}

function deleteEvent(){
    let eventId = document.getElementById("editid").value;
    let events = getEventData();
    events = events.filter(event => event.id != eventId);
    localStorage.setItem("es-eventdata", JSON.stringify(events));
    buildDropDown();
}

function updateEvent(){
    let eventId = document.getElementById("editid").value;
    let events = getEventData();
    let eventindex = events.findIndex(event => event.id == eventId);

    let name = document.getElementById("editname").value;
    let city = document.getElementById("editcity").value;

    let stateSelect = document.getElementById("editstate");
    let selectedIndex = stateSelect.selectedIndex;
    let state = stateSelect.options[selectedIndex].text;

    let attendance = parseInt(document.getElementById("editattend").value);

    let dateValue = document.getElementById("editdate").value;
    dateValue = new Date(dateValue + "T00:00");
    let date = dateValue.toLocaleDateString();

    let newevent = {
        event: name,
        city: city,
        state: state,
        attendance: attendance,
        date: date,
        id: eventId
    };

    events[eventindex] = newevent;
    localStorage.setItem("es-eventdata", JSON.stringify(events));
    buildDropDown();
}