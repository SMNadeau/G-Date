console.log("Initialize the app:");

const firebase = require('../firebase/config')

var db = firebase.firestore();

function setImages(status) {
    document.getElementById('imageList').innerHTML = "";
    const input = document.getElementById('fileInput');
    input.style.opacity = 0;
    db.collection('users')
        .where('role', '==', 'bot')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let li = document.createElement('li');
                let label = document.createElement('label');
                let image = document.createElement('image');
                label.innerHTML = doc.data().firstName + '-' + doc.data().age;
                image.innerHTML = `<img style="width:128px;height:128px;" src="${doc.data().profilePictureURL}">`;
                //This would changed depending on whether I am editing or adding
                if (status == 'edit') {
                    image.onclick = () => {
                        ipcRenderer.send('photos:edit', doc.id)
                        //editBotPhoto(doc.id)
                    };
                } else if (status == 'add') {
                    image.onclick = () => { addBotPhoto(doc.id) };
                } else if (status = 'show all') {
                    
                }

                li.appendChild(label);
                li.appendChild(image);
                li.style.outline = "solid black";

                document.getElementById('imageList').appendChild(li);

                //console.log(doc.id, '=>', doc.data());
            });

        }).catch((error) => {
            console.log('Error getting documents: ', error);
        });
}

function addBotPhoto(id) {
    var fileInput = document.getElementById('fileInput');
    fileInput.click();
    fileInput.onchange = () => {
        var path = document.querySelector("input").files[0];
        console.log(path.name);
        var storageRef = firebase.storage().ref();
        var newImageRef = storageRef.child('botphotos/' + path.name)
        newImageRef.put(path).then((snapshot) => {
            console.log('Uploaded new image!');
        }).then(() => {
            newImageRef.getDownloadURL().then((url) => {
                changeUserPhoto(id, url, () => {
                    ipcRenderer.send('MainWindow:reload');
                });
            });
        });
    };
}

function editBotPhoto(id) {
    var storageRef = firebase.storage().ref();
    // Create a reference under which you want to list
    var listRef = storageRef.child('botphotos/');

    // Find all the prefixes and items.
    listRef.listAll()
        .then((res) => {
            res.prefixes.forEach((folderRef) => {
                // All the prefixes under listRef.
                // You may call listAll() recursively on them.
                //console.log(folderRef);
            });
            res.items.forEach((itemRef) => {
                // All the items under listRef.
                itemRef.getDownloadURL().then((url) => {
                    let li = document.createElement('li');
                    let label = document.createElement('label');
                    let image = document.createElement('image');
                    label.innerHTML = itemRef.name;
                    image.innerHTML = `<img style="width:128px;height:128px;" src="${url}">`;

                    image.onclick = () => {
                        changeUserPhoto(id, url, () => {
                            window.close();
                            //ipcRenderer.send('AddWindow:close');
                        });
                        
                    };

                    li.appendChild(label);
                    li.appendChild(image);
                    li.style.outline = "solid black";

                    document.getElementById('imageList').appendChild(li);

                    //console.log(url);
                });
            });
        }).catch((error) => {
            // Uh-oh, an error occurred!
        });

}

function changeUserPhoto(id, newUrl, callback) {
    var docRef = db.collection('users').doc(id);

    return docRef
        .update({
            profilePictureURL: newUrl,
        })
        .then(() => {
            console.log('Document successfully updated!');

            if (typeof callback !== 'undefined') {
                callback();
            }
            
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error('Error updating document: ', error);
        });
}

function getBots() {
    db.collection('users')
        .where('role', '==', 'bot')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, '=>', doc.data());
            });

        }).catch((error) => {
            console.log('Error getting documents: ', error);
        });
}