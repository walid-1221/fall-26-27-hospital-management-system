
function fillOptions(selectId, items) {
  const select = document.getElementById(selectId);
  for (let i = 0; i < items.length; i++) {
    const option = document.createElement("option");
    option.innerHTML = items[i];
    select.appendChild(option);
  }
}

function setText(id, text) {
  document.getElementById(id).innerHTML = text;
}

function showError(id, message) {
  document.getElementById(id).innerHTML = message;
}

function clearErrors(ids) {
  for (let i = 0; i < ids.length; i++) {
    document.getElementById(ids[i]).innerHTML = "";
  }
}

function validPhone(phone) {
  return phone.length === 11 && !isNaN(phone) && phone.indexOf("01") === 0;
}

function getList(role) {
  switch (role) {
    case "admin": return admins;
    case "doctor": return doctors;
    case "nurse": return nurses;
    default: return patients;
  }
}

function setList(role, list) {
  switch (role) {
    case "admin": admins = list; break;
    case "doctor": doctors = list; break;
    case "nurse": nurses = list; break;
    default: patients = list;
  }
}

function emailError(list, email, ignoreIndex) {
  if (email === "") return "Email is required";
  if (email.indexOf("@") === -1 || email.indexOf(".") === -1) return "Enter a valid email";
  for (let i = 0; i < list.length; i++) {
    if (i !== ignoreIndex && list[i].email === email) return "This email is already used";
  }
  return "";
}

function removeAt(list, index) {
  const kept = [];
  for (let i = 0; i < list.length; i++) {
    if (i !== index) kept.push(list[i]);
  }
  return kept;
}

function containsText(text, search) {
  return String(text).toLowerCase().indexOf(search.toLowerCase()) !== -1;
}
