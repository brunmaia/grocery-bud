// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const btnSubmit = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const btnClear = document.querySelector('.clear-btn');

// edit option
let editElement;
let editFlag = false;
let editID = '';
let onList = false;

// ****** EVENT LISTENERS **********
// submit form
form.addEventListener('submit', addItem);
// clear form
btnClear.addEventListener('click', clearItems);
// load items
window.addEventListener('DOMContentLoaded', setupItems);

// ****** FUNCTIONS **********
function addItem(e) {
  e.preventDefault();
  let value = grocery.value;
  value = value.trim();
  value = value.replace(/\s+/g, ' ');
  value = value.toLowerCase();
  const id = new Date().getTime().toString();
  checkList(value);

  if (value && !editFlag && onList == false) {
    createListItem(id, value);
    // display alert
    displayAlert('item added to the list', 'success');
    // show container
    container.classList.add('show-container');
    // add to local storage
    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value && editFlag && onList == false) {
    editElement.innerHTML = value;
    displayAlert('value changed', 'success');
    // edit local storage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else if (value && onList == true) {
    displayAlert('item is already on the list', 'danger');
    setBackToDefault();
  } else {
    displayAlert('please enter value', 'danger');
  }
}

function checkList(value) {
  const items = document.querySelectorAll('.grocery-item');
  for (let i = 0; i < items.length; i++) {
    if (items[i].textContent.includes(value)) {
      onList = true;
      break;
    }
  }
  console.log(items);
}
// delete item function
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  element.remove();
  displayAlert('item deleted from the list', 'danger');
  const items = document.querySelectorAll('.grocery-item');
  if (items.length == 0) {
    container.classList.remove('show-container');
  }
  setBackToDefault();
  removeFromLocalStorage(id);
}
// edit item function
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editID = element.dataset.id;
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;

  // set form value
  grocery.value = editElement.innerHTML;
  editFlag = true;
  btnSubmit.textContent = 'edit';
}
// set back to default
function setBackToDefault() {
  grocery.value = '';
  editFlag = false;
  editID = '';
  btnSubmit.textContent = 'submit';
  onList = false;
}

// clear items
function clearItems() {
  const items = document.querySelectorAll('.grocery-item');
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }

  container.classList.remove('show-container');
  displayAlert('empty list', 'danger');
  setBackToDefault();
  localStorage.removeItem('list');
}
// display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  //   remove alert
  setTimeout(function () {
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}
// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem('list', JSON.stringify(items));
}
function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem('list', JSON.stringify(items));
}
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem('list', JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : [];
}

// ****** SETUP ITEMS **********
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add('show-container');
  }
}

function createListItem(id, value) {
  const element = document.createElement('article');
  // add class
  element.classList.add('grocery-item');
  // add id
  const attr = document.createAttribute('data-id');
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `<p class="title">${value}</p>
                <div class ="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>`;
  const btnDelete = element.querySelector('.delete-btn');
  const btnEdit = element.querySelector('.edit-btn');

  btnDelete.addEventListener('click', deleteItem);
  btnEdit.addEventListener('click', editItem);
  // append child
  list.appendChild(element);
}
