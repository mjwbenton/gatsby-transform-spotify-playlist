import request from "request-promise";
import getAuthorizationHeader from "./auth";

export type Playlist = {
  name: string;
  description: string;
  tracks: Array<Track>;
};

export type Track = {
  name: string;
  artists: Array<Artist>;
  album: Album;
};

export type Artist = {
  name: string;
};

export type Album = {
  name: string;
  images: Array<Image>;
};

export type Image = {
  url: string;
  width: number;
  height: number;
};

export async function getPlaylist(playlist): Promise<Playlist> {
  const authHeader = await getAuthorizationHeader();
  const response = await request({
    method: "GET",
    uri: `https://api.spotify.com/v1/playlists/${playlist}`,
    headers: {
      Authorization: authHeader
    },
    json: true
  });
  const { name, description } = response;
  const tracks: Array<Track> = response.tracks.items.map(t => {
    const albumName = t.track.album.name;
    return {
      name: t.track.name,
      album: {
        name: t.track.album.name,
        images: t.track.album.images
      },
      artists: t.track.artists.map(a => ({
        name: a.name
      }))
    };
  });
  return { name, description, tracks };
}
