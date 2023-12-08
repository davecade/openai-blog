import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function Home({ test }) {
	console.log("test >> ", test);
	return <h1>New Post Page</h1>;
}

// withPageAuthRequired will redirect to the login page if
// the user is not authenticated
export const getServerSideProps = withPageAuthRequired(() => {
	return {
		props: {},
	};
});
