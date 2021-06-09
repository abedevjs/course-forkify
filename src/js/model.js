import { async } from "regenerator-runtime";
import { API_URL, RESULTS_PER_PAGE, KEY } from './config.js';
import { getJSON, sendJSON } from './helpers.js';

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,//default
        resultsPerPage: RESULTS_PER_PAGE,
        
    },
    bookmarks: [],
};

const createRecipeObject = function(data) {
    const {recipe} = data.data;//< aslinya let {recipe} = data.data.recipe;
        return {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
            ...(recipe.key && { key: recipe.key }),//
        };
}

export const loadRecipe = async function(id) {
    try {
    //1. Search Recipe Algorithm
        const data = await getJSON(`${API_URL}${id}?key=${KEY}`);
            // console.log('TEST:', state.recipe);
    
    //2. Fixing and re-assign the returning api obj as we wish to use
        state.recipe = createRecipeObject(data);
            console.log('Model.js:', state.recipe);

    //3.Check if the current state bookmarks has any recipe. If it is, persist that recipe
            if(state.bookmarks.some(bookmark => bookmark.id === id)) state.recipe.bookmarked = true;

    } catch (err) {
        console.error(`Model.js: 💥💥💥 ${err.message} 💥💥💥`);
        throw err;//kita throw error ini ke function yg lg pake function error ini
    }
};

export const loadSearchResults = async function(query) {
    try {
        state.search.query = query;
        const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);
        
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && { key: rec.key }),
            }
        });

        state.search.page = 1;//Whenever we make a new search, the page reset to 1
        console.log('Model.js: ', state.search.results);

    } catch (err) {
        console.error(`Model.js: 💥💥💥 ${err.message} 💥💥💥`);
        throw err;//kita throw error ini ke function yg lg pake function error ini
    }
};

export const getSearchResultsPage = function(page = state.search.page) {//PAGINATION. page = state.search.page < maksudnya secara default ngikutin value yg di declare state.search.page
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage;// Page 1, (1 - 1) * 10 = 0. Page 2, (2 - 1) * 10 = 10. Page 3, (3 - 1) * 10 = 20
    const end = page * state.search.resultsPerPage;// Page 1, 1 * 10 = 10. Page 2, 2 * 10 = 20. Page 3, 3 * 10 = 30

    // 0-10, 10-20, 20-30 etc.... < krn dlm slice argumennya (0, 10) < berarti yg di keep 0 - 9 
    return state.search.results.slice(start, end);//klo slice itu menyatakan yg dikeep. End yg terakhir ga termasuk
};

export const updateServings = function(newServings) {
    // console.log(state.recipe.ingredients);

    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    });

    state.recipe.servings = newServings;
};

const persistBookmarks = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const addBookmarks = function(recipe) {

    state.bookmarks.push(recipe);
        // console.log('fn', state.bookmarks);
    
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true; //create new property inside the recipe object

    persistBookmarks();
};

export const removeBookmarks = function(id) {
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    if(id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks();
};

export const uploadRecipe = async function(newRecipe) {
    try {
        //newRecipe > ["ingredient-1", "0.5,kg,rice"]
        const ingredients = Object.entries(newRecipe)
            .filter(entry => entry[0]
            .startsWith('ingredient') && entry[1] !== '')
            .map(ing => {
                const ingArr = ing[1].split(',').map(el => el.trim());
                    if(ingArr.length !== 3) throw new Error('Recipe must with the correct format! 🎇');
                const [quantity, unit, description] = ingArr;

                return { quantity: quantity ? +quantity : null, unit, description };
            });

            const recipe = {
                title: newRecipe.title,
                source_url: newRecipe.sourceUrl,
                image_url: newRecipe.image,
                publisher: newRecipe.publisher,
                cooking_time: +newRecipe.cookingTime,
                servings: +newRecipe.servings,
                ingredients
            };

            const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
            state.recipe = createRecipeObject(data);
            addBookmarks(state.recipe);

    } catch (err) {
        console.error(`Upload Recipe: 💥💥💥 ${err.message} 💥💥💥`);
        throw err;
    };
};

const clearBookmarks = function() {//dipakai klo lagi pengen clear bookmark aj pada saat development
    localStorage.clear('bookmarks');
};
    

const init =  function() {
    const storage = localStorage.getItem('bookmarks');

    if(storage) state.bookmarks = JSON.parse(storage);
};

    init();
    // clearBookmarks();