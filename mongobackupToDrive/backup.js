const { spawn } = require('child_process');
const path = require('path');
const cron = require('node-cron');
const { clear } = require('console');


var isComplete=false;
const DB_NAME = 'farmStand';//Database name which you want to backup
const ARCHIVE_PATH = path.join(__dirname, 'public', `${DB_NAME}.gzip`);


function backupMongoDB() {
  const child = spawn('mongodump', [
    `--db=${DB_NAME}`,
    `--archive=${ARCHIVE_PATH}`,
    '--gzip',
  ]);

  child.stdout.on('data', (data) => {
    console.log('stdout:\n', data);
  });
  child.stderr.on('data', (data) => {
    console.log('stderr:\n', Buffer.from(data).toString());
  });
  child.on('error', (error) => {
    console.log('error:\n', error);
  });
  child.on('exit', (code, signal) => {
    if (code) console.log('Process exit with code:', code);
    else if (signal) console.log('Process killed with signal:', signal);
    else console.log('Backup is successfull ✅');
    
  });

}
// Scheduling the backup every 5 seconds (using node-cron)
cron.schedule('*/5 * * * * *', () =>{
  backupMongoDB();
} );

const upload=()=>{
  
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), listFiles);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
  const drive = google.drive({ version: 'v3', auth });
  // getList(drive, '',auth);
  uploadFile(auth);
  // downloadfiles(auth);
}
// function getList(drive, pageToken,auth) {
//   drive.files.list({
//       corpora: 'user',
//       pageSize: 10,
//       //q: "name='elvis233424234'",
//       pageToken: pageToken ? pageToken : '',
//       fields: 'nextPageToken, files(*)',
//   }, (err, res) => {
//       if (err) return console.log('The API returned an error: ' + err);
//       const files = res.data.files;
//       if (files.length) {
//           // processList(files);
//           // downloadFiles(files,auth)
//           if (res.data.nextPageToken) {
//               getList(drive, res.data.nextPageToken);
//           }
//       } else {
//           console.log('No files found.');
//       }
//   });
// }
// function processList(files) {
//   console.log('Processing....');
//   files.forEach(file => {
//       console.log(file.name + file.mimeType);
//       // console.log(file);
//   });
// }
// function downloadFiles(files,auth){
//   const drive = google.drive({ version: 'v3', auth });
//   files.forEach(file => {
//     if(file.name =="farmStand.gzip"){
//       drive.files.get({
//         fileId: file.id,
//         mimeType: 'application/gzip',
//       }, (err, res) => {
//         if (err) return console.log('The API returned an error: ' + err);
        
//         const filePath = `./server/${file.name}`;
//         fs.createWriteStream(filePath);

//       });
//     }
// });
// }
function uploadFile(auth) {
  const drive = google.drive({ version: 'v3', auth });
  var fileMetadata = {
      'name': 'farmStand.gzip'
  };
  var media = {
      mimeType: 'application/gzip',
      body: fs.createReadStream('./public/farmStand.gzip')
  };
  drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
  }, function (err, res) {
      if (err) {
          // Handle error
          console.log(err);
      } else {
          console.log('File Id: ', res.data.id);
      }
  });
}


}
