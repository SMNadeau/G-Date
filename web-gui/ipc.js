const { ipcMain } = require('electron');

const { newUser, editUser, editQuestion, editPhoto, } = require('./modals');
//const { mainWindow, addWindow } = require('./main');


/**
 * Listener used to open user editing homepage
 */
//ipcMain.on('users:open', () => {
//    mainWindow.loadFile('users/users.html');
//});

/**
 * Listener used to open user editing homepage
 */
//ipcMain.on('data:open', () => {
//    mainWindow.loadFile('data/data.html');
//});

/**
 * Listener used to open user editing homepage
 */
//ipcMain.on('questions:open', () => {
//    mainWindow.loadFile('questions/questions.html');
//});

ipcMain.on('questions:edit', (event, id) => {
    editQuestion(id);
});

//ipcMain.on('photos:open', () => {
//    mainWindow.loadFile('photos/photos.html');
//});


ipcMain.on('photos:edit', (event, id) => {
    editPhoto(id);
});


/**
 * Listener used to close user editing homepage and return to the main index
 */
//ipcMain.on('main:open', () => {
//    mainWindow.loadFile('index.html');
//});

ipcMain.on('mainWindow:reload', () => {
    mainWindow.reload();
});
//ipcMain.on('AddWindow:close', () => {
//    addWindow.close();
//});


/**
 * Listener used to setup a userForm to submit a new user
 */
ipcMain.on('newUser:start', () => {
    newUser();
});
/**
 * Listener to start the editUser process.  Listener will destructure the
 * userID that was passed and pass it to the editUser function in main.js
 */
ipcMain.on('editUser:start', (event, userID) => {
    editUser(userID);
});
/**
 * Listener will close the modal window userForm when the edits have been
 * submitted
 */
ipcMain.on('editUser:edit', () => {
    addWindow.close();
});
/**
 * Listener will reload the mainWindow after a user was deleted.
 */
ipcMain.on('deleteUser', () => {
    mainWindow.reload();
});
/**
 * Closes the modal window without submitting whatever task was originally
 * intended
 */
ipcMain.on('cancel', () => {
    addWindow.close();
});

ipcMain.on('dialog', (event, { title, message, type, buttons }) => {
    dialog.showMessageBox({ title: title, message: message, type: type, buttons: buttons }).then((response) => {
        mainWindow.webContents.send('dialog', response);
    })

});