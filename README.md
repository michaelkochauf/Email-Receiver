Simple Email Receiver to automatically print attachments
============================================

I am using this software to automatically print attachments from emails from an raspberry pi.


The script receives emails and stores them into the ./attachments directory. 

In the next step, all the attachments from the email are printed via cups on the specified printer. 

After 10 minutes, the attachments folder is cleared. 

In the file [www.js](/bin/www.js) the follwing things need to be defined:
* printerName --> Name of the printer from cups
* allowedEmails --> List of email addresses, from which printing is allowedEmails
* imap credentials