function login() {
  const type = document.getElementById("userType").value;
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  let ok = true;

  // clear old errors
  document.getElementById("typeErr").innerHTML = "";
  document.getElementById("emailErr").innerHTML = "";
  document.getElementById("passwordErr").innerHTML = "";
  document.getElementById("loginErr").innerHTML = "";

  // check the three fields
  if (type === "") { document.getElementById("typeErr").innerHTML = "Choose a user type"; ok = false; }
  if (email === "") {
    document.getElementById("emailErr").innerHTML = "Email is required"; ok = false;
  } else if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
    document.getElementById("emailErr").innerHTML = "Enter a valid email"; ok = false;
  }
  if (password === "") { document.getElementById("passwordErr").innerHTML = "Password is required"; ok = false; }

  if (!ok) return false;               // stop: errors are shown

  // pick the list that matches the chosen user type (lists are in js/data.js)
  let list;
  switch (type) {
    case "admin": list = admins; break;
    case "doctor": list = doctors; break;
    case "nurse": list = nurses; break;
    default: list = patients;
  }

  // look for a user with this email and password
  let found = false;
  for (let i = 0; i < list.length; i++) {
    if (list[i].email === email && list[i].password === password) found = true;
  }

  if (!found) {
    document.getElementById("loginErr").innerHTML = "Wrong email or password";
    return false;
  }

  // go to the page of that user type: admin.html, doctor.html, nurse.html, patient.html
  window.location.href = type + ".html?email=" + email;
  return false;
}
