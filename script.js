// ========================================
// CALENDAR
// ========================================

const calendarGrid = document.getElementById("calendarGrid");
const monthTitle = document.getElementById("monthTitle");

const prevMonthButton = document.getElementById("prevMonth");
const nextMonthButton = document.getElementById("nextMonth");
const todayButton = document.getElementById("todayButton");

const newTaskButton = document.getElementById("newTaskButton");

const searchButton =
    document.getElementById("searchButton");

const searchBox =
    document.getElementById("searchBox");

const searchInput =
    document.getElementById("searchInput");

const taskModal = document.getElementById("taskModal");
const closeModal = document.getElementById("closeModal");
const saveTaskButton = document.getElementById("saveTaskButton");

const taskDetailModal =
    document.getElementById("taskDetailModal");

const closeDetailModal =
    document.getElementById("closeDetailModal");

const editTaskButton =
    document.getElementById("editTaskButton");

const deleteTaskButton =
    document.getElementById("deleteTaskButton");

const completeTaskButton =
    document.getElementById("completeTaskButton");

const detailTaskName =
    document.getElementById("detailTaskName");

const detailTaskCategory =
    document.getElementById("detailTaskCategory");

const detailTaskDate =
    document.getElementById("detailTaskDate");

const detailTaskStart =
    document.getElementById("detailTaskStart");

const detailTaskLocation =
    document.getElementById("detailTaskLocation");

const detailTaskDetails =
    document.getElementById("detailTaskDetails");

const upcomingTasks =
    document.getElementById("upcomingTasks");

const taskCount =
    document.getElementById("taskCount");

const totalTasks =
    document.getElementById("totalTasks");

const completedTasks =
    document.getElementById("completedTasks");

const upcomingTaskCount =
    document.getElementById("upcomingTaskCount");


let selectedTaskId = null;
let editingTaskId = null;


// ========================================
// DATE
// ========================================

const today = new Date();

let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const todayString =
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;


// ========================================
// MONTH NAMES
// ========================================

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


// ========================================
// TASK DATA
// ========================================

let tasks =
    JSON.parse(localStorage.getItem("myTasks")) || [];


// ========================================
// RENDER CALENDAR
// ========================================

