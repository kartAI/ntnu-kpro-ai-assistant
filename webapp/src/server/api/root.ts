import { modelRouter } from "./routers/model";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { applicationRouter } from "./routers/application";
import { documentRouter } from "./routers/document";
import { modelErrorRouter } from "./routers/model-error";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  model: modelRouter,
  application: applicationRouter,
  document: documentRouter,
  response: modelErrorRouter,
  modelErrors: modelErrorRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
