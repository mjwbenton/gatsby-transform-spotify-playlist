import { getPlaylist } from "./api";
import createNodeHelpers from "gatsby-node-helpers";

const { createNodeFactory } = createNodeHelpers({
  typePrefix: `Spotify`
});

const SpotifyPlaylistNode = createNodeFactory(`Playlist`);

export async function onCreateNode({ node, actions, cache, reporter }) {
  const { createNode, createParentChildLink } = actions;
  if (!node.frontmatter) {
    return;
  }
  const playlistId = node.frontmatter.spotifyPlaylist;
  if (!playlistId) {
    return;
  }
  let playlist;
  try {
    const cacheKey = `spotify-playlist-${playlistId}`;
    playlist = await cache.get(cacheKey);
    if (!playlist) {
      playlist = await getPlaylist(playlistId);
    }
  } catch (err) {
    reporter.panicOnBuild(
      `Error fetching SpotifyPlaylist ${playlistId} for node ${node.id}\n${err}`
    );
  }
  if (!playlist) {
    return;
  }
  const playlistNode = SpotifyPlaylistNode(
    {
      playlist,
      id: node.id + playlistId
    },
    {
      parent: node.id
    }
  );
  createNode(playlistNode);
  createParentChildLink({ parent: node, child: playlistNode });
}
