import { post } from "../api/apiClient";

import type { Media } from "../api/postsService";
import type { PostCount } from "../api/postsService";

const ADD_COMMENT_ENDPOINT = `/social/posts/${id}/comment`

interface CreatePost {
    title: string,
    body?: string,
    tags?: string[],
    media: Media,
}

interface CreatePostResponse extends CreatePost {
    id: string,
    created: string,
    updated: string,
    count: PostCount,
}


/* export async function addComment(): Promise<CreatePostResponse> {
    const response = await post<CreatePost>(ADD_COMMENT_ENDPOINT, {});
} */