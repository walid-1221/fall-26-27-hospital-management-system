
const sections = [
    "book-appointment-section",
    "view-schedule-section",
    "prescription-section",
    "test-report-section",
    "view-bill-section"
];

let appointmentFields = ["department", "doctor", "appointment-date", "appointment-time"];

let availableTimes = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM"
];


function showError(fieldId, message) {
    let errorId;

    switch (fieldId) {
        case "department":
            errorId = "departmentError";
            break;

        case "doctor":
            errorId = "doctorError";
            break;

        case "appointment-date":
            errorId = "dateError";
            break;

        case "appointment-time":
            errorId = "timeError";
            break;
    }

    document.getElementById(errorId).innerHTML = message;
}


// Clear an individual error

function clearError(fieldId) {
    let errorId;

    switch (fieldId) {
        case "department":
            errorId = "departmentError";
            break;

        case "doctor":
            errorId = "doctorError";
            break;

        case "appointment-date":
            errorId = "dateError";
            break;

        case "appointment-time":
            errorId = "timeError";
            break;
    }

    document.getElementById(errorId).innerHTML = "";
}


// Clear all appointment form errors

function clearErrors(fields) {
    for (const field of fields) {
        clearError(field);
    }
}


// Get today's date

function todayString() {
    let today = new Date();

    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
}


function showSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: "smooth"
    });
}


// Navigation buttons

document.getElementById("nav-book-appointment").addEventListener("click", function () {
    showSection("book-appointment-section");
});

document.getElementById("nav-view-schedule").addEventListener("click", function () {
    showSection("view-schedule-section");
});

document.getElementById("nav-view-prescriptions").addEventListener("click", function () {
    showSection("prescription-section");
});

document.getElementById("nav-view-test-report").addEventListener("click", function () {
    showSection("test-report-section");
});

document.getElementById("nav-view-bills").addEventListener("click", function () {
    showSection("view-bill-section");
});


// CREATE: Book a new appointment

function bookAppointment() {

    let department = document.getElementById("department").value;
    let doctor = document.getElementById("doctor").value;
    let date = document.getElementById("appointment-date").value;
    let time = document.getElementById("appointment-time").value;

    let isValid = true;

    clearErrors(appointmentFields);


    // Department validation

    if (department === "") {
        showError("department", "Please select a department.");
        isValid = false;
    }


    // Doctor validation

    if (doctor === "") {
        showError("doctor", "Please select a doctor.");
        isValid = false;
    }


    // Date validation

    if (date === "") {
        showError("appointment-date", "Please select an appointment date.");
        isValid = false;
    } else if (date < todayString()) {
        showError("appointment-date", "Please select a valid date.");
        isValid = false;
    }


    // Time validation

    if (time === "") {
        showError("appointment-time", "Please select an appointment time.");
        isValid = false;
    }


    // If validation fails

    if (isValid === false) {
        return false;
    }


    // Successful booking

    alert("Appointment booked successfully!");

    document.getElementById("appointment-form").reset();

    return false;
}


// Submit appointment form

document.getElementById("appointment-form").addEventListener("submit", function (event) {
    event.preventDefault();
    bookAppointment();
});



// Load available appointment times

function loadAppointmentTimes() {

    let select = document.getElementById("appointment-time");

    for (const time of availableTimes) {

        let option = document.createElement("option");

        option.value = time;
        option.innerHTML = time;

        select.appendChild(option);
    }
}

function clearAppointmentError(fieldId) {
    clearError(fieldId);
}

document.getElementById("department").addEventListener("change", function () {
    clearAppointmentError("department");
});

document.getElementById("doctor").addEventListener("change", function () {
    clearAppointmentError("doctor");
});

document.getElementById("appointment-date").addEventListener("change", function () {
    clearAppointmentError("appointment-date");
});

document.getElementById("appointment-time").addEventListener("change", function () {
    clearAppointmentError("appointment-time");
});


function searchDoctor() {

    let keyword = document.getElementById("search-input").value.trim().toLowerCase();

    let doctorSelect = document.getElementById("doctor");

    let doctorFound = false;

    if (keyword === "") {
        alert("Please enter a doctor name.");
        return;
    }


    for (let i = 0; i < doctorSelect.options.length; i++) {

        let doctorName = doctorSelect.options[i].textContent.toLowerCase();

        if (doctorName.includes(keyword) && doctorSelect.options[i].value !== "") {

            doctorSelect.value = doctorSelect.options[i].value;

            doctorFound = true;

            break;
        }
    }


    if (doctorFound === true) {

        clearError("doctor");

        showSection("book-appointment-section");

        alert("Doctor found successfully.");

    } else {

        alert("No doctor found with this name.");

    }
}


document.getElementById("search-btn").addEventListener("click", function () {
    searchDoctor();
});

function viewProfile() {

    alert("Patient profile will be available soon.");

}


document.getElementById("profile-pic").addEventListener("click", function () {
    viewProfile();
});


function payBill() {

    let paymentMethod = document.getElementById("payment").value;

    if (paymentMethod === "") {

        alert("Please select a payment method.");

        return false;

    } else {

        alert("Payment feature will be available soon.");

        return false;
    }
}

document.querySelector(".payment-btn").addEventListener("click", function () {
    payBill();
});


document.getElementById("appointment-date").min = todayString();


loadAppointmentTimes();
