import React, { useCallback, useReducer, useState } from "react";

const PostsContext = React.createContext({});

export default PostsContext;

function postsReducer(state, action) {
	switch (action.type) {
		case "ADD_POST": {
			const newPosts = [...state];
			action.posts.forEach((post) => {
				const exists = newPosts.find((p) => p._id === post._id);
				if (!exists) {
					newPosts.push(post);
				}
			});
			return newPosts;
		}

		case "DELETE_POST": {
			const newPosts = [];
			const index = newPosts.findIndex((p) => p._id === postId);
			if (index > -1) {
				newPosts.splice(index, 1);
			}
			return newPosts;
		}

		default:
			return state;
	}
}

export const PostsProvider = ({ children }) => {
	const [posts, dispatch] = useReducer(postsReducer, []);
	const [noMorePosts, setNoMorePosts] = useState(false);

	const deletePost = useCallback((postId) => {
		dispatch({
			type: "DELETE_POST",
			postId,
		});
	}, []);

	const setPostsFromSSR = useCallback((postsFromSSR = []) => {
		dispatch({
			type: "ADD_POST",
			posts: postsFromSSR,
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
			dispatch({
				type: "ADD_POST",
				posts: postsResult,
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
				deletePost,
			}}
		>
			{children}
		</PostsContext.Provider>
	);
};
