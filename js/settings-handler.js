(function(){
  const delayInput = document.getElementById("delay-input");
  const voiceSelect = document.getElementById("voice-select");
  const themeSelect = document.getElementById("theme-select");
  const form = document.getElementById("settings-form");
  const msg = document.getElementById("settings-msg");

  function applyTheme(theme){
    if(theme === "dark") document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  }

  function load(){
    const user = DataManager.getCurrentUser();
    const rateInput = document.getElementById("rate-input");
    if(!user){
      delayInput.value = 900;
      voiceSelect.value = "";
      if(rateInput) rateInput.value = 0.9;
      themeSelect.value = "light";
      applyTheme("light");
      return;
    }
    delayInput.value = user.settings && user.settings.delayTime || 900;
    voiceSelect.value = user.settings && user.settings.voice || "";
    if(rateInput) rateInput.value = user.settings && user.settings.rate || 0.9;
    themeSelect.value = user.settings && user.settings.theme || "light";
    applyTheme(themeSelect.value);
  }

  form && form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const user = DataManager.getCurrentUser();
    const delay = Number(delayInput.value) || 900;
    const voice = voiceSelect.value;
    const rateInput = document.getElementById("rate-input");
    const rate = rateInput ? Number(rateInput.value) : 0.9;
    const theme = themeSelect.value;
    if(user){
      DataManager.updateUserSettings(user.id, { delayTime: delay, voice, rate, theme });
      msg.textContent = "Settings saved.";
    } else {
      msg.textContent = "Saved (guest).";
    }
    applyTheme(theme);
    setTimeout(()=> msg.textContent = "", 2000);
  });

  document.addEventListener("DOMContentLoaded", load);
})();}