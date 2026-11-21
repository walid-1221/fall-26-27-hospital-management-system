// ---------- Sample data (later this will come from the server) ----------
var patients = [
  { id: "P001", name: "Karim Hossain", age: 52, condition: "Hypertension" },
  { id: "P002", name: "Nusrat Jahan", age: 34, condition: "Chest pain" },
  { id: "P003", name: "Abdul Aziz", age: 67, condition: "Diabetes" },
  { id: "P004", name: "Salma Khatun", age: 45, condition: "Arrhythmia" }
];

var doctors = [
  { name: "Dr. Rahman", department: "Cardiology", contact: "01700-000001", active: true },
  { name: "Dr. Ahmed", department: "Neurology", contact: "01700-000002", active: true },
  { name: "Dr. Sultana", department: "Pediatrics", contact: "01700-000003", active: true },
  { name: "Dr. Islam", department: "Orthopedics", contact: "01700-000004", active: false },
  { name: "Dr. Chowdhury", department: "Cardiology", contact: "01700-000005", active: true }
];

var availableTests = [
  "Complete Blood Count (CBC)", "Blood Sugar (Fasting)", "Lipid Profile",
  "ECG", "Echocardiogram", "Chest X-Ray",
  "Liver Function Test", "Kidney Function Test", "Urine R/E",
  "CT Scan", "MRI"
];

var prescriptions = [];
var testRequests = [];
var activity = [];

// ---------- Helpers ----------
function $(id) { return document.getElementById(id); }

function findPatient(id) {
  for (var i = 0; i < patients.length; i++) {
    if (patients[i].id === id) return patients[i];
  }
  return null;
}

function nowText() {
  return new Date().toLocaleString();
}

function showToast(message) {
  var t = $("toast");
  t.textContent = message;
  t.classList.remove("hidden");
  setTimeout(function () { t.classList.add("hidden"); }, 2500);
}

function addActivity(text) {
  activity.unshift(nowText() + " - " + text);
  renderDashboard();
}

// ---------- Navigation ----------
var titles = {
  dashboard: "Dashboard",
  patients: "My Patients",
  prescribe: "Write Prescription",
  tests: "Suggest Tests",
  doctors: "Doctors Directory"
};

function showPage(name) {
  var pages = document.querySelectorAll(".page");
  for (var i = 0; i < pages.length; i++) pages[i].classList.add("hidden");
  $(name).classList.remove("hidden");

  var buttons = document.querySelectorAll(".menu-btn");
  for (var j = 0; j < buttons.length; j++) {
    buttons[j].classList.toggle("active", buttons[j].getAttribute("data-target") === name);
  }
  $("page-title").textContent = titles[name];
}

var menuButtons = document.querySelectorAll(".menu-btn");
for (var m = 0; m < menuButtons.length; m++) {
  menuButtons[m].addEventListener("click", function () {
    showPage(this.getAttribute("data-target"));
  });
}

// ---------- Dashboard ----------
function renderDashboard() {
  $("count-patients").textContent = patients.length;
  $("count-prescriptions").textContent = prescriptions.length;
  $("count-tests").textContent = testRequests.length;
  $("count-doctors").textContent = doctors.length;

  var ul = $("activity");
  ul.innerHTML = "";
  if (activity.length === 0) {
    ul.innerHTML = "<li>No activity yet.</li>";
    return;
  }
  for (var i = 0; i < activity.length && i < 8; i++) {
    var li = document.createElement("li");
    li.textContent = activity[i];
    ul.appendChild(li);
  }
}

// ---------- Patients ----------
function renderPatients(filter) {
  var tbody = $("patient-table");
  tbody.innerHTML = "";
  var text = (filter || "").toLowerCase();

  for (var i = 0; i < patients.length; i++) {
    var p = patients[i];
    if (text && (p.name + " " + p.id).toLowerCase().indexOf(text) === -1) continue;

    var tr = document.createElement("tr");
    tr.innerHTML =
      "<td>" + p.id + "</td><td>" + p.name + "</td><td>" + p.age + "</td><td>" + p.condition + "</td>" +
      "<td><button class='btn small' data-action='rx' data-id='" + p.id + "'>Prescribe</button> " +
      "<button class='btn small secondary' data-action='test' data-id='" + p.id + "'>Tests</button></td>";
    tbody.appendChild(tr);
  }
}

$("patient-search").addEventListener("input", function () {
  renderPatients(this.value);
});

// Event delegation: one listener for all buttons in the table
$("patient-table").addEventListener("click", function (e) {
  var btn = e.target;
  if (btn.tagName !== "BUTTON") return;
  var id = btn.getAttribute("data-id");
  if (btn.getAttribute("data-action") === "rx") {
    $("rx-patient").value = id;
    showPage("prescribe");
  } else {
    $("test-patient").value = id;
    showPage("tests");
  }
});

function fillPatientSelects() {
  var ids = ["rx-patient", "test-patient"];
  for (var s = 0; s < ids.length; s++) {
    var select = $(ids[s]);
    select.innerHTML = "";
    for (var i = 0; i < patients.length; i++) {
      var opt = document.createElement("option");
      opt.value = patients[i].id;
      opt.textContent = patients[i].id + " - " + patients[i].name;
      select.appendChild(opt);
    }
  }
}

// ---------- Prescription form ----------
function addMedicineRow() {
  var row = document.createElement("div");
  row.className = "medicine-row";
  row.innerHTML =
    "<input type='text' name='medicine[]' placeholder='Medicine name' required>" +
    "<input type='text' name='dose[]' placeholder='Dose (500mg)' required>" +
    "<input type='text' name='frequency[]' placeholder='1+0+1' required>" +
    "<input type='text' name='duration[]' placeholder='7 days' required>" +
    "<button type='button' class='btn small danger'>X</button>";

  row.querySelector("button").addEventListener("click", function () {
    var list = $("medicine-list");
    if (list.children.length > 1) list.removeChild(row);
    else showToast("At least one medicine is required.");
  });
  $("medicine-list").appendChild(row);
}

