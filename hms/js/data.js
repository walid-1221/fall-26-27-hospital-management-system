// ================= SHARED DATA =================
// Every page of the project includes this file BEFORE its own script:
//   <script src="js/data.js"></script>
// Login uses the four user lists below (admins, doctors, nurses, patients).
// Each user has an email and a password.
//
// Data is kept in arrays, so it resets when a page is reloaded.

let admins = [
  { email: "admin@hms.com", password: "admin123" }
];

let doctors = [
  { name: "Dr. Rahim Uddin", dept: "Medicine", phone: "01711111111", email: "rahim@hms.com", password: "doctor123" },
  { name: "Dr. Sadia Karim", dept: "Cardiology", phone: "01822222222", email: "sadia@hms.com", password: "doctor123" }
];

let nurses = [
  { name: "Nusrat Jahan", ward: "ICU", phone: "01933333333", email: "nusrat@hms.com", password: "nurse123" }
];

let patients = [
  { name: "Abdul Hamid", age: 54, gender: "Male", phone: "01644444444", problem: "Chest pain", email: "hamid@hms.com", password: "patient123" }
];

// ---- Group members: add the arrays your page needs below this line ----
// (example: prescriptions, tests, serials, vitals, reports)
