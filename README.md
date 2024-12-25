# Alter Gym

## Distinctiveness and Complexity
My desire was to solve a real-life problem for the purposes of this project. My girlfriend is working on a Pilates studio, 
they have multiple classes per hour with a lot of people with various skill levels. Each hour they have to come together and see the names, remember what is their skill and sort the rooms based on that on the spot.
This process may take a lot of time. Thus I was inspired to create a web application which could solve this issue.
A web application where the fitness instructors would first set how many **rooms** they are available and the max number trainees they can have.
Afterwards, they would search the database for the trainees to add and select them. Afterwards, the application would provide the rooms based on the skill level of the trainees and which room they belong to.
I am a life time gym goer myself and I have not seen something similar to this and I am certain it would increase their productivity a lot. 
The complexity resides on the factors the web application needed dynamic room and trainee management, skill based sorting, user authentication, communication betwwen the back-end and the front-end.

## Skills Learned
- All of the projects in the course were provided with a starting point. Starting my own web application was more daunting than first anticipated.
- How to call from the front-end (javascript) methods in the back-end (python)
- How to use bootstrap to ensure the web applications look good in all devices such as mobiles.

## How to Run the Application
- Download the project files and open the command prompt.
- Go to the directory where the downloaded files are located.
- Type the following command: ```python manage.py runserver``` and **Enter**.
- Open the browser of your choosing and visit the link: http://127.0.0.1:8000/
- Register as a new user to the **Register** page.
  > You can go there by selecting the __register__ button on the top bar.
  >
  > Or by going to the URL http://127.0.0.1:8000/register.
- From there you will be directed to the home page where you are asked to enter the total number of room and the max number of trainees you can select.
- Now you can search trainees from the search bar and do the following:
  - View their data
  - Edit
  - Delete
  - Select
- Select as many trainees as you like or as many you have set.
- At the bottom of the page there is a button **Generate Rooms**, press it when you are satisfied with the selected trainees.
- You will be traversed to another page where you can see who goes with who in which room.
- You can add trainees by pressing the button on the top bar **Add Trainees**. You will go to a page where you can add any other trainee you want, give them a valid score (1 - 10) and any comments if needed.

## Files Created
- models.py: contains which data the trainees have inside the database.
- views.py: contains the methods from the server side. Here we ensure we are logged in, in order to access the web pages, and do things like add / remove / mark a trainee and generate the rooms.
- Templates:
  - layout.html: the basic layout all of our pages follow.
  - login: the page where the user logs in the page.
  - register: if it's a first-time user they should first register before they are logged in.
  - trainees.html: this is the page where the user can add new trainees to the database.
  - index.html: the home page of the web application. From here the user decides to configure number of rooms / max number of trainees, as well as search / select the trainees.
  - rooms.html: the page where we see the result of the index.html. Here the user sees where each trainee should go and with who.
- trainee.js: the index.html changes dynamically on the front end via javascript to ensure the speed of the web page. More specifically it is being used to:
   - change the state of the index.html (show / hide the configurations and the search / select).
   - searches for trainees in the database in order to show them in the index.html.
   - Informs the back end to edit / delete / mark a trainee in the database.
