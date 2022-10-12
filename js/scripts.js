// Create empty array for tasks
let tasksArr = JSON.parse(localStorage.getItem('tasks')) || [];

// Increment index to set on localStorage
let taskLocalIndex = Number(localStorage.getItem('taskIndex'));

// Update localStorage
let updateTasksLocal = () => {
   localStorage.setItem('tasks', JSON.stringify(tasksArr));
};

let updateTasksIdLocal = () => {
   localStorage.setItem('taskIndex', taskLocalIndex);
};


// Get html elements
let elFormTask = $_('.js-tasks__form');
let elInputTask = $_('.js-tasks__input');
let elTasksList = $_('.js-tasks__list');
let elTasksleft = $_('.js-tasks__left');
let elTaskTemplate = $_('#todo__item-template').content;
let elTasksFilterBox = $_('.tasks__filter-btns-box');


// Create Tasks item
let createTasksItem = (task) => {
   elTask = elTaskTemplate.cloneNode(true);

   $_('.tasks__completed-checkbox', elTask).checked = task.completed;
   $_('.tasks__completed-checkbox', elTask).dataset.todoId = task.id;
   $_('.tasks__completed-checkbox', elTask).setAttribute(
      'id',
      `todo${task.id}`
   );
   $_('.tasks__completed-label', elTask).setAttribute('for', `todo${task.id}`);
   $_('.tasks__text', elTask).textContent = task.taskText;
   $_('.js-remove-task-btn', elTask).dataset.todoId = task.id;

   if (task.completed) {
      $_('.tasks__text', elTask).classList.add('del');
   }

   return elTask;
};


// Create and push task object
let createTasksToArray = (inputTask) => {
   tasksArr.push({
      id: ++taskLocalIndex,
      taskText: inputTask,
      completed: false,
   });
};


// Render tasks to document
let renderTasks = (arr) => {
   elTasksList.innerHTML = '';

   let elTasksFragment = document.createDocumentFragment();

   arr.forEach((task) => {
      elTasksFragment.append(createTasksItem(task));
   });

   elTasksList.append(elTasksFragment);
};


// Tasks left function
let showTasksUndone = () => {

   let tasksUndone = tasksArr.filter((task) => {
      return task.completed === false;
   });

   elTasksleft.textContent = tasksUndone.length;
};




let onElFormTaskSubmit = (evt) => {
   evt.preventDefault();

   // Get value of inputTask
   let inputTask = elInputTask.value.trim();

   // Prevent empty value
   if (!inputTask) {
      alert('Please, enter text!');
      return;
   }

   createTasksToArray(inputTask);
   renderTasks(tasksArr);

   updateTasksIdLocal();
   updateTasksLocal();

   // Little UI feature
   elInputTask.value = '';
   elInputTask.focus();

   showTasksUndone();
};

// Listen submit of elFormTask and assign callback function
elFormTask.addEventListener('submit', onElFormTaskSubmit);


// Render Tasks to show tasks sharply after reload
renderTasks(tasksArr);
showTasksUndone();


let removeTodo = (todoTarget) => {
   // Delete element
   todoTarget.closest('li').remove();

   // Find element form array and splice
   let foundTaskIndex = tasksArr.findIndex((task) => {
      return task.id === Number(todoTarget.dataset.todoId);
   });

   tasksArr.splice(foundTaskIndex, 1);
};

let toggleAssignCompleted = (taskId) => {
   let taskDone = tasksArr.find((task) => {
      return taskId === task.id;
   });

   // Assign it to vice verca when it checked
   taskDone.completed = !taskDone.completed;
};




let onElTasksListClick = (evt) => {

   if (evt.target.matches('.js-remove-task-btn')) {

      removeTodo(evt.target);
      updateTasksLocal();

   } else if (evt.target.matches('.tasks__completed-checkbox')) {

      // Assign target checkbox's id to new binding
      let taskDoneId = Number(evt.target.dataset.todoId);

      // Toggle class to task element
      evt.target.closest('div').nextElementSibling.classList.toggle('del');

      toggleAssignCompleted(taskDoneId);
      updateTasksLocal();
      showTasksUndone();
   }
};

// Add the callback
elTasksList.addEventListener('click', onElTasksListClick);



let onElTasksFilterBox = (evt) => {
   if (evt.target.matches('.js-tasks__filter-all')) {

      // Render all
      renderTasks(tasksArr);

   } else if (evt.target.matches('.js-tasks__filter-active')) {

      // Filter active tasks and render
      activeTasksArr = tasksArr.filter((task) => {
         return task.completed === false;
      });

      renderTasks(activeTasksArr);

   } else if (evt.target.matches('.js-tasks__filter-completed')) {

      // Filter done tasks and render
      doneTasksArr = tasksArr.filter((task) => {
         return task.completed === true;
      });

      renderTasks(doneTasksArr);

   } else if (evt.target.matches('.js-tasks__clear-completed')) {

      // Clear local storage and make everything empty
      tasksArr = []
      elTasksList.innerHTML = '';

      updateTasksIdLocal();
      updateTasksLocal();

   }
};

// Add the callback
elTasksFilterBox.addEventListener('click', onElTasksFilterBox);