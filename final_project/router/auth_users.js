const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (userName,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === userName && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const userName = req.body.username;
    const password = req.body.password;
    if(!userName ||  !password){
        return res.status(404).json({message: "error login in"});
    }
    //Authenticate user
    if (authenticatedUser(userName, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data : password}, 'access', {expiresIn : 60*60});
        // Store access token and username in session
            req.session.authorization = {
                accessToken
            }
            return res.status(200).send("User successfully logged in");
	} else {
		return res.status(208).json({ message: "Invalid Login. Check username and password" });
	}
    
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn; // Get ISBN from URL parameters
  const review = req.query.review; // Get review text from query parameters
  const username = req.session.authorization.username; // Get username from session (established during login)

    // Check if the user is logged in
    /*if (!username) {
        return res.status(403).json({ message: "User not logged in." });
    }*/

    // Check if review text is provided
    if (!review) {
        return res.status(400).json({ message: "Review text is required." });
    }

    // Check if the book exists in our 'books' database
    if (books[isbn]) {
        // If the book exists, check if it has a 'reviews' property
        if (!books[isbn].reviews) {
            books[isbn].reviews = {}; // Initialize 'reviews' object if it doesn't exist
        }
        // Add or update the review for the logged-in user
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: `Review for ISBN ${isbn} added/updated successfully by ${username}.` });
    } else {
        // If the book is not found
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Get ISBN from URL parameters
    const username = req.session.authorization.username; // Get username from session

   /* if (!username) {
        return res.status(403).json({ message: "User not logged in." });
    }*/

    if (books[isbn]) {
        if (books[isbn].reviews && books[isbn].reviews[username]) {
            delete books[isbn].reviews[username]; // Delete the review by the specific user
            return res.status(200).json({ message: `Review for ISBN ${isbn} by ${username} deleted successfully.` });
        } else {
            return res.status(404).json({ message: `No review found for ISBN ${isbn} by ${username}.` });
        }
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

