import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { Configuration, OpenAIApi } from "openai";
import clientPromise from "../../../lib/mongodb";

//go
// Adding withApiAuthRequired to the handler function
// will ensure that only authenticated users can access the API route.
// This is from the @auth0/nextjs-auth0 package.
// So we can wrap other handlers like this to ensure that only
// authenticated users can access them.
export default withApiAuthRequired(async function handler(req, res) {
	// get the currently logged in user from Auth0
	const { user } = await getSession(req, res);

	// Check if the user has any available tokens
	const client = await clientPromise;
	const db = client.db("OpenAIBlog");

	// get the user's in the database with the same
	// auth0Id as the currently logged in user
	const userProfile = await db
		.collection("users")
		.findOne({ auth0Id: user.sub });

	// if the user doesn't have any available tokens
	if (!userProfile?.availableTokens) {
		// 403 means forbidden
		res.status(403);
		return;
	}

	const config = new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
	});
	const { topic, keywords } = req.body;

	//validation
	if (!topic || !keywords) {
		res.status(422);
		return;
	}

	if (topic.length > 80 || keywords.length > 80) {
		res.status(422);
		return;
	}

	const openai = new OpenAIApi(config);

	const postContentResponse = await openai.createChatCompletion({
		model: "gpt-4",
		temperature: 0,
		messages: [
			{
				role: "system",
				content: `You are a blog post generator`,
			},
			{
				role: "user",
				content: `
					Write a long and detailed SEO-frieldnly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}.
					The content should be formatted in SEO friendly HTML, limited to the following HTML tags: p, h1, h2, h3, h4, h5. h6, string, li, ol, li, i
				`,
			},
		],
	});

	const postContent =
		postContentResponse.data.choices[0]?.message?.content || "";

	const titleResponse = await openai.createChatCompletion({
		model: "gpt-4",
		temperature: 0,
		messages: [
			{
				role: "system",
				content: `You are a blog post generator`,
			},
			{
				role: "user",
				content: `
					Write a long and detailed SEO-frieldnly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}.
					The content should be formatted in SEO friendly HTML, limited to the following HTML tags: p, h1, h2, h3, h4, h5. h6, string, li, ol, li, i
				`,
			},
			{
				role: "assistant",
				content: postContent,
			},
			{
				role: "user",
				content: `
					Generate appropriate title tag text for the above blog post
				`,
			},
		],
	});

	const metaDescriptionResponse = await openai.createChatCompletion({
		model: "gpt-4",
		temperature: 0,
		messages: [
			{
				role: "system",
				content: `You are a blog post generator`,
			},
			{
				role: "user",
				content: `
					Write a long and detailed SEO-frieldnly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}.
					The content should be formatted in SEO friendly HTML, limited to the following HTML tags: p, h1, h2, h3, h4, h5. h6, string, li, ol, li, i
				`,
			},
			{
				role: "assistant",
				content: postContent,
			},
			{
				role: "user",
				content: `
					Generate SEO-friendly meta description content for the above blog post
				`,
			},
		],
	});

	const title = titleResponse.data.choices[0]?.message?.content || "";
	const metaDescription =
		metaDescriptionResponse.data.choices[0]?.message?.content || "";

	// update the user's available tokens in the database
	// by subtracting 1 from the current value
	await db
		.collection("users")
		.updateOne({ auth0Id: user.sub }, { $inc: { availableTokens: -1 } });

	const parsed = (text) => text.split("\n").join("");

	const post = await db.collection("posts").insertOne({
		postContent: parsed(postContent),
		title: parsed(title),
		metaDescription: parsed(metaDescription),
		topic,
		keywords,
		userId: userProfile._id,
		created: new Date(),
	});
	console.log("post > ", post);
	res.status(200).json({
		postId: post.insertedId,
	});
});
