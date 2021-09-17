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

  module.exports = {generateRandomString , findUser }