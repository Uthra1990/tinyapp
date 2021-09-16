const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie('username', username);
  res.redirect('/urls');
});


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

  app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
  });

  
  app.get("/urls", (req, res) => {
    const templateVars = {
      urls: urlDatabase,
      user : users[req.cookies["user_id"]]
    };
    res.render('urls_index', templateVars);
  });

  app.get("/urls/new", (req, res) => {
   // res.render("urls_new");
    const templateVars = {
      user : users[req.cookies["user_id"]]
    };
    res.render("urls_new", templateVars);
    res.redirect("urls");
  });

  app.get("/urls/:shortURL", (req, res) => {
    const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL, user : users[req.cookies["user_id"]], };
    res.render("urls_show", templateVars);
  });

  app.get("/urls/:shortURL", (req, res) => {
      const longURL = urlDatabase[req.params.shortURL].longURL;
      //const username = req.cookies["username"]
      console.log(longURL)
      res.redirect(longURL);
  });

  app.post("/logout", (req, res) => {
    console.log("logout")
    res.clearCookie('user_id');
    res.redirect('/urls');
  });

  app.post("/urls/:shortURL/delete", (req, res) => {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
    res.redirect('/urls');
    
  });

  app.post("/urls", (req, res) => {
  const longURL = req.body.longURL
  const shortURL = generateRandomString() 
  urlDatabase[shortURL] = longURL 
  //console.log(req.body);  // Log the POST request body to the console
  //res.send("Ok");    // Respond with 'Ok' (we will replace this)
  res.redirect(`/urls`);
});

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const newURL = req.body.newURL
    urlDatabase[shortURL] = newURL
    res.redirect('/urls');
});

app.get("/register", (req, res) => {
  console.log("register",req.cookies["user_id"])
  const templateVars = {
    user : users[req.cookies["user_id"]],
  };
  res.render("urls_register", templateVars);
  });

  app.post("/register", (req, res) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    const newUserID = generateRandomString();
    users[newUserID] = {
      id : newUserID,
      email : userEmail,
      password : userPassword
    }
    
    if(userEmail === "" || userPassword === "") {
      res.send(400, "please enter a valid Email and Password")
    }

    const alreadyExistUser = function(email)
    {
      for (const user in users) {
        if (users[user].email === email) {
          return true
        }
      } return false;
    };

    if (alreadyExistUser(userEmail)) {
      res.send(400, "An account already exists with the same EmailID");
    };
    res.cookie('user_id', newUserID)
    res.redirect("/urls");
  });

function generateRandomString() {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( var i = 0; i < 6; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
 }
 return result;
}




  