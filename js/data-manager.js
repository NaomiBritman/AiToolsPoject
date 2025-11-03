(function(window){
  const STORAGE = {
    USERS: "rv_users_v1",
    RECIPES: "rv_recipes_v1",
    CURRENT: "rv_current_user_v1"
  };

  const initialData = {
    users: [
      { id: 1, username: "naomi", password: "1234", settings: { delayTime: 900, theme: "light" } },
      { id: 2, username: "guest", password: "guest", settings: { delayTime: 800, theme: "light" } }
    ],
    recipes: [
      { id: 1, title: "Simple Pancakes",image:"images/Recipe-10468-80LOTTx3Vu4BhHov.jpg" ,ingredients: ["1 cup flour","1 egg","1 cup milk","1 tbsp sugar"], instructions: ["Mix dry ingredients.","Add egg and milk.","Stir to combine.","Heat pan","Pour batter and cook 2–3 min per side."] },
      { id: 2, title: "Tomato Salad", image:"images/3414.jpg", ingredients: ["2 tomatoes","1/2 red onion","olive oil","salt"], instructions: ["Chop tomatoes and onion.","Mix in a bowl with oil and salt.","Serve chilled."] },
      { id: 3, title: "Shakshuka",image:" images/14.jpg", ingredients: ["2 tbsp olive oil","1 onion","2 garlic cloves","1 red pepper","400g crushed tomatoes","4 eggs","spices"], instructions: ["Sauté onion, garlic and pepper.","Add tomatoes and simmer.","Make wells and crack eggs.","Cover and cook until eggs set."] },
      { id: 4, title: "Hummus", image:" images/NINJA3-75.jpg",ingredients: ["1 can chickpeas","2 tbsp tahini","1 lemon","1 garlic clove","olive oil","salt"], instructions: ["Drain chickpeas.","Blend all ingredients until smooth.","Adjust seasoning and serve with olive oil."] },
      { id: 5, title: "Garlic Pasta",image:" images/images.jpeg", ingredients: ["200g spaghetti","3 garlic cloves","olive oil","chili flakes","parsley"], instructions: ["Cook pasta al dente.","Sauté garlic in oil.","Toss pasta with oil, chili and parsley.","Serve with grated cheese."] },
      { id: 6, title: "Banana Bread",image:" images/kjocbbv_autoOrient_w.jpg", ingredients: ["3 ripe bananas","2 cups flour","1 cup sugar","1/2 cup butter","2 eggs","1 tsp baking soda"], instructions: ["Preheat oven to 175°C.","Mash bananas and mix wet ingredients.","Combine dry ingredients and fold in.","Bake 50-60 minutes."] },
      { id: 7, title: "Chicken Soup",image:"images/shutterstock_90034219.jpg", ingredients: ["1 whole chicken or parts","2 carrots","2 celery sticks","1 onion","salt","pepper"], instructions: ["Place chicken and veg in pot with water.","Simmer 1-1.5 hours.","Remove chicken, shred meat.","Season and serve hot."] },
      { id: 8, title: "Guacamole",image:" images/images (1).jpeg", ingredients: ["2 avocados","1 lime","1/4 onion","cilantro","salt"], instructions: ["Mash avocados.","Add lime, onion, cilantro and salt.","Mix and serve."] },
      { id: 9, title: "Fried Rice",image:" images/08d98f70-4f90-4231-9bf5-7787d9889be1.jpg", ingredients: ["2 cups cooked rice","1 egg","mixed vegetables","soy sauce","sesame oil"], instructions: ["Scramble egg and set aside.","Sauté vegetables, add rice.","Stir in soy sauce and egg.","Finish with sesame oil."] },
      { id: 10, title: "Chocolate Cake",image:" images/Recipe-6553-p056N3cSWOutQoZn.jpg", ingredients: ["4 tbsp flour","2 tbsp cocoa","3 tbsp sugar","3 tbsp milk","1 tbsp oil"], instructions: ["Mix dry and wet ingredients in a mug.","Microwave 60-90 seconds.","Let cool slightly and enjoy."] },

      // additional recipes (11-20)
      { id: 11, title: "Caprese Salad",image:" images/Recipe-13628-bt21v5fw1lk8uzq0.jpg", ingredients: ["2 tomatoes","125g mozzarella","basil leaves","olive oil","balsamic glaze","salt","pepper"], instructions: ["Slice tomatoes and mozzarella.","Arrange with basil leaves.","Drizzle olive oil and balsamic.","Season and serve."] },
      { id: 12, title: "Omelette",image:" images/Basic-omelette.jpg", ingredients: ["2-3 eggs","1 tbsp milk","butter","salt","pepper","fillings (cheese, herbs)"], instructions: ["Beat eggs with milk, salt and pepper.","Melt butter in pan.","Pour eggs, cook gently and add fillings.","Fold and serve."] },
      { id: 13, title: "Greek Yogurt Parfait",image:" images/dc62cb6c-03a7-47f4-843d-572365e9f183.jpg", ingredients: ["Greek yogurt","granola","honey","fresh berries"], instructions: ["Layer yogurt, granola and berries.","Drizzle with honey and serve."] },
      { id: 14, title: "Roasted Vegetables",image:" images/AdobeStock_211553771750.jpg", ingredients: ["assorted vegetables","olive oil","salt","pepper","herbs"], instructions: ["Preheat oven to 200°C.","Toss vegetables with oil and seasoning.","Roast 25-35 minutes until tender."] },
      { id: 15, title: "Beef Tacos",image:" images/teka_-ארוחת-עצמאות-טאקו-בקר-בגריל_קרדיט-צילום-טקה-סטודיו-2-__w1200h630.jpg", ingredients: ["ground beef","taco seasoning","tortillas","lettuce","cheese","salsa"], instructions: ["Cook beef with seasoning.","Warm tortillas.","Assemble tacos with toppings and serve."] },
      { id: 16, title: "Lentil Soup",image:"images/KRT_1935.jpg ", ingredients: ["1 cup lentils","1 onion","2 carrots","2 celery sticks","vegetable stock","spices"], instructions: ["Sauté onion and veg.","Add lentils and stock.","Simmer until lentils are tender.","Season and blend partially if desired."] },
      { id: 17, title: "Pesto Pasta",image:"images/AdobeStock_297116994.jpg", ingredients: ["pasta of choice","basil pesto","parmesan","pine nuts (optional)"], instructions: ["Cook pasta.","Toss with pesto and a splash of pasta water.","Top with parmesan and pine nuts."] },
      { id: 18, title: "Apple Crumble",image:" images/AdobeStock_391381000.jpg", ingredients: ["4 apples","1/2 cup sugar","1 cup oats","1/2 cup flour","1/2 cup butter"], instructions: ["Preheat oven to 180°C.","Slice apples and place in baking dish.","Mix crumble topping and sprinkle over apples.","Bake ~35-40 minutes until golden."] },
      { id: 19, title: "Sautéed Spinach with Garlic",image:"images/spinach-recipe-with-unique-flavors.jpeg", ingredients: ["fresh spinach","2 garlic cloves","olive oil","salt","lemon (optional)"], instructions: ["Sauté garlic in oil.","Add spinach and toss until wilted.","Season and finish with lemon."] },
      { id: 20, title: "Simple Stir-Fry Noodles",image:"images/מוקפץ-נודלס-ופטריות.png ", ingredients: ["noodles","mixed vegetables","soy sauce","garlic","ginger","oil"], instructions: ["Cook noodles and drain.","Sauté garlic and ginger, add vegetables.","Add noodles and soy sauce, toss and serve."] }
    ]
  };



  function ensureInitial(){
    if(!localStorage.getItem(STORAGE.USERS) || !localStorage.getItem(STORAGE.RECIPES)){
      localStorage.setItem(STORAGE.USERS, JSON.stringify(initialData.users));
      localStorage.setItem(STORAGE.RECIPES, JSON.stringify(initialData.recipes));
      localStorage.setItem(STORAGE.CURRENT, JSON.stringify(null));
    }
  }

  function read(key){
    ensureInitial();
    return JSON.parse(localStorage.getItem(key));
  }

  function write(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Users
  function getUsers(){ return read(STORAGE.USERS) || []; }
  function saveUsers(users){ write(STORAGE.USERS, users); }
  function findUserByUsername(username){
    const u = getUsers(); return u.find(x => x.username === username) || null;
  }
  function setCurrentUser(user){ write(STORAGE.CURRENT, user); }
  function getCurrentUser(){ return read(STORAGE.CURRENT); }
  function updateUserSettings(userId, settings){
    const users = getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if(idx >= 0){
      users[idx].settings = Object.assign({}, users[idx].settings || {}, settings);
      saveUsers(users);
      const cur = getCurrentUser();
      if(cur && cur.id === userId) setCurrentUser(users[idx]);
    }
  }

  // new: addUser
  function addUser({ username, password, settings = { delayTime: 900, theme: "light" } }){
    if(!username || !password) throw new Error("username and password required");
    const users = getUsers();
    if(users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, reason: "exists" };
    }
    const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = { id, username, password, settings };
    users.push(newUser);
    saveUsers(users);
    return { success: true, user: newUser };
  }

  // Recipes
  function getRecipes(){ return read(STORAGE.RECIPES) || []; }
  function saveRecipes(list){ write(STORAGE.RECIPES, list); }
  function addRecipe(recipe){
    const list = getRecipes();
    const id = list.length ? Math.max(...list.map(r=>r.id)) + 1 : 1;
    const item = Object.assign({ id }, recipe);
    list.push(item);
    saveRecipes(list);
    return item;
  }
  function getRecipeById(id){
    const list = getRecipes(); return list.find(r => Number(r.id) === Number(id)) || null;
  }
  function searchRecipes(q){
    if(!q) return getRecipes();
    q = q.toLowerCase();
    return getRecipes().filter(r => r.title.toLowerCase().includes(q) ||
      (r.ingredients||[]).join(" ").toLowerCase().includes(q));
  }

  // expose
  window.DataManager = {
    ensureInitial, getUsers, saveUsers, findUserByUsername, setCurrentUser, getCurrentUser, updateUserSettings,
    addUser,
    getRecipes, saveRecipes, addRecipe, getRecipeById, searchRecipes
  };

  // חשוב: הדאינג באתחול מיד כשמוודעים המודול
  ensureInitial();

})(window);