const sections = [
    "book-appointment-section",
    "view-schedule-section",
    "prescription-section",
    "test-report-section",
    "view-bill-section"
];

let appointments = [];

function showSection(sectionId) {
    let section = document.getElementById(sectionId);

    if (section) {
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

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

function bookAppointment() {

    let department = document.getElementById("department").value;
    let doctor = document.getElementById("doctor").value;
    let date = document.getElementById("appointment-date").value;
    let time = document.getElementById("appointment-time").value;
    let reason = document.getElementById("reason").value.trim();

    let isValid = true;

    if (department === "") {
        alert("Please select a department.");
        isValid = false;
    }

    if (doctor === "") {
        alert("Please select a doctor.");
        isValid = false;
    }

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);

    if (date === "" || appointmentDate < today) {
        alert("Please select a valid appointment date.");
        isValid = false;
    }

    if (time === "") {
        alert("Please select an appointment time.");
        isValid = false;
    }

    if (isValid === false) {
        return false;
    }

    // CREATE appointment object
    let newAppointment = {
        department: department,
        doctor: doctor,
        date: date,
        time: time,
        reason: reason,
        status: "Pending"
    };

    appointments.push(newAppointment);

    alert("Appointment request submitted successfully!");

    document.getElementById("appointment-form").reset();

    renderSchedule();

    return false;
}


function renderSchedule() {

    let table = document.querySelector("#view-schedule-section .data-table");

    let rows = "";

    if (appointments.length === 0) {

        rows = "<tr><td>No appointment has been booked yet.</td></tr>";

    } else {

        rows = "<tr>" +
            "<th>Department Name</th>" +
            "<th>Doctor Name</th>" +
            "<th>Date</th>" +
            "<th>Time</th>" +
            "<th>Status</th>" +
            "</tr>";

        for (let i = 0; i < appointments.length; i++) {

            let appointment = appointments[i];

            rows += "<tr>" +
                "<td>" + appointment.department + "</td>" +
                "<td>" + appointment.doctor + "</td>" +
                "<td>" + appointment.date + "</td>" +
                "<td>" + appointment.time + "</td>" +
                "<td>" + appointment.status + "</td>" +
                "</tr>";
        }
    }

    table.innerHTML = rows;
}


function searchDoctor() {

    let keyword = document.getElementById("search-input").value.trim().toLowerCase();

    let doctorSelect = document.getElementById("doctor");

    if (keyword === "") {
        alert("Please enter a doctor name.");
        return;
    }

    let found = false;

    for (let i = 0; i < doctorSelect.options.length; i++) {

        let doctorName = doctorSelect.options[i].text.toLowerCase();

        if (doctorName.includes(keyword) && doctorSelect.options[i].value !== "") {

            doctorSelect.selectedIndex = i;

            showSection("book-appointment-section");

            found = true;
            break;
        }
    }

    if (found === false) {
        alert("Doctor not found.");
    }
}


function viewProfile() {

    let profileSection = document.getElementById("profile-section");

    if (profileSection) {

        profileSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } else {

        alert("Profile section has not been added yet.");
    }
}


function downloadPrescription() {

    alert("No prescription is available to download.");
}

function downloadReport() {

    alert("No test report is available to download.");
}

function payBill() {

    let paymentMethod = document.getElementById("payment").value;

    if (paymentMethod === "" || paymentMethod === "Select") {

        alert("Please select a payment method.");
        return false;
    }

    alert("Payment processing requires the PHP backend.");

}


document.getElementById("appointment-form").addEventListener("submit", function (event) {

    event.preventDefault();

    bookAppointment();

});


document.getElementById("search-btn").addEventListener("click", function () {

    searchDoctor();

});

document.getElementById("search-input").addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        event.preventDefault();

        searchDoctor();

    }

});


document.getElementById("profile-pic").addEventListener("click", function () {

    viewProfile();

});


document.querySelector("#prescription-section .download-btn").addEventListener("click", function () {

    downloadPrescription();

});

document.querySelector("#test-report-section .download-btn").addEventListener("click", function () {

    downloadReport();

});

document.querySelector(".payment-btn").addEventListener("click", function () {

    payBill();

});

renderSchedule();
