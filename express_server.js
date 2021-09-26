const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require('bcryptjs');
const {findUser,generateRandomString,urlForUser} = require('./helpers')


app.set("view engine", "ejs");
// const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser());

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

const urlDatabase = {
  "b2xVn2": {
    longURL : "http://www.lighthouselabs.ca",
    user_id : "userRandomID"
  } ,
  "9sm5xK": {
    longURL : "http://www.google.com",
    user_id : "userRandomID"
  } 
  
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "1@1.com", 
    password: "$2a$10$YbjIP8lNAfTGxE07hI0eIuDXrtuelvOfURex6rz6X4fadhMtAUQgW"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "2@2.com", 
    password: "$2a$10$YbjIP8lNAfTGxE07hI0eIuDXrtuelvOfURex6rz6X4fadhMtAUQgW"
  }
}


//const password = "1"; // found in the req.params object
//const hashedPassword = bcrypt.hashSync(password, 10);


app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // const hash = bcrypt.hashSync('1');
  // console.log('++++++++++++++', hash)
if(!email || !password){
  res.status(403).send("Please enter a Email and a Password")
}
else if(!findUser(email,users)) {
  res.status(403).send("Please register")
}
else{
  const user = findUser(email,users) 
  if(!bcrypt.compareSync(password, users[user.id].password)){
    res.status(403).send("Invalid Password")
  } 
  else{
    // res.cookie('user_id', user.id)
    req.session.user_id = user.id;
    res.redirect('/urls')
  }
  }
});



app.get("/login", (req, res) => {
    const templateVars = {
      user: users[req.session.user_id],
    };
    res.render("urls_login", templateVars);
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
    // const user = users[req.cookies["user_id"]]
    // console.log("redirect")
    const user_id = req.session.user_id;
    const user = users[user_id]
  
    const templateVars = {
      urls: urlForUser(user,urlDatabase),
      user
    };
    
     res.render('urls_index', templateVars);
    
   });

  app.get("/urls/new", (req, res) => {
    // res.render("urls_new");
    const templateVars = {
      user : users[req.session.user_id]
    };
    console.log(templateVars)
    // res.render("urls_new",templateVars);
    if(templateVars.user) {
     return res.render("urls_new", templateVars);
    //  res.redirect("urls");
     }
    else{
      res.redirect("/login");
    }
  });

  app.get("/urls/:shortURL", (req, res) => {
    const shortURL = req.params.shortURL
    const longURL = urlDatabase[shortURL].longURL
    const templateVars = {
       shortURL,
       longURL, 
       user : users[req.session.user_id], };
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
    req.session = null;
    res.redirect('/urls');
  });

  app.post("/urls", (req, res) => {
    if(req.session.user_id){
    const longURL = req.body.longURL
    const shortURL = generateRandomString() 
    const user_id = req.session.user_id
    urlDatabase[shortURL] = { longURL, user_id}
    };
     console.log('>>>>>>>>>>>>>>>', urlDatabase)
     res.redirect('/urls');
  });

  app.post("/urls/:shortURL/delete", (req, res) => {
    const shortURL = req.params.shortURL;
    const user = users[req.session.user_id]
    if(!user){
      res.status(403).send("Please Login to delete")
    }
    else{
      if(urlDatabase[shortURL].user_id === user.id){
        delete urlDatabase[shortURL];
      }
    } 
    res.redirect('/urls');
    
  });

  

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const user = users[req.session.user_id]
    if(!user){
      res.status(403).send("Please Login to edit")
    }
    else{
      if(urlDatabase[shortURL].user_id === user.id){
        const newURL = req.body.newURL
        urlDatabase[shortURL].longURL = newURL;
        res.redirect('/urls'); 
      }
    }
  
});

//123:www.google.com
/*"b2xVn2": {
    longURL : "http://www.lighthouselabs.ca",
    user_id : "userRandomID"
  } */

app.get("/register", (req, res) => {
  const templateVars = {
    user : users[req.session.user_id],
  };
  res.render("urls_register", templateVars);
  });

  app.post("/register", (req, res) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const hashedPassword = bcrypt.hashSync(userPassword, 10);
    
    

    if(userEmail === "" || userPassword === "") {
      res.status(400).send( "Please enter a valid Email and Password")
    }

    
    else if(findUser(userEmail,users)) {
      res.status(400).send("An account already exists with the same EmailID");
    }
    else {
    const newUserID = generateRandomString();
   //console.log("------------------",newUserID)
    users[newUserID] = {
      id : newUserID,
      email : userEmail,
      password : bcrypt.hashSync(userPassword, 10),
    }
    req.session.user_id = newUserID;
    res.redirect("/urls");
  }
  });





   