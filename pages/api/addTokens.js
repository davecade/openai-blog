import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
	//check if a user has a profile stored in our database
	//if they dont have a profile we create one and add tokens
	//if they do have a profile we add tokens to their profile

	// from auth0 docs
	const { user } = await getSession(req, res);

	const client = await clientPromise;
	const db = client.db("OpenAIBlog");

	const userProfile = await db.collection("users").updateOne(
		{
			auth0Id: user.sub,
		},
		{
			$inc: {
				availableTokens: 10,
			},
			$setOnInsert: {
				auth0Id: user.sub,
			},
		},
		{
			upsert: true,
		}
	);

	res.status(200).json({ name: "John Doe" });
}
