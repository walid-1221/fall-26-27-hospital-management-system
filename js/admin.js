// ================= ADMIN DASHBOARD =================
let editRole = "";     // role of the user being edited ("" = not editing)
let editIndex = -1;    // position of that user in its list (-1 = not editing)

const userErrIds = ["uRoleErr", "uNameErr", "uEmailErr", "uPassErr", "uPhoneErr",
                    "uDeptErr", "uWardErr", "uAgeErr", "uGenderErr"];

// ---------- show one section, hide the others ----------
function showSection(id) {
  const ids = ["users", "stats", "rules", "log"];
  for (let i = 0; i < ids.length; i++) {
    document.getElementById(ids[i]).style.display = (ids[i] === id) ? "block" : "none";
  }
  if (id === "stats") showStats();
}

// ---------- refresh everything that depends on the user lists ----------
function refreshAll() {
  showUsers();
  showStats();
  showLog();
}

// =====================================================
// MANAGE USERS: Create, Read, Update, Delete, Search
// =====================================================

// show only the fieldset that belongs to the chosen role
function showRoleFields() {
  const role = document.getElementById("uRole").value;
  document.getElementById("doctorFields").style.display = (role === "doctor") ? "block" : "none";
  document.getElementById("nurseFields").style.display = (role === "nurse") ? "block" : "none";
  document.getElementById("patientFields").style.display = (role === "patient") ? "block" : "none";
}

// text for the Details column
function details(role, u) {
  switch (role) {
    case "doctor": return "Department: " + u.dept;
    case "nurse": return "Ward: " + u.ward;
    case "patient": return "Age " + u.age + ", " + u.gender + (u.problem !== "" ? ", " + u.problem : "");
    default: return "System admin";
  }
}

// READ + SEARCH: draw the table (rows that do not match the search are skipped)
function showUsers() {
  const search = document.getElementById("userSearch").value.trim();
  const roleFilter = document.getElementById("roleFilter").value;
  const roles = ["admin", "doctor", "nurse", "patient"];
  let html = "";
  let shown = 0;
  let total = 0;

  for (let r = 0; r < roles.length; r++) {
    const list = getList(roles[r]);
    for (let i = 0; i < list.length; i++) {
      const u = list[i];
      total++;
      if (roleFilter !== "all" && roleFilter !== roles[r]) continue;
      if (!containsText(u.name, search) && !containsText(u.email, search) &&
          !containsText(u.phone, search) && !containsText(roles[r], search)) continue;
      shown++;
      html += "<tr><td>" + shown + "</td><td>" + roles[r] + "</td><td>" + u.name + "</td><td>" +
              u.email + "</td><td>" + u.phone + "</td><td>" + details(roles[r], u) + "</td><td>" +
              '<button onclick="editUser(\'' + roles[r] + '\',' + i + ')">Edit</button> ' +
              '<button onclick="removeUser(\'' + roles[r] + '\',' + i + ')">Remove</button></td></tr>';
    }
  }
  if (shown === 0) html = '<tr><td colspan="7">No users found</td></tr>';
  document.getElementById("userBody").innerHTML = html;
  setText("userCount", "Showing " + shown + " of " + total + " users");
}

