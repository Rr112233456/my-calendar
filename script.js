// =====================================================
// MY CALENDAR - SCRIPT.JS
// =====================================================

"use strict";

// =====================================================
// ELEMENTS
// =====================================================

const calendarGrid = document.getElementById("calendarGrid");
const monthTitle = document.getElementById("monthTitle");

const prevMonthButton = document.getElementById("prevMonth");
const nextMonthButton = document.getElementById("nextMonth");
const todayButton = document.getElementById("todayButton");

const newTaskButton = document.getElementById("newTaskButton");

const searchButton = document.getElementById("searchButton");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");

const taskModal = document.getElementById("taskModal");
const closeModal = document.getElementById("closeModal");
const saveTaskButton = document.getElementById("saveTaskButton");

const taskDetailModal =
    document.getElementById("taskDetailModal");

const closeTaskDetailModal =
    document.getElementById("closeTaskDetailModal");

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

const detailTaskEnd =
    document.getElementById("detailTaskEnd");

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

const themeButton =
    document.getElementById("themeButton");

// =====================================================
// FORM ELEMENTS
// =====================================================

const taskNameInput =
    document.getElementById("taskName");

const taskDateInput =
    document.getElementById("taskDate");

const taskEndDateInput =
    document.getElementById("taskEndDate");

const taskCategoryInput =
    document.getElementById("taskCategory");

const taskStartInput =
    document.getElementById("taskStart");

const taskEndInput =
    document.getElementById("taskEnd");

const taskLocationInput =
    document.getElementById("taskLocation");

const taskDetailsInput =
    document.getElementById("taskDetails");

const taskColorInput =
    document.getElementById("taskColor");

const taskTextColorInput =
    document.getElementById("taskTextColor");

// =====================================================
// SETTINGS
// =====================================================

const DEFAULT_TASK_COLOR = "#eaf2ff";
const DEFAULT_TEXT_COLOR = "#1f2937";

const STORAGE_KEY = "myTasks";
const THEME_KEY = "calendarTheme";

// =====================================================
// DATE
// =====================================================

const today = new Date();

const todayString =
    formatDateToString(today);

let currentMonth =
    today.getMonth();

let currentYear =
    today.getFullYear();

// =====================================================
// STATE
// =====================================================

let selectedTaskId = null;
let editingTaskId = null;

let tasks = loadTasks();

// =====================================================
// MONTH NAMES
// =====================================================

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

// =====================================================
// LOAD TASKS
// =====================================================

function loadTasks() {

    try {

        const saved =
            localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return [];
        }

        const parsed =
            JSON.parse(saved);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed;

    } catch (error) {

        console.error(
            "ไม่สามารถโหลด Tasks ได้:",
            error
        );

        return [];
    }
}

// =====================================================
// SAVE TASKS
// =====================================================

function saveTasks() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );
}

// =====================================================
// FORMAT DATE -> YYYY-MM-DD
// =====================================================

function formatDateToString(date) {

    return (
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0")
    );
}

// =====================================================
// PARSE LOCAL DATE
// =====================================================

function parseDate(dateString) {

    if (!dateString) {
        return null;
    }

    return new Date(
        dateString + "T00:00:00"
    );
}

// =====================================================
// FORMAT TASK DATE
// =====================================================

