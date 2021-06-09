import View from './View.js';
import icons from 'url:../../img/icons.svg';//tempat dmn kita ambil icon krn di css dan di js jd beda dan disini kita ngasih arahan ke parcel ngambil icon musti kemana

class AddNewRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe succesfully created! 🤣'

    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor() {
        super();
        this._addHandlerShowWindow();//this function is executed automatically by the time the controller.js import this module, so we dont have to call this function in the controller
        this._addHandlerHideWindow();//this function is executed automatically by the time the controller.js import this module, so we dont have to call this function in the controller
    }

    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function(e) {
            e.preventDefault();
            const dataArr = [...new FormData(this)];//the this refers to this._parentElement
            const data = Object.fromEntries(dataArr);
            console.log(data);

            handler(data)
        })
    }

    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }
};

export default new AddNewRecipeView();