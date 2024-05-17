class myframe extends HTMLElement{
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.renderFrame();
    }

    renderFrame() {
        const uri = this.getAttribute('uri');
        if (uri) {
            const id = uri.split(':')[2];
            const typeOf = uri.split(':')[1];
            this.shadowRoot.innerHTML = `
                <iframe class="spotify-iframe" width="100%" height="670" src="https://open.spotify.com/embed/${typeOf}/${id}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
            `;
        } else {
            this.shadowRoot.innerHTML = '';
        }
    }

    static get observedAttributes() {
        return ["uri"];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'uri' && oldVal !== newVal) {
            this.renderFrame();
        }
    }
}
customElements.define("my-frame",myframe)


//////////////////////// SEARCH //////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    let searchInput = document.querySelector('.right-section .filtrar_s');
    let searchButton = document.getElementById('searchButton');
    let songList = document.getElementById('Song-card');
    let lastSearchTime = 0;
    const searchDelay = 100;
  
    async function searchSpotify(search) {
      const currentTime = Date.now();
      if (currentTime - lastSearchTime < searchDelay) {
        console.log('Espera un momento antes de realizar otra búsqueda.');
        return;
      }
  
      try {
        let url = `https://spotify23.p.rapidapi.com/search/?q=${search}&type=tracks&offset=0&limit=8&numberOfTopResults=5`;
        let res = await fetch(url, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': '27affe6731msh64d1fa5c477d18dp1f41d5jsn3f8bf97a8340',
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
          },
        });
        let data = await res.json();
        console.log(data);
  
        if (data && data.tracks && data.tracks.items) {
          songList.innerHTML = '';
          data.tracks.items.forEach((song) => {
            if (song && song.name && song.artists) {
              let songItem = document.createElement('div');
              songItem.classList.add('song-card');
              songItem.innerHTML = `
                <h3>${song.name}</h3>
                <p>Artista: ${song.artists.map((artist) => artist.name).join(', ')}</p>
              `;
              songList.appendChild(songItem);
            }
          });
        } else {
          console.log('No se encontraron resultados válidos en la respuesta de la API.');
        }
      } catch (error) {
        console.log(`Error: ${error}`);
      }
  
      lastSearchTime = currentTime;
    }
  
    searchButton.addEventListener('click', () => {
      let search = searchInput.value.trim();
      if (search) {
        searchSpotify(search);
      } else {
        songList.innerHTML = '';
      }
    });
  });
  