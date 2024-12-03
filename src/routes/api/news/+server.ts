import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface AnimeNews {
    title: string;
    date: string;
    author_username: string;
    forum_url: string;
    images: {
        jpg: {
            image_url: string;
        };
    };
    excerpt: string;
}

const ANILIST_QUERY = `
query {
  Page(page: 1, perPage: 12) {
    media(type: ANIME, sort: TRENDING_DESC, status: RELEASING) {
      id
      title {
        english
        romaji
      }
      description
      coverImage {
        large
      }
      updatedAt
      siteUrl
    }
  }
}`;

export const GET: RequestHandler = async () => {
    try {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: ANILIST_QUERY
            })
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        
        // Validate the response structure
        if (!data?.data?.Page?.media || !Array.isArray(data.data.Page.media)) {
            throw new Error('Invalid response structure from AniList API');
        }

        // Transform the data to match our AnimeNews interface
        const news = data.data.Page.media.map((item: any) => {
            if (!item) return null;

            return {
                title: item.title?.english || item.title?.romaji || 'Untitled Anime',
                date: new Date(item.updatedAt * 1000).toISOString(),
                author_username: 'AniList',
                forum_url: item.siteUrl || '#',
                images: {
                    jpg: {
                        image_url: item.coverImage?.large || '/placeholder-anime.jpg'
                    }
                },
                excerpt: item.description 
                    ? item.description.replace(/<[^>]*>/g, '').slice(0, 200) + '...' 
                    : 'No description available'
            };
        }).filter(Boolean);

        if (news.length === 0) {
            throw new Error('No anime news available');
        }

        return json(news);
    } catch (error) {
        console.error('News fetch error:', error);
        return json(
            { 
                error: error instanceof Error 
                    ? error.message 
                    : 'Failed to fetch anime news. Please try again later.'
            }, 
            { status: 500 }
        );
    }
};