// CREATE and UPDATE: one form does both (editIndex tells which one)
function saveUser() {
  const role = document.getElementById("uRole").value;
  const name = document.getElementById("uName").value.trim();
  const email = document.getElementById("uEmail").value.trim();
  const pass = document.getElementById("uPass").value;
  const phone = document.getElementById("uPhone").value.trim();
  const dept = document.getElementById("uDept").value;
  const ward = document.getElementById("uWard").value;
  const age = document.getElementById("uAge").value;
  const gender = document.querySelector('input[name="gender"]:checked');
  const problem = document.getElementById("uProblem").value.trim();
  const list = (role === "") ? [] : getList(role);
  const emailMsg = emailError(list, email, (role === editRole) ? editIndex : -1);
  let ok = true;

  clearErrors(userErrIds);
  setText("userMsg", "");

  if (role === "") { showError("uRoleErr", "Choose a role"); ok = false; }
  if (name === "") { showError("uNameErr", "Name is required"); ok = false; }
  if (emailMsg !== "") { showError("uEmailErr", emailMsg); ok = false; }
  if (pass.length < 6) { showError("uPassErr", "At least 6 characters"); ok = false; }
  if (!validPhone(phone)) { showError("uPhoneErr", "11 digits starting with 01"); ok = false; }
  if (role === "doctor" && dept === "") { showError("uDeptErr", "Choose a department"); ok = false; }
  if (role === "nurse" && ward === "") { showError("uWardErr", "Choose a ward"); ok = false; }
  if (role === "patient") {
    if (age === "" || Number(age) < 1 || Number(age) > 120) { showError("uAgeErr", "Age must be 1 to 120"); ok = false; }
    if (!gender) { showError("uGenderErr", "Choose a gender"); ok = false; }
  }

  if (!ok) return false;               // stop: errors are shown

  // build the user object for this role
  const user = { name: name, email: email, password: pass, phone: phone };
  if (role === "doctor") user.dept = dept;
  else if (role === "nurse") user.ward = ward;
  else if (role === "patient") { user.age = age; user.gender = gender.value; user.problem = problem; }

  let message;
  if (editIndex >= 0) {
    list[editIndex] = user;            // UPDATE: replace the old object
    addLog("Updated", "Updated " + role + " " + name);
    message = "User updated";
  } else {
    list.push(user);                   // CREATE: add a new object
    addLog("Added", "Added " + role + " " + name);
    message = "User added";
  }

  resetUserForm();
  refreshAll();
  setText("userMsg", message);
  document.getElementById("userMsg").style.color = "green";
  return false;                        // never reload the page
}

// UPDATE step 1: copy the user into the form
function editUser(role, i) {
  const u = getList(role)[i];
  resetUserForm();
  editRole = role;
  editIndex = i;

  document.getElementById("uRole").value = role;
  document.getElementById("uRole").disabled = true;   // role cannot change while editing
  showRoleFields();
  document.getElementById("uName").value = u.name;
  document.getElementById("uEmail").value = u.email;
  document.getElementById("uPass").value = u.password;
  document.getElementById("uPhone").value = u.phone;
  if (role === "doctor") document.getElementById("uDept").value = u.dept;
  if (role === "nurse") document.getElementById("uWard").value = u.ward;
  if (role === "patient") {
    document.getElementById("uAge").value = u.age;
    document.getElementById(u.gender === "Male" ? "uMale" : "uFemale").checked = true;
    document.getElementById("uProblem").value = u.problem;
  }

  setText("formTitle", "Edit " + role + ": " + u.name);
  document.getElementById("saveBtn").innerHTML = "Update User";
  document.getElementById("cancelBtn").style.display = "inline-block";
}

// back to the "add a user" form
function resetUserForm() {
  editRole = "";
  editIndex = -1;
  document.getElementById("userForm").reset();
  document.getElementById("uRole").disabled = false;
  clearErrors(userErrIds);
  setText("userMsg", "");
  setText("formTitle", "Add a user");
  document.getElementById("saveBtn").innerHTML = "Add User";
  document.getElementById("cancelBtn").style.display = "none";
  showRoleFields();
}

// DELETE
function removeUser(role, i) {
  const list = getList(role);
  if (role === "admin" && list.length === 1) {
    alert("At least one admin is required");
    return;
  }
  const name = list[i].name;
  setList(role, removeAt(list, i));
  resetUserForm();
  addLog("Deleted", "Removed " + role + " " + name);
  refreshAll();
}

// =====================================================
// UNIQUE FEATURE 1: STATISTICS REPORT
// =====================================================

// build bar chart rows: bar width = count compared with the biggest count
function barChart(labels, counts) {
  let max = 1;
  for (let i = 0; i < counts.length; i++) {
    if (counts[i] > max) max = counts[i];
  }
  let html = "";
  for (let i = 0; i < labels.length; i++) {
    const percent = Math.round(counts[i] / max * 100);
    html += '<div class="barRow"><span class="barLabel">' + labels[i] + '</span>' +
            '<div class="barTrack"><div class="bar" style="width:' + percent + '%">' + counts[i] + '</div></div></div>';
  }
  return html;
}

function showStats() {
  setText("statTotal", admins.length + doctors.length + nurses.length + patients.length);
  setText("statAdmins", admins.length);
  setText("statDoctors", doctors.length);
  setText("statNurses", nurses.length);
  setText("statPatients", patients.length);

  // count doctors in every department
  const deptCounts = [];
  for (let d = 0; d < departments.length; d++) {
    let count = 0;
    for (let i = 0; i < doctors.length; i++) {
      if (doctors[i].dept === departments[d]) count++;
    }
    deptCounts.push(count);
  }
  setText("deptChart", barChart(departments, deptCounts));

  // count nurses in every ward
  const wardCounts = [];
  for (let w = 0; w < wards.length; w++) {
    let count = 0;
    for (let i = 0; i < nurses.length; i++) {
      if (nurses[i].ward === wards[w]) count++;
    }
    wardCounts.push(count);
  }
  setText("wardChart", barChart(wards, wardCounts));
}

