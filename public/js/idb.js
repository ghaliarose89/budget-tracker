let db;
// establish a connection to IndexedDB database 
const request = indexedDB.open('budget_tracker',1);

request.onupgradeneeded = function (event){
const db = event.target.result;
db.createObjectStore('new-transaction' , {autoIncrement: true});
};

request.onsuccess = function(event)  {
    const db = event.target.request;
    if (navigator.onLine){
        //uploadTransaction()
    }

};
request.onerror = function (event) {
    console.log(event.target.errorCode)
};

function saveRecord(record) {
    const transaction = db.transaction(['new-transaction'] , 'readwrite');
    
    const transactionObject = transaction.objectStore('new-transaction');

    transactionObject.add(record)

}