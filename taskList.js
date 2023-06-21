// input fields - ref
const taskField = document.getElementById('taskField');
const dateField = document.getElementById('dateField');
const priorityField = document.getElementById('priority');

// error message placeholders -ref
const taskError = document.getElementById('taskError');
const dateError = document.getElementById('dateError');
const priorityError = document.getElementById('priorityError');

// Add input event listeners to the fields
taskField.addEventListener('input', () => clearFields(taskError));
dateField.addEventListener('input', () => clearFields(dateError));
priorityField.addEventListener('input', () => clearFields(priorityError));

const taskList = document.getElementById('taskList');
const emptyData = `<div class="empty-list"> No tasks to display </div>`

let editedData = null

const clearFields = (clearData,formFields) => {
 if(formFields){
    if(Array.isArray(clearData)){
        clearData.forEach((field) => field.value = '')
       }
       else{
        clearData.value = ""
       }
 }
   else{
    if(Array.isArray(clearData)){
        clearData.forEach((errorElement) => errorElement.textContent = '')
       }
       else{
        clearData.textContent = ""
       }
   }
}

let totalLists = [];
taskList.innerHTML = totalLists.length === 0 && emptyData;

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault(); 

  const taskFieldValue = taskField.value.trim();
  const dateFieldValue = dateField.value.trim();
  const priorityValue = priorityField.value;

  clearFields([taskError,dateError,priorityError])

  let errors = false;

  // Validate the fields
  if (taskFieldValue === '') {
    taskError.textContent = 'Please enter a value for the task field.';
    errors = true;
  }

  if (dateFieldValue === '') {
    dateError.textContent = 'Please select a date.';
    errors = true;
  } else {
    const currentDate = new Date().toISOString().split('T')[0];
    if (dateFieldValue < currentDate) {
      dateError.textContent = 'Please select a future date.';
      errors = true;
    }
  }

  if (priorityValue === '') {
    priorityError.textContent = 'Please select a priority.';
    errors = true;
  }

  // If there are errors, stop further processing
  if (errors) {
    return;
  }

  // Create a new object with the form values
   if(!editedData){
    const formResult = {
        taskName: taskFieldValue,
        dueDate: dateFieldValue,
        priority: priorityValue,
        id: totalLists.length + 1,
        isCompleted:false
      };
    
      totalLists = [...totalLists, formResult];
        
      clearFields([taskField,dateField,priorityField],true)
    
      console.log("Form Results:", totalLists);
      displayTotalLists();
   }
   else {
    const editedResult = {
        taskName: taskFieldValue,
        dueDate: dateFieldValue,
        priority: priorityValue,
        id: editedData.id,
        isCompleted:editedData.isCompleted
      };
      totalLists = totalLists.map(data => data.id === editedData.id ? editedResult : data)
      clearFields([taskField,dateField,priorityField],true)
      editedData=null
      displayTotalLists();
   }
});


const deleteTask = (id) => {
    totalLists = totalLists.filter((task) => task.id !== id);
    displayTotalLists();
  };

  const editTask = (id) => {
    const task = totalLists.find((task) => task.id === id);
    if (task) {
      taskField.value = task.taskName;
      dateField.value = task.dueDate;
      priorityField.value = task.priority;
    }
    editedData = task
  }
  
 const completeTask = (id) => {
    totalLists = totalLists.map(data => data.id === id ? {...data,isCompleted:true} : data)
    displayTotalLists();
 } 

const displayTotalLists = () => {
     
    if(totalLists.length === 0){
        taskList.innerHTML =  emptyData ;
        return
      }
    taskList.innerHTML = '';

    sortingData(totalLists).forEach((data, index) => {
      const priority = data.priority.charAt(0).toUpperCase() + data.priority.slice(1);
      const date = formatDate(data.dueDate)
      const listItem = `<li>
        <div class="${data.isCompleted ? 'completed' : ''}"> ${index + 1}</div>
        <div class="${data.isCompleted ? 'completed' : ''}"> ${data.taskName}</div>
        <div class="${data.isCompleted ? 'completed' : ''}">${date}</div>
        <div class="${data.isCompleted ? 'completed' : ''}">${priority}</div>
        <div>
        <button ${data.isCompleted ? 'disabled' : ''} onclick="editTask(${data.id})">Edit</button>
        <button onclick="deleteTask(${data.id})">Delete</button>
        <button ${data.isCompleted ? 'disabled' : ''} onclick="completeTask(${data.id})">Complete</button>
        </div>
      </li>`;
      
      taskList.innerHTML +=  listItem ;
    });
  };
  
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const result = formattedDate.split(" ")
    return result[1].slice(0,2)+" "+result[0]+" "+result[2]
  };

  const sortingData = (data) => data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
