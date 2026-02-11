import { checkAuth } from "./auth.js";

(async () => {
    const user = await checkAuth();
    if(!user) return;

    console.log("Logged user:", user);

    let unfinishedTasksCount = 0;

    const list = document.getElementById("taskList");
    const form = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");

    await loadTasks();

    //GET - za ucitavanje taskova iz backenda
    async function loadTasks() {
        try {
            const res = await fetch("/backend/api/tasks/tasks.php");
            const tasks = await res.json();

            unfinishedTasksCount = tasks.filter(t => t.status !== "completed").length;

            list.innerHTML = "";

            tasks.forEach(task => {

                const li = document.createElement("li");
                li.dataset.id = task.id;
                li.innerHTML = `
                    <span class="${task.status === "completed" ? "done" : ""}">
                        ${task.task}
                    </span>

                    <div class="task-actions">
                        <button class="toggle-btn ${task.status === "completed" ? "completed" : ""}">
                        <i class="fa-solid ${task.status === "completed" ? "fa-rotate-left" : "fa-check"}"></i>
                        </button>
                        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
                list.appendChild(li);
            });

            const clearBtn = document.getElementById("clear-all-btn");

            if(tasks.length >= 2){
                clearBtn.style.display = "block";
            }else {
                clearBtn.style.display = "none";
            }

        } catch(err) {
            console.error("Error loading tasks:", err);
        }
    }

    //Event delegation za toggle/delete
    list.addEventListener("click", async (e) => {
        const li = e.target.closest("li");
        if(!li) return;

        const id = li.dataset.id;

        if(e.target.closest(".toggle-btn")){
            await toggleTask(id);
            await loadTasks();
        }

        if(e.target.closest(".delete-btn")){
            await deleteTask(id);
            await loadTasks();
        }
    });

    //POST - za slanje taskova backendu
    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const task = taskInput.value.trim();

        if(!task){
            alert("Write a task");
            return;
        }

        try {
            await fetch("/backend/api/tasks/tasks.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action: "add",
                    task
                })
            });

            taskInput.value = "";
            await loadTasks();
        } catch(err) {
            console.error("Error adding task:", err);
        }
    });

    //funkcija za brisanje taska
    async function deleteTask(id) {
        try {
            await fetch("/backend/api/tasks/tasks.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action: "delete",
                    id
                })
            });

            await loadTasks();
        } catch(err) {
            console.error("Error deleting task:", err);
        }
    }

    //funkcija za zavrsetak taska
    async function toggleTask(id){
        try {
            await fetch("/backend/api/tasks/tasks.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action: "toggle",
                    id
                })
            });

            await loadTasks();
        } catch(err) {
            console.error("Error toggling task:", err);
        }
    }

    async function clearAllTasks(){

        let message = "Delete all tasks?";

        if(unfinishedTasksCount > 0){
            message = `You have ${unfinishedTasksCount} unfinished task${unfinishedTasksCount > 1 ? "s" : ""}. Are you sure you want to delete all tasks?`;
        }

        if(!confirm(message)) return;

        try {
            await fetch("/backend/api/tasks/tasks.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action: "clear_all"
                })
            });

            await loadTasks();
        }catch(err) {
            console.error("Error clearing all tasks", err);
        }
    }

    document.getElementById("clear-all-btn").addEventListener("click", clearAllTasks);


})();