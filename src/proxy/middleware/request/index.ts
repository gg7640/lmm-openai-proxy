import type { Request } from "express";
import type { ClientRequest } from "http";
import type { ProxyReqCallback } from "http-proxy";

export { createOnProxyReqHandler } from "./rewrite";
export {
  createPreprocessorMiddleware,
  createEmbeddingsPreprocessorMiddleware,
} from "./preprocess";

// Express middleware (runs before http-proxy-middleware, can be async)
export { applyQuotaLimits } from "./apply-quota-limits";
export { validateContextSize } from "./validate-context-size";
export { countPromptTokens } from "./count-prompt-tokens";
export { languageFilter } from "./language-filter";
export { setApiFormat } from "./set-api-format";
export { signAwsRequest } from "./sign-aws-request";
export { transformOutboundPayload } from "./transform-outbound-payload";

// HPM middleware (runs on onProxyReq, cannot be async)
export { addKey, addKeyForEmbeddingsRequest } from "./add-key";
export { addAnthropicPreamble } from "./add-anthropic-preamble";
export { blockZoomerOrigins } from "./block-zoomer-origins";
export { finalizeBody } from "./finalize-body";
export { finalizeSignedRequest } from "./finalize-signed-request";
export { limitCompletions } from "./limit-completions";
export { stripHeaders } from "./strip-headers";

/**
 * Middleware that runs prior to the request being handled by http-proxy-
 * middleware.
 *
 * Async functions can be used here, but you will not have access to the proxied
 * request/response objects, nor the data set by ProxyRequestMiddleware
 * functions as they have not yet been run.
 *
 * User will have been authenticated by the time this middleware runs, but your
 * request won't have been assigned an API key yet.
 *
 * Note that these functions only run once ever per request, even if the request
 * is automatically retried by the request queue middleware.
 */
export type RequestPreprocessor = (req: Request) => void | Promise<void>;

/**
 * Middleware that runs immediately before the request is sent to the API in
 * response to http-proxy-middleware's `proxyReq` event.
 *
 * Async functions cannot be used here as HPM's event emitter is not async and
 * will not wait for the promise to resolve before sending the request.
 *
 * Note that these functions may be run multiple times per request if the
 * first attempt is rate limited and the request is automatically retried by the
 * request queue middleware.
 */
export type ProxyRequestMiddleware = ProxyReqCallback<ClientRequest, Request>;

export const forceModel = (model: string) => (req: Request) =>
  void (req.body.model = model);
