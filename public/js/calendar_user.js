
var modal = document.getElementById("myModal");
const ec = EventCalendar.create(document.getElementById('ec'), {
        view: 'timeGridWeek',
        headerToolbar: {
            start: 'prev,next today',
            center: 'title',
            end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        scrollTime: '09:00:00',
        eventSources: [
            {events: async function() {
                returnArray = []
                const response = await fetch(`/calendar/getUserEvents`)
                const data = await response.json()
                
                data.forEach(el => {
                    console.log('element',el)
                    const object = {
                        start: el.eventStart,
                        end: el.eventEnd,
                        resourceId: el.siteId,
                        title: el.eventTitle,
                        extendedProps: {
                            description: el.eventDescription,
                            image: el.image,
                            id: el._id
                        }
                    }
                    returnArray.push(object)
                });
                console.log(returnArray)
                return returnArray
            }}
        ],
        views: {
            timeGridWeek: {pointer: true},
            resourceTimeGridWeek: {pointer: true},
            resourceTimelineWeek: {
                slotDuration: '00:15',
                slotLabelInterval: '01:00',
                slotMinTime: '09:00',
                slotMaxTime: '21:00',
                slotWidth: 16,
                resources: [
                    {id: 1, title: 'Resource A'},                    
                ]
            }
        },
        dayMaxEvents: true,
        nowIndicator: true,
        selectable: true,
        //where I started messing with sh*t
        eventClick: function(info){
            console.log(info.event)
            document.querySelector('#getDetails').style.display = "block"
            document.querySelector('.getEventTitle').innerText = info.event.title
            document.querySelector('.getDesc').innerText = info.event.extendedProps.description
            document.querySelector('.eventId').value = info.event.extendedProps.id
            document.querySelector('.siteId').value = info.event.resourceIds[0]
            if (info.event.extendedProps.image) {
                document.querySelector('.getImg').src = info.event.extendedProps.image
            }
        }
    });

    async function createEvents() {
        returnArray = []
        response = await fetch(`/calendar/getEvents/id/${id}`)
        const data = await response.json()
        for (const el of data){
            const object = {
                start: el.eventStart,
                end: el.eventEnd,
                resourceId: el.siteId,
                title: el.eventTitle
            }
            returnArray.push(object)
        }

        return returnArray
    }

    function _pad(num) {
        let norm = Math.floor(Math.abs(num));
        return (norm < 10 ? '0' : '') + norm;
    }

    var modal = document.getElementById("getDetails");

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    }