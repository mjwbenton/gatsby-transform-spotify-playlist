import request from "request-promise";
import getAuthorizationHeader from "./auth";

export async function getPlaylist(playlist) {
  const authHeader = await getAuthorizationHeader();
  const response = await request({
    method: "GET",
    uri: `https://api.spotify.com/v1/playlists/${playlist}`,
    headers: {
      Authorization: authHeader
    },
    json: true
  });
  return response;
}
