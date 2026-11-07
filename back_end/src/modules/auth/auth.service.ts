import argon2 from "argon2";
import { SignJWT } from "jose";

import { prisma } from "../../config/database.js";
import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors/app-error.js";

const jwtSecret = new TextEncoder().encode(env.JWT_SECRET);

export class AuthService {
  async register(input: { name: string; email: string; password: string }) {
    const email = input.email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError(409, "Email already registered");
    }

    const passwordHash = await argon2.hash(input.password, {
      type: argon2.argon2id,
    });

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  }

  async login(input: { email: string; password: string }) {
    const email = input.email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    const passwordValid = await argon2.verify(
      user.passwordHash,
      input.password,
    );

    if (!passwordValid) {
      throw new AppError(401, "Invalid email or password");
    }

    const accessToken = await new SignJWT({
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(user.id)
      .setIssuedAt()
      .setExpirationTime(env.JWT_EXPIRES_IN)
      .sign(jwtSecret);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
