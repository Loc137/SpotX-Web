import { getToken } from "./getToken.js";
import { getUserPlaylists, createPlaylist, addTrackToPlaylist } from "./CRUD.js";

window.showModalDetails_track = showModalDetails_track;
window.showModalDetails_artist = showModalDetails_artist;
window.closeModal = closeModal;

// =================== HÀM ĐỊNH DẠNG THỜI GIAN ===================
export function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

// =================== MODAL CHI TIẾT TRACK ===================
export async function showModalDetails_track(trackId) {
  const existingModal = document.querySelector(".modal_box");
  if (existingModal) existingModal.remove();

  const token = await getToken();
  const url = `https://api.spotify.com/v1/tracks/${trackId}`;
  const res = await fetch(url, { headers: { Authorization: "Bearer " + token } });
  const data = await res.json();

  const name = data.name;
  const artist = data.artists.map((a) => a.name).join(", ");
  const image = data.album.images[0]?.url;
  const release_date = data.album.release_date;
  const duration = formatDuration(data.duration_ms);
  const link = data.external_urls.spotify;
  const artistId = data.artists[0].id;
  const embed = `https://open.spotify.com/embed/track/${trackId}`;

  const modal_box = document.createElement("div");
  modal_box.className = "modal_box";
  modal_box.innerHTML = `
    <button id="backBtn" onclick="closeModal()" style="background:none;border:none;color:white;font-size:18px;cursor:pointer;">
        <i class="fa-solid fa-arrow-left"></i> Go back
    </button>
    <div class="modal_content">
      <div class="iframe_embed">
        <iframe src="${embed}" width="80%" height="375" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
      </div>
    </div>

    <div class="add" onclick='openPlaylistSelector({
      name: "${name}",
      image: "${image}",
      artist: "${artist}",
      trackId: "${trackId}",
      release_date: "${release_date}",
      duration: "${duration}",
      link: "${link}"
    })'>
      <i class="fa-solid fa-circle-plus fa-2xl" style="color:#fff;"></i>
      <p style="margin:0 10px;font-size:larger;">Add to your playlist</p>
    </div>

    <div class="container">
      <div class="ct">
        <p>Title</p>
        <p>Artist</p>
        <p>Release date</p>
        <p><i class="fa-regular fa-clock fa-lg" style="color:#fff;"></i></p>
      </div>
    </div>

    <div class="detail_wrapper">
      <div class="song_row">
        <strong class="ellipsis">${name}</strong>
        <strong class="ellipsis" onclick="showModalDetails_artist('${artistId}')">${artist}</strong>
        <strong>${release_date}</strong>
        <strong>${duration}</strong>
      </div>
    </div>

    <p class="modal_title">More by ${artist}</p>
    <div class="track_modal_wrapper"></div>
  `;
  document.body.appendChild(modal_box);

  // Lấy thêm bài hát cùng nghệ sĩ
  const url_track = `https://api.spotify.com/v1/search?q=${encodeURIComponent(artist)}&type=track&limit=7`;
  const res_track = await fetch(url_track, { headers: { Authorization: "Bearer " + token } });
  const data_track = await res_track.json();
  const track_modal_wrapper = document.querySelector(".track_modal_wrapper");

  data_track.tracks.items.forEach((t) => {
    const tname = t.name;
    const tartist = t.artists.map((a) => a.name).join(", ");
    const timage = t.album.images[0]?.url;
    const tid = t.id;

    track_modal_wrapper.innerHTML += `
      <div class="track_modal_row" onclick="showModalDetails_track('${tid}')">
        <img src="${timage}" alt="${tname}" style="width:175px;height:175px;border-radius:10px;margin-bottom:20px;">
        <p class="ellipsis">${tname}</p>
        <p class="ellipsis" style="opacity:0.7;">${tartist}</p>
      </div>
    `;
  });
}

