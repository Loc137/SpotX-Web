import { getToken } from "./getToken.js";
import { formatDuration, showModalDetails_track, showModalDetails_artist, closeModal } from "./show_modal.js";

window.showModalDetails_track = showModalDetails_track
window.showModalDetails_artist = showModalDetails_artist
// window.showModalMore_track = showModalMore_track
// window.showModalMore_artist = showModalMore_artist
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



let query = ""

async function search() {
  query = document.getElementById("search_input").value.trim();

  const token = await getToken();
  const url_track = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    query
  )}&type=track&limit=10`;
  const url_artist = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    query
  )}&type=artist&limit=8`;

  const res_track = await fetch(url_track, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const res_artist = await fetch(url_artist, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const data_track = await res_track.json();
  const data_artist = await res_artist.json();

  const results_track = data_track.tracks.items;
  const results_artist = data_artist.artists.items;

  //in ra man hinh
  const song_wrapper = document.querySelector(".song_wrapper");
  const artist_wrapper = document.querySelector(".artist_wrapper");

  song_wrapper.innerHTML = "";
  artist_wrapper.innerHTML = "";

  //in title
  const song_title = document.querySelector("#song_title")
  const artist_title = document.querySelector("#artist_title")

  song_title.innerHTML = "";
  artist_title.innerHTML = "";

  song_title.innerHTML += `<p>Songs</p>`
  artist_title.innerHTML += `<p>Artists</p>`

  //in show more
  const showMore_track = document.querySelector(".showMore_track")
  const showMore_artist = document.querySelector(".showMore_artist")

  showMore_track.innerHTML = "";
  showMore_artist.innerHTML = "";

  showMore_track.innerHTML += `<p>Show more</p>`
  showMore_artist.innerHTML += `<p>Show more</p>`

  //in song collumn
  const container = document.querySelector(".container")

  container.innerHTML = "";

  container.innerHTML += `
    <div class="ct">
      <p>Title</p>
      <p>Artist</p>
      <p>Release date</p>
      <p><i class="fa-regular fa-clock fa-lg" style="color: #ffffff;"></i></p>
    </div>
  `

  //in track
  results_track.forEach((tracks) => {
    const name = tracks.name;
    const artist = tracks.artists.map((a) => a.name).join(", ");
    const image = tracks.album.images[0]?.url;
    const release_date = tracks.album.release_date;
    const duration = formatDuration(tracks.duration_ms);
    // const link = tracks.external_urls.spotify
    const audio = tracks.preview_url;
    const link = tracks.external_urls.spotify;
    const artistId = tracks.artists[0].id
    const trackId = tracks.id;

    song_wrapper.innerHTML += `
    <div class="song_row" onclick="showModalDetails_track('${trackId}')">
      <div class="song_title" style="display: flex; flex-direction: row; align-items: center; gap: 10px;">
        <img src="${image}" alt="${name}" style="width: 60px; height: 60px; border-radius: 10px;">
        <div>
          <strong class="ellipsis">${name}</strong><br>
          <a href="${link}" target="_blank" style="text-decoration: none; color: #1DB954 !important;">Nghe trên Spotify</a>
        </div>
      </div>
      <strong class="ellipsis" onclick="showModalDetails_artist('${artistId}')">${artist}</strong>
      <strong>${release_date}</strong>
      <strong>${duration}</strong>
    </div>
`;
  });

  //in artist
  results_artist.forEach((artists) => {
    const name = artists.name;
    const image = artists.images[0]?.url;
    const followers = artists.followers.total
    const artistId = artists.id;

    artist_wrapper.innerHTML += `
          <div class="artist_row" onclick="showModalDetails_artist('${artistId}')">
            <img src="${image}" alt="${name}" style="width: 150px; height: 150px; border-radius: 50%; margin-bottom: 20px">
            <p class="ellipsis">${name}</p>
            <p style="opacity: 0.7;">Artist</p>
            <p style="opacity: 0.7;">${followers} followers</p>
          </div>
        `;
  });
}

document
  .getElementById("search_input")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); //ngan reload
      search();
    }
  });

// document.querySelector(".showMore_track").addEventListener("click", () => { showModalMore_track(query); });
// document.querySelector(".showMore_artist").addEventListener("click", () => { showModalMore_artist(query); });