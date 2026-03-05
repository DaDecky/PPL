import { auth, prisma } from "@/lib/auth";

type SignInIdentifierBody = {
  identifier?: string;
  password?: string;
  callbackURL?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizePhoneNumber = (value: string) => {
  const raw = value.replace(/[\s-]/g, "");
  const digitsOnly = raw.replace(/\D/g, "");

  if (raw.startsWith("+62")) {
    return `+${digitsOnly}`;
  }

  if (digitsOnly.startsWith("62")) {
    return `+${digitsOnly}`;
  }

  if (digitsOnly.startsWith("08")) {
    return `+62${digitsOnly.slice(1)}`;
  }

  if (digitsOnly.startsWith("8")) {
    return `+62${digitsOnly}`;
  }

  return null;
};

export async function POST(request: Request) {
  const body = (await request.json()) as SignInIdentifierBody;
  const identifier = body.identifier?.trim() ?? "";
  const password = body.password ?? "";
  const callbackURL = body.callbackURL;

  if (!identifier || !password) {
    return Response.json(
      { message: "Identifier dan password wajib diisi." },
      { status: 400 },
    );
  }

  let email = identifier;

  if (!emailRegex.test(identifier)) {
    const normalizedPhone = normalizePhoneNumber(identifier);

    if (!normalizedPhone) {
      return Response.json(
        { message: "Email/no.hp atau password salah." },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { phoneNumber: normalizedPhone },
      select: { email: true },
    });

    if (!user?.email) {
      return Response.json(
        { message: "Email/no.hp atau password salah." },
        { status: 401 },
      );
    }

    email = user.email;
  }

  return auth.api.signInEmail({
    body: {
      email,
      password,
      callbackURL,
    },
    headers: request.headers,
    asResponse: true,
  });
}
