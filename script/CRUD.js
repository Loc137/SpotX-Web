import { db } from "./firebase-config.js";
import {
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

/* ===============================
   Playlist cá nhân của user
   =============================== */

// Lấy danh sách playlist của user
export async function getUserPlaylists() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return [];

  const playlistsRef = collection(db, "playlists", currentUser.email, "user_playlists");
  const querySnapshot = await getDocs(playlistsRef);
  const playlists = [];
  querySnapshot.forEach((docSnap) => playlists.push(docSnap.id));
  return playlists;
}

// Tạo playlist mới
export async function createPlaylist(playlistName) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("You need to log in!");
    return false;
  }

  if (!playlistName.trim()) {
    alert("Please enter playlist name!");
    return false;
  }

  const playlistRef = doc(db, "playlists", currentUser.email, "user_playlists", playlistName);
  const existing = await getDoc(playlistRef);
  if (existing.exists()) {
    alert("This playlist already exists!");
    return false;
  }

  await setDoc(playlistRef, { createdAt: new Date() });
  alert(`🎶 Playlist created "${playlistName}"`);
  return true;
}

// Thêm bài hát vào playlist cụ thể
export async function addTrackToPlaylist(playlistName, track) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("You need to log in!");
    return;
  }

  const trackRef = doc(
    db,
    "playlists",
    currentUser.email,
    "user_playlists",
    playlistName,
    "tracks",
    track.trackId
  );

  const existing = await getDoc(trackRef);
  if (existing.exists()) {
    alert("🎵 Bài hát này đã có trong playlist!");
    return;
  }

  await setDoc(trackRef, track);
  alert(`✅ Song added to playlist "${playlistName}"!`);
}

// Lấy danh sách bài hát trong playlist cụ thể
export async function getTracksInPlaylist(playlistName) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return [];

  const tracksRef = collection(
    db,
    "playlists",
    currentUser.email,
    "user_playlists",
    playlistName,
    "tracks"
  );

  const querySnapshot = await getDocs(tracksRef);
  const tracks = [];
  querySnapshot.forEach((docSnap) => tracks.push({ id: docSnap.id, ...docSnap.data() }));
  return tracks;
}

// Xóa bài hát khỏi playlist cụ thể ✅
export async function deleteTrackInPlaylist(playlistName, trackId) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;

  const trackRef = doc(
    db,
    "playlists",
    currentUser.email,
    "user_playlists",
    playlistName,
    "tracks",
    trackId
  );

  try {
    const confirmDelete = confirm("Are you sure you want to remove this song from your playlist?");
    if (!confirmDelete) return;

    await deleteDoc(trackRef);
    alert(`🗑️ Song removed from playlist "${playlistName}"!`);

    // Xóa trực tiếp khỏi giao diện nếu có phần tử chứa track đó
    const trackCard = document.querySelector(`[data-track-id="${trackId}"]`);
    if (trackCard) trackCard.remove();
  } catch (error) {
    console.error("Lỗi khi xóa bài hát:", error);
  }
}
