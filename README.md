# Web Competition Tracking Application as lab1

## Description

A web application tracks competitions held in a round-robin format.
The logged-in user can define a competition on the homepage by entering the competition name,
a list of competitors (separated by commas or new lines), and choosing a scoring system,
such as win/draw/loss (e.g., 3/1/0 for football, 1/0.5/0 for chess, 2/0/1 for basketball).
If the entered data is valid, the application will generate a complete schedule by rounds
and allow the user who created the competition to input results (visible only to them, not to other users).

## Live application
- **URL:** [https://web2lab1-9t17.onrender.com/](https://web2lab1-9t17.onrender.com/) Note: database expired so you will get 500 Internal service error

## Implemented Features

1. **User Authentication**
   - Users can log in using Google Authentication through Auth0.

2. **Public Display of Competition Status via Link**
   - A publicly accessible link displays the current status of a competition.

3. **Creation of New Competitions**
   - Users, after logging in, can create new competitions using a form on the homepage.

4. **Input and Modification of Results with Ranking Calculation**
   - Users can input and modify competition results, and the application calculates and updates the rankings on the competition page.

