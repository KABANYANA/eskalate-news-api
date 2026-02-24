export const successResponse = (
  message: string,
  object: any = null
) => ({
  Success: true,
  Message: message,
  Object: object,
  Errors: null
});

export const errorResponse = (
  message: string,
  errors: string[] = []
) => ({
  Success: false,
  Message: message,
  Object: null,
  Errors: errors
});