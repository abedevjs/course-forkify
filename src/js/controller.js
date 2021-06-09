import 'core-js/stable';//for polyfiling everything else (polyfilling the codes back to es5 agar memfasilitasi old browser)
import 'regenerator-runtime/runtime';//for polyfiling async await (polyfilling the codes back to es5 agar memfasilitasi old browser)
import * as Model from './model.js';
import RecipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import ResultsView from './views/resultsView.js';
import PaginationView from './views/paginationView.js';
import BookmarkView from './views/bookmarkView.js';
import AddNewRecipeView from './views/addNewRecipeView.js';


const { async } = require("q");//ini otomatis ter declare sendiri oleh Parcel

// if(module.hot) {//ini dari parcel, bukan js, biar tdk reload2 terus browser nya. Ini pilihan sj, suka2 km mau pake atau tdk
//   module.hot.accept();
// }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const controlSearch = async function() {//Untuk meload Search Results dari Model, kemudian mendisplay data tersebut ke UI dari SearchView
  try {
    //1. Display spinner
      ResultsView.renderSpinner();

    //2. Get query that has inputted by the user
      const query = SearchView.getQuery();
        if(!query) return;

    //3. Take the query and Load the results on Model based by that query
      await Model.loadSearchResults(query); 
  
    //4. Display the search results on the UI based on the number of search results per page calculated by the Model
      // ResultsView.render(Model.state.search.results);
      ResultsView.render(Model.getSearchResultsPage());      

    //5. Display the initial pagination button
      PaginationView.render(Model.state.search); 


  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function(goToPage) {//Untuk mengontrol Pagination di UI berdasarkan data yang sdh di atur oleh Model.
    //Function render() yg ada dalam fungsi ini meng overwrite fungsi render sebelumnya yg sdh dieksekusi di controlSearch karena...
    //...didalam function render() ada function this._clear(); yg tugasnya untuk mengclear ui di parent elemen sebelum...
    //...mendisplay template html yg baru lwt function this._parentElement.insertAdjacentHTML('afterbegin', html);

  //1. Men display halaman keberapa yg di buka
    ResultsView.render(Model.getSearchResultsPage(goToPage));   
 
  //2. Men display jumlah results yg sudah ditentukan oleh Model
    PaginationView.render(Model.state.search);
};

const controlRecipes = async function() {//Untuk meload 1 data recipes dari Model, kemudian di display data tersebut ke UI dari RecipeView
  try {
    //1. Take the id
      const id = window.location.hash.slice(1);//#53sgji28479vndk099 < id yg diambil adalah setelah hash(#) krn di slice dr situ slice(1)
        if(!id) return;

    //Update results view to mark selected search result
      // ResultsView.render(Model.getSearchResultsPage());
      ResultsView.update(Model.getSearchResultsPage());
      
    //Update bookmark view
      BookmarkView.update(Model.state.bookmarks)
      // BookmarkView.render(Model.state.bookmarks)
      

    //2. Render Loading Spinner animation
      RecipeView.renderSpinner();
     
    //3. Get Data
      await Model.loadRecipe(id);//5ed6604591c37cdc054bcb23
      // const {recipe} = Model.state;//< aslinya const {recipe} = Model.state.recipe;

    //4. Render Recipe Search Result
      RecipeView.render(Model.state.recipe);
      
  } catch (err) {
    RecipeView.renderError();
  }
};

const controlServings = function(newServings) {//newServing 
  //Update the recipe servings (in state) 
    // Model.updateServings(5);
    Model.updateServings(newServings);
  
    //Update the recipe view
    // RecipeView.render(Model.state.recipe)
    RecipeView.update(Model.state.recipe)
};

const controlAddBookmark = function() {
  //Add/Remove Bookmarks
    if(!Model.state.recipe.bookmarked ? Model.addBookmarks(Model.state.recipe) : Model.removeBookmarks(Model.state.recipe.id));

  //Update recipe view
  RecipeView.update(Model.state.recipe);

  //Render bookmarks
  BookmarkView.render(Model.state.bookmarks);
};

const controlLoadBookmarks = function() {
  BookmarkView.render(Model.state.bookmarks);
};

const controlAddRecipe = async function(newRecipe) {
  try {
    AddNewRecipeView.renderSpinner();

    await Model.uploadRecipe(newRecipe);
      // console.log(Model.state.recipe);

    RecipeView.render(Model.state.recipe);

    BookmarkView.render(Model.state.bookmarks);

    AddNewRecipeView.renderMessage();

    window.history.pushState(null, '', `#${Model.state.recipe.id}`)

    setTimeout(() => {
      AddNewRecipeView.toggleWindow();
    }, 2000);

  } catch (err) {
    console.error('💥')
    AddNewRecipeView.renderError(err.message);
  }
  
};

const init = function() {
    BookmarkView.addHandlerRender(controlLoadBookmarks);//Untuk me load bookmark di localstorage pada saat start applikasi

    SearchView.addHandlerSearch(controlSearch);//Untuk meng submit query lwt click/submit event lwt search form
    
    PaginationView.addHandlerClick(controlPagination);//Untuk mendengarkan click event pada button dan akan mendisplay search results di halaman berikutnya

  //Display welcome message
    RecipeView.renderMessage();

  //Handle the window event listener right after the app started
    RecipeView.addHandlerRender(controlRecipes);//Untuk men display 1 recipes yg id nya di tangkap lwt url lwt load dan hashchange event
    RecipeView.addHandlerUpdateServing(controlServings);//Untuk men display perubahan serving pada recipes, ketika tombol event di klik
    RecipeView.addHandlerAddBookmark(controlAddBookmark);//Untuk men display tombol bookmark pada event klik

    AddNewRecipeView.addHandlerUpload(controlAddRecipe);
    
};
  init();//Start the app one time execution

