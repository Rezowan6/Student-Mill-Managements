// ✅ Loading data from localStorage (if any)
let students = JSON.parse(localStorage.getItem("studentsData")) || [];

// ✅ Variable to hold which student is being edited
let editIndex = null;

/* ==========================================================
    🔹 Function to save data to localStorage
   ========================================================== */
function saveToLocalStorage() {
    localStorage.setItem("studentsData", JSON.stringify(students));
    updateStudentSelect(); // dropdown list Will update
}

/* ==========================================================
    🔹 Function to show all students in the main table
   ========================================================== */
function displayStudents(filter = "") {
    const table = document.getElementById("studentTable");
    // Setting table headers
    table.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Student Tk</th>
            <th>Date Added</th>
            <th>Actions</th>
            <th>Monthly Total</th>
        </tr>
    `;

    let total = 0;      // total tk
    let totalMill = 0;  // all student's monthly totalMill

    // filter According to student list create
    let filteredStudents = students
        .map((s, i) => ({ ...s, realIndex: i }))
        .filter(s => s.name.toLowerCase().includes(filter.toLowerCase()));

    // Every student is shown in the table
    filteredStudents.forEach((student, index) => {
        total += student.studentTk;
        const monthTotal = getMonthlyTotal(student);
        totalMill += monthTotal;

        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>Md: ${student.name}</td>
                <td>৳${student.studentTk}</td>
                <td>${student.date}</td>
                <td>
                    <button class="edit" onclick="editStudent(${student.realIndex})">✏️ Edit</button>
                    <button class="delete" onclick="deleteStudent(${student.realIndex})">🗑️ Delete</button>
                    <button class="month" onclick="showMonthData(${student.realIndex})">📅 Month Data</button>
                </td>
                <td><b>${monthTotal}</b></td>
            </tr>
        `;
        table.innerHTML += row;
    });

    // Total amount display
    document.getElementById("total").innerText = `Total Money: ৳${total}`;
    document.getElementById("totalMill").innerText = `Total Mill: ${totalMill}`;

    saveToLocalStorage(); // Saving data while displaying tables
}

/* ==========================================================
    🔹 Monthly total amount function
   ========================================================== */
function getMonthlyTotal(student) {
    if (!student.monthData) return 0;
    return student.monthData.reduce((sum, d) => sum + d.tk, 0);
}

/* ==========================================================
    🔹 Adding/updating new students
   ========================================================== */
document.getElementById("studentForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const studentTk = Number(document.getElementById("studentTk").value);
    const formattedDate = new Date().toLocaleString();

    if (!name || !studentTk) return alert("Please fill all fields!");

    const newStudent = {
        name,
        studentTk,
        date: formattedDate,
        monthData: [] // Empty array to hold monthly data
    };

    // Adding a new student or updating an old one
    if (editIndex === null) {
        students.push(newStudent);
    } else {
        students[editIndex] = newStudent;
        editIndex = null;
        document.querySelector(".add").textContent = "Add Student";
    }

    saveToLocalStorage();
    displayStudents();
    showMonthlyForm(); // Monthly data form will be displayed after adding new student.
    document.getElementById("studentForm").reset();
});

/* ==========================================================
    🔹 student editing function
   ========================================================== */
function editStudent(index) {
    const student = students[index];
    document.getElementById("name").value = student.name;
    document.getElementById("studentTk").value = student.studentTk;
    editIndex = index;
    document.querySelector(".add").textContent = "Update Student";
}

/* ==========================================================
    🔹 Function to delete student
   ========================================================== */
function deleteStudent(index) {
    if (confirm("Are you sure you want to delete this student?")) {
        students.splice(index, 1);
        saveToLocalStorage();
        displayStudents();
    }
}

/* ==========================================================
    🔹 Search by name
   ========================================================== */
document.getElementById("search").addEventListener("input", function () {
    const filter = this.value;
    displayStudents(filter);
});

/* ==========================================================
    🔹 Adding daily monthly data (store only)
   ========================================================== */
