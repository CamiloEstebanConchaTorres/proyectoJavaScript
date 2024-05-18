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


//////////////////////// SEARCH SONGS RIGTH //////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
  let searchInput = document.getElementById('placeholdersearch'); 
  let songList = document.getElementById('Song-card');
  let frame = document.querySelector('.Framecenter');
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
        data.tracks.items.forEach((song, index) => {
          console.log(`Processing song ${index}`, song);
          console.log('Detalles de la canción:', song);
          if (song && song.data && song.data.name && song.data.artists) {
            let imageUrl = song.data.albumOfTrack?.coverArt?.sources[0]?.url || '';
            let songItem = document.createElement('div');
            songItem.classList.add('song-card');
            songItem.innerHTML = `
              <img src="${imageUrl}" alt="${song.data.name}" class="song-image" data-uri="${song.data.uri}" />
              <h3>${song.data.name}</h3>
              <p>Artista: ${song.data.artists.items.map((artist) => artist.profile.name).join(', ')}</p>
            `;
            songList.appendChild(songItem);
            songItem.querySelector('.song-image').addEventListener('click', (event) => {
              const uri = event.target.getAttribute('data-uri');
              frame.setAttribute('uri', uri);
            });
          } else {
            console.log(`Canción ${index} no tiene los datos esperados.`);
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
  async function loadDefaultSongs() {
    try {
      const defaultSearch = 'electronica';
      await searchSpotify(defaultSearch);
    } catch (error) {
      console.log(`Error al cargar las canciones predeterminadas: ${error}`);
    }
  }
  loadDefaultSongs();
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      let search = searchInput.value.trim();
      if (search) {
        searchSpotify(search);
      } else {
        songList.innerHTML = '';
      }
    }
  });
});



///////////////////////////////// ALBUMS ////////////////////////////////////////////7

document.addEventListener('DOMContentLoaded', function() {
  let searchInputAlbum = document.querySelector('.left-section .filtrar_s'); 
  let albumGallery = document.querySelector('.left-section .album-gallery');
  let frame = document.querySelector('.Framecenter');
  let lastSearchTimeAlbum = 0;
  const searchDelay = 100;

  async function searchAlbums(search) {
    const currentTime = Date.now();
    if (currentTime - lastSearchTimeAlbum < searchDelay) {
      console.log('Espera un momento antes de realizar otra búsqueda.');
      return;
    }
    try {
      let url = `https://spotify23.p.rapidapi.com/search/?q=${search}&type=albums&offset=0&limit=8&numberOfTopResults=5`;
      let res = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '27affe6731msh64d1fa5c477d18dp1f41d5jsn3f8bf97a8340',
          'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
        },
      });
      let data = await res.json();
      console.log(data);
      if (data && data.albums && data.albums.items) {
        albumGallery.innerHTML = '';
        data.albums.items.forEach((album, index) => {
          console.log(`Processing album ${index}`, album);
          console.log('Detalles del álbum:', album);
          if (album && album.data && album.data.name && album.data.artists) {
            let imageUrl = album.data.coverArt?.sources[0]?.url || '';
            let albumItem = document.createElement('div');
            albumItem.classList.add('album-card');
            albumItem.innerHTML = `
              <img src="${imageUrl}" alt="${album.data.name}" class="album-image" data-uri="${album.data.uri}" />
              <h3>${album.data.name}</h3>
              <p>Artista: ${album.data.artists.items.map((artist) => artist.profile.name).join(', ')}</p>
            `;
            albumGallery.appendChild(albumItem);
            albumItem.querySelector('.album-image').addEventListener('click', async (event) => {
              const uri = event.target.getAttribute('data-uri');
              console.log('Álbum seleccionado:', uri);
              frame.setAttribute('uri', uri);
            });
          } else {
            console.log(`Álbum ${index} no tiene los datos esperados.`);
          }
        });
      } else {
        console.log('No se encontraron resultados válidos en la respuesta de la API.');
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }

    lastSearchTimeAlbum = currentTime;
  }

  async function loadDefaultAlbums() {
    try {
      const defaultSearch = 'David GUetta';
      await searchAlbums(defaultSearch);
    } catch (error) {
      console.log(`Error al cargar los álbumes predeterminados: ${error}`);
    }
  }

  loadDefaultAlbums();
  searchInputAlbum.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      let search = searchInputAlbum.value.trim();
      if (search) {
        searchAlbums(search);
      } else {
        albumGallery.innerHTML = '';
      }
    }
  });
});

////////////////////// YOU LIKE /////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
  let searchInput = document.getElementById('placeholdersearch');
  let songList = document.getElementById('Song-card');
  let youMayLikeList = document.getElementById('YouMayLike-cards');
  let frame = document.querySelector('.Framecenter');
  let lastSearchTime = 0;
  const searchDelay = 100;

  async function searchSpotify(search, listElement) {
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
        listElement.innerHTML = '';
        data.tracks.items.forEach((song, index) => {
          console.log(`Processing song ${index}`, song);
          console.log('Detalles de la canción:', song);
          if (song && song.data && song.data.name && song.data.artists) {
            let imageUrl = song.data.albumOfTrack?.coverArt?.sources[0]?.url || '';
            let songItem = document.createElement('div');
            songItem.classList.add('song-card');
            songItem.innerHTML = `
              <img src="${imageUrl}" alt="${song.data.name}" class="song-image" data-uri="${song.data.uri}" />
              <h3>${song.data.name}</h3>
              <p>Artista: ${song.data.artists.items.map((artist) => artist.profile.name).join(', ')}</p>
            `;
            listElement.appendChild(songItem);
            songItem.querySelector('.song-image').addEventListener('click', (event) => {
              const uri = event.target.getAttribute('data-uri');
              frame.setAttribute('uri', uri);
            });
          } else {
            console.log(`Canción ${index} no tiene los datos esperados.`);
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

  async function loadDefaultSongs() {
    try {
      const defaultSearch = 'electronica';
      await searchSpotify(defaultSearch, songList);
    } catch (error) {
      console.log(`Error al cargar las canciones predeterminadas: ${error}`);
    }
  }

  async function loadYouMayLikeSongs() {
    try {
      const youMayLikeSearch = 'jazz';
      await searchSpotify(youMayLikeSearch, youMayLikeList);
    } catch (error) {
      console.log(`Error al cargar las canciones de "You May Like": ${error}`);
    }
  }
  loadYouMayLikeSongs(); 
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      let search = searchInput.value.trim();
      if (search) {
        searchSpotify(search, songList);
      } else {
        songList.innerHTML = '';
      }
    }
  });
});
