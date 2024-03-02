export declare const TRPC_ERROR_CODES_BY_KEY: {
  /**
   * Invalid JSON was received by the server.
   * An error occurred on the server while parsing the JSON text.
   */
  readonly PARSE_ERROR: -32700;
  /**
   * The JSON sent is not a valid Request object.
   */
  readonly BAD_REQUEST: -32600;
  readonly INTERNAL_SERVER_ERROR: -32603;
  readonly NOT_IMPLEMENTED: -32603;
  readonly UNAUTHORIZED: -32001;
  readonly FORBIDDEN: -32003;
  readonly NOT_FOUND: -32004;
  readonly METHOD_NOT_SUPPORTED: -32005;
  readonly TIMEOUT: -32008;
  readonly CONFLICT: -32009;
  readonly PRECONDITION_FAILED: -32012;
  readonly PAYLOAD_TOO_LARGE: -32013;
  readonly UNPROCESSABLE_CONTENT: -32022;
  readonly TOO_MANY_REQUESTS: -32029;
  readonly CLIENT_CLOSED_REQUEST: -32099;
};
export type TRPC_ERROR_CODE_NUMBER = ValueOf<typeof TRPC_ERROR_CODES_BY_KEY>;
export type ValueOf<TObj> = TObj[keyof TObj];
// interface TRPCErrorResponse<TError extends TRPCErrorShape = TRPCErrorShape>
export interface TRPCErrorResponse<
  TError extends TRPCErrorShape = TRPCErrorShape,
> extends JSONRPC2.ErrorResponse<TError> {}
export declare namespace JSONRPC2 {
  export type RequestId = number | string | null;
  export interface BaseEnvelope {
    id?: RequestId;
    jsonrpc?: "2.0";
  }
  export interface BaseRequest<TMethod extends string = string>
    extends BaseEnvelope {
    method: TMethod;
  }
  export interface Request<TMethod extends string = string, TParams = unknown>
    extends BaseRequest<TMethod> {
    params: TParams;
  }
  export interface ResultResponse<TResult = unknown> extends BaseEnvelope {
    result: TResult;
  }
  export interface ErrorResponse<TError extends TRPCErrorShape = TRPCErrorShape>
    extends BaseEnvelope {
    error: TError;
  }
}
export interface TRPCSuccessResponse<TData>
  extends JSONRPC2.ResultResponse<TRPCResult<TData> & { type?: "data" }> {}
export interface TRPCResult<TData = unknown> {
  data: TData;
}
export type TRPCResponse<
  TData = unknown,
  TError extends TRPCErrorShape = TRPCErrorShape,
> = TRPCErrorResponse<TError> | TRPCSuccessResponse<TData>;
export interface TRPCErrorShape<
  TCode extends number = TRPC_ERROR_CODE_NUMBER,
  TData extends Record<string, unknown> = Record<string, unknown>,
> {
  code: TCode;
  message: string;
  data: TData;
}
export interface ErrorResponse<TError extends TRPCErrorShape = TRPCErrorShape>
  extends JSONRPC2.BaseEnvelope {
  error: TError;
}

//   extends JSONRPC2.ErrorResponse<TError> {}
export declare namespace JSONRPC2 {
  export type RequestId = number | string | null;
  /**
   * All requests/responses extends this shape
   */
  export interface BaseEnvelope {
    id?: RequestId;
    jsonrpc?: "2.0";
  }
  export interface BaseRequest<TMethod extends string = string>
    extends BaseEnvelope {
    method: TMethod;
  }
  export interface Request<TMethod extends string = string, TParams = unknown>
    extends BaseRequest<TMethod> {
    params: TParams;
  }
  export interface ResultResponse<TResult = unknown> extends BaseEnvelope {
    result: TResult;
  }
  export interface ErrorResponse<TError extends TRPCErrorShape = TRPCErrorShape>
    extends BaseEnvelope {
    error: TError;
  }
}
export interface TRPCSuccessResponse<TData>
  extends JSONRPC2.ResultResponse<
    TRPCResult<TData> & {
      type?: "data";
    }
  > {}
export interface TRPCResult<TData = unknown> {
  data: TData;
}
export type TRPCResponse<
  TData = unknown,
  TError extends TRPCErrorShape = TRPCErrorShape,
> = TRPCErrorResponse<TError> | TRPCSuccessResponse<TData>;
export interface TRPCErrorShape<
  TCode extends number = TRPC_ERROR_CODE_NUMBER,
  TData extends Record<string, unknown> = Record<string, unknown>,