document.getElementById("addMonthDataBtn").addEventListener("click", () => {
    const studentIndex = document.getElementById("studentSelect").value;
    const tk = Number(document.getElementById("tkInput").value);

    const today = new Date();
    const day = today.getDate(); // Today's date (1–31)
    const monthName = today.toLocaleString("default", { month: "long" });
    const date = `${monthName} ${day}, ${today.getFullYear()}`;

    if (studentIndex === "" || !tk)
        return alert("Please fill all fields!");

    const s = students[studentIndex];
    s.monthData.push({ date, tk }); // Pushing daily data
    saveToLocalStorage();

    document.getElementById("tkInput").value = "";
    alert(`✅ Data stored for ${s.name} (${date})`);
});

/* ==========================================================
    🔹 Showing monthly data table
   ========================================================== */
function showMonthData(index) {
    const s = students[index];
    const table = document.getElementById("studentTable");
    const formDiv = document.getElementById("monthlyDataFormDiv");

    // Hiding the main table and form
    table.style.display = "none";
    formDiv.style.display = "none";

    // Creating monthly tables
    let monthHTML = `
        <h3>${s.name} - Monthly Data</h3>
        <table border="1" cellpadding="8" cellspacing="0">
            <tr>
                <th>Date</th>
                <th>Amount (Tk)</th>
                <th>Action</th>
            </tr>
    `;

    // Showing data for each day
    s.monthData.forEach((d, i) => {
        monthHTML += `
            <tr>
                <td>${d.date}</td>
                <td>${d.tk}</td>
                <td>
                    <button class="edit" onclick="editMonthData(${index}, ${i})">✏️ Edit</button>
                </td>
            </tr>`;
    });

    // Monthly Total tk
    const total = getMonthlyTotal(s);
    monthHTML += `
        <tr><td><b>Total</b></td><td colspan="2"><b>${total}</b></td></tr>
        </table>
        <br>
        <button class="closeMonthData" onclick="closeMonthData()">🔙 Back to Main Table</button>
    `;

    // Create a new div and add it to the body
    const monthDiv = document.createElement("div");
    monthDiv.id = "monthDataDiv";
    monthDiv.innerHTML = monthHTML;
    document.body.appendChild(monthDiv);
}

/* ==========================================================
    🔹 Monthly data editing function
   ========================================================== */
function editMonthData(studentIndex, dayIndex) {
    const s = students[studentIndex];
    const dayData = s.monthData[dayIndex];

    // Taking input of new mill with prompt
    const newTk = prompt(`Edit amount for ${dayData.date}:`, dayData.tk);
    if (newTk === null || newTk.trim() === "") return;

    s.monthData[dayIndex].tk = Number(newTk); // Update
    saveToLocalStorage();

    alert("✅ Monthly data updated!");

    // Remove old table and show new one
    document.getElementById("monthDataDiv").remove();
    showMonthData(studentIndex);
}

/* ==========================================================
    🔹 Turn off monthly data view
   ========================================================== */
function closeMonthData() {
    const monthDiv = document.getElementById("monthDataDiv");
    if (monthDiv) monthDiv.remove();

    document.getElementById("studentTable").style.display = "table";
    document.getElementById("monthlyDataFormDiv").style.display = "none";
}

/* ==========================================================
    🔹 Updating Dropdown (Select Student)
   ========================================================== */
function updateStudentSelect() {
    const select = document.getElementById("studentSelect");
    select.innerHTML = `<option value="">-- Select Student --</option>`;
    students.forEach((s, i) => {
        select.innerHTML += `<option value="${i}">${s.name}</option>`;
    });
}

/* ==========================================================
    🔹 Showing monthly form after adding new student
   ========================================================== */
function showMonthlyForm() {
    const formDiv = document.getElementById("monthlyDataFormDiv");
    formDiv.style.display = "block";
}

/* ==========================================================
    🔹 Show all during page load
   ========================================================== */
displayStudents();
updateStudentSelect();






