import { NextResponse } from "next/server";

const CHANNEL_IDS = [
  "UC82I7itdM3X4RHVTbLnklAA", 
];

const MAX_PER_CHANNEL = 5; 

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY || "AIzaSyAinc226JrwqP9Gz6MWhiZaKfYIy-Mthqs";
  const allShorts = [];

  await Promise.all(
    CHANNEL_IDS.map(async (channelId) => {
      try {
        const chanRes = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
        );
        const chanData = await chanRes.json();
        const uploadsId = chanData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
        if (!uploadsId) return;

        // Step 2: get latest videos from uploads playlist
        const playRes = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=20&key=${apiKey}`
        );
        const playData = await playRes.json();

        // Step 3: filter Shorts only (duration <= 60s)
        const videoIds = playData.items
          ?.map((item) => item.snippet?.resourceId?.videoId)
          .filter(Boolean)
          .join(",");

        if (!videoIds) return;

        const videoRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${apiKey}`
        );
        const videoData = await videoRes.json();

        const shorts = videoData.items
          ?.filter((v) => {
            const dur = v.contentDetails?.duration || "";
            // Parse ISO 8601 — Shorts are <= 60 seconds
            const match = dur.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
            const mins = parseInt(match?.[1] || "0");
            const secs = parseInt(match?.[2] || "0");
            return mins === 0 && secs <= 60;
          })
          .slice(0, MAX_PER_CHANNEL)
          .map((v) => v.id);

        allShorts.push(...(shorts || []));
      } catch (err) {
        console.error(`Failed for channel ${channelId}:`, err);
      }
    })
  );

  return NextResponse.json({ ids: allShorts });
}