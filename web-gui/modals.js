const { BrowserWindow} = require('electron');

/**
 * Creates our modal window and sets it up for adding a new user
 */
 async function newUser() {
    addWindow = new BrowserWindow({
        height: 600,
        width: 1000,
        parent: mainWindow,
        modal: true,
        title: 'Add New User',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    /**
     ** ONLY FOR DEV
     */
    addWindow.webContents.openDevTools();

    await addWindow.loadFile('users/userForm.html');
    /**
     * Communicates with the renderer process that form's functionality should be
     * that of adding a new user
     */
    addWindow.webContents.send('newUser');

    addWindow.on('close', () => {
        addWindow = null;
        /**
         * Reload the mainWindow whenever the modal window gets closed.
         */
         //global.share.mainWindow.reload();
        mainWindow.reload();
    });
}

/**
 * Creates our modal window and sets it up for adding a editing a user
 * identified by the userID
 *
 * @param {String} userID
 */
async function editUser(userID) {
    addWindow = new BrowserWindow({
        height: 600,
        width: 1000,
        parent: mainWindow,
        modal: true,
        title: 'Edit User',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    /**
     ** ONLY FOR DEV
     */
    addWindow.webContents.openDevTools();

    await addWindow.loadFile('users/userForm.html');
    /**
     * Communicates with the renderer process that form's functionality should be
     * that of editing a user
     */
    addWindow.webContents.send('editUser', userID);
    addWindow.on('close', () => {
        addWindow = null;
        mainWindow.reload();
        //mainWindow.webContents.reloadIgnoringCache();
    });
}

async function editQuestion(id) {
    addWindow = new BrowserWindow({
        height: 600,
        width: 1000,
        parent: mainWindow,
        modal: true,
        title: 'Edit Question',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    /**
     ** ONLY FOR DEV
     */
    addWindow.webContents.openDevTools();

    await addWindow.loadFile('questions/questionForm.html');
    /**
     * Communicates with the renderer process that form's functionality should be
     * that of editing a user
     */
    addWindow.webContents.send('questions:edit', id);
    addWindow.on('close', () => {
        addWindow = null;
        mainWindow.reload();
        //mainWindow.webContents.reloadIgnoringCache();
    });
}

async function editPhoto(id) {
    addWindow = new BrowserWindow({
        height: 600,
        width: 1000,
        parent: mainWindow,
        modal: true,
        title: 'Edit User',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    /**
     ** ONLY FOR DEV
     */
    addWindow.webContents.openDevTools();

    await addWindow.loadFile('photos/editPhotos.html');
    /**
     * Communicates with the renderer process that form's functionality should be
     * that of editing a user
     */
    addWindow.webContents.send('photos:edit', id);
    addWindow.on('close', () => {
        addWindow = null;
        mainWindow.reload();
        //mainWindow.webContents.reloadIgnoringCache();
    });
}

module.exports = {
    newUser,
    editUser,
    editQuestion,
    editPhoto,
}