$("add-medicine").addEventListener("click", addMedicineRow);

$("prescription-form").addEventListener("submit", function (e) {
  e.preventDefault(); // prototype: stop the real HTTP POST

  var patient = findPatient($("rx-patient").value);
  var rows = document.querySelectorAll("#medicine-list .medicine-row");
  var medicines = [];

  for (var i = 0; i < rows.length; i++) {
    var inputs = rows[i].querySelectorAll("input");
    medicines.push({
      name: inputs[0].value, dose: inputs[1].value,
      frequency: inputs[2].value, duration: inputs[3].value
    });
  }

  prescriptions.unshift({
    patient: patient,
    diagnosis: $("rx-diagnosis").value,
    medicines: medicines,
    notes: $("rx-notes").value,
    date: nowText()
  });

  renderPrescriptions();
  addActivity("Prescription sent to " + patient.name);
  showToast("Prescription sent to patient portal");

  this.reset();
  $("medicine-list").innerHTML = "";
  addMedicineRow();
});

function renderPrescriptions() {
  var box = $("prescription-list");
  box.innerHTML = "";
  if (prescriptions.length === 0) {
    box.innerHTML = "<p class='hint'>No prescriptions yet.</p>";
    return;
  }
  for (var i = 0; i < prescriptions.length; i++) {
    var rx = prescriptions[i];
    var div = document.createElement("div");
    div.className = "record";

    var meds = "";
    for (var k = 0; k < rx.medicines.length; k++) {
      var md = rx.medicines[k];
      meds += "<li>" + md.name + " - " + md.dose + " - " + md.frequency + " - " + md.duration + "</li>";
    }
    div.innerHTML =
      "<div class='meta'>" + rx.date + " &middot; <span class='badge'>Sent to patient portal</span></div>" +
      "<strong>" + rx.patient.name + "</strong> (" + rx.patient.id + ") &mdash; " + rx.diagnosis +
      "<ul>" + meds + "</ul>" +
      (rx.notes ? "<em>Notes: " + rx.notes + "</em>" : "");
    box.appendChild(div);
  }
}

// ---------- Test form ----------
function buildTestOptions() {
  var box = $("test-options");
  for (var i = 0; i < availableTests.length; i++) {
    var label = document.createElement("label");
    var cb = document.createElement("input");
    cb.type = "checkbox";
    cb.name = "tests";
    cb.value = availableTests[i];
    label.appendChild(cb);
    label.appendChild(document.createTextNode(" " + availableTests[i]));
    box.appendChild(label);
  }
}

$("test-form").addEventListener("submit", function (e) {
  e.preventDefault();

  var checked = document.querySelectorAll("#test-options input:checked");
  if (checked.length === 0) {
    showToast("Please select at least one test.");
    return;
  }

  var selected = [];
  for (var i = 0; i < checked.length; i++) selected.push(checked[i].value);

  var urgency = document.querySelector("input[name='urgency']:checked").value;
  var patient = findPatient($("test-patient").value);

  testRequests.unshift({
    patient: patient, tests: selected, urgency: urgency,
    notes: $("test-notes").value, date: nowText()
  });

  renderTests();
  addActivity(selected.length + " test(s) requested for " + patient.name);
  showToast("Test request sent");
  this.reset();
});

function renderTests() {
  var box = $("test-list");
  box.innerHTML = "";
  if (testRequests.length === 0) {
    box.innerHTML = "<p class='hint'>No test requests yet.</p>";
    return;
  }
  for (var i = 0; i < testRequests.length; i++) {
    var t = testRequests[i];
    var div = document.createElement("div");
    div.className = "record";
    div.innerHTML =
      "<div class='meta'>" + t.date + " &middot; <span class='badge " + t.urgency + "'>" + t.urgency + "</span></div>" +
      "<strong>" + t.patient.name + "</strong> (" + t.patient.id + ")" +
      "<ul><li>" + t.tests.join("</li><li>") + "</li></ul>" +
      (t.notes ? "<em>Notes: " + t.notes + "</em>" : "");
    box.appendChild(div);
  }
}

// ---------- Doctors directory (read-only) ----------
function renderDoctors(department) {
  var tbody = $("doctor-table");
  tbody.innerHTML = "";
  for (var i = 0; i < doctors.length; i++) {
    var d = doctors[i];
    if (department && department !== "All" && d.department !== department) continue;
    var tr = document.createElement("tr");
    tr.innerHTML =
      "<td>" + d.name + "</td><td>" + d.department + "</td><td>" + d.contact + "</td>" +
      "<td><span class='badge " + (d.active ? "" : "off") + "'>" + (d.active ? "Active" : "Inactive") + "</span></td>";
    tbody.appendChild(tr);
  }
}

function buildDepartmentFilter() {
  var select = $("dept-filter");
  var seen = ["All"];
  for (var i = 0; i < doctors.length; i++) {
    if (seen.indexOf(doctors[i].department) === -1) seen.push(doctors[i].department);
  }
  for (var j = 0; j < seen.length; j++) {
    var opt = document.createElement("option");
    opt.value = seen[j];
    opt.textContent = seen[j] === "All" ? "All departments" : seen[j];
    select.appendChild(opt);
  }
  select.addEventListener("change", function () { renderDoctors(this.value); });
}

// ---------- Start ----------
fillPatientSelects();
buildTestOptions();
buildDepartmentFilter();
addMedicineRow();
renderPatients();
renderPrescriptions();
renderTests();
renderDoctors();
renderDashboard();