> {
  code: TCode;
  message: string;
  data: TData;
}
export interface ErrorResponse<TError extends TRPCErrorShape = TRPCErrorShape>
  extends BaseEnvelope {
  error: TError;
}
export interface BaseEnvelope {
  id?: RequestId;
  jsonrpc?: "2.0";
}
export type RequestId = number | string | null;
export type ResponseMetaFn<TRouter extends AnyRouter> = (opts: {
  data: TRPCResponse<unknown, inferRouterError<TRouter>>[];
  ctx?: inferRouterContext<TRouter>;
  /**
   * The different tRPC paths requested
   **/
  paths?: string[];
  type: ProcedureType | "unknown";
  errors: TRPCError[];
  /**
   * `true` if the `ResponseMeta` are being
   * generated without knowing the response data
   * (e.g. for streaming requests).
   */
  eagerGeneration?: boolean;
}) => ResponseMeta;
export interface HTTPRequest {
  method: string;
  query: URLSearchParams;
  headers: HTTPHeaders;
  body: unknown;
}
export interface ResolveHTTPRequestOptions<
  TRouter extends AnyRouter,
  TRequest extends HTTPRequest,
> extends HTTPBaseHandlerOptions<TRouter, TRequest> {
  createContext: () => Promise<inferRouterContext<TRouter>>;
  req: TRequest;
  path: string;
  error?: Maybe<TRPCError>;
  contentTypeHandler?: BaseContentTypeHandler<any>;
  preprocessedBody?: boolean;
  /**
   * Called as soon as the response head is known.
   * When streaming, headers will have been generated
   * **without** knowing the response body.
   *
   * Without this callback, streaming is disabled.
   */
  unstable_onHead: (
    headResponse: Omit<HTTPResponse, "body">,
    isStreaming: boolean
  ) => void;
  /**
   * Called for every procedure with `[index, result]`.
   *
   * Will be called a single time with `index = -1` if
   * - response is an error
   * - response is empty (HEAD request)
   *
   * Without this callback, streaming is disabled.
   */
  unstable_onChunk: (chunk: ResponseChunk) => void;
}
/**
 * Base interface for anything using HTTP
 */
export interface HTTPBaseHandlerOptions<TRouter extends AnyRouter, TRequest>
  extends BaseHandlerOptions<TRouter, TRequest> {
  /**
   * Add handler to be called before response is sent to the user
   * Useful for setting cache headers
   * @link https://trpc.io/docs/caching
   */
  responseMeta?: ResponseMetaFn<TRouter>;
}
export interface BaseHandlerOptions<TRouter extends AnyRouter, TRequest> {
  onError?: OnErrorFunction<TRouter, TRequest>;
  batching?: {
    enabled: boolean;
  };
  router: TRouter;
}
export type OnErrorFunction<TRouter extends AnyRouter, TRequest> = (opts: {
  error: TRPCError;
  type: ProcedureType | "unknown";
  path: string | undefined;
  req: TRequest;
  input: unknown;
  ctx: inferRouterContext<TRouter> | undefined;
}) => void;
export interface ResponseMeta {
  status?: number;
  headers?: HTTPHeaders;
}
export type HTTPHeaders = Dict<string[] | string>;
export type Dict<TType> = Record<string, TType | undefined>;
export interface HTTPResponse {
  status: number;
  headers?: HTTPHeaders;
  body?: string;
}
export type ResponseChunk = [procedureIndex: number, responseBody: string];
export type BaseContentTypeHandler<TOptions> = {
  isMatch(opts: TOptions): boolean;
  getBody: (opts: TOptions) => MaybePromise<BodyResult>;
  getInputs: GetInputs;
};
export type BodyResult =
  | {
      ok: true;
      data: unknown;
      /**
       * If the HTTP handler has already parsed the body
       */
      preprocessed: boolean;
    }
  | {
      ok: false;
      error: TRPCError;
    };
export type GetInputs = (opts: {
  req: HTTPRequest;
  isBatchCall: boolean;
  router: AnyRouter;
  preprocessedBody: boolean;
}) => MaybePromise<Record<number, unknown>>;

export type ResolveHTTPResponseOptions = Omit<
  ResolveHTTPRequestOptions<TRouter, TRequest>,
  "unstable_onChunk" | "unstable_onHead"
>;
