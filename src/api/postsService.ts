import { get, post, del, put } from "./apiClient";

export const POSTS_ENDPOINT = "/social/posts";
const PROFILES_ENDPOINT = "/social/profiles";

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
  avatar?: Avatar;
  bio?: string;
}

export interface Avatar {
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

export interface Meta {
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
    throw new Error("Error posting comment.");
  }
  return response;
}
// PUBLISH A NEW POST ///

export interface PublishPost {
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
    throw new Error("Error publishing post.");
  }
  return response;
}
/// SEARCH FOR POST ///

interface SearchPostsResponse {
  data: Post[];
  meta: Meta;
}

export async function searchForPosts(
  query: string, page: number = 1, limit: number = 100
): Promise<SearchPostsResponse> {
  const response = await get<SearchPostsResponse>(
    `${POSTS_ENDPOINT}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&_author=true&_comments=true&_reactions=true`
  );

  if (!response) {
    throw new Error("Error searching for posts.");
  }
  return response;
}

// DELETE YOUR OWN POST //

export async function deletePost(postId: number): Promise<void> {
  await del(`${POSTS_ENDPOINT}/${postId}`);
}

/// FOLLOW OR UNFOLLOW USER ///

export interface Profile {
  name: string;
  email: string;
  bio: string;
  banner: Media;
  avatar: Media;
  following?: Profile[];
  followers?: Profile[];
}

export interface ProfileResponse {
  data: Profile;
  meta: Record<string, unknown>;
}

export async function followUser(name: string): Promise<ProfileResponse> {
  const response = await put<ProfileResponse>(
    `${PROFILES_ENDPOINT}/${name}/follow`,
    undefined
  );

  if (!response) {
    throw new Error("Error trying to follow user.");
  }
  return response;
}

export async function getFollowing(
  loggedInUserName: string
): Promise<ProfileResponse> {
  const response = await get<ProfileResponse>(
    `${PROFILES_ENDPOINT}/${loggedInUserName}?_following=true`
  );

  if (!response) {
    throw new Error("Error trying to get following.");
  }
  return response;
}

export async function unfollowUser(name: string): Promise<ProfileResponse> {
  const response = await put<ProfileResponse>(
    `${PROFILES_ENDPOINT}/${name}/unfollow`,
    undefined
  );

  if (!response) {
    throw new Error("Error unfollowing user.");
  }
  return response;
}

/// GET ONE PROFILE ///

interface Banner {
  url: string;
  alt: string;
}

interface Count {
  posts: number;
  followers: number;
  following: number;
}
export interface OneProfile {
  name: string;
  email: string;
  bio: string;
  banner: Banner;
  avatar: Avatar;
  _count: Count;
}

interface OneProfileResponse {
  data: OneProfile;
  meta: object;
}

export async function getOneProfile(name: string): Promise<OneProfileResponse> {
  const response = await get<OneProfileResponse>(
    `${PROFILES_ENDPOINT}/${name}`
  );
  if (!response) {
    throw new Error("Error trying to get profile.");
  }
  return response;
}

// EDIT POST ///

export interface EditPost {
  title: string;
  body?: string;
  tags?: string[];
  media?: { 
    url: string;
    alt: String;
  }| null;
}

interface PostContent {
    id: number;
    created: string;
    updated: string;
    title: string;
    body: string;
    tags: string[];
    media: Media;
    _count: {
      comments: number;
      reactions: number;
    };
}

interface EditPostResponse {
  data: PostContent,
    meta: object;
}

export async function editOwnPost(postId: number, content: EditPost): Promise<EditPostResponse> {
const response = await put<EditPostResponse>(`${POSTS_ENDPOINT}/${postId}`, content);

if (!response) {
  throw new Error('Error trying to edit post.');
}
return response;
}



