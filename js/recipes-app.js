(function(){
  const listEl = document.getElementById("recipes-list");
  const searchInput = document.getElementById("search-input");
  const addBtn = document.getElementById("add-recipe-btn");
  const addForm = document.getElementById("add-form");
  const saveBtn = document.getElementById("save-recipe-btn");
  const cancelBtn = document.getElementById("cancel-add-btn");
  const logoutLink = document.getElementById("logout-link");

  function escapeHtml(s){ return (s||"").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  async function handleImageFile(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result); // מחזיר Data URL
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  function renderCard(recipe){
    const div = document.createElement("article");
    div.className = "recipe-card";
    
    // שינוי הטיפול בתמונות: imagePath מכיל Data URL או URL חיצוני
    const imagePath = recipe.image || '';
    const imageHtml = imagePath ? 
      `<div class="recipe-image-container">
         <img class="recipe-thumb" src="${imagePath}" alt="${escapeHtml(recipe.title)}" 
         onerror="this.parentElement.style.display='none'">
       </div>` : '';
    
    div.innerHTML = `
      ${imageHtml}
      <div class="recipe-content">
        <h3>${escapeHtml(recipe.title || '')}</h3>
        <div class="meta">${recipe.ingredients?.length || 0} ingredients · ${recipe.instructions?.length || 0} steps</div>
        <div class="row">
          <a class="btn" href="recipe_view.html?id=${recipe.id}">Open Recipe</a>
        </div>
      </div>
    `;
    return div;
  }

  function loadList(q){
    DataManager.ensureInitial();
    const items = DataManager.searchRecipes(q);
    listEl.innerHTML = "";
    if(!items.length) listEl.innerHTML = '<div class="card">No recipes found</div>';
    items.forEach(r => listEl.appendChild(renderCard(r)));
  }

  function init(){
    DataManager.ensureInitial();
    loadList("");
    searchInput && searchInput.addEventListener("input", (e) => loadList(e.target.value));
    addBtn && addBtn.addEventListener("click", ()=> addForm.classList.toggle("hidden"));
    cancelBtn && cancelBtn.addEventListener("click", ()=> addForm.classList.add("hidden"));

    saveBtn && saveBtn.addEventListener("click", async ()=>{
      const title = document.getElementById("new-title").value.trim();
      const imageFile = document.getElementById("new-image-file").files[0];
      const ingredients = document.getElementById("new-ingredients").value
        .split("\n")
        .map(s => s.trim())
        .filter(Boolean);
      const instructions = document.getElementById("new-instructions").value
        .split("\n")
        .map(s => s.trim())
        .filter(Boolean);

      const err = document.getElementById("add-error");
      err.textContent = "";
      
      if (!title) {
        err.textContent = "Title is required";
        return;
      }

      try {
        const imageData = await handleImageFile(imageFile); // imageData הוא ה-Data URL
        const recipe = DataManager.addRecipe({
          title,
          image: imageData, // שומרים את ה-Data URL
          ingredients,
          instructions
        });

        // Clear form
        document.getElementById("new-title").value = "";
        document.getElementById("new-image-file").value = "";
        document.getElementById("new-image-preview").classList.add("hidden");
        document.getElementById("new-ingredients").value = "";
        document.getElementById("new-instructions").value = "";
        
        // Hide form and refresh list
        addForm.classList.add("hidden");
        loadList(searchInput.value);
      } catch (error) {
        err.textContent = "Failed to save recipe: " + error.message;
      }
    });

    // preview handlers moved into init so they run with the rest of init
    const fileInput = document.getElementById('new-image-file');
    const preview = document.getElementById('new-image-preview');

    function showPreview(src){
      if(!preview) return;
      if(!src){ preview.classList.add('hidden'); preview.src = ''; return; }
      preview.src = src; preview.classList.remove('hidden');
    }

    if(fileInput){
      fileInput.addEventListener('change', async (e) => {
        const f = e.target.files[0];
        if(!f){ showPreview(null); return; }
        const reader = new FileReader();
        reader.onload = () => showPreview(reader.result);
        reader.readAsDataURL(f);
        // clear URL field so saved image will be file unless user enters URL
      });
    }

    if(logoutLink){
      logoutLink.addEventListener("click", (e)=>{
        e.preventDefault();
        DataManager.setCurrentUser(null);
        location.href = "login.html";
      });
    }
  }

  // ensure init runs once DOM is ready
  document.addEventListener("DOMContentLoaded", init);
})();