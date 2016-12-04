# Yugoslavian_Folk_Dance_Appreciation_Society
To properly set up the project for marking, please follow the following steps:
## Steps For Setup

### 1. Get Node Modules:
Run ```npm install``` to get the node modules.
 
### 2. Setup Database:
Run these commands in the console in this order to setup the database:

1. Open up two command lines and change directories until you are in the ```Yugoslavian_Folk_Dance_Appreciation_Society``` repository.

2. In the first command line, run these commands: 

     ```
     mkdir data
     mongod --dbpath=$PWD/data
     ```
     
3. In the second command line, run these commands:

    ```
    mongoimport --db notesdb --collection courses --type json --file courses.json --jsonArray
    mongoimport --db notesdb --collection users --type json --file users.json --jsonArray
    mongoimport --db notesdb --collection notes --type json --file notes.json --jsonArray
    ```
    

### 3. Run Server:
After the previous steps have been completed run the server with the command ```node nServer.js```, the login page for ```NoteHub``` will be at ```http://localhost:3000/```.

### Additional Notes:
An admin account that you can use to test the functionality of ```NoteHub``` is:
```
Username: testname1
Password: pass1
```