function formatTaskDate(dateString) {

    const date =
        parseDate(dateString);

    if (!date) {
        return "-";
    }

    return date.toLocaleDateString(
        "en-GB",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}

// =====================================================
// FORMAT UPCOMING DATE
// =====================================================

function formatUpcomingDate(dateString) {

    if (dateString === todayString) {
        return "Today";
    }

    const date =
        parseDate(dateString);

    if (!date) {
        return "-";
    }

    return date.toLocaleDateString(
        "en-GB",
        {
            day: "numeric",
            month: "short"
        }
    );
}

// =====================================================
// CATEGORY CLASS
// =====================================================

function getCategoryClass(category) {

    switch (category) {

        case "video":
            return "blue";

        case "design":
            return "green";

        case "website":
            return "purple";

        default:
            return "blue";
    }
}

// =====================================================
// CATEGORY ICON
// =====================================================

function getCategoryIcon(category) {

    switch (category) {

        case "video":
            return "🎥";

        case "design":
            return "🎨";

        case "website":
            return "💻";

        default:
            return "📋";
    }
}

// =====================================================
// RESET FORM
// =====================================================

function resetTaskForm() {

    if (taskNameInput) {
        taskNameInput.value = "";
    }

    if (taskDateInput) {
        taskDateInput.value = "";
    }

    if (taskEndDateInput) {
        taskEndDateInput.value = "";
    }

    if (taskStartInput) {
        taskStartInput.value = "";
    }

    if (taskEndInput) {
        taskEndInput.value = "";
    }

    if (taskLocationInput) {
        taskLocationInput.value = "";
    }

    if (taskDetailsInput) {
        taskDetailsInput.value = "";
    }

    if (taskColorInput) {
        taskColorInput.value =
            DEFAULT_TASK_COLOR;
    }

    if (taskTextColorInput) {
        taskTextColorInput.value =
            DEFAULT_TEXT_COLOR;
    }
}

// =====================================================
// LOAD TASK INTO FORM
// =====================================================

function loadTaskIntoForm(task) {

    if (!task) {
        return;
    }

    taskNameInput.value =
        task.name || "";

    taskDateInput.value =
        task.date || "";

    taskEndDateInput.value =
        task.endDate || task.date || "";

    taskCategoryInput.value =
        task.category || "work";

    taskStartInput.value =
        task.start || "";

    taskEndInput.value =
        task.end || "";

    taskLocationInput.value =
        task.location || "";

    taskDetailsInput.value =
        task.details || "";

    taskColorInput.value =
        task.color || DEFAULT_TASK_COLOR;

    taskTextColorInput.value =
        task.textColor ||
        DEFAULT_TEXT_COLOR;
}

// =====================================================
// OPEN NEW TASK MODAL
// =====================================================

function openNewTaskModal() {

    editingTaskId = null;

    resetTaskForm();

    taskModal.style.display = "flex";
}

// =====================================================
// CLOSE NEW TASK MODAL
// =====================================================

function closeNewTaskModal() {

    taskModal.style.display = "none";

    editingTaskId = null;
}

// =====================================================
// OPEN TASK DETAIL
// =====================================================

function openTaskDetail(task) {

    if (!task) {
        return;
    }

    selectedTaskId = task.id;

    detailTaskName.textContent =
        task.name || "Untitled Task";

    detailTaskCategory.textContent =
        task.category || "ไม่ได้ระบุ";

    if (
        task.endDate &&
        task.endDate !== task.date
    ) {

        detailTaskDate.textContent =
            `${formatTaskDate(task.date)} - ${formatTaskDate(task.endDate)}`;

    } else {

        detailTaskDate.textContent =
            formatTaskDate(task.date);
    }

    detailTaskStart.textContent =
        task.start || "ไม่ได้ระบุ";

    detailTaskEnd.textContent =
        task.end || "ไม่ได้ระบุ";

    detailTaskLocation.textContent =
        task.location || "ไม่ได้ระบุ";

    detailTaskDetails.textContent =
        task.details ||
        "ไม่มีรายละเอียดเพิ่มเติม";

    updateCompleteButton(task);

    taskDetailModal.style.display =
        "flex";
}

// =====================================================
// CLOSE DETAIL MODAL
// =====================================================

function closeTaskDetail() {

    taskDetailModal.style.display =
        "none";

    selectedTaskId = null;
}

// =====================================================
// CREATE TASK
// =====================================================

function createTask() {

    const taskName =
        taskNameInput.value.trim();

    const taskDate =
        taskDateInput.value;

    const taskEndDate =
        taskEndDateInput.value;

    const taskCategory =
        taskCategoryInput.value;

    const taskStart =
        taskStartInput.value;

    const taskEnd =
        taskEndInput.value;

    const taskLocation =
        taskLocationInput.value.trim();

    const taskDetails =
        taskDetailsInput.value.trim();

    const taskColor =
        taskColorInput.value ||
        DEFAULT_TASK_COLOR;

    const taskTextColor =
        taskTextColorInput.value ||
        DEFAULT_TEXT_COLOR;

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!taskName || !taskDate) {

        alert(
            "กรุณากรอกชื่องานและ Start Date"
        );

        return;
    }

    const finalEndDate =
        taskEndDate || taskDate;

    if (finalEndDate < taskDate) {

        alert(
            "End Date ต้องไม่ก่อน Start Date"
        );

        return;
    }

    // -------------------------------------------------
    // EDIT
    // -------------------------------------------------

    if (editingTaskId !== null) {

        const task =
            tasks.find(function(item) {

                return (
                    item.id ===
                    editingTaskId
                );

            });

        if (!task) {
            return;
        }

        task.name =
            taskName;

        task.date =
            taskDate;

        task.endDate =
            finalEndDate;

        task.category =
            taskCategory;

        task.start =
            taskStart;

        task.end =
            taskEnd;

        task.location =
            taskLocation;

        task.details =
            taskDetails;

        task.color =
            taskColor;

        task.textColor =
            taskTextColor;

        // ถ้าแก้วัน/เวลาใหม่
        // ให้สามารถแจ้งเตือนอีกครั้งได้
        task.notified = false;

        saveTasks();

        renderCalendar();

        closeNewTaskModal();

        resetTaskForm();

        alert(
            "แก้ไขงานเรียบร้อยแล้ว ✅"
        );

        editingTaskId = null;

        return;
    }

    // -------------------------------------------------
    // NEW TASK
    // -------------------------------------------------

    const newTask = {

        id:
            Date.now() +
            Math.random(),

        name:
            taskName,

        date:
            taskDate,

        endDate:
            finalEndDate,

        category:
            taskCategory,

        start:
            taskStart,

        end:
            taskEnd,

        location:
            taskLocation,

        details:
            taskDetails,

        color:
            taskColor,

        textColor:
            taskTextColor,

        completed:
            false,

        notified:
            false
    };

    tasks.push(newTask);

    saveTasks();

    renderCalendar();

    closeNewTaskModal();

    resetTaskForm();

    alert(
        "เพิ่มงานเรียบร้อยแล้ว ✅"
    );
}

