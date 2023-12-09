/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ["s.gravatar.com", "lh3.googleusercontent.com"], // must add this for every domain that hosts images
	},
};

module.exports = nextConfig;
