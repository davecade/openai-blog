import React, { useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { useRouter } from "next/router";
import { getAppProps } from "../../utils/getAppProps";

export default function NewPost({ test }) {
	const [topic, setTopic] = useState("");
	const [keywords, setKeywords] = useState("");
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch("/api/generatePost", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ topic, keywords }),
		});
		const json = await res.json();
		console.log("RESULT", json);

		// redirect to the newly created post
		if (json?.postId) {
			router.push(`/post/${json.postId}`);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div>
					<label>
						<strong>Generate a blog post o the topic of:</strong>
					</label>
					<textarea
						className={
							"resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
						}
						value={topic}
						onChange={(e) => setTopic(e.target.value)}
					/>
				</div>
				<div>
					<label>
						<strong>Targetting the following keywords:</strong>
					</label>
					<textarea
						className={
							"resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
						}
						value={keywords}
						onChange={(e) => setKeywords(e.target.value)}
					/>
				</div>
				<button type="submit" className="btn">
					Generate
				</button>
			</form>
		</div>
	);
}

NewPost.getLayout = function getLayout(page, pageProps) {
	return <AppLayout {...pageProps}>{page}</AppLayout>;
};

// withPageAuthRequired will redirect to the login page if
// the user is not authenticated
export const getServerSideProps = withPageAuthRequired({
	async getServerSideProps(ctx) {
		const props = await getAppProps(ctx);
		return { props };
	},
});