// =====================================================
// EDIT SELECTED TASK
// =====================================================

function editSelectedTask() {

    const task =
        tasks.find(function(item) {

            return (
                item.id ===
                selectedTaskId
            );

        });

    if (!task) {
        return;
    }

    editingTaskId =
        task.id;

    loadTaskIntoForm(task);

    taskDetailModal.style.display =
        "none";

    taskModal.style.display =
        "flex";
}

// =====================================================
// DELETE SELECTED TASK
// =====================================================

function deleteSelectedTask() {

    const task =
        tasks.find(function(item) {

            return (
                item.id ===
                selectedTaskId
            );

        });

    if (!task) {
        return;
    }

    const confirmDelete =
        confirm(
            "ต้องการลบงานนี้ใช่ไหม?"
        );

    if (!confirmDelete) {
        return;
    }

    tasks =
        tasks.filter(function(item) {

            return (
                item.id !==
                selectedTaskId
            );

        });

    saveTasks();

    closeTaskDetail();

    renderCalendar();
}

// =====================================================
// COMPLETE / INCOMPLETE
// =====================================================

function toggleCompleteTask() {

    const task =
        tasks.find(function(item) {

            return (
                item.id ===
                selectedTaskId
            );

        });

    if (!task) {
        return;
    }

    task.completed =
        !task.completed;

    saveTasks();

    updateCompleteButton(task);

    renderCalendar();

    if (task.completed) {

        alert(
            "ทำงานเสร็จแล้ว ✅"
        );

    } else {

        alert(
            "ยกเลิกสถานะเสร็จแล้ว"
        );
    }
}

// =====================================================
// COMPLETE BUTTON
// =====================================================

