// Array to store all tasks
// Each task is an object: { id, text, completed }
let tasks = [];

// Load tasks from Local Storage when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    displayDate();
    
    // Allow adding task by pressing Enter key
    document.getElementById('taskInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});

// Function to display current date
function displayDate() {
    const dateElement = document.getElementById('currentDate');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);
    dateElement.textContent = today;
}

// Function to add a new task
function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim(); // Remove extra spaces
    
    // Validation: Check if input is empty
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    // Create new task object
    const newTask = {
        id: Date.now(), // Unique ID using timestamp
        text: taskText,
        completed: false
    };
    
    // Add to array
    tasks.push(newTask);
    
    // Save to Local Storage
    saveTasks();
    
    // Clear input box
    input.value = '';
    
    // Update the display
    renderTasks();
}

// Function to delete a specific task
function deleteTask(id) {
    // Filter out the task with matching id
    tasks = tasks.filter(task => task.id !== id);
    
    saveTasks();
    renderTasks();
}

// Function to toggle task completion status
function toggleTask(id) {
    // Find the task in array
    const task = tasks.find(task => task.id === id);
    
    if (task) {
        task.completed = !task.completed; // Toggle boolean
        saveTasks();
        renderTasks();
    }
}

// Function to clear all tasks
function clearAllTasks() {
    if (tasks.length === 0) return;
    
    const confirmClear = confirm('Are you sure you want to delete all tasks?');
    if (confirmClear) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
}

// Function to render/display all tasks
function renderTasks() {
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const clearBtn = document.getElementById('clearBtn');
    
    // Clear current list
    taskList.innerHTML = '';
    
    // Show/hide empty state message
    if (tasks.length === 0) {
        emptyState.classList.add('show');
        clearBtn.classList.remove('show');
    } else {
        emptyState.classList.remove('show');
        clearBtn.classList.add('show');
    }
    
    // Loop through tasks and create HTML for each
    tasks.forEach(task => {
        // Create list item
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.onclick = () => toggleTask(task.id);
        
        // Create task text span
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteTask(task.id);
        
        // Append elements to list item
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        
        // Append list item to task list
        taskList.appendChild(li);
    });
    
    // Update statistics
    updateStats();
}

// Function to update statistics (total and completed)
function updateStats() {
    const totalElement = document.getElementById('totalTasks');
    const completedElement = document.getElementById('completedTasks');
    
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    
    totalElement.textContent = `Total: ${total}`;
    completedElement.textContent = `Completed: ${completed}`;
}

// Function to save tasks to Local Storage
function saveTasks() {
    // Convert tasks array to JSON string and save
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

// Function to load tasks from Local Storage
function loadTasks() {
    const savedTasks = localStorage.getItem('myTasks');
    
    if (savedTasks) {
        // Convert JSON string back to array
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
}