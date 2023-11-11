import config from '../config/env.js'

const authOptions = {
  method: 'POST',
  body: `grant_type=client_credentials&client_id=${config.CLIENT_ID}&client_secret=${config.CLIENT_SECRET}`,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

const content = null || document.getElementById('content')

async function getMusic (API, token) {
  try {
    const response = await fetch(API, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.json()
  } catch (error) {
    console.error(error)
  }
}

async function getToken (API) {
  try {
    const response = await fetch(API, authOptions)
    return response.json()
  } catch (error) {
    console.error(error)
  }
}

;(async () => {
  try {
    const auth = await getToken(config.AUTH_CLIENT)
    const songs = await getMusic(
      `${config.CLIENT}/playlists/${config.PLAYLIST_ID}`,
      auth.access_token
    )
    let view = `
    ${songs.tracks.items.map(
      song => `
    <div class="group relative">
    <a href="${song.track.external_urls.spotify}">
          <div class="w-full bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:aspect-none">
            <img src="${song.track.album.images[1].url}" alt="" class="w-full">
          </div>
          <div class="mt-4 flex justify-between">
            <h3 class="text-sm text-gray-700">
            <a href="${song.track.external_urls.spotify}" aria-hidden="true" class="absolute inset-0">${song.track.artists[0].name}</a>
              title
            </h3>
          </div>
        </div>
    `
    )}
        
        `
    content.innerHTML = view
  } catch (error) {
    console.log(error)
  }
})()
