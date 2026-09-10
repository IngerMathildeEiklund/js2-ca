import { get } from "./apiClient";

const POSTS_ENDPOINT = "/social/posts";

interface Comment {
    body: string,
    replyToId: number,
    id: number, 
    postId: number, 
    owner: string,
    created: string,
    author: Author,
    avatar: Avatar,
    banner: Banner,
}

interface PostWithComments extends Post {
    comments: Comment[]
}
interface Author {
    name: string, 
    email: string,
    bio: string,
}

interface Avatar {
    url: string,
    alt: string
}
interface Banner {
    url: string,
    alt: string
}

interface Media {
    url: string, 
    alt: string
}

interface PostCount {
    comments: number, 
    reactions: number
}

export interface Post {
    id: number, 
    title: string, 
    body: string, 
    tags: string[],
    media: Media,
    created: string,
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
interface GetPostResponse {
    data: PostWithComments,
    meta: Meta
}

export async function getPosts(page: 1, limit: 100): Promise<GetPostsResponse> {
const response = await get<GetPostsResponse>(`${POSTS_ENDPOINT}?page=${page}&limit=${limit}`);
if (!response?.data) {
    throw new Error(`Failed to fetch posts, Response: ${JSON.stringify(response)}`);
}
return response;
}




//// GET ONE POST BY ID ////



export async function getPostById(postId: number): Promise<PostWithComments | null> {
   const response = await get<GetPostResponse>(`${POSTS_ENDPOINT}/${postId}?_comments=true`);

   if (!response?.data) {
    return null;
   }
   return response.data;
}