function renderCalendar() {

    calendarGrid.innerHTML = "";

    const firstDay =
        new Date(
            currentYear,
            currentMonth,
            1
        );

    const lastDay =
        new Date(
            currentYear,
            currentMonth + 1,
            0
        );

    const totalDays =
        lastDay.getDate();

    const startDay =
        firstDay.getDay();


    monthTitle.textContent =
        `${monthNames[currentMonth]} ${currentYear}`;


    // ====================================
    // EMPTY DAYS
    // ====================================

    for (
        let i = 0;
        i < startDay;
        i++
    ) {

        const emptyDay =
            document.createElement("div");

        emptyDay.classList.add(
            "day",
            "empty"
        );

        calendarGrid.appendChild(emptyDay);

    }


    // ====================================
    // CREATE DAYS
    // ====================================

    for (
        let day = 1;
        day <= totalDays;
        day++
    ) {

        const dayElement =
            document.createElement("div");

        dayElement.classList.add("day");


        // เลขวันที่

        const number =
            document.createElement("span");

        number.textContent = day;

        dayElement.appendChild(number);


        // ====================================
        // TODAY
        // ====================================

        if (
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        ) {

            dayElement.classList.add("today");

        }


        // ====================================
        // DATE STRING
        // ====================================

        const dateString =
            `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


        // ====================================
        // FIND TASKS
        // ====================================

        const dayTasks =
            tasks.filter(
                task => task.date === dateString
            );


        // ====================================
        // SHOW TASKS
        // ====================================

        dayTasks.forEach(task => {

            const event =
                document.createElement("div");

            event.classList.add(
                "event",
                getCategoryClass(task.category)
            );

            if (task.completed) {

                event.classList.add("completed");

            }


            event.textContent =
                `${taskStartText(task)} ${task.name}`;


            // คลิกงาน

            event.addEventListener(
                "click",
                function (e) {

                    e.stopPropagation();

                    openTaskDetail(task);

                }
            );


            dayElement.appendChild(event);

        });


        // ====================================
        // CLICK DAY
        // ====================================

        dayElement.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(".day.selected")
                    .forEach(
                        function (selectedDay) {

                            selectedDay.classList.remove(
                                "selected"
                            );

                        }
                    );


                dayElement.classList.add(
                    "selected"
                );

            }
        );


        calendarGrid.appendChild(
            dayElement
        );

    }


    // อัปเดต Upcoming Tasks
    renderUpcomingTasks();

    taskCount.textContent = tasks.length;

    totalTasks.textContent =
    tasks.length;

completedTasks.textContent =
    tasks.filter(task => task.completed).length;

upcomingTaskCount.textContent =
    tasks.filter(
        task =>
            task.date >= todayString &&
            !task.completed
    ).length;

}


// ========================================
// CATEGORY COLOR
// ========================================

function getCategoryClass(category) {

    if (category === "video") {
        return "blue";
    }

    if (category === "design") {
        return "green";
    }

    if (category === "website") {
        return "purple";
    }

    return "blue";

}


// ========================================
// CATEGORY ICON
// ========================================

function getCategoryIcon(category) {

    if (category === "video") {
        return "🎥";
    }

    if (category === "design") {
        return "🎨";
    }

    if (category === "website") {
        return "💻";
    }

    return "📋";

}


// ========================================
// TASK TIME
// ========================================

function taskStartText(task) {

    if (!task.start) {
        return "";
    }

    return `${task.start} ·`;

}


// ========================================
// UPCOMING TASKS
// ========================================

function renderUpcomingTasks() {

    if (!upcomingTasks) {
        return;
    }


    upcomingTasks.innerHTML = "";


    // วันที่วันนี้

    const todayString =
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;


    // งานวันนี้และงานอนาคต

    const upcoming =
        tasks
            .filter(
                task => task.date >= todayString
            )
            .sort(
                (a, b) => {

                    const dateA =
                        `${a.date} ${a.start || "23:59"}`;

                    const dateB =
                        `${b.date} ${b.start || "23:59"}`;

                    return dateA.localeCompare(
                        dateB
                    );

                }
            )
            .slice(0, 5);


    // ====================================
    // NO TASK
    // ====================================

    if (upcoming.length === 0) {

        upcomingTasks.innerHTML = `
            <div class="no-upcoming">
                ไม่มีงานที่กำลังจะมาถึง
            </div>
        `;

        return;

    }


    // ====================================
    // CREATE UPCOMING TASK
    // ====================================

    upcoming.forEach(task => {

        const taskElement =
            document.createElement("div");

        taskElement.classList.add(
            "task"
        );


        // ICON

        const icon =
            document.createElement("div");

        icon.classList.add(
            "task-icon",
            getCategoryClass(task.category)
        );

        icon.textContent =
            getCategoryIcon(task.category);


        // INFO

        const info =
            document.createElement("div");

        info.classList.add(
            "task-info"
        );


        // NAME

        const title =
            document.createElement("h4");

        title.textContent =
            task.name;


        // DATE + TIME

        const time =
            document.createElement("p");

        time.textContent =
            `${formatUpcomingDate(task.date)} · ${task.start || "--:--"}`;


        info.appendChild(title);

        info.appendChild(time);


        taskElement.appendChild(icon);

        taskElement.appendChild(info);


        // คลิก Upcoming Task

        taskElement.addEventListener(
            "click",
            function () {

                openTaskDetail(task);

            }
        );


        upcomingTasks.appendChild(
            taskElement
        );

    });

}


// ========================================
// FORMAT UPCOMING DATE
// ========================================

function formatUpcomingDate(dateString) {

    const todayString =
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;


    if (dateString === todayString) {

        return "Today";

    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "numeric",
            month: "short"
        }
    );

}


// ========================================
// NEW TASK MODAL
// ========================================

newTaskButton.addEventListener(
    "click",
    function () {

        editingTaskId = null;

        taskModal.style.display =
            "flex";

    }
);


// ========================================
// CLOSE NEW TASK MODAL
// ========================================

closeModal.addEventListener(
    "click",
    function () {

        taskModal.style.display =
            "none";

    }
);


taskModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === taskModal
        ) {

            taskModal.style.display =
                "none";

        }

    }
);


// ========================================
// SAVE / UPDATE TASK
// ========================================

saveTaskButton.addEventListener(
    "click",
    function () {

        const taskName =
            document
                .getElementById("taskName")
                .value
                .trim();


        const taskDate =
            document
                .getElementById("taskDate")
                .value;


        const taskCategory =
            document
                .getElementById("taskCategory")
                .value;


        const taskStart =
            document
                .getElementById("taskStart")
                .value;


        const taskLocation =
            document
                .getElementById("taskLocation")
                .value
                .trim();


        const taskDetails =
            document
                .getElementById("taskDetails")
                .value
                .trim();


        // ====================================
        // CHECK REQUIRED DATA
        // ====================================

        if (
            !taskName ||
            !taskDate
        ) {

            alert(
                "กรุณากรอกชื่องานและวันที่"
            );

            return;

        }


        // จำไว้ว่ากำลังแก้ไขหรือสร้างใหม่

        const isEditing =
            editingTaskId !== null;


        // ====================================
        // UPDATE EXISTING TASK
        // ====================================

        if (isEditing) {

            const taskIndex =
                tasks.findIndex(
                    task =>
                        task.id === editingTaskId
                );


            if (taskIndex !== -1) {

                tasks[taskIndex] = {

                    ...tasks[taskIndex],

                    name: taskName,

                    date: taskDate,

                    category: taskCategory,

                    start: taskStart,

                    location: taskLocation,

                    details: taskDetails

                };

            }


            editingTaskId = null;

        }


        // ====================================
        // CREATE NEW TASK
        // ====================================

        else {

            const newTask = {

                id: Date.now(),

                name: taskName,

                date: taskDate,

                category: taskCategory,

                start: taskStart,

                location: taskLocation,

                details: taskDetails

            };


            tasks.push(newTask);

        }


        // ====================================
        // SAVE LOCAL STORAGE
        // ====================================

        localStorage.setItem(
            "myTasks",
            JSON.stringify(tasks)
        );


        // ====================================
        // UPDATE CALENDAR
        // ====================================

        renderCalendar();


        // ====================================
        // CLOSE MODAL
        // ====================================

        taskModal.style.display =
            "none";


        // ====================================
        // CLEAR FORM
        // ====================================

        document.getElementById(
            "taskName"
        ).value = "";

        document.getElementById(
            "taskDate"
        ).value = "";

        document.getElementById(
            "taskStart"
        ).value = "";

        document.getElementById(
            "taskLocation"
        ).value = "";

        document.getElementById(
            "taskDetails"
        ).value = "";


        // ====================================
        // MESSAGE
        // ====================================

        if (isEditing) {

            alert(
                "แก้ไขงานเรียบร้อยแล้ว ✅"
            );

        }

        else {

            alert(
                "เพิ่มงานเรียบร้อยแล้ว ✅"
            );

        }

    }
);


// ========================================
// PREVIOUS MONTH
// ========================================

prevMonthButton.addEventListener(
    "click",
    function () {

        currentMonth--;


        if (currentMonth < 0) {

            currentMonth = 11;

            currentYear--;

        }


        renderCalendar();

    }
);


// ========================================
// NEXT MONTH
// ========================================

nextMonthButton.addEventListener(
    "click",
    function () {

        currentMonth++;


        if (currentMonth > 11) {

            currentMonth = 0;

            currentYear++;

        }


        renderCalendar();

    }
);


// ========================================
// TODAY
// ========================================

todayButton.addEventListener(
    "click",
    function () {

        currentMonth =
            today.getMonth();

        currentYear =
            today.getFullYear();


        renderCalendar();

    }
);


// ========================================
// TASK DETAIL
// ========================================

function openTaskDetail(task) {

    selectedTaskId =
        task.id;


    detailTaskName.textContent =
        task.name;


    detailTaskCategory.textContent =
        task.category;


    detailTaskDate.textContent =
        formatTaskDate(
            task.date
        );


    detailTaskStart.textContent =
        task.start ||
        "ไม่ได้ระบุ";


    detailTaskLocation.textContent =
        task.location ||
        "ไม่ได้ระบุ";


    detailTaskDetails.textContent =
        task.details ||
        "ไม่มีรายละเอียดเพิ่มเติม";
        updateCompleteButton(task);


    taskDetailModal.style.display =
        "flex";

}


// ========================================
// FORMAT DATE
// ========================================

function formatTaskDate(dateString) {

    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


// ========================================
// CLOSE TASK DETAIL
// ========================================

closeDetailModal.addEventListener(
    "click",
    function () {

        taskDetailModal.style.display =
            "none";

    }
);


taskDetailModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            taskDetailModal
        ) {

            taskDetailModal.style.display =
                "none";

        }

    }
);


// ========================================
// EDIT TASK
// ========================================

editTaskButton.addEventListener(
    "click",
    function () {

        const task =
            tasks.find(
                task =>
                    task.id ===
                    selectedTaskId
            );


        if (!task) {
            return;
        }


        // เก็บ ID งาน

        editingTaskId =
            task.id;


        // ใส่ข้อมูลเดิม

        document.getElementById(
            "taskName"
        ).value =
            task.name;


        document.getElementById(
            "taskDate"
        ).value =
            task.date;


        document.getElementById(
            "taskStart"
        ).value =
            task.start || "";


        document.getElementById(
            "taskCategory"
        ).value =
            task.category;


        document.getElementById(
            "taskLocation"
        ).value =
            task.location || "";


        document.getElementById(
            "taskDetails"
        ).value =
            task.details || "";


        // ปิดรายละเอียด

        taskDetailModal.style.display =
            "none";


        // เปิดฟอร์ม

        taskModal.style.display =
            "flex";

    }
);


// ========================================
// DELETE TASK
// ========================================

deleteTaskButton.addEventListener(
    "click",
    function () {

        const confirmDelete =
            confirm(
                "ต้องการลบงานนี้ใช่ไหม?"
            );


        if (!confirmDelete) {
            return;
        }


        tasks =
            tasks.filter(
                task =>
                    task.id !==
                    selectedTaskId
            );


        localStorage.setItem(
            "myTasks",
            JSON.stringify(tasks)
        );


        taskDetailModal.style.display =
            "none";


        renderCalendar();


        selectedTaskId =
            null;

    }
);

// ========================================
// SEARCH BOX
// ========================================

searchButton.addEventListener(
    "click",
    function () {

        searchBox.classList.toggle("active");

        if (searchBox.classList.contains("active")) {

            searchInput.focus();

        } else {

            searchInput.value = "";

        }

    }
);

// ========================================
// SEARCH TASKS
// ========================================

searchInput.addEventListener(
    "input",
    function () {

        const keyword =
            searchInput.value
                .trim()
                .toLowerCase();

        document
            .querySelectorAll(".task-list .task")
            .forEach(function (taskElement) {

                const taskName =
                    taskElement
                        .querySelector("h4")
                        .textContent
                        .toLowerCase();

                if (
                    taskName.includes(keyword)
                ) {

                    taskElement.style.display =
                        "flex";

                } else {

                    taskElement.style.display =
                        "none";

                }

            });

    }
);


// ========================================
// COMPLETE TASK
// ========================================

completeTaskButton.addEventListener(
    "click",
    function () {

        const task =
            tasks.find(
                task =>
                    task.id === selectedTaskId
            );

        if (!task) {
            return;
        }

        // เปลี่ยนสถานะงาน
        task.completed =
            !task.completed;

        // บันทึกข้อมูล
        localStorage.setItem(
            "myTasks",
            JSON.stringify(tasks)
        );

        // อัปเดตหน้าเว็บ
        renderCalendar();

        // อัปเดตปุ่ม
        updateCompleteButton(task);

    }
);

function updateCompleteButton(task) {

    if (task.completed) {

        completeTaskButton.textContent =
            "↩ Mark as Incomplete";

        completeTaskButton.classList.add(
            "completed"
        );

    } else {

        completeTaskButton.textContent =
            "✓ Complete";

        completeTaskButton.classList.remove(
            "completed"
        );

    }

}

// ========================================
// START
// ========================================

renderCalendar();

const themeButton =
    document.getElementById("themeButton");

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeButton.textContent = "🌙";
}

themeButton.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark-mode"
        );

        if (
            document.body.classList.contains(
                "dark-mode"
            )
        ) {

            themeButton.textContent = "🌙";

            localStorage.setItem(
                "theme",
                "dark"
            );

        } else {

            themeButton.textContent = "☀️";

            localStorage.setItem(
                "theme",
                "light"
            );
        }
    }
);

if ("Notification" in window) {
    Notification.requestPermission();
}

function checkTaskNotifications() {

    const now = new Date();

    tasks.forEach(function (task) {

        if (!task.date || !task.start) {
            return;
        }

        const taskDateTime =
            new Date(
                `${task.date}T${task.start}`
            );

        const timeDifference =
            taskDateTime - now;

        if (
            timeDifference >= 0 &&
            timeDifference <= 60000 &&
            !task.notified
        ) {

            showNotification(task);

            task.notified = true;

            localStorage.setItem(
                "myTasks",
                JSON.stringify(tasks)
            );

        }

    });

}

function checkTaskNotifications() {

    const now = new Date();

    tasks.forEach(function (task) {

        if (!task.date || !task.start) {
            return;
        }

        const taskDateTime =
            new Date(
                `${task.date}T${task.start}`
            );

        const timeDifference =
            taskDateTime - now;

        if (
            timeDifference >= 0 &&
            timeDifference <= 60000
        ) {
            showNotification(task);
        }

    });

}

setInterval(
    checkTaskNotifications,
    60000
);