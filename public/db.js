// create new db request for budget db

let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
    // checking to see if app is online before reading from db
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function(event) {
    console.log("whoops! " + event.target.errorCode);
};

function saveRecord(record) {
    // create a transaction on the pending db with readwrite access
    const transaction = db.transaction(["pending"], "readwrite");
    //access pending object store
    const store = transaction.objectStore("pending");
    // add record to your store
    store.add(record);
}

function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
            method: "POST",
            body: JSON.stringify(getAll.result),
            headers: {
                Accept: "application/json, text/plain,*/*",
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(() => {
            const transaction = db.transaction(["pending"], "readwrite");

            const store = transaction.objectStore("pending");

            
        });
    }
};
}

window.addEventListener("online", checkDatabase);