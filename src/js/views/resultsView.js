import View from './View.js';
import PreviewView from './previewView.js';
import icons from 'url:../../img/icons.svg';//tempat dmn kita ambil icon krn di css dan di js jd beda dan disini kita ngasih arahan ke parcel ngambil icon musti kemana

// class ResultsView extends View {
class ResultsView extends PreviewView {
    _parentElement = document.querySelector('.results');
    _messageError = 'No recipes found for your query 😵. Please try another one!';
    _message = 'Hello there! 🖐️';



    // _generateHTML() {//if my parent class is View
    //     return this._data.map(result => PreviewView.render(result, false)).join('');
    // }

    // _generateHTML() {//if my parent class is View and there's no PreviewView
    //     return this._data.map(this._generateHTMLPreview)
    // }

    // _generateHTMLPreview(result) {   
    //     const id = window.location.hash.slice(1);
    //     return `
    //         <li class="preview">
    //             <a class="preview__link ${result.id === id ? 'preview__link--active' : ''}" href="#${result.id}">
    //                 <figure class="preview__fig">
    //                     <img src="${result.image}" alt="${result.title}" />
    //                 </figure>
    //                 <div class="preview__data">
    //                     <h4 class="preview__title">${result.title}</h4>
    //                     <p class="preview__publisher">${result.publisher}</p>
    //                     <!--
    //                     <div class="preview__user-generated">
    //                         <svg>
    //                             <use href="${icons}#icon-user"></use>
    //                         </svg>
    //                     </div>
    //                     -->
    //                 </div>
    //             </a>
    //         </li>
    //     `;
    // }
};

export default new ResultsView();


