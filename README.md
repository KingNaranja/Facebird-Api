

# [Facebird](https://needsmorecaramel.github.io/Facebird-Client/) -- the newest social media app

# [Facebird-Api](https://github.com/NeedsMoreCaramel/Facebird-Api)

Facebird repositories:
https://github.com/NeedsMoreCaramel/Facebird-Client  https://github.com/NeedsMoreCaramel/Facebird-Api

Links to Facebird deployed sites: Facebird-Client: https://needsmorecaramel.github.io/Facebird-Client/ Facebird-Api: https://evening-waters-25240.herokuapp.com

# What is FaceBird ?
FaceBird is a social media single page web app that allows users to make posts and read other user's posts. Users can also delete and update their own post.
## How it works
### Client

When a user logs in, the app fetches the entire post database and sorts it by creation date so that the user can see the most recent post from other users and also thier own.

The post data is proccessed by handlebars before populating the users feed. The user can then ```CRUD``` the database using RESTful ```AJAX``` routes. The user can also filter to see only thier own posts.

### API

We built the Facebird Api in Express with Mongoose data validation. It receives AJAX requests from the client and communicates with the MongoDB database to return the appropriate response.

The Api requires users to sign up with a unique nickname and email. Posts belong to a user and a user can only edit and delete their own posts.

# Technologies Used (CLIENT):
### Client
 * HTML / CSS
 * JavaScript
 * jQuery
 * Ajax
 * Handlebars.js
 * SASS
 * Bootstrap

### API
* JavaScript
* Express
* MongoDB
* Mongoose
* Node.js


# WireFrames and Documentation

Found within ```/documentation``` directory inside repo

* [Wireframes v1](https://imgur.com/UbpUUZG) / [Wireframes v2](https://imgur.com/x3gyeYz)
    * [Posts](https://imgur.com/ZvhaDcE)
* [User Stories](https://imgur.com/HfyhE5S)
* [ERD](https://imgur.com/JbdPLBn)

# Planning, process and execution

## Planning
During our first day of planning we outlines objectives, assigned roles, discussed workflow, and created MVP documentation, including:
 * User Stories
 * Wireframes
 * ERD
 * Reach Goals
 * Project Management Board

## Process
Our teams workflow consisted of a daily standup and retro to keep the project on track and on schedule. To start we pair-programmed building the front-end and back-end infrastructure simultaneously.


All features went through a group code review before being merged into the development branch.
When pairs needed to work both within the same repository, we used Git workflow tools to avoid merge conflicts.

## Problem Solving
When either of the programming pairs ran into roadblocks, the team would reconvene and work through the issue together.

We would use error driven develpoment to guide us to the resolution and used technology documentation to research similar issues and their solutions.


# In the Future
A few features we are looking forward to implementing.
### CLIENT
- reponsive design
- refactor front-end to use React components
- further implement style to front-end
### API
- Moment.js
