
export default class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}
