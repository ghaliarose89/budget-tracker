// create variable to hold db connection
let db;
// establish a connection to IndexedDB database 
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_transaction', { autoIncrement: true });
};


request.onsuccess = function(event) {
    // when db is successfully created with its object store 
    db = event.target.result;
    // check if app is online
    if (navigator.onLine) {
      uploadTransaction();
    }
  };
  
request.onerror = function(event) {
console.log(event.target.errorCode);
};

function saveRecord(record) {
    // open a new transaction with the database with read and write permissions 
    const transaction = db.transaction(['new_transaction'], 'readwrite');
  
    // access the object store 
    const budgetObjectStore = transaction.objectStore('new_transaction');
  
    
    budgetObjectStore.add(record);
};

// function that will handle collecting all of the data 
function uploadTransaction() {
    // open a transaction on your db
    let transaction = db.transaction(['new_transaction']);
  
    // access the object store 
    const budgetObjectStore = transaction.objectStore('new_transaction');
    // get all transactions from store and set to a variable
    const getAll = budgetObjectStore.getAll();
  
    //getAll() execution, run this function
    getAll.onsuccess = function() {
    // if there was data in indexedDb's store, let's send it to the api server
    if (getAll.result.length > 0) {
      fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open one more transaction
          const transaction = db.transaction(['new_transaction'], 'readwrite');
          // access the object store
          const budgetObjectStore = transaction.objectStore('new_transaction');
          // clear all items in your store
          budgetObjectStore.clear();

          alert('All saved transactions has been submitted!');
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
}

// listen for app coming back online
window.addEventListener('online', uploadTransaction);