export {calcTotalPrice, fillTicketFormModal, calcTotalPriceModal};

const ticketCosts = {"permanent": 20, "temporary": 25, "combined": 40};
const ticketTypes = {"permanent": "Permanent exhibition", "temporary": "Temporary exhibition", "combined": "Combined Admission"};


function storeDataToLocalStorage(ticketType, basicTicketsNum, seniorTicketsNum, basicSum, seniorSum) {
    let bookingTickets = {}
    bookingTickets["ticketType"] = ticketType;
    bookingTickets["basicTicketsNum"] = basicTicketsNum;
    bookingTickets["seniorTicketsNum"] = seniorTicketsNum;
    bookingTickets["basicSum"] = basicSum;
    bookingTickets["seniorSum"] = seniorSum;
    bookingTickets["totalPrice"] = basicSum + seniorSum;
    window.localStorage.setItem("bookingTickets", JSON.stringify(bookingTickets));
}


function calcTotalPrice (ticketType) {
    let basicTicketsNum = document.getElementById('basicTicketsNum').value;
    let seniorTicketsNum = document.getElementById('seniorTicketsNum').value;
    
    if (!ticketType) {
        var ticketType = document.querySelector('input[name="ticketType"]:checked').value;
    }
    
    let basicSum = ticketCosts[ticketType] * basicTicketsNum;
    let seniorSum = (ticketCosts[ticketType] * seniorTicketsNum)/2;
    document.getElementById("totalPrice").innerHTML = basicSum + seniorSum;
    
    storeDataToLocalStorage(ticketType, basicTicketsNum, seniorTicketsNum, basicSum, seniorSum);
}


function fillTicketFormModal() {
    let bookingTickets = JSON.parse(localStorage.getItem("bookingTickets"));
    if (bookingTickets) {
        document.getElementById("totalPriceModal").innerHTML = bookingTickets["totalPrice"];
        
        document.getElementById("basicTicketsNumRight").innerHTML = bookingTickets["basicTicketsNum"]
        document.getElementById("seniorTicketsNumRight").innerHTML = bookingTickets["seniorTicketsNum"]
        
        document.getElementById("basicTicketsNumLeft").value = bookingTickets["basicTicketsNum"]
        document.getElementById("seniorTicketsNumLeft").value = bookingTickets["seniorTicketsNum"]
        
        document.getElementById("basicSum").innerHTML = bookingTickets["basicSum"]
        document.getElementById("seniorSum").innerHTML = bookingTickets["seniorSum"]
        
        document.getElementById("ticketTypeSelector").value = bookingTickets["ticketType"];
        document.getElementById("ticketTypeRight").innerHTML = ticketTypes[bookingTickets["ticketType"]];

        document.querySelectorAll('.basic_ticket_cost').forEach(el => {
            el.innerHTML = ticketCosts[bookingTickets["ticketType"]];
        })
        
        document.querySelectorAll('.senior_ticket_cost').forEach(el => {
            el.innerHTML = ticketCosts[bookingTickets["ticketType"]]/2;
        })
    }
}


function calcTotalPriceModal(ticketType) {
    let basicTicketsNumLeft = document.getElementById('basicTicketsNumLeft').value;
    let seniorTicketsNumLeft = document.getElementById('seniorTicketsNumLeft').value;
    
    if (!ticketType) {
        var ticketType = document.getElementById("ticketTypeSelector").value;
    }
    document.getElementById("ticketTypeRight").innerHTML = ticketTypes[ticketType]
    
    document.querySelectorAll('.basic_ticket_cost').forEach(el => {
        el.innerHTML = ticketCosts[ticketType];
    })
    document.querySelectorAll('.senior_ticket_cost').forEach(el => {
        el.innerHTML = ticketCosts[ticketType] / 2;
    })
    
    document.getElementById("basicTicketsNumRight").innerHTML = basicTicketsNumLeft
    document.getElementById("seniorTicketsNumRight").innerHTML = seniorTicketsNumLeft
    
    let basicSum = ticketCosts[ticketType] * basicTicketsNumLeft;
    let seniorSum = (ticketCosts[ticketType] * seniorTicketsNumLeft)/2;
    
    document.getElementById("basicSum").innerHTML = basicSum
    document.getElementById("seniorSum").innerHTML = seniorSum
    document.getElementById("totalPriceModal").innerHTML = basicSum + seniorSum;
    
    storeDataToLocalStorage(ticketType, basicTicketsNumLeft, seniorTicketsNumLeft, basicSum, seniorSum);
}