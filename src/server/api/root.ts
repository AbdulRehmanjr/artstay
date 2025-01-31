
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { craftRouter } from "~/server/api/routers/craft";
import { artisanRouter } from "~/server/api/routers/artisan";


export const appRouter = createTRPCRouter({
  craft: craftRouter,
  artisan: artisanRouter
});


export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
