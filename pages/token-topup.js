import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function TokenTopUp() {
	return <h1>Token Top up Page</h1>;
}

export const getServerSideProps = withPageAuthRequired(() => {
	return {
		props: {},
	};
});
