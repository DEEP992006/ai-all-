import { usersTable, db } from "@repo/db";
import { currentUser } from "@clerk/nextjs/server";

export async function POST() {

  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

//   await db.user.upsert({
//     where: { clerkId: userId },
//     update: {
//       username: user.username ?? user.firstName,
//       image: user.imageUrl,
//     },
//     create: {
//       clerkId: userId,
//       username: user.username ?? user.firstName,
//       image: user.imageUrl,
//     },
//   });
console.log("\n\n\n\n",user.emailAddresses[0].emailAddress);

const a = await db.insert(usersTable).values({ "ClerkId": user.id, email: user.emailAddresses[0].emailAddress })
// console.log(a);

  return Response.json({ ok: true });
}
