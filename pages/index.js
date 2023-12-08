import Image from "next/image";
import Link from "next/link";
const { useUser } = require("@auth0/nextjs-auth0/client");

export default function Home() {
	const { user } = useUser(); // auth0 hook for getting user info

	return (
		<div>
			<h1>This is the homepage</h1>
			<div>
				{!!user ? (
					<>
						<Image src={user.picture} alt={user.name} height={50} width={50} />
						<p>{user.email}</p>
						<Link href="/api/auth/logout">Logout</Link>
					</>
				) : (
					<Link href="/api/auth/login">Login</Link>
				)}
			</div>
		</div>
	);
}
