import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
const { useUser } = require("@auth0/nextjs-auth0/client");
import { Logo } from "../Logo/Logo";

export const AppLayout = ({ children }) => {
	const { user } = useUser(); // auth0 hook for getting user info
	console.log(user);
	return (
		<div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
			<div className="flex flex-col text-white overflow-hidden">
				<div className="bg-slate-800 px-2">
					<Logo />
					<Link href="/post/new" className="btn">
						new post
					</Link>
					<Link href="/token-topup" className="block mt-2 text-center">
						<FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
						<span className="pl-3">0 tokens available</span>
					</Link>
				</div>
				<div className="flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
					list of posts
				</div>
				<div className="bg-cyan-800 flex item-center gap-2 border-t border-t-black/50 h-20 px-2">
					{!!user ? (
						<>
							<div className="min-w-[50px]">
								<Image
									src={user.picture}
									alt={user.name}
									height={50}
									width={50}
									className="rounded-full"
								/>
							</div>
							<div className="flex-1">
								<p className="font-bold">{user.email}</p>
								<Link className="text-sm" href="/api/auth/logout">
									Logout
								</Link>
							</div>
						</>
					) : (
						<Link href="/api/auth/login">Login</Link>
					)}
				</div>
			</div>
			<div className="bg-yellow-500">{children}</div>
		</div>
	);
};
