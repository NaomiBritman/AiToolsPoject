(function(){
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const titleEl = document.getElementById("recipe-title");
  const ingList = document.getElementById("ingredients-list");
  const stepsList = document.getElementById("steps-list");
  const recipeImage = document.getElementById("recipe-image");
  const startBtn = document.getElementById("start-reading");
  const pauseBtn = document.getElementById("pause-reading");
  const resumeBtn = document.getElementById("resume-reading");
  const stopBtn = document.getElementById("stop-reading");
  const status = document.getElementById("reader-status");

  // small helper
  function escapeHtml(s){ return (s||"").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  // render UI nicely: step badges, nicer lists
  function render(recipe){
    if(!recipe){
      titleEl.textContent = "Recipe not found";
      if(recipeImage){ recipeImage.classList.add('hidden'); recipeImage.src = ''; }
      return;
    }
    titleEl.textContent = recipe.title || "Recipe";

    const placeholder = `https://picsum.photos/seed/recipe${recipe.id || 'placeholder'}/800/600`;
    const src = recipe.image || placeholder;
    if(recipeImage){
      recipeImage.src = src;
      recipeImage.alt = recipe.title || 'Recipe image';
      recipeImage.classList.remove('hidden');
    }

    // ingredients - collapsible container
    ingList.innerHTML = "";
    (recipe.ingredients||[]).forEach(i=>{
      const li = document.createElement("li");
      li.textContent = i;
      ingList.appendChild(li);
    });

    // steps - ordered list
    stepsList.innerHTML = "";
    (recipe.instructions||[]).forEach((s, idx)=>{
      const li = document.createElement("li");
      li.className = "step-item";
      li.setAttribute("data-step-index", idx);
      li.textContent = s;
      stepsList.appendChild(li);
    });
  }

  function getStepElements(){ return Array.from(stepsList.querySelectorAll("li")); }

  // auto-scroll and status update when highlight class changes
  function attachHighlightObserver(){
    const obs = new MutationObserver((mutations)=>{
      for(const m of mutations){
        if(m.type === "attributes" && m.attributeName === "class"){
          const target = m.target;
          if(target.classList && target.classList.contains("current-step")){
            // smooth scroll into center
            try{
              target.scrollIntoView({ behavior: "smooth", block: "center" });
            }catch(e){}
            // update status with current step text (short)
            const idx = target.getAttribute("data-step-index");
            const txt = target.querySelector(".step-text")?.textContent || "";
            status.textContent = `Reading step ${Number(idx)+1}: ${txt.slice(0,60)}`;
          } else {
            // if no highlighted step, clear or set idle
            const any = stepsList.querySelector(".current-step");
            if(!any) status.textContent = "Idle";
          }
        }
      }
    });
    

    // observe each step element for class changes
    const els = getStepElements();
    els.forEach(el => obs.observe(el, { attributes: true, attributeFilter: ["class"] }));
    return obs;
  }

  function injectControls(){
    const controls = document.querySelector(".controls");
    if(!controls) return;
    if(document.getElementById("ui-extra-controls")) return;

    const info = document.createElement("div");
    info.id = "ui-extra-controls";
    info.className = "muted";
    info.style.fontSize = "13px";
    info.style.marginTop = "10px";
    info.textContent = "Shortcuts: Space = Pause/Resume • R = Start • S = Stop";

    controls.appendChild(info);
  }

  // keyboard shortcuts
  function attachKeyboardShortcuts(recipe){
    document.addEventListener("keydown", (e)=>{
      if(document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) return;
      if(e.code === "Space"){
        e.preventDefault();
        // toggle pause/resume
        pauseBtn && resumeBtn && (function(){
          // if reading -> pause, if paused -> resume, else start
          try {
            if(window.speechSynthesis && window.speechSynthesis.paused){
              SpeechReader.resumeReading();
              status.textContent = "Reading...";
            } else if (window.speechSynthesis && window.speechSynthesis.speaking){
              SpeechReader.pauseReading();
              status.textContent = "Paused";
            } else {
              // start from beginning
              const steps = (recipe && recipe.instructions) ? recipe.instructions : [];
              SpeechReader.startReading(steps, { delayTime: (DataManager.getCurrentUser()?.settings?.delayTime || 900), stepElements: getStepElements() });
              status.textContent = "Reading...";
            }
          }catch(e){}
        })();
      } else if(e.key.toLowerCase() === "s"){ // stop
        SpeechReader.stopReading();
        status.textContent = "Stopped";
      } else if(e.key.toLowerCase() === "r"){ // start
        const steps = (recipe && recipe.instructions) ? recipe.instructions : [];
        SpeechReader.startReading(steps, { delayTime: (DataManager.getCurrentUser()?.settings?.delayTime || 900), stepElements: getStepElements() });
        status.textContent = "Reading...";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    const recipe = DataManager.getRecipeById(id);
    render(recipe);
    injectControls();

    // attach observer AFTER rendering so it watches the correct elements
    let observer = attachHighlightObserver();

    const user = DataManager.getCurrentUser();
   const currentUser = JSON.parse(localStorage.getItem('rv_current_user_v1'));
const delay = (currentUser && currentUser.settings && currentUser.settings.delayTime) || 900;


    // wire buttons
    startBtn && startBtn.addEventListener("click", ()=>{
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const title = recipe.title || "";
      const ingredients = (recipe.ingredients || []).map(i => `מרכיב: ${i}`);
      const steps = (recipe.instructions || []).map((s, i) => `שלב ${i + 1}: ${s}`);
      const allText = [title, "מרכיבים:", ...ingredients, "שלבי הכנה:", ...steps];
      observer.disconnect();
      observer = attachHighlightObserver();
      SpeechReader.startReading(allText, { delayTime: delay, stepElements: getStepElements() });
      if(status) status.textContent = "Reading...";
    });

    pauseBtn && pauseBtn.addEventListener("click", ()=>{
      SpeechReader.pauseReading();
      if(status) status.textContent = "Paused";
    });

    resumeBtn && resumeBtn.addEventListener("click", ()=>{
      SpeechReader.resumeReading();
      if(status) status.textContent = "Reading...";
    });

    stopBtn && stopBtn.addEventListener("click", ()=>{
      SpeechReader.stopReading();
      if(status) status.textContent = "Stopped";
    });

    // keyboard shortcuts
    attachKeyboardShortcuts(recipe);

    // initial status
    status.textContent = "Ready";
  });

  // ...existing code...

startBtn && startBtn.addEventListener("click", () => {
  if(!recipe) return;
  
  // Prepare text arrays with explicit Hebrew prefixes
  const ingredients = recipe.ingredients ? 
    ["רשימת המצרכים:", ...recipe.ingredients.map(i => `מצרך: ${i}`)] : [];
  
  const instructions = recipe.instructions ? 
    ["שלבי ההכנה:", ...recipe.instructions.map((s, i) => `שלב ${i + 1}: ${s}`)] : [];

  // Get elements for highlighting
  const elements = getCombinedElements();

  // Start reading with Hebrew content
  SpeechReader.startReading(
    { 
      ingredients, 
      instructions 
    }, 
    { 
      delayTime: delay,
      stepElements: elements
    }
  );

  if(status) status.textContent = "מקריא...";
});
})();