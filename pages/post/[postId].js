import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function Home() {
	return <h1>Post ID Page</h1>;
}

export const getServerSideProps = withPageAuthRequired(() => {
	return {
		props: {},
	};
});
