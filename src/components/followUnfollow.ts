import { followUser } from "../api/postsService";
import { unfollowUser } from "../api/postsService";

import type { Profile, FollowResponse } from "../api/postsService";

const followersContainer = document.getElementById('following');

const following = [];

async function fetchFollowers(name: string): Promise<Profile> {

}
