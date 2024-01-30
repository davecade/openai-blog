import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
const { useUser } = require("@auth0/nextjs-auth0/client");
import { Logo } from "../Logo/Logo";
import { useContext, useEffect } from "react";
import PostsContext from "../../context/postsContext";

export const AppLayout = ({
	children,
	availableTokens,
	posts: postsFromSSR,
	postId,
}) => {
	const { user } = useUser(); // auth0 hook for getting user info

	const { posts, setPostsFromSSR, getPosts, noMorePosts } =
		useContext(PostsContext);

	useEffect(() => {
		setPostsFromSSR(postsFromSSR);
	}, [postsFromSSR, setPostsFromSSR]); // setPostsFromSSE will never change because it's a callback function
	console.log("noMorePosts ?", noMorePosts);
	return (
		<div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
			<div className="flex flex-col text-white overflow-hidden">
				<div className="bg-slate-800 px-2">
					<Logo />
					<Link href="/post/new" className="btn">
						new post
					</Link>
					<Link href="/token-topup" className="block mt-2 text-center">
						<FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
						<span className="pl-3">{availableTokens} tokens available</span>
					</Link>
				</div>
				<div className="px-4 flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
					{posts.map((post) => (
						<Link
							key={posts._id}
							href={`/post/${post._id}`}
							className={`py-1 block text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-sm ${
								postId === post._id ? "bg-white/40" : ""
							}`}
						>
							{post.topic}
						</Link>
					))}
					{!noMorePosts && (
						<div
							onClick={() => {
								getPosts({ lastPostDate: posts[posts.length - 1].created });
							}}
							className="hover:underline text-sm text-slate-400 text-center cursor pointer mt-4"
						>
							Load more posts
						</div>
					)}
				</div>
				<div className="bg-cyan-800 flex item-center gap-2 border-t border-t-black/50 h-20 px-2">
					{!!user ? (
						<>
							<div className="min-w-[50px]">
								<Image
									src={user.picture}
									alt={user.name}
									height={50}
									width={50}
									className="rounded-full"
								/>
							</div>
							<div className="flex-1">
								<p className="font-bold">{user.email}</p>
								<Link className="text-sm" href="/api/auth/logout">
									Logout
								</Link>
							</div>
						</>
					) : (
						<Link href="/api/auth/login">Login</Link>
					)}
				</div>
			</div>
			{children}
		</div>
	);
};
