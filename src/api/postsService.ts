import { get, post, del, put } from "./apiClient";

export const POSTS_ENDPOINT = "/social/posts";

export interface PostComment {
  id: number;
  postId: number;
  body: string;
  replyToId?: number;
  owner: string;
  created: string;
  author: Author;
}

export interface CreatedComment {
  id: number;
  postId: number;
  body: string;
  replyToId?: number;
  owner: string;
  created: string;
}

export interface PostWithComments extends Post {
  comments: PostComment[];
}
export interface Author {
  name: string;
  email: string;
  avatar: Avatar;
  bio: string;
}

interface Avatar {
  url: string;
  alt: string;
}

export interface Media {
  url: string;
  alt: string;
}

export interface PostCount {
  comments: number;
  reactions: number;
}
interface Reaction {
  symbol: string;
  count: number;
  reactors: string[];
}

export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  media: Media;
  created: string;
  updated: string;
  author: Author;
  reactions: Reaction[];
  _count: PostCount;
}

interface Meta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
}

interface GetPostsResponse {
  data: Post[];
  meta: Meta;
}
interface GetPostResponse {
  data: PostWithComments;
  meta: Meta;
}
interface CreateComment {
  body: string;
  replyToId?: number;
}

interface CommentResponse {
  data: CreateCommentData;
  meta: object;
}

interface CreateCommentData {
  body: string;
  replyToId?: number;
  id: number;
  postId: number;
  owner: string;
  created: string;
}

export async function getPosts(
  page: number = 1,
  limit: number = 100
): Promise<GetPostsResponse> {
  const response = await get<GetPostsResponse>(
    `${POSTS_ENDPOINT}?page=${page}&limit=${limit}&_author=true&_reactions=true`
  );
  if (!response?.data) {
    throw new Error(
      `Failed to fetch posts, Response: ${JSON.stringify(response)}`
    );
  }
  return response;
}

//// GET ONE POST BY ID ////

export async function getPostById(
  postId: number
): Promise<PostWithComments | null> {
  const response = await get<GetPostResponse>(
    `${POSTS_ENDPOINT}/${postId}?_comments=true&_author=true&_reactions=true`
  );

  if (!response?.data) {
    return null;
  }
  return response.data;
}

/// ADD A COMMENT ON A POST ///

export async function postComment(
  postId: number,
  comment: string,
  replyToId?: number
): Promise<CommentResponse> {
  const bodyContent: CreateComment = { body: comment, replyToId: replyToId };
  const response = await post<CommentResponse>(
    `${POSTS_ENDPOINT}/${postId}/comment`,
    bodyContent
  );

  if (!response) {
    throw new Error("Something went wrong");
  }
  return response;
}
// PUBLISH A NEW POST /// 


interface PublishPost {
  title: string;
  body?: string;
  tags?: string[];
  media?: Media;
}

interface PublishPostResponse {
  id: number;
  title: string;
  tags: string[];
  media: Media;
  created: string;
  updated: string;
  count: PostCount;
}

interface CreatePublishPostresponse {
  data: PublishPostResponse;
  meta: object;
}

export async function publishNewPost(
  title: string,
  body?: string,
  tags?: string[],
  media?: Media

): Promise<CreatePublishPostresponse> {
  const postContent: PublishPost = { title, body, tags, media };
  const response = await post<CreatePublishPostresponse>(
    POSTS_ENDPOINT,
    postContent
  );
  if (!response) {
    throw new Error("Something went wrong.");
  }
  return response;
}
/// SEARCH FOR POST ///

interface SearchPostsResponse {
  data: Post[],
  meta: object
}

export async function searchForPosts(query: string): Promise<SearchPostsResponse> {
const response = await get<SearchPostsResponse>(`${POSTS_ENDPOINT}/search?q=${encodeURIComponent(query)}&_author=true&_comments=true&_reactions=true`);

if (!response) {
  throw new Error('Something went wrong.');
}
return response;
}

// DELETE YOUR OWN POST //


export async function deletePost(postId: number): Promise<void> {
await del(`${POSTS_ENDPOINT}/${postId}`);

}

