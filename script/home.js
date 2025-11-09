import { getToken } from "./getToken.js";
import { formatDuration, showModalDetails_track, showModalDetails_artist, closeModal } from "./show_modal.js";

window.showModalDetails_track = showModalDetails_track
window.showModalDetails_artist = showModalDetails_artist
window.closeModal = closeModal

//show username

document.addEventListener("DOMContentLoaded", () => {
  const userSession = JSON.parse(localStorage.getItem("user_session"));
  const avatarImg = document.getElementById("avatar");
  const nameDiv = document.querySelector(".name_user");

  if (userSession && userSession.user) {
    const user = userSession.user;

    // Hiển thị tên
    nameDiv.textContent = user.displayName || user.email || "User";

    // Hiển thị ảnh đại diện (chỉ có nếu đăng nhập Google)
    avatarImg.src = user.photoURL;

  } else {
    // Nếu chưa đăng nhập → chuyển về login
    window.location.href = "./login.html";
  }
});



async function showResult() {
  const token = await getToken()

  const query = "trình"
  const url_popular_track = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=7`

  const url_release_track = `https://api.spotify.com/v1/search?q=new&type=track&limit=7`

  const query_2 = "bruno mars"
  const url_popular_artist = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query_2)}&type=artist&limit=7`

  const res_popular_track = await fetch(url_popular_track, {
    headers: {
      Authorization: "Bearer " + token
    }
  })
  const res_release_track = await fetch(url_release_track, {
    headers: {
      Authorization: "Bearer " + token
    }
  })
  const res_popular_artist = await fetch(url_popular_artist, {
    headers: {
      Authorization: "Bearer " + token
    }
  })

  const data_popular_track = await res_popular_track.json()
  const data_release_track = await res_release_track.json()
  const data_popular_artist = await res_popular_artist.json()

  const results_popular_track = data_popular_track.tracks.items
  const results_release_track = data_release_track.tracks.items
  const results_popular_artist = data_popular_artist.artists.items

  const popular_song_wrapper = document.querySelector(".ps_wrapper")
  const release_song_wrapper = document.querySelector(".nr_wrapper")
  const popular_artist_wrapper = document.querySelector(".fa_wrapper")
  popular_song_wrapper.innerHTML = ""
  release_song_wrapper.innerHTML = ""
  popular_artist_wrapper.innerHTML = ""

  //in popular track
  results_popular_track.forEach((tracks) => {
    const name = tracks.name;
    const artist = tracks.artists.map(a => a.name).join(", ")
    const image = tracks.album.images[0]?.url
    const artistId = tracks.artists[0].id
    const trackId = tracks.id

    popular_song_wrapper.innerHTML += `
          <div class="ps_row" onclick="showModalDetails_track('${trackId}')">
            <img src="${image}" alt="${name}" style="width: 175px; height: 175px; border-radius: 10px; margin-bottom: 20px">
            <p class="ellipsis">${name}</p>
            <p class="ellipsis" style="opacity: 0.7;" onclick="showModalDetails_artist('${artistId}')">${artist}</p>
          </div>
        `;
  });

  //in release track
  results_release_track.forEach((tracks) => {
    const name = tracks.name;
    const artist = tracks.artists.map(a => a.name).join(", ")
    const image = tracks.album.images[0]?.url
    const artistId = tracks.artists[0].id
    const trackId = tracks.id

    release_song_wrapper.innerHTML += `
          <div class="nr_row" onclick="showModalDetails_track('${trackId}')">
            <img src="${image}" alt="${name}" style="width: 175px; height: 175px; border-radius: 10px; margin-bottom: 20px">
            <p class="ellipsis">${name}</p>
            <p class="ellipsis" style="opacity: 0.7;" onclick="showModalDetails_artist('${artistId}')">${artist}</p>
          </div>
        `;
  });

  //in popular artist
  results_popular_artist.forEach((artists) => {
    const name = artists.name;
    const image = artists.images[0]?.url
    const followers = artists.followers.total
    const artistId = artists.id;

    popular_artist_wrapper.innerHTML += `
          <div class="fa_row" onclick="showModalDetails_artist('${artistId}')">
            <img src="${image}" alt="${name}" style="width: 175px; height: 175px; border-radius: 50%; margin-bottom: 20px">
            <p class="ellipsis">${name}</p>
            <p style="opacity: 0.7;">Artist</p>
            <p style="opacity: 0.7;">${followers} followers</p>
          </div>
        `;
  });
}

showResult()