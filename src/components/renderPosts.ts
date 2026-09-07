import { getPosts } from "../api/postsService";

const renderPostsContainer = document.getElementById("render-posts");

export async function renderPosts() {
    try {
        const response = await getPosts(1, 100);
        if (!response?.data) {
            console.log("No posts found");
        }
        const data = response.data;
        
    }catch(error) {
    }
}


renderPosts();