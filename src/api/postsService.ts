import { get } from "./apiClient";

const POSTS_ENDPOINT = "/social/posts";


interface Media {
    url: string, 
    alt: string
}

interface PostCount {
    comments: number, 
    reactions: number
}

interface Post {
    id: number, 
    title: string, 
    body: string, 
    tags: string[],
    media: Media,
    updated: string,
    _count: PostCount
}

interface Meta {
    isFirstPage: boolean,
    isLastPage: boolean,
    currentPage: number,
    previousPage: number | null,
    nextPage: number | null, 
    pageCount: number,
    totalCount: number
}

interface GetPostsResponse {
    data: Post[],
    meta: Meta
}


export async function getPosts(page: 1, limit: 100): Promise<GetPostsResponse> {
const response = await get<GetPostsResponse>(`${POSTS_ENDPOINT}?page=${page}&limit=${limit}`);
if (!response?.data) {
    throw new Error(`Failed to fetch posts, Response: ${JSON.stringify(response)}`);
}
return response;
}

