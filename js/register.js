const regErrIds = ["regTypeErr", "regNameErr", "regEmailErr", "regPhoneErr", "regPassErr",
                   "regConfirmErr", "regDeptErr", "regWardErr", "regAgeErr", "regGenderErr"];

// show only the fieldset of the chosen type
function showTypeFields() {
  const type = document.getElementById("regType").value;
  document.getElementById("regDoctorFields").style.display = (type === "doctor") ? "block" : "none";
  document.getElementById("regNurseFields").style.display = (type === "nurse") ? "block" : "none";
  document.getElementById("regPatientFields").style.display = (type === "patient") ? "block" : "none";
}

// Register button works only while the terms box is ticked
function toggleRegister() {
  document.getElementById("registerBtn").disabled = !document.getElementById("terms").checked;
}

function validateRegister() {
  const type = document.getElementById("regType").value;
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const pass = document.getElementById("regPass").value;
  const confirm = document.getElementById("regConfirm").value;
  const dept = document.getElementById("regDept").value;
  const ward = document.getElementById("regWard").value;
  const age = document.getElementById("regAge").value;
  const gender = document.querySelector('input[name="regGender"]:checked');
  const problem = document.getElementById("regProblem").value.trim();
  const list = (type === "") ? [] : getList(type);
  const emailMsg = emailError(list, email, -1);
  let ok = true;

  clearErrors(regErrIds);
  setText("regMsg", "");

  if (type === "") { showError("regTypeErr", "Choose who you are"); ok = false; }
  if (name === "") { showError("regNameErr", "Name is required"); ok = false; }
  if (emailMsg !== "") { showError("regEmailErr", emailMsg); ok = false; }
  if (!validPhone(phone)) { showError("regPhoneErr", "11 digits starting with 01"); ok = false; }
  if (pass.length < 6) { showError("regPassErr", "At least 6 characters"); ok = false; }
  if (confirm !== pass) { showError("regConfirmErr", "Passwords do not match"); ok = false; }
  if (type === "doctor" && dept === "") { showError("regDeptErr", "Choose a department"); ok = false; }
  if (type === "nurse" && ward === "") { showError("regWardErr", "Choose a ward"); ok = false; }
  if (type === "patient") {
    if (age === "" || Number(age) < 1 || Number(age) > 120) { showError("regAgeErr", "Age must be 1 to 120"); ok = false; }
    if (!gender) { showError("regGenderErr", "Choose a gender"); ok = false; }
  }

  if (!ok) return false;               // stop: errors are shown

  // build the new user object and add it to the right list
  const user = { name: name, email: email, password: pass, phone: phone };
  if (type === "doctor") user.dept = dept;
  else if (type === "nurse") user.ward = ward;
  else { user.age = age; user.gender = gender.value; user.problem = problem; }
  list.push(user);

  document.getElementById("registerForm").reset();
  showTypeFields();
  toggleRegister();
  setText("regMsg", "Account created for " + name + ". You can now login.");
  document.getElementById("regMsg").style.color = "green";
  return false;                        // never reload the page
}

// first display
fillOptions("regDept", departments);
fillOptions("regWard", wards);
showTypeFields();