// =====================================================
// UNIQUE FEATURE 2: HOSPITAL RULES (with live preview)
// =====================================================

// put the saved rules into the form
function showRulesForm() {
  document.getElementById("rFee").value = hospitalRules.fee;
  document.getElementById("rMax").value = hospitalRules.maxPatients;
  document.getElementById("rStart").value = hospitalRules.visitStart;
  document.getElementById("rEnd").value = hospitalRules.visitEnd;
  document.getElementById("rVisitors").value = hospitalRules.visitors;
  showPreview();
}

// live preview: runs on every key press / change
function showPreview() {
  const fee = document.getElementById("rFee").value;
  const max = document.getElementById("rMax").value;
  const start = document.getElementById("rStart").value;
  const end = document.getElementById("rEnd").value;
  const visitors = document.getElementById("rVisitors").value;
  setText("rulePreview",
    "<p>Consultation fee: <b>" + fee + " Tk</b></p>" +
    "<p>Each doctor sees at most <b>" + max + "</b> patients a day.</p>" +
    "<p>Visiting hours: <b>" + start + " to " + end + "</b></p>" +
    "<p>Each patient may have <b>" + visitors + "</b> visitor(s).</p>");
}

function saveRules() {
  const fee = document.getElementById("rFee").value;
  const max = document.getElementById("rMax").value;
  const start = document.getElementById("rStart").value;
  const end = document.getElementById("rEnd").value;
  const visitors = document.getElementById("rVisitors").value;
  let ok = true;

  clearErrors(["rFeeErr", "rMaxErr", "rTimeErr"]);
  setText("ruleMsg", "");

  if (fee === "" || Number(fee) <= 0) { showError("rFeeErr", "Fee must be more than 0"); ok = false; }
  if (max === "" || Number(max) < 1 || Number(max) > 200) { showError("rMaxErr", "Enter a number from 1 to 200"); ok = false; }
  if (start === "" || end === "" || end <= start) { showError("rTimeErr", "End time must be after start time"); ok = false; }

  if (!ok) return false;

  hospitalRules.fee = Number(fee);
  hospitalRules.maxPatients = Number(max);
  hospitalRules.visitStart = start;
  hospitalRules.visitEnd = end;
  hospitalRules.visitors = Number(visitors);

  addLog("Settings", "Rules saved: fee " + fee + " Tk, visiting " + start + " to " + end);
  setText("ruleMsg", "Rules saved");
  document.getElementById("ruleMsg").style.color = "green";
  return false;
}

// =====================================================
// UNIQUE FEATURE 3: ACTIVITY LOG
// =====================================================

// add one line to the log (called after every create / update / delete / rules change)
function addLog(type, text) {
  activityLog.push({ time: new Date().toLocaleTimeString(), type: type, text: text });
  showLog();
}

// colour of each type (switch)
function logClass(type) {
  switch (type) {
    case "Added": return "log-add";
    case "Updated": return "log-update";
    case "Deleted": return "log-delete";
    default: return "log-settings";
  }
}

// newest line first; the filter hides other types
function showLog() {
  const filter = document.getElementById("logFilter").value;
  let html = "";
  let shown = 0;
  for (let i = activityLog.length - 1; i >= 0; i--) {
    const item = activityLog[i];
    if (filter !== "all" && item.type !== filter) continue;
    shown++;
    html += '<div class="log ' + logClass(item.type) + '"><b>' + item.type + '</b> · ' +
            item.time + '<br>' + item.text + '</div>';
  }
  if (shown === 0) html = "<p>No activity yet</p>";
  document.getElementById("logBoard").innerHTML = html;
  setText("logCount", "Showing " + shown + " of " + activityLog.length + " entries");
}

function clearLog() {
  activityLog = [];
  showLog();
}

// ---------- first display ----------
fillOptions("uDept", departments);
fillOptions("uWard", wards);
fillOptions("rVisitors", [1, 2, 3, 4, 5]);
showRulesForm();
resetUserForm();
refreshAll();
showSection("users");