function updateCompleteButton(task) {

    if (!completeTaskButton) {
        return;
    }

    if (task.completed) {

        completeTaskButton.textContent =
            "↩️ Mark Incomplete";

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

// =====================================================
// CREATE MULTI-DAY SEGMENTS
// =====================================================

function createTaskSegments(
    task,
    monthStart,
    monthEnd,
    firstDay,
    startDay
) {

    if (!task.date) {
        return [];
    }

    const startDate =
        parseDate(task.date);

    const endDate =
        parseDate(
            task.endDate ||
            task.date
        );

    if (!startDate || !endDate) {
        return [];
    }

    if (endDate < startDate) {
        return [];
    }

    if (
        endDate < monthStart ||
        startDate > monthEnd
    ) {
        return [];
    }

    const visibleStart =
        startDate > monthStart
            ? startDate
            : monthStart;

    const visibleEnd =
        endDate < monthEnd
            ? endDate
            : monthEnd;

    const segments = [];

    let segmentStart =
        new Date(visibleStart);

    while (
        segmentStart <=
        visibleEnd
    ) {

        const dayOffset =
            Math.floor(
                (
                    segmentStart -
                    firstDay
                ) /
                86400000
            );

        const cellIndex =
            startDay +
            dayOffset;

        const row =
            Math.floor(
                cellIndex / 7
            ) + 1;

        const startColumn =
            (cellIndex % 7) + 1;

        const daysUntilSaturday =
            6 -
            segmentStart.getDay();

        let segmentEnd =
            new Date(segmentStart);

        segmentEnd.setDate(
            segmentEnd.getDate() +
            daysUntilSaturday
        );

        if (
            segmentEnd >
            visibleEnd
        ) {

            segmentEnd =
                new Date(visibleEnd);
        }

        const endDayOffset =
            Math.floor(
                (
                    segmentEnd -
                    firstDay
                ) /
                86400000
            );

        const endCellIndex =
            startDay +
            endDayOffset;

        const endColumn =
            (endCellIndex % 7) + 1;

        segments.push({

            task:
                task,

            row:
                row,

            startColumn:
                startColumn,

            endColumn:
                endColumn + 1,

            startDate:
                new Date(segmentStart),

            endDate:
                new Date(segmentEnd)
        });

        segmentStart =
            new Date(segmentEnd);

        segmentStart.setDate(
            segmentStart.getDate() + 1
        );
    }

    return segments;
}

// =====================================================
// RENDER CALENDAR
// =====================================================

function renderCalendar() {

    if (!calendarGrid) {
        return;
    }

    calendarGrid.innerHTML = "";

    calendarGrid.style.position =
        "relative";

    calendarGrid.style.columnGap =
        "0";

    calendarGrid.style.rowGap =
        "0";

    calendarGrid.style.gridTemplateColumns =
        "repeat(7, minmax(0, 1fr))";

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

    const totalWeeks =
        Math.ceil(
            (
                startDay +
                totalDays
            ) / 7
        );

    monthTitle.textContent =
        `${monthNames[currentMonth]} ${currentYear}`;

    // -------------------------------------------------
    // CREATE DAY CELLS
    // -------------------------------------------------

    for (
        let cellIndex = 0;
        cellIndex <
        totalWeeks * 7;
        cellIndex++
    ) {

        const dayNumber =
            cellIndex -
            startDay +
            1;

        const dayElement =
            document.createElement("div");

        dayElement.classList.add(
            "day"
        );

        dayElement.style.gridColumn =
            `${(cellIndex % 7) + 1}`;

        dayElement.style.gridRow =
            `${Math.floor(cellIndex / 7) + 1}`;

        if (
            dayNumber < 1 ||
            dayNumber > totalDays
        ) {

            dayElement.classList.add(
                "empty"
            );

            calendarGrid.appendChild(
                dayElement
            );

            continue;
        }

        const dateString =
            `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;

        const number =
            document.createElement("span");

        number.textContent =
            dayNumber;

        dayElement.appendChild(
            number
        );

        if (
            dateString ===
            todayString
        ) {

            dayElement.classList.add(
                "today"
            );
        }

        dayElement.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(
                        ".day.selected"
                    )
                    .forEach(function(day) {

                        day.classList.remove(
                            "selected"
                        );

                    });

                dayElement.classList.add(
                    "selected"
                );
            }
        );

        calendarGrid.appendChild(
            dayElement
        );
    }

    // -------------------------------------------------
    // MONTH RANGE
    // -------------------------------------------------

    const monthStart =
        new Date(
            currentYear,
            currentMonth,
            1
        );

    const monthEnd =
        new Date(
            currentYear,
            currentMonth,
            totalDays
        );

    // -------------------------------------------------
    // CREATE SEGMENTS
    // -------------------------------------------------

    let segments = [];

    tasks.forEach(function(task) {

        const taskSegments =
            createTaskSegments(
                task,
                monthStart,
                monthEnd,
                firstDay,
                startDay
            );

        segments =
            segments.concat(
                taskSegments
            );
    });

    // -------------------------------------------------
    // ASSIGN LANES
    // -------------------------------------------------

    const lanesByRow = {};

    segments.forEach(
        function(segment) {

            if (
                !lanesByRow[
                    segment.row
                ]
            ) {

                lanesByRow[
                    segment.row
                ] = [];
            }

            let lane = 0;

            while (true) {

                const overlap =
                    lanesByRow[
                        segment.row
                    ].some(
                        function(existing) {

                            return (
                                existing.lane ===
                                lane &&
                                !(
                                    segment.endColumn <=
                                    existing.startColumn ||
                                    segment.startColumn >=
                                    existing.endColumn
                                )
                            );
                        }
                    );

                if (!overlap) {
                    break;
                }

                lane++;
            }

            segment.lane =
                lane;

            lanesByRow[
                segment.row
            ].push(segment);
        }
    );

    // -------------------------------------------------
    // RENDER EVENTS
    // -------------------------------------------------

    segments.forEach(
        function(segment) {

            const task =
                segment.task;

            const event =
                document.createElement(
                    "div"
                );

            event.classList.add(
                "event",
                "multi-day-event",
                getCategoryClass(
                    task.category
                )
            );

            if (task.completed) {

                event.classList.add(
                    "completed"
                );
            }

            event.style.gridColumn =
                `${segment.startColumn} / ${segment.endColumn}`;

            event.style.gridRow =
                `${segment.row}`;

            event.style.zIndex =
                `${20 + segment.lane}`;

            event.style.marginTop =
                `${34 + segment.lane * 28}px`;

            event.style.backgroundColor =
                task.color ||
                DEFAULT_TASK_COLOR;

            event.style.color =
                task.textColor ||
                DEFAULT_TEXT_COLOR;

            // -----------------------------------------
            // LABEL
            // -----------------------------------------

            const label =
                document.createElement(
                    "span"
                );

            label.className =
                "multi-day-event-label";

            const originalStartDate =
                parseDate(task.date);

            const taskStartsHere =
                originalStartDate &&
                segment.startDate.getTime() ===
                originalStartDate.getTime();

            if (taskStartsHere) {

                label.textContent =
                    task.start
                        ? `${task.start} ${task.name}`
                        : task.name;

            } else {

                label.textContent =
                    task.name;
            }

            event.appendChild(
                label
            );

            // -----------------------------------------
            // END TIME
            // -----------------------------------------

            const taskEndDate =
                parseDate(
                    task.endDate ||
                    task.date
                );

            const endsHere =
                taskEndDate &&
                segment.endDate.getTime() ===
                taskEndDate.getTime();

            if (
                endsHere &&
                task.end
            ) {

                const endTime =
                    document.createElement(
                        "span"
                    );

                endTime.className =
                    "multi-day-event-end";

                endTime.textContent =
                    task.end;

                event.appendChild(
                    endTime
                );
            }

            // -----------------------------------------
            // CLICK
            // -----------------------------------------

            event.addEventListener(
                "click",
                function(eventObject) {

                    eventObject.stopPropagation();

                    openTaskDetail(task);
                }
            );

            calendarGrid.appendChild(
                event
            );
        }
    );

    // -------------------------------------------------
    // SIDEBAR
    // -------------------------------------------------

    renderUpcomingTasks();

    updateStatistics();
}

// =====================================================
// UPDATE STATISTICS
// =====================================================

function updateStatistics() {

    const completed =
        tasks.filter(
            function(task) {
                return task.completed;
            }
        ).length;

    const upcoming =
        tasks.filter(
            function(task) {

                return (
                    (
                        task.endDate ||
                        task.date
                    ) >=
                    todayString &&
                    !task.completed
                );
            }
        ).length;

    if (taskCount) {
        taskCount.textContent =
            tasks.length - completed;
    }

    if (totalTasks) {
        totalTasks.textContent =
            tasks.length;
    }

    if (completedTasks) {
        completedTasks.textContent =
            completed;
    }

    if (upcomingTaskCount) {
        upcomingTaskCount.textContent =
            upcoming;
    }
}

// =====================================================
// UPCOMING TASKS
// =====================================================

function renderUpcomingTasks() {

    if (!upcomingTasks) {
        return;
    }

    upcomingTasks.innerHTML = "";

    const upcoming =
        tasks
            .filter(function(task) {

                return (
                    (
                        task.endDate ||
                        task.date
                    ) >=
                    todayString
                );
            })
            .sort(function(a, b) {

                const dateA =
                    `${a.date} ${a.start || "23:59"}`;

                const dateB =
                    `${b.date} ${b.start || "23:59"}`;

                return dateA.localeCompare(
                    dateB
                );
            })
            .slice(0, 5);

    if (
        upcoming.length ===
        0
    ) {

        upcomingTasks.innerHTML = `
            <div class="no-upcoming">
                ไม่มีงานที่กำลังจะมาถึง
            </div>
        `;

        return;
    }

    upcoming.forEach(
        function(task) {

            const taskElement =
                document.createElement(
                    "div"
                );

            taskElement.classList.add(
                "task"
            );

            if (task.completed) {

                taskElement.classList.add(
                    "completed"
                );
            }

            // -----------------------------------------
            // ICON
            // -----------------------------------------

            const icon =
                document.createElement(
                    "div"
                );

            icon.classList.add(
                "task-icon",
                getCategoryClass(
                    task.category
                )
            );

            icon.textContent =
                getCategoryIcon(
                    task.category
                );

            // -----------------------------------------
            // INFO
            // -----------------------------------------

            const info =
                document.createElement(
                    "div"
                );

            info.classList.add(
                "task-info"
            );

            const title =
                document.createElement(
                    "h4"
                );

            title.textContent =
                task.name;

            const time =
                document.createElement(
                    "p"
                );

            const endDateText =
                task.endDate &&
                task.endDate !== task.date
                    ? ` → ${formatUpcomingDate(task.endDate)}`
                    : "";

            time.textContent =
                `${formatUpcomingDate(task.date)}${endDateText} · ${task.start || "--:--"}${task.end ? ` - ${task.end}` : ""}`;

            info.appendChild(
                title
            );

            info.appendChild(
                time
            );

            taskElement.appendChild(
                icon
            );

            taskElement.appendChild(
                info
            );

            taskElement.addEventListener(
                "click",
                function() {

                    openTaskDetail(task);
                }
            );

            upcomingTasks.appendChild(
                taskElement
            );
        }
    );
}

// =====================================================
// MONTH NAVIGATION
// =====================================================

function goToPreviousMonth() {

    currentMonth--;

    if (currentMonth < 0) {

        currentMonth = 11;
        currentYear--;
    }

    renderCalendar();
}

function goToNextMonth() {

    currentMonth++;

    if (currentMonth > 11) {

        currentMonth = 0;
        currentYear++;
    }

    renderCalendar();
}

function goToToday() {

    currentMonth =
        today.getMonth();

    currentYear =
        today.getFullYear();

    renderCalendar();
}

// =====================================================
// SEARCH
// =====================================================

function toggleSearch() {

    if (!searchBox) {
        return;
    }

    searchBox.classList.toggle(
        "active"
    );

    if (
        searchBox.classList.contains(
            "active"
        )
    ) {

        searchInput.focus();
    }
}

// =====================================================
// SEARCH TASKS
// =====================================================

function searchTasks(keyword) {

    const searchKeyword =
        keyword
            .trim()
            .toLowerCase();

    if (!searchKeyword) {

        renderCalendar();

        return;
    }

    const originalTasks =
        tasks;

    const filteredTasks =
        originalTasks.filter(
            function(task) {

                return (

                    (task.name || "")
                        .toLowerCase()
                        .includes(
                            searchKeyword
                        ) ||

                    (task.category || "")
                        .toLowerCase()
                        .includes(
                            searchKeyword
                        ) ||

                    (task.location || "")
                        .toLowerCase()
                        .includes(
                            searchKeyword
                        ) ||

                    (task.details || "")
                        .toLowerCase()
                        .includes(
                            searchKeyword
                        )
                );
            }
        );

    tasks =
        filteredTasks;

    renderCalendar();

    tasks =
        originalTasks;
}

// =====================================================
// DARK MODE
// =====================================================

function updateThemeIcon() {

    if (!themeButton) {
        return;
    }

    if (
        document.body.classList.contains(
            "dark-mode"
        )
    ) {

        themeButton.textContent =
            "🌙";

    } else {

        themeButton.textContent =
            "☀️";
    }
}

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            THEME_KEY
        );

    if (
        savedTheme ===
        "dark"
    ) {

        document.body.classList.add(
            "dark-mode"
        );
    }

    updateThemeIcon();
}

function toggleTheme() {

    document.body.classList.toggle(
        "dark-mode"
    );

    const isDark =
        document.body.classList.contains(
            "dark-mode"
        );

    localStorage.setItem(
        THEME_KEY,
        isDark
            ? "dark"
            : "light"
    );

    updateThemeIcon();
}

// =====================================================
// NOTIFICATION PERMISSION
// =====================================================

function requestNotificationPermission() {

    if (
        !("Notification" in window)
    ) {
        return;
    }

    if (
        Notification.permission !==
        "default"
    ) {
        return;
    }

    setTimeout(
        function() {

            Notification
                .requestPermission()
                .catch(
                    function() {
                        // Browser อาจไม่อนุญาต
                    }
                );

        },
        1500
    );
}

// =====================================================
// SHOW NOTIFICATION
// =====================================================

function showNotification(task) {

    if (
        !("Notification" in window)
    ) {
        return;
    }

    if (
        Notification.permission !==
        "granted"
    ) {
        return;
    }

    new Notification(
        "Task Reminder 🔔",
        {
            body:
                task.name
        }
    );
}

// =====================================================
// CHECK NOTIFICATIONS
// =====================================================

function checkTaskNotifications() {

    if (
        !("Notification" in window)
    ) {
        return;
    }

    if (
        Notification.permission !==
        "granted"
    ) {
        return;
    }

    const now =
        new Date();

    const currentDate =
        formatDateToString(
            now
        );

    const currentTime =
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    let changed =
        false;

    tasks.forEach(
        function(task) {

            if (task.completed) {
                return;
            }

            if (
                task.date !==
                currentDate
            ) {
                return;
            }

            if (!task.start) {
                return;
            }

            if (
                task.start !==
                currentTime
            ) {
                return;
            }

            if (task.notified) {
                return;
            }

            showNotification(task);

            task.notified =
                true;

            changed =
                true;
        }
    );

    if (changed) {
        saveTasks();
    }
}

// =====================================================
// FIX OLD TASK DATA
// =====================================================

function fixOldTaskData() {

    let changed =
        false;

    tasks.forEach(
        function(task) {

            if (
                !task.endDate &&
                task.date
            ) {

                task.endDate =
                    task.date;

                changed =
                    true;
            }

            if (!task.color) {

                task.color =
                    DEFAULT_TASK_COLOR;

                changed =
                    true;
            }

            if (!task.textColor) {

                task.textColor =
                    DEFAULT_TEXT_COLOR;

                changed =
                    true;
            }

            if (
                typeof task.completed !==
                "boolean"
            ) {

                task.completed =
                    false;

                changed =
                    true;
            }

            if (
                typeof task.notified !==
                "boolean"
            ) {

                task.notified =
                    false;

                changed =
                    true;
            }
        }
    );

    if (changed) {
        saveTasks();
    }
}

// =====================================================
// DEFAULT END DATE
// =====================================================

function setupDefaultEndDate() {

    if (
        !taskDateInput ||
        !taskEndDateInput
    ) {
        return;
    }

    taskDateInput.addEventListener(
        "change",
        function() {

            if (
                !taskEndDateInput.value
            ) {

                taskEndDateInput.value =
                    taskDateInput.value;
            }
        }
    );
}

// =====================================================
// ESC KEY
// =====================================================

function setupEscapeKey() {

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key !==
                "Escape"
            ) {
                return;
            }

            if (
                taskModal &&
                taskModal.style.display ===
                "flex"
            ) {

                closeNewTaskModal();
            }

            if (
                taskDetailModal &&
                taskDetailModal.style.display ===
                "flex"
            ) {

                closeTaskDetail();
            }
        }
    );
}

// =====================================================
// CLICK OUTSIDE SEARCH
// =====================================================

function setupSearchOutsideClick() {

    document.addEventListener(
        "click",
        function(event) {

            if (
                !searchBox ||
                !searchButton
            ) {
                return;
            }

            if (
                !searchBox.contains(
                    event.target
                ) &&
                !searchButton.contains(
                    event.target
                )
            ) {

                searchBox.classList.remove(
                    "active"
                );
            }
        }
    );
}

// =====================================================
// MODAL OUTSIDE CLICK
// =====================================================

function setupModalOutsideClick() {

    if (taskModal) {

        taskModal.addEventListener(
            "click",
            function(event) {

                if (
                    event.target ===
                    taskModal
                ) {

                    closeNewTaskModal();
                }
            }
        );
    }

    if (taskDetailModal) {

        taskDetailModal.addEventListener(
            "click",
            function(event) {

                if (
                    event.target ===
                    taskDetailModal
                ) {

                    closeTaskDetail();
                }
            }
        );
    }
}

// =====================================================
// EVENT LISTENERS
// =====================================================

function setupEventListeners() {

    if (newTaskButton) {

        newTaskButton.addEventListener(
            "click",
            openNewTaskModal
        );
    }

    if (closeModal) {

        closeModal.addEventListener(
            "click",
            closeNewTaskModal
        );
    }

    if (saveTaskButton) {

        saveTaskButton.addEventListener(
            "click",
            createTask
        );
    }

    if (prevMonthButton) {

        prevMonthButton.addEventListener(
            "click",
            goToPreviousMonth
        );
    }

    if (nextMonthButton) {

        nextMonthButton.addEventListener(
            "click",
            goToNextMonth
        );
    }

    if (todayButton) {

        todayButton.addEventListener(
            "click",
            goToToday
        );
    }

    if (closeTaskDetailModal) {

        closeTaskDetailModal.addEventListener(
            "click",
            closeTaskDetail
        );
    }

    if (editTaskButton) {

        editTaskButton.addEventListener(
            "click",
            editSelectedTask
        );
    }

    if (deleteTaskButton) {

        deleteTaskButton.addEventListener(
            "click",
            deleteSelectedTask
        );
    }

    if (completeTaskButton) {

        completeTaskButton.addEventListener(
            "click",
            toggleCompleteTask
        );
    }

    if (searchButton) {

        searchButton.addEventListener(
            "click",
            toggleSearch
        );
    }

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function() {

                searchTasks(
                    searchInput.value
                );
            }
        );
    }

    if (themeButton) {

        themeButton.addEventListener(
            "click",
            toggleTheme
        );
    }
}

// =====================================================
// START APP
// =====================================================

function initCalendar() {

    // แก้ข้อมูลเก่าก่อน
    fixOldTaskData();

    // โหลด Theme
    loadTheme();

    // ตั้ง Event
    setupEventListeners();

    // ตั้ง Modal
    setupModalOutsideClick();

    // ตั้ง ESC
    setupEscapeKey();

    // ตั้ง Search
    setupSearchOutsideClick();

    // ตั้ง End Date
    setupDefaultEndDate();

    // ขอ Notification
    requestNotificationPermission();

    // วาด Calendar
    renderCalendar();

    // เช็ก Notification ทันที
    checkTaskNotifications();

    // เช็กทุก 1 นาที
    setInterval(
        checkTaskNotifications,
        60000
    );
}

// =====================================================
// RUN
// =====================================================

initCalendar();