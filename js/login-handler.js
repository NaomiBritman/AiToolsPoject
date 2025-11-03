(function(){
  const form = document.getElementById("login-form");
  const err = document.getElementById("login-error");
  if(!form) return;

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    err.textContent = "";
    const user = DataManager.findUserByUsername(username);
    if(!user || user.password !== password){
      err.textContent = "Invalid username or password.";
      return;
    }
    DataManager.setCurrentUser(user);
    location.href = "recipes.html";
  });
})()