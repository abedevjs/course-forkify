import icons from 'url:../../img/icons.svg';//tempat dmn kita ambil icon krn di css dan di js jd beda dan disini kita ngasih arahan ke parcel ngambil icon musti kemana

export default class View {
    _data;

    render(data) {//(data, render = true)
        if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const html = this._generateHTML();

        // if(!render) return html;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', html);
    }

    update(data) {
      // if(!data || (Array.isArray(data) && data.length === 0))
      //   return this.renderError();

      this._data = data;
      const newHTML = this._generateHTML();

      const newDOM = document.createRange().createContextualFragment(newHTML);
      const newElements = Array.from(newDOM.querySelectorAll('*'));
      const curElements = Array.from(this._parentElement.querySelectorAll('*'));

      newElements.forEach((newEl, i) => {
        const curEl = curElements[i];

        //Update changed TEXT
          if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '')
            curEl.textContent = newEl.textContent;

          if(!newEl.isEqualNode(curEl))
          Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
      });
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }

    renderSpinner() {
            const html = `
              <div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
              </div>
            `;
            // this._parentElement.innerHTML = '';//sblm kita render utk display, kita clear kan dl seluruh text di html element
            this._clear();
            this._parentElement.insertAdjacentHTML('afterbegin', html);
    }

    renderError(message = this._messageError) {//message = this._messageError < maksudnya secara default ngikutin value yg di declare _messageError pada child class masing2
      const html = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
      `;

      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', html);
    }

    renderMessage(message = this._message) {
      const html = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
      `;

      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', html);
    }

};
