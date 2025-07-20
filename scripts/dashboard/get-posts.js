import { renderPosts } from "./render-posts.js";


export const fetchPosts= async () => {
  try {
    const res = await fetch("http://localhost:5000/get-cats");
    const data = await res.json();

    const postList = data.cats;
    renderPosts(postList);
    console.log("Posts fetched successfully:", postList);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};
