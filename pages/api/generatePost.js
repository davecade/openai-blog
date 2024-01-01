import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
	const config = new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
	});
	const openai = new OpenAIApi(config);
	const topic = "10 tips for dog owners";
	const keywords =
		"first-time dog owners, common dog health issues, best dog breeds";

	const response = await openai.createChatCompletion({
		model: "gpt-4",
		temperature: 0,
		max_tokens: 3600,
		messages: [
			{
				role: "user",
				content: `Write a long and detailed SEO-frieldnly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}.
				The content should be formatted in SEO friendly HTML.
				The response mist also include appropriate HTML title and meta desription content.
				The return format must be stringified JSON ins the following format:
				{
					"postContent: post content here,
					"title: title goes here
					"metaDescription: meta description goes here
				}
				`,
			},
		],
	});

	console.log("response > ", response.data.choices[0]?.message.content);

	res
		.status(200)
		.json({
			post: JSON.parse(
				response.data.choices[0]?.message.content.split("\n").join("")
			),
		});
}
