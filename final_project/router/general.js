const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  //Get Username andpassword from request 
  const username = req.body.username;
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
        // Add the new user to the users array
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
}
// Return error if username or password is missing
return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  // Send JSON response with formatted books data
  res.send(JSON.stringify(books,null,4));
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const booksByAuthor = [];
  const author = req.params.author;
  const bookIsbns = Object.keys(books);
  //iterate over book keys (isbn)
  for(const bookIsbn of bookIsbns){
    if(books[bookIsbn].author.toLowerCase() === author.toLowerCase()){
        booksByAuthor.push({[bookIsbn] : books[bookIsbn]});
    }
  }
  //check if any book found
  if(booksByAuthor.length > 0){
    return res.status(200).json({ books: booksByAuthor });
  }
  else{
    return res.status(404).json({ message: "No books found for this author." });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const booksByTitle = [];
  const title = req.params.title;
  const bookIsbns = Object.keys(books);
  //iterate over book keys (isbn)
  for(const bookIsbn of bookIsbns){
    if(books[bookIsbn].title.toLowerCase() === title.toLowerCase()){
        booksByTitle.push({[bookIsbn] : books[bookIsbn]});
    }
  }
  //booksByTitle = books.filter(book => book.title === title);
  //check if any book found
  if(booksByTitle.length > 0){
    return res.status(200).json({ books: booksByTitle });
  }
  else{
    return res.status(404).json({ message: "No books found for this title." });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    //Check if the book exists in your 'books' data
    if(books[isbn]){
        return res.status(200).json({ reviews: books[isbn].reviews }); // Send the reviews as JSON
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
