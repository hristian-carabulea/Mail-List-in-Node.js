// npm i express body-parser request
// jshint esversion: 6
// go to bootstrap.com, switch to version 5, find and click on Sign-in, right click and choose "view page source, and then copy & paste it in signup.html
//    https://getbootstrap.com/docs/5.1/examples/sign-in/

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { options } = require("request");
require("./config");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
}); // end app.get("/", function(req, res)

// get values entered on the web page
app.post("/", function(req, res){

  const firstName = req.body.fName; 
  const lastName  = req.body.lName; 
  const email = req.body.email;

  console.log(firstName, lastName, email);

  const data = {
    members:  [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }; // end const data

  const jsonDATA = JSON.stringify(data);
  const url = "https://us20.api.mailchimp.com/3.0/lists/" + AUDIENCE_ID;
  // const url = "https://us20.api.mailchimp.com/3.0/lists/" + AUDIENCE_ID_WRONG; // WRONG AUDIENCE ID for local testing purposes

  // only for Heroku environment
  const options = {
    method: "POST",
    auth: SECRET_API_KEY
  }

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      // res.send("Successfully subscribed!");
      res.sendFile(__dirname + "/success.html");
    }
    else {
      // res.send("There was an error with signing up. Please try again!");
      res.sendFile(__dirname + "/failure.html");
    } // end if else

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  }) // end https request
  
  request.write(jsonDATA);
  request.end();

}); // end app.post

// in failure case
app.post("/failure", function(req, res){
  res.redirect("/");
})

// app.listen(3000, function() { // for local development
  app.listen(process.env.PORT || 3000, function() {  
    // for use with Heroku or locally on port 3000
  console.log("Server is running on port 3000.");
}) // end app.listen

