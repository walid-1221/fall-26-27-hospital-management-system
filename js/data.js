

const departments = ["Medicine", "Cardiology", "Orthopedics", "Pediatrics"];
const wards = ["General", "ICU", "Emergency"];

let admins = [
  { name: "Main Admin", email: "admin@hms.com", password: "admin123", phone: "01700000000" }
];

let doctors = [
  { name: "Dr. Rahim Uddin", email: "rahim@hms.com", password: "doctor123", phone: "01711111111", dept: "Medicine" },
  { name: "Dr. Sadia Karim", email: "sadia@hms.com", password: "doctor123", phone: "01822222222", dept: "Cardiology" }
];

let nurses = [
  { name: "Nusrat Jahan", email: "nusrat@hms.com", password: "nurse123", phone: "01933333333", ward: "ICU" }
];

let patients = [
  { name: "Abdul Hamid", email: "hamid@hms.com", password: "patient123", phone: "01644444444", age: 54, gender: "Male", problem: "Chest pain" }
];


let hospitalRules = {
  fee: 500,            
  maxPatients: 30,   
  visitStart: "16:00", 
  visitEnd: "20:00",
  visitors: 2          
};


let activityLog = [
  { time: "Start", type: "Settings", text: "Default hospital rules loaded" }
];


