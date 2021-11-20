console.log("starting receiver");
const MailListener = require("mail-listener2");
const fs = require('fs');
const path = require('path');
const exec  = require("child_process");

const printerName = "";
const allowedEmails = [
    ""
]

var mailListener = new MailListener({
  username: "",
  password: "",
  host: "", // imap host address
  port: 993, // imap port
  tls: true,
  connTimeout: 10000, // Default by node-imap
  authTimeout: 5000, // Default by node-imap,
  debug: console.log, // Or your custom function with only one incoming argument. Default: null
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX", // mailbox to monitor
  markSeen: true, // all fetched email willbe marked as seen and not fetched next time
  fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
  mailParserOptions: {streamAttachments: false}, // options to be passed to mailParser lib.
  attachments: true, // download attachments as they are encountered to the project directory
  attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments
});

mailListener.start(); // start listening

mailListener.on("server:connected", function(){
  console.log("imapConnected");
});

mailListener.on("server:disconnected", function(){
  console.log("imapDisconnected");
});

mailListener.on("error", function(err){
  console.log(err);
});

mailListener.on("mail", function(mail, seqno, attributes){
  let sender = mail.from[0].address;

  let doContinue = false;
  for(let i = 0; i< allowedEmails.length; i++)
  {
    let email = allowedEmails[i];
    if(sender == email)
    {
      doContinue = true;
    }
  }

  if(doContinue)
  {
    printAttachments(mail.attachments);
  }
  
  // Delete the Attachments after 10 minutes
  setTimeout(() => {
    cleanAttachments();
  },10*60000);

});

mailListener.on("attachment", function(attachment){

});

function cleanAttachments()
{
  let directory = "./attachments"
    fs.readdir(mailListener.attachmentOptions.directory, (err, files) => {
      if (err) throw err;
    
      for (const file of files) {
        fs.unlink(path.join(directory, file), err => {
          if (err) throw err;
        });
      }
    });
}

function printAttachments(attachments)
{
  for(let i = 0; i < attachments.length;i++)
  {
    let path = attachments[i].path;
    if(path)
    {
      if(fs.existsSync(path))
      {
        let command = "lp -d "+printerName+" "+path;
        exec.execSync(command);
      }
    }
  }
}