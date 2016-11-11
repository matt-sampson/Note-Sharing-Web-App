#Project Description
For this project, we wish to create a note-sharing platform for students at UofT to use for a variety of courses; for the scope of this project though, we will focus on Computer Science courses. This application is specifically targeted at students who may not be able to attend all of their lectures or tutorials so that they have a source of notes for what they missed. ```Users``` of this platform should be able to subscribe to the ```courses``` that they are currently taking; in addition to this, they should be able to post ```notes```, and edit the notes they have posted for ```courses``` that they are subscribed to. Also, the ```users``` should be able to search up all ```notes``` being shared according to either course code or the ```user``` that posted the ```notes```. A final, but integral part of the platform is the ability to ```rate``` notes according to their quality so that posted notes can be sorted according to user-agreed ratings.

User profiles can also accessed by anyone; these profiles contains the ```name/username``` of the user as well as their ```registered courses``` and an ```average note rating``` according to the individual ```ratings``` of their ```notes```. On a side note, a subclass of ```users``` that will exist are the ```admins``` that can control parts of the platform. More specifically, the admin should be able to:
- Add/Delete ``` Course ```
- Add/Delete ```Users ```
- Add/Delete ```Course``` to the  ```Subscribed Courses``` of any individual ```User``` 

#User Interactions
##Admin:
- __Create Course__ - For creating a new ```Course``` to add to the database of courses
- __Delete Course__ - To delete a ```Course``` from the database that is no longer needed
- __Add/Delete User__ - Add/Delete ```User``` to the database
- __Add/Delete Course__ - to the  ```Subscribed Courses``` of any individual ```User```


##User + Admin:
- __LogIn/Logout__ - A ```User``` can log in and out of the website for for a user-specifc experience to the website
- __Course SignUp__ - Any ```User``` can sign up for any ```Course``` with a limit of 6 courses being the most one can sign up for
- __Course Unsubscribe__ - For unsubscribing from a ```Course``` that the ```User``` is currently signed up for
- __My Courses__ - Display a list of courses that the current ```User``` is signed up for
- __Get Course__ - Retrieve the details of a selected ```Course``` through text input
- __Post Notes__ - A ```User``` can upload notes to any ```Course``` that they are subscribed to
- __Edit Notes__ - Once uploaded, a ```User``` can edit their own ```notes``` but not the ```notes``` of other people
- __Rate Notes__ - All ```notes``` can be rated on a 5-point system and the average rating is displayed
- __Get User Notes__ - A ```User``` can search for all the ```notes``` that have been uploaded by another ```User``` by inputing the username of the uploader


#Data Storage
All data will be stored using MongoDb. The JSON representations for the objects are:
    
    Users{
   	 Users: [...(list of all users in database)...]
    }

    Courses{
   	 Courses: [...(list of all courses in database)...]
    }
    
    User{
   	 Name: ,
   	 Courses: [...(list of Courses this user signed up for)...],
   	 Notes: [...(list of Notes by this user)...],
     OverallNoteRating:
    }

    Course{
   	 code: ,
   	 Notes: [...(list of Notes for this Course)...]
    }

    Note{
   	 Uploader: ,
   	 Text: ,
   	 Ratings: [...(list of ratings from 1 to 5)...]
    }
#View Sketches
PNG files for the View Sketches can be found within the ```proposal``` directory.

![Get Notes For Course] (https://github.com/CSC309-Fall-2016/Yugoslavian_Folk_Dance_Appreciation_Society/tree/master/proposal/View_Sketch1.PNG)

![Get Registered Courses For User](https://github.com/CSC309-Fall-2016/Yugoslavian_Folk_Dance_Appreciation_Society/tree/master/proposal/View_Sketch2.PNG)

![Edit Note](https://github.com/CSC309-Fall-2016/Yugoslavian_Folk_Dance_Appreciation_Society/tree/master/proposal/View_Sketch3.PNG)
