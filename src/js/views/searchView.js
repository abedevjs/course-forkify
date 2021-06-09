import View from './View.js';
import icons from 'url:../../img/icons.svg';

class SearchView extends View {
    _parentElement = document.querySelector('.search');
    _messageError = 'Something went wrong 😵. Please try again later!';

    getQuery() {
        const query = this._parentElement.querySelector('.search__field').value;
        
        this._clearInput();

        return query;
    }

    addHandlerSearch(handler) {
        this._parentElement.addEventListener('submit', function(e) {
            e.preventDefault();
            handler();
        })
    }

    _clearInput() {
        this._parentElement.querySelector('.search__field').value = '';
    }
};

export default new SearchView();