// Legacy-Alias → POST /api/admin/users mit mode=invite
import { POST as usersPost } from "../users/route";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const forwarded = new Request(req.url, {
    method: "POST",
    headers: req.headers,
    body: JSON.stringify({ ...body, mode: "invite" }),
  });
  return usersPost(forwarded);
}
