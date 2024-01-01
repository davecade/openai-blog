import React, { useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";

export default function NewPost({ test }) {
	const [postContent, setPostContent] = useState("");

	const handleClick = async () => {
		const res = await fetch("/api/generatePost", {
			method: "POST",
		});
		const json = await res.json();
		setPostContent(json.post.postContent);
	};

	return (
		<div>
			<h1>New Post Page</h1>
			<button className="btn" onClick={handleClick}>
				Generate
			</button>
			<div
				className="max-w-screen-sm p-10"
				dangerouslySetInnerHTML={{ __html: postContent }}
			/>
		</div>
	);
}

NewPost.getLayout = function getLayout(page, pageProps) {
	return <AppLayout {...pageProps}>{page}</AppLayout>;
};

// withPageAuthRequired will redirect to the login page if
// the user is not authenticated
export const getServerSideProps = withPageAuthRequired(() => {
	return {
		props: {},
	};
});
