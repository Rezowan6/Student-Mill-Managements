// ✅ Load data
let students = JSON.parse(localStorage.getItem("studentsData")) || [];
let editIndex = null;

// ✅ Save
function saveToLocalStorage() {
    localStorage.setItem("studentsData", JSON.stringify(students));
}

// ✅ Display
function displayStudents(filter = "") {
    const table = document.getElementById("studentTable");
    table.innerHTML = `
        <tr class="bg-gray-200">
        <th class="border py-2">ID</th>
        <th class="border py-2">Name</th>
        <th class="border py-2">Student Tk</th>
        <th class="border py-2">Date</th>
        </tr>
    `;

    let totalMoney = 0;

    let filteredStudents = students
        .map((s, i) => ({ ...s, realIndex: i }))
        .filter(s => s.name.toLowerCase().includes(filter.toLowerCase()));

    filteredStudents.forEach((student, index) => {
        totalMoney += student.studentTk;
        table.innerHTML += `
        <tr>
            <td class="border py-2">${index + 1}</td>
            <td class="border py-2">${student.name}</td>
            <td class="border py-2">৳${student.studentTk}</td>
            <td class="border py-2">${student.date}</td>
        </tr>`;
    });

    document.getElementById("total__money").innerText = `Total Money: ৳${totalMoney}`;
}

// ✅ Add or Edit
document.getElementById("studentForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const studentTk = Number(document.getElementById("studentTk").value);
    const formattedDate = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    if (!name || !studentTk) return alert("Please fill all fields!");

    const newStudent = { name, studentTk, date: formattedDate };

    if (editIndex === null) {
        students.push(newStudent);
    } else {
        students[editIndex] = newStudent;
        editIndex = null;
        document.querySelector(".add").textContent = "Add Student";
    }

    saveToLocalStorage();
    displayStudents();
    e.target.reset();
});

// ✅ Search
document.getElementById("searchInput").addEventListener("input", function () {
    displayStudents(this.value);
});

// ✅ Checkbox sync
const checkboxes = document.querySelectorAll('input[name="amount"]');
const customInput = document.getElementById("studentTk");

checkboxes.forEach((box) => {
    box.addEventListener("change", () => {
        if (box.checked) {
        checkboxes.forEach((c) => {
            if (c !== box) c.checked = false;
        });
        customInput.value = box.value;
        } else {
        customInput.value = "";
        }
    });
});

// ✅ Delete Last
document.getElementById("deleteBtn").addEventListener("click", () => {
    if (students.length === 0) return alert("⚠️ No student left to delete!");
    if (confirm("⚠️ Are you sure you want to delete last student?")) {
        students.pop();
        saveToLocalStorage();
        displayStudents();
    }
});

// ✅ Restart
document.getElementById("restartBtn").addEventListener("click", () => {
    if (students.length === 0) return;
    if (confirm("⚠️ Are you sure you want to delete all students?")) {
        localStorage.removeItem("studentsData");
        students = [];
        displayStudents();
        alert("✅ All student data cleared!");
    }
});

// ✅ Initial Display
displayStudents();
