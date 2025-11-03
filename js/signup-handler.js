(function(){
  const form = document.getElementById("signup-form");
  if(!form) return;
  const err = document.getElementById("signup-error");
  const msg = document.getElementById("signup-msg");

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    err.textContent = ""; msg.textContent = "";
    const username = document.getElementById("su-username").value.trim();
    const password = document.getElementById("su-password").value;
    const password2 = document.getElementById("su-password2").value;
    const delay = Number(document.getElementById("su-delay").value) || 900;
    const theme = document.getElementById("su-theme").value || "light";

    if(!username || !password){
      err.textContent = "Username and password required.";
      return;
    }
    if(password !== password2){
      err.textContent = "Passwords do not match.";
      return;
    }

    try {
      const res = DataManager.addUser({ username, password, settings: { delayTime: delay, theme } });
      if(!res.success){
        if(res.reason === "exists"){
          err.textContent = "Username already exists.";
          return;
        }
        err.textContent = "Could not create account.";
        return;
      }
      // set as current and redirect
      DataManager.setCurrentUser(res.user);
      msg.textContent = "Account created. Redirecting...";
      setTimeout(()=> location.href = "recipes.html", 600);
    } catch (ex) {
      console.error(ex);
      err.textContent = "Unexpected error.";
    }
  });
})();