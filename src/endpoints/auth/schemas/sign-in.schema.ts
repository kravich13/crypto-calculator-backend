export interface ISignInBodyInput {
  email: string;
}

export const signInSchema = {
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
    },
    required: ['email'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        emailCodeResendExpiresIn: { type: 'number' },
      },
      required: ['emailCodeResendExpiresIn'],
    },
  },
};
