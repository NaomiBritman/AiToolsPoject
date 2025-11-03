(function(window){
  let index = 0;
  let lines = [];
  let delayTime = 800;
  let running = false;
  let currentUtterance = null;
  let delayTimer = null;
  let stepElements = [];

  function supportsSpeech(){ return 'speechSynthesis' in window; }

  function speak(text) {
    return new Promise((resolve, reject) => {
      const user = JSON.parse(localStorage.getItem('rv_current_user_v1'));
      const voiceName = user?.settings?.voice;
      const voices = speechSynthesis.getVoices();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'he-IL';
      utterance.rate = user?.settings?.rate || 0.9;
      utterance.pitch = 1;
      
      if(voiceName) {
        const selected = voices.find(v => v.name === voiceName);
        if(selected) utterance.voice = selected;
      }
      if(!utterance.voice) {
        utterance.voice = voices.find(v => v.lang.includes('he')) || voices[0];
      }

      utterance.onend = () => resolve();
      utterance.onerror = (e) => reject(e);
      
      speechSynthesis.speak(utterance);
      currentUtterance = utterance;
    });
  }

  function clearHighlight(){
    stepElements.forEach(el => el && el.classList.remove("current-step"));
  }

  function highlight(i){
    clearHighlight();
    if(stepElements[i]) stepElements[i].classList.add("current-step");
  }

  function speakNext(){
    if(index >= lines.length){
      running = false;
      currentUtterance = null;
      clearHighlight();
      return;
    }

    const text = (lines[index] || "").trim();
    highlight(index);
    
    if(!text){
      index++;
      delayTimer = setTimeout(speakNext, delayTime);
      return;
    }

    speak(text)
      .then(() => {
        currentUtterance = null;
        index++;
        delayTimer = setTimeout(speakNext, delayTime);
      })
      .catch(() => {
        currentUtterance = null;
        index++;
        delayTimer = setTimeout(speakNext, delayTime);
      });
  }

  speechSynthesis.getVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }

  // now accepts either:
  //  - an array of lines (old behavior)
  //  - an object { ingredients: [...], instructions: [...] } -> will read ingredients first then instructions
  // Important: stepElements must be an array of DOM elements that matches the combined order (ingredients then instructions).
  // To keep highlighting aligned we do NOT insert separate header lines; instead we prefix the first item of each section with the header in Hebrew.
  function startReading(data, options = {}){
    if(!supportsSpeech()){
        console.warn("Speech API not supported");
        return;
    }
    
    stopReading();

    if(Array.isArray(data)){
        lines = data.slice();
    } else if(data && typeof data === 'object'){
        lines = [];
        
        // Add ingredients section
        if(Array.isArray(data.ingredients) && data.ingredients.length){
            lines.push("רשימת מצרכים:");
            data.ingredients.forEach(ing => lines.push(ing));
        }
        
        // Add small pause between sections
        lines.push("");
        
        // Add instructions section
        if(Array.isArray(data.instructions) && data.instructions.length){
            lines.push("הוראות הכנה:");
            data.instructions.forEach(inst => lines.push(inst));
        }
    }

    index = 0;
    delayTime = options.delayTime || 800;
    stepElements = options.stepElements || [];
    running = true;
    
    // Start reading after a small delay to ensure voices are loaded
    setTimeout(speakNext, 100);
  }

  function pauseReading(){
    if(!running) return;
    try { speechSynthesis.pause(); } catch(e){}
    if(delayTimer){ clearTimeout(delayTimer); delayTimer = null; }
  }

  function resumeReading(){
    if(!running) return;
    try {
      if(speechSynthesis.paused) speechSynthesis.resume();
      else if(!currentUtterance) speakNext();
    } catch(e){}
  }

  function stopReading(){
    running = false;
    index = 0;
    lines = [];
    if(delayTimer){ clearTimeout(delayTimer); delayTimer = null; }
    try { speechSynthesis.cancel(); } catch(e){}
    currentUtterance = null;
    clearHighlight();
  }

  window.SpeechReader = {
    startReading, pauseReading, resumeReading, stopReading
  };
})(window);