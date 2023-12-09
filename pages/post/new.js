import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";

export default function NewPost({ test }) {
	console.log("test >> ", test);
	return <h1>New Post Page</h1>;
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
