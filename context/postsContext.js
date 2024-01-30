import React, { useCallback, useState } from "react";

const PostsContext = React.createContext({});

export default PostsContext;

export const PostsProvider = ({ children }) => {
	const [posts, setPosts] = useState([]);
	const [noMorePosts, setNoMorePosts] = useState(false);

	const setPostsFromSSR = useCallback((postsFromSSR = []) => {
		setPosts((prev) => {
			const newPosts = [...prev];
			postsFromSSR.forEach((post) => {
				const exists = newPosts.find((p) => p._id === post._id);
				if (!exists) {
					newPosts.push(post);
				}
			});
			return newPosts;
		});
	}, []);

	const getPosts = useCallback(
		async ({ lastPostDate, getNewerPosts = false }) => {
			const response = await fetch("/api/getPosts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					lastPostDate,
					getNewerPosts,
				}),
			});
			const json = await response.json();
			const postsResult = json.posts || [];

			if (postsResult.length < 5) {
				setNoMorePosts(true);
			}
			setPosts((prev) => {
				const newPosts = [...prev];
				postsResult.forEach((post) => {
					const exists = newPosts.find((p) => p._id === post._id);
					if (!exists) {
						newPosts.push(post);
					}
				});
				return newPosts;
			});
		},
		[]
	);

	return (
		<PostsContext.Provider
			value={{
				posts,
				setPostsFromSSR,
				getPosts,
				noMorePosts,
			}}
		>
			{children}
		</PostsContext.Provider>
	);
};
