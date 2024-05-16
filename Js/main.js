const API_URL = 'https://spotify23.p.rapidapi.com';
const API_KEY = '27affe6731msh64d1fa5c477d18dp1f41d5jsn3f8bf97a8340';
const API_HOST = 'spotify23.p.rapidapi.com';

class myframe extends HTMLElement {
  id;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const response = await fetch(`${API_URL}/tracks/?ids=${this.id}`, {
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
      }
    });
    const data = await response.json();

    this.shadowRoot.innerHTML = /*html*/`
      <iframe class="spotify-iframe" width="454" height="690" src="${data.tracks[0].preview_url}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
    `;
  }

  static get observedAttributes() {
    return ["uri"];
  }

  attributeChangedCallback(name, old, now) {
    let [nameUri, track, id] = now.split(":");
    this.id = id;
  }
}

customElements.define("my-frame", myframe);