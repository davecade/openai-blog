import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../lib/mongodb";

// responsible for quering all the data we need for the side bar
export const getAppProps = async (ctx) => {
	const userSessions = await getSession(ctx.req, ctx.res);
	const client = await clientPromise;
	const db = client.db("OpenAIBlog");
	const currentlyLoggedInUser = await db.collection("users").findOne({
		auth0Id: userSessions.user.sub,
	});

	if (!currentlyLoggedInUser) {
		return {
			props: {
				availableTokens: 0,
				posts: [],
			},
		};
	}

	const posts = await db
		.collection("posts")
		.find({
			userId: currentlyLoggedInUser._id,
		})
		.sort({
			created: -1,
		})
		.toArray();

	return {
		availableTokens: currentlyLoggedInUser.availableTokens,
		posts: posts.map(({ created, _id, userId, ...rest }) => ({
			...rest,
			_id: _id.toString(),
			created: created.toString(),
		})),
		postId: ctx.params?.postId || null,
	};
};
