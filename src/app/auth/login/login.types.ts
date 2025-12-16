export type ILoginApiPayload = {
  email: string;
  password: string;
}

export type ILoginApiResponse = {
  "token": string
}
