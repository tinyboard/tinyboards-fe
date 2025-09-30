/**
 * Video embed utilities for handling YouTube, Vimeo, and other video platform embeds
 */

export interface VideoEmbedInfo {
  platform: 'youtube' | 'vimeo' | 'twitch' | null;
  videoId: string | null;
  embedUrl: string | null;
  thumbnailUrl: string | null;
}

/**
 * Extract video information from various video platform URLs
 */
export const getVideoEmbedInfo = (url: string): VideoEmbedInfo => {
  if (!url) return { platform: null, videoId: null, embedUrl: null, thumbnailUrl: null };

  // YouTube patterns
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);

  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    return {
      platform: 'youtube',
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    };
  }

  // Vimeo patterns
  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);

  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    return {
      platform: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}`,
      thumbnailUrl: null // Vimeo thumbnails require API call
    };
  }

  // Twitch patterns (clips and VODs)
  const twitchClipRegex = /(?:clips\.twitch\.tv\/)([^\/\s]+)/;
  const twitchVodRegex = /(?:twitch\.tv\/videos\/)(\d+)/;
  const twitchClipMatch = url.match(twitchClipRegex);
  const twitchVodMatch = url.match(twitchVodRegex);

  if (twitchClipMatch) {
    const clipId = twitchClipMatch[1];
    return {
      platform: 'twitch',
      videoId: clipId,
      embedUrl: `https://clips.twitch.tv/embed?clip=${clipId}&parent=${window.location.hostname}`,
      thumbnailUrl: null
    };
  }

  if (twitchVodMatch) {
    const vodId = twitchVodMatch[1];
    return {
      platform: 'twitch',
      videoId: vodId,
      embedUrl: `https://player.twitch.tv/?video=${vodId}&parent=${window.location.hostname}`,
      thumbnailUrl: null
    };
  }

  return { platform: null, videoId: null, embedUrl: null, thumbnailUrl: null };
};

/**
 * Check if a URL can be embedded as a video
 */
export const canEmbedVideo = (url: string): boolean => {
  const videoInfo = getVideoEmbedInfo(url);
  return videoInfo.platform !== null;
};

/**
 * Get the appropriate embed component props for a video URL
 */
export const getVideoEmbedProps = (url: string) => {
  const videoInfo = getVideoEmbedInfo(url);

  if (!videoInfo.platform) return null;

  switch (videoInfo.platform) {
    case 'youtube':
      return {
        component: 'lite-youtube',
        props: {
          videoid: videoInfo.videoId,
          playlabel: 'Play video'
        }
      };

    case 'vimeo':
      return {
        component: 'iframe',
        props: {
          src: videoInfo.embedUrl,
          frameborder: '0',
          allow: 'autoplay; fullscreen; picture-in-picture',
          allowfullscreen: true,
          width: '640',
          height: '360'
        }
      };

    case 'twitch':
      return {
        component: 'iframe',
        props: {
          src: videoInfo.embedUrl,
          frameborder: '0',
          allowfullscreen: true,
          scrolling: 'no',
          width: '640',
          height: '360'
        }
      };

    default:
      return null;
  }
};