// =================== POPUP CHỌN PLAYLIST ===================
async function openPlaylistSelector(track) {
  const playlists = await getUserPlaylists();

  const modal = document.createElement("div");
  modal.className = "playlist-modal";
  modal.innerHTML = `
  <div class="playlist-popup">
    <h3 class="popup-title">🎧 Select playlist</h3>
    <div class="playlist-list">
      ${
        playlists.length > 0
          ? playlists.map((pl) => `<button class="playlist-btn" data-name="${pl}">${pl}</button>`).join("")
          : "<p style='opacity:0.8;'>Chưa có playlist nào</p>"
      }
    </div>
    <div class="playlist-create">
      <input type="text" id="newPlaylistName" placeholder="Enter a new playlist name..." />
      <button id="createPlaylistBtn" class="btn-create" style="border: 1px solid white;">Create new playlists</button>
    </div>
    <button id="closePlaylistModal" class="btn-close" style="margin-right: 30px;">Close</button>
  </div>
`;

  document.body.appendChild(modal);

  // CSS nhanh
  Object.assign(modal.style, {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  });
  Object.assign(modal.querySelector(".playlist-popup").style, {
    background: "#121212",
    color: "#fff",
    padding: "25px",
    borderRadius: "15px",
    width: "320px",
    textAlign: "center",
    boxShadow: "0 0 25px rgba(0,0,0,0.6)",
  });

  // Nút playlist có sẵn
  modal.querySelectorAll(".playlist-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await addTrackToPlaylist(btn.dataset.name, track);
      document.body.removeChild(modal);
    });
  });

  // Nút tạo mới
  document.getElementById("createPlaylistBtn").addEventListener("click", async () => {
    const name = document.getElementById("newPlaylistName").value.trim();
    if (!name) return alert("Enter playlist name!");

    const created = await createPlaylist(name);
    if (created) {
      await addTrackToPlaylist(name, track);
      document.body.removeChild(modal);
    }
  });

  // Nút đóng
  document.getElementById("closePlaylistModal").addEventListener("click", () => {
    document.body.removeChild(modal);
  });
}

window.openPlaylistSelector = openPlaylistSelector;

// =================== MODAL NGHỆ SĨ ===================
export async function showModalDetails_artist(artistId) {
  const existingModal = document.querySelector(".modal_box");
  if (existingModal) existingModal.remove();

  const token = await getToken();
  const url = `https://api.spotify.com/v1/artists/${artistId}`;
  const res = await fetch(url, { headers: { Authorization: "Bearer " + token } });
  const data = await res.json();

  const name = data.name;
  const embed = `https://open.spotify.com/embed/artist/${artistId}`;

  const modal_box = document.createElement("div");
  modal_box.className = "modal_box";
  modal_box.innerHTML = `
    <button id="backBtn" onclick="closeModal()" style="background:none;border:none;color:white;font-size:18px;cursor:pointer;">
        <i class="fa-solid fa-arrow-left"></i> Go back
    </button>
    <div class="modal_content">
      <div class="iframe_embed">
        <iframe src="${embed}" width="80%" height="500" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
      </div>
    </div>
    <p class="modal_title">Related Artists</p>
    <div class="artist_modal_wrapper"></div>
  `;
  document.body.appendChild(modal_box);

  const relatedURL = `https://api.spotify.com/v1/search?q=${encodeURIComponent(name)}&type=artist&limit=7`;
  const res_artist = await fetch(relatedURL, { headers: { Authorization: "Bearer " + token } });
  const data_artist = await res_artist.json();
  const artist_modal_wrapper = document.querySelector(".artist_modal_wrapper");

  data_artist.artists.items.forEach((a) => {
    const aname = a.name;
    const aimage = a.images[0]?.url;
    const followers = a.followers.total;
    const aid = a.id;
    artist_modal_wrapper.innerHTML += `
      <div class="artist_modal_row" onclick="showModalDetails_artist('${aid}')">
        <img src="${aimage}" alt="${aname}" style="width:175px;height:175px;border-radius:50%;margin-bottom:20px;">
        <p class="ellipsis">${aname}</p>
        <p style="opacity:0.7;">Artist</p>
        <p style="opacity:0.7;">${followers} followers</p>
      </div>
    `;
  });
}

// =================== ĐÓNG MODAL ===================
export async function closeModal() {
  const modal_box = document.querySelector(".modal_box");
  if (modal_box) document.body.removeChild(modal_box);
}
