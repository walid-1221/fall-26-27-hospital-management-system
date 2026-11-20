// ---------- show everything ----------
function showAll() {
  let html = "";

  // doctors table
  for (let i = 0; i < doctors.length; i++) {
    html += "<tr><td>" + (i + 1) + "</td><td>" + doctors[i].name + "</td><td>" +
            doctors[i].dept + "</td><td>" + doctors[i].phone + "</td>" +
            '<td><button onclick="removeDoctor(' + i + ')">Remove</button></td></tr>';
  }
  if (doctors.length === 0) html = '<tr><td colspan="5">No doctors yet</td></tr>';
  document.getElementById("doctorBody").innerHTML = html;
  document.getElementById("doctorCount").innerHTML = doctors.length;

  // nurses table
  html = "";
  for (let i = 0; i < nurses.length; i++) {
    html += "<tr><td>" + (i + 1) + "</td><td>" + nurses[i].name + "</td><td>" +
            nurses[i].ward + "</td><td>" + nurses[i].phone + "</td>" +
            '<td><button onclick="removeNurse(' + i + ')">Remove</button></td></tr>';
  }
  if (nurses.length === 0) html = '<tr><td colspan="5">No nurses yet</td></tr>';
  document.getElementById("nurseBody").innerHTML = html;
  document.getElementById("nurseCount").innerHTML = nurses.length;

  // patients table
  html = "";
  for (let i = 0; i < patients.length; i++) {
    html += "<tr><td>" + (i + 1) + "</td><td>" + patients[i].name + "</td><td>" +
            patients[i].age + "</td><td>" + patients[i].gender + "</td><td>" +
            patients[i].phone + "</td><td>" + patients[i].problem + "</td>" +
            '<td><button onclick="removePatient(' + i + ')">Remove</button></td></tr>';
  }
  if (patients.length === 0) html = '<tr><td colspan="7">No patients yet</td></tr>';
  document.getElementById("patientBody").innerHTML = html;
  document.getElementById("patientCount").innerHTML = patients.length;
}

// ---------- helpers ----------
// phone must be 11 digits and start with 01
function validPhone(phone) {
  return phone.length === 11 && !isNaN(phone) && phone.indexOf("01") === 0;
}

// return a new array without the item at position index
function removeAt(list, index) {
  const kept = [];
  for (let i = 0; i < list.length; i++) {
    if (i !== index) kept.push(list[i]);
  }
  return kept;
}

// ---------- add doctor ----------
function addDoctor() {
  const name = document.getElementById("dName").value.trim();
  const dept = document.getElementById("dDept").value;
  const phone = document.getElementById("dPhone").value.trim();
  let ok = true;

  document.getElementById("dNameErr").innerHTML = "";
  document.getElementById("dDeptErr").innerHTML = "";
  document.getElementById("dPhoneErr").innerHTML = "";

  if (name === "") { document.getElementById("dNameErr").innerHTML = "Name is required"; ok = false; }
  if (dept === "") { document.getElementById("dDeptErr").innerHTML = "Choose a department"; ok = false; }
  if (!validPhone(phone)) { document.getElementById("dPhoneErr").innerHTML = "11 digits starting with 01"; ok = false; }

  if (!ok) return false;               // stop: errors are shown

  doctors.push({ name: name, dept: dept, phone: phone });
  document.getElementById("doctorForm").reset();
  showAll();
  return false;                        // never reload the page
}

// ---------- add nurse ----------
function addNurse() {
  const name = document.getElementById("nName").value.trim();
  const ward = document.getElementById("nWard").value;
  const phone = document.getElementById("nPhone").value.trim();
  let ok = true;

  document.getElementById("nNameErr").innerHTML = "";
  document.getElementById("nWardErr").innerHTML = "";
  document.getElementById("nPhoneErr").innerHTML = "";

  if (name === "") { document.getElementById("nNameErr").innerHTML = "Name is required"; ok = false; }
  if (ward === "") { document.getElementById("nWardErr").innerHTML = "Choose a ward"; ok = false; }
  if (!validPhone(phone)) { document.getElementById("nPhoneErr").innerHTML = "11 digits starting with 01"; ok = false; }

  if (!ok) return false;

  nurses.push({ name: name, ward: ward, phone: phone });
  document.getElementById("nurseForm").reset();
  showAll();
  return false;
}

// ---------- add patient ----------
function addPatient() {
  const name = document.getElementById("pName").value.trim();
  const age = document.getElementById("pAge").value;
  const gender = document.querySelector('input[name="gender"]:checked');
  const phone = document.getElementById("pPhone").value.trim();
  const problem = document.getElementById("pProblem").value.trim();
  let ok = true;

  document.getElementById("pNameErr").innerHTML = "";
  document.getElementById("pAgeErr").innerHTML = "";
  document.getElementById("pGenderErr").innerHTML = "";
  document.getElementById("pPhoneErr").innerHTML = "";

  if (name === "") { document.getElementById("pNameErr").innerHTML = "Name is required"; ok = false; }
  if (age === "" || Number(age) < 1 || Number(age) > 120) { document.getElementById("pAgeErr").innerHTML = "Age must be 1 to 120"; ok = false; }
  if (!gender) { document.getElementById("pGenderErr").innerHTML = "Choose a gender"; ok = false; }
  if (!validPhone(phone)) { document.getElementById("pPhoneErr").innerHTML = "11 digits starting with 01"; ok = false; }

  if (!ok) return false;

  patients.push({ name: name, age: age, gender: gender.value, phone: phone, problem: problem });
  document.getElementById("patientForm").reset();
  showAll();
  return false;
}

// ---------- remove ----------
function removeDoctor(i)  { doctors = removeAt(doctors, i);   showAll(); }
function removeNurse(i)   { nurses = removeAt(nurses, i);     showAll(); }
function removePatient(i) { patients = removeAt(patients, i); showAll(); }

// ---------- first display ----------
showAll();
