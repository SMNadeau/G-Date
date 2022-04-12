console.log('Initialize the app:');

const firebase = require('../firebase/config')

var db = firebase.firestore();

async function deleteAllData() {
    //Finds any document that is associated with userId and deletes it
    await db
        .collection('PostDate')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((docRef) => {
                docRef.ref
                    .delete()
                    .then(() => {
                        console.log('Document successfully deleted!');
                    })
                    .catch((error) => {
                        console.error('Error removing document: ', error);
                    });
            });
        })
        .catch((error) => {
            console.log('Error getting documents: ', error);
        });

    await db
        .collection('PreDate')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((docRef) => {
                docRef.ref
                    .delete()
                    .then(() => {
                        console.log('Document successfully deleted!');
                    })
                    .catch((error) => {
                        console.error('Error removing document: ', error);
                    });
            });
        })
        .catch((error) => {
            console.log('Error getting documents: ', error);
        });

    await db
        .collection('SpeedDateData')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((docRef) => {
                docRef.ref
                    .delete()
                    .then(() => {
                        console.log('Document successfully deleted!');
                    })
                    .catch((error) => {
                        console.error('Error removing document: ', error);
                    });
            });
        })
        .catch((error) => {
            console.log('Error getting documents: ', error);
        });

    await db
        .collection('notifications')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((docRef) => {
                docRef.ref
                    .delete()
                    .then(() => {
                        console.log('Document successfully deleted!');
                    })
                    .catch((error) => {
                        console.error('Error removing document: ', error);
                    });
            });
        })
        .catch((error) => {
            console.log('Error getting documents: ', error);
        });

    await db
        .collection('rating')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((docRef) => {
                docRef.ref
                    .delete()
                    .then(() => {
                        console.log('Document successfully deleted!');
                    })
                    .catch((error) => {
                        console.error('Error removing document: ', error);
                    });
            });
        })
        .catch((error) => {
            console.log('Error getting documents: ', error);
        });

    await db
        .collection('swipe_counts')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((docRef) => {
                docRef.ref
                    .delete()
                    .then(() => {
                        console.log('Document successfully deleted!');
                    })
                    .catch((error) => {
                        console.error('Error removing document: ', error);
                    });
            });
        })
        .catch((error) => {
            console.log('Error getting documents: ', error);
        });

    await db
        .collection('swipes')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((docRef) => {
                docRef.ref
                    .delete()
                    .then(() => {
                        console.log('Document successfully deleted!');
                    })
                    .catch((error) => {
                        console.error('Error removing document: ', error);
                    });
            });
        })
        .catch((error) => {
            console.log('Error getting documents: ', error);
        });
    //ipcRenderer.send('MainWindow:reload');
}

async function deleteAllDataCheck() {
    let count = 1;
    //Finds any document that is associated with userId and deletes it
    await db
        .collection('PostDate')
        .get()
        .then((querySnapshot) => {
            count += querySnapshot.size;
        })
        .catch((error) => {
            console.log('Error getting documents: ', error);
        });

    await db
        .collection('PreDate')
        .get()
        .then((querySnapshot) => {
            count += querySnapshot.size;
        })
        .catch((error) => {
            console.log('Error getting documents: ', error);
        });

    await db
        .collection('SpeedDateData')
        .get()
        .then((querySnapshot) => {
            count += querySnapshot.size;
        })
        .catch((error) => {
            console.log('Error getting documents: ', error);
        });

    await db
        .collection('notifications')
        .get()
        .then((querySnapshot) => {
            count += querySnapshot.size;
        })
        .catch((error) => {
            console.log('Error getting documents: ', error);
        });

    await db
        .collection('rating')
        .get()
        .then((querySnapshot) => {
            count += querySnapshot.size;
        })
        .catch((error) => {
            console.log('Error getting documents: ', error);
        });

    await db
        .collection('swipe_counts')
        .get()
        .then((querySnapshot) => {
            count += querySnapshot.size;
        })
        .catch((error) => {
            console.log('Error getting documents: ', error);
        });

    await db
        .collection('swipes')
        .get()
        .then((querySnapshot) => {
            count += querySnapshot.size;
        })
        .catch((error) => {
            console.log('Error getting documents: ', error);
        });
    console.log(count)

    ipcRenderer.send('dialog', {
        title: 'Clear Data Warning',
        message: `${count} database references are going to be deleted.`,
        type: 'warning',
        buttons: ['Cancel', 'OK'],
    });

    ipcRenderer.on('dialog', (event, dialog) => {
        if (dialog.response == 0) {
            ipcRenderer.send('MainWindow:reload');
        } else if (dialog.response == 1) {
            deleteAllData();
        }
    });
}