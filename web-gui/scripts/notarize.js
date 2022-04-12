const { notarize } = require('electron-notarize');

console.log('Notarizing App');

exports.default = async function notarizing(context) {
  //const { electronPlatformName, appOutDir } = context;
  if (process.platform !== 'darwin') {
    return;
  }

  let appName = context.packager.appInfo.productFilename;
  let appDir = context.appOutDir;

  return await notarize({
    appBundleId: 'com.GDate.webgui',
    appPath: `${appDir}/${appName}.app`,
    appleId: process.env.appleId,
    appleIdPassword: process.env.appleIdPassword,
  });
};
