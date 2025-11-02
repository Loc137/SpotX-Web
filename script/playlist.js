import {
  getUserPlaylists,
  getTracksInPlaylist,
  deleteTrackInPlaylist
} from "./CRUD.js";
import { showModalDetails_track } from "./show_modal.js";

window.showModalDetails_track = showModalDetails_track;
window.loadPlaylists = loadPlaylists;
window.showPlaylistTracks = showPlaylistTracks;
window.deleteTrackInPlaylist = deleteTrackInPlaylist; // ✅ cho phép gọi từ HTML

document.addEventListener("DOMContentLoaded", async () => {
  await loadPlaylists();
});

async function loadPlaylists() {
  const container = document.querySelector(".song_wrapper");
  container.innerHTML = "";

  const playlists = await getUserPlaylists();
  if (!playlists || playlists.length === 0) {
    container.innerHTML = `<p style="padding:20px;color:white;">Chưa có playlist nào. Hãy thêm bài hát để tạo playlist!</p>`;
    return;
  }

  const ct = document.createElement("div");
  ct.className = "ct";
  ct.innerHTML = `
      <div class="ct">
        <p style="margin-left: 10px; font-size: xx-large;">Playlist</p>
      </div>
  `;
  container.appendChild(ct);

  playlists.forEach((pl) => {
    const div = document.createElement("div");
    div.className = "playlist_item";
    div.style.cssText = `
      padding:15px;
      margin-top:20px;
      background:#181818;
      border-radius:10px;
      cursor:pointer;
      color:white;
    `;
    div.innerHTML = `
      <h4>${pl}</h4>
      <p style="opacity:0.7;">Click to see songs in this playlist</p>
    `;
    div.addEventListener("click", () => showPlaylistTracks(pl));
    container.appendChild(div);
  });
}

async function showPlaylistTracks(playlistName) {
  const container = document.querySelector(".song_wrapper");
  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <h3 style="color:white;">🎵 ${playlistName}</h3>
      <button id="backBtn" style="background:none;border:none;color:white;font-size:18px;cursor:pointer;">
        <i class="fa-solid fa-arrow-left"></i> Go back
      </button>
    </div>

    <div class="ct" style = "margin-top: 30px;">
      <p>Title</p>
      <p>Artist</p>
      <p>Release date</p>
      <p><i class="fa-regular fa-clock fa-lg" style="color: #ffffff;"></i></p>
      <p><i class="fa-solid fa-trash fa-lg" style="color: #ffffff;"></i></p>
    </div>

    <div class="track_grid" style="display:flex;flex-direction:column;gap:10px;margin-top:20px;"></div>
  `;

  const backBtn = document.getElementById("backBtn");
  backBtn.addEventListener("click", loadPlaylists);

  const grid = container.querySelector(".track_grid");
  const tracks = await getTracksInPlaylist(playlistName);

  if (!tracks || tracks.length === 0) {
    grid.innerHTML = `<p style="padding:20px;color:white;">Playlist này chưa có bài hát nào.</p>`;
    return;
  }

  tracks.forEach((track) => {
    const { name, artist, image, trackId, link, release_date, duration } = track;
    const div = document.createElement("div");
    div.className = "track_card";
    div.dataset.trackId = trackId; // ✅ để xóa DOM sau này
    div.innerHTML = `
      <div class="song_row" onclick="showModalDetails_track('${trackId}')">
        <div class="song_title" style="display: flex; flex-direction: row; align-items: center; gap: 10px;">
          <img src="${image}" alt="${name}" style="width: 60px; height: 60px; border-radius: 10px;">
          <div>
            <strong class="ellipsis">${name}</strong><br>
            <a href="${link}" target="_blank" style="text-decoration: none; color: #1DB954 !important;">Nghe trên Spotify</a>
          </div>
        </div>
        <strong class="ellipsis">${artist}</strong>
        <strong>${release_date}</strong>
        <strong>${duration}</strong>
        <p onclick="event.stopPropagation(); deleteTrackInPlaylist('${playlistName}', '${trackId}')">
          <i class="fa-solid fa-trash fa-lg" style="color: #ffffff;"></i>
        </p>
      </div>
    `;
    grid.appendChild(div);
  });
}
