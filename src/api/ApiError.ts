export default class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiErorr";
  }
}
