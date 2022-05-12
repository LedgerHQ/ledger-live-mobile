export interface UseCase<Request, Response> {
  execute(request?: Request): Promise<Response> | Response;
}
