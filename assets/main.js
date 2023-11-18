import config from "../config/env.js";

const authOptions = {
  method: "POST",
  body: `grant_type=client_credentials&client_id=${config.CLIENT_ID}&client_secret=${config.CLIENT_SECRET}`,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

const content = null || document.getElementById("content");

async function getMusic(API, token) {
  try {
    const response = await fetch(API, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

async function getToken(API) {
  try {
    const response = await fetch(API, authOptions);
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

(async () => {
  try {
    const auth = await getToken(config.AUTH_CLIENT);
    const songs = await getMusic(
      `${config.CLIENT}/playlists/${config.PLAYLIST_ID}`,
      auth.access_token
    );
    let view = `
    ${songs.tracks.items.map(
      (song) => `
    <div id="card" class="group relative" aria-hidden="true">
      <a href="${song.track.external_urls.spotify}" aria-hidden="true">
        <div class="w-full bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:aspect-none">
          <img aria-hidden="true" width="30" height="30" data-src="${song.track.album.images[1].url}" alt="${song.track.name}" class="w-full">
        </div>
        <div class="mt-4 flex justify-between">
          <h3 class="text-sm text-gray-700">
          <a aria-hidden="true" href="${song.track.external_urls.spotify}" aria-hidden="true" class="absolute h-[95%] p-4 inset-0 text-white p-4 font-bold">
            <h1 style="text-shadow:0 0 6px black;">${song.track.name}</h1>
          </a>
          </h3>
        </div>
      </div>
    `
    )}
        
        `;
    content.innerHTML = view;

    const images = document.querySelectorAll(`#${content.id} img`);
    const container = document.getElementById('#card');
    const imagesObserver = new IntersectionObserver(elements => {
      elements.forEach(entry => {
        const image = entry.target.querySelector('img');
        if (entry.isIntersecting) {
          let imagen = entry.target;
          imagen.src = imagen.dataset.src;
        } else {
          if (image && image.dataset) {
            image.src = image.dataset.src;
          }
        }
      });
    }, { root: container, threshold: 0.5 });
    // console.log(imagesObserver)
    images.forEach(img => { imagesObserver.observe(img); });
  } catch (error) {
    console.log(error);
  }
})();
