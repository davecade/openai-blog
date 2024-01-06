import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
	const config = new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
	});
	const { topic, keywords } = req.body;
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

	const postContent = postContentResponse.data.choices[0]?.message?.content;

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
					Generate SEO-friendly meta description text for the above blog post
				`,
			},
		],
	});

	const title = titleResponse.data.choices[0]?.message?.content || "";
	const metaDescription =
		metaDescriptionResponse.data.choices[0]?.message?.content || "";

	res.status(200).json({
		postContent,
		title,
		metaDescription,
	});
}
