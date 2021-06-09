import View from './View.js';
import icons from 'url:../../img/icons.svg';//tempat dmn kita ambil icon krn di css dan di js jd beda dan disini kita ngasih arahan ke parcel ngambil icon musti kemana

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--inline');
                if(!btn) return;
                // console.log(btn);
            
            const goToPage = +btn.dataset.goto;
                // console.log(goToPage); 
                
            handler(goToPage);
        })
    }

    _generateHTML() {
        //patokan data disini yg dishare dr model via controller adalah: this._data = Model.state.search{query, results[], page, resultsPerPage}
        const currentPage = this._data.page;
            // console.log('currentPage:', currentPage);
        const numberOfPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
            // console.log('numberOfPages:', numberOfPages);

        //1. We are at the page 1 and there's a next page. Button: (- >)
            if(currentPage === 1 && numberOfPages > 1)
                return this._generateBtnHTML('next', currentPage); 

        //2. We are at the middle page. Button: (< >)
            if(currentPage < numberOfPages)
                return this._generateBtnHTML('prev and next', currentPage);

        //3. We are at the last page. Button: (< -)
            if(currentPage === numberOfPages && numberOfPages > 1)
                return this._generateBtnHTML('prev', currentPage);

        //4. No other page(s). Button: (- -)
            return `We only have ${this._data.results.length} recipes 😁`; 
    }

    _generateBtnHTML(btn, curPage) {
        
        if(btn === 'prev') {
            return `
                <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                    <span>Page ${curPage - 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                </button>
            `;
        };

        if(btn === 'next') {
            return `
                <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            
            `;
        }

        if(btn === 'prev and next') {
            return `
                <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span>
                </button>
                <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
        }
    }
};

export default new PaginationView();