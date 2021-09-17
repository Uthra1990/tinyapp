function generateRandomString() {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( var i = 0; i < 6; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
  }

  const findUser = function(email, users) {
    for (const user in users) {
      if (users[user].email === email) {
        return users[user]
      }
    }
    return false;
  }

  const urlForUser = function(user,db) {
      const userUrls = {}
     if(!user){
         return userUrls;
     }
     else{
      for(let url in db) {
          if(db[url].user_id=== user.id){
              userUrls[url] = db[url]
          }
          
        }
    }
        return userUrls
  } 

  module.exports = {generateRandomString , findUser , urlForUser}