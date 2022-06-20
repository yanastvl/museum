export {initDateModal, updateDateTime}


function getFullDate(date) {
    let options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    };
    let fullDate = new Date(date).toLocaleDateString('en-us', options);
    return fullDate
}

function initDateModal() {
    const currentDateTime = new Date().toLocaleString("en-US", {timeZone: "Europe/Moscow"}).split(",");
    
    let date = new Date();
    let isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split("T");
    
    document.getElementById("dateInput").min = isoDateTime[0];
    document.getElementById("dateRight").innerHTML = getFullDate(currentDateTime[0]);
}


function updateDateTime(date, time) {
    if (time) {
        document.getElementById("timeRight").innerHTML = time;
    }
    if (date) {
        document.getElementById("dateRight").innerHTML = getFullDate(date);
    }
}