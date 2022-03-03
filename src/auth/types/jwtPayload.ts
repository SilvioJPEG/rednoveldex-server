export type JwtPayload = {
  username: string;
  sub: number;
};

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };
