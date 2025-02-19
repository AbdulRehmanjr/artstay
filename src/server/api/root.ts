
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { registerRouter } from "~/server/api/routers/registration";
import { craftRouter } from "~/server/api/routers/craft";
import { artisanRouter } from "~/server/api/routers/artisan";



export const appRouter = createTRPCRouter({
  register:registerRouter,
  craft: craftRouter,
  artisan: artisanRouter,
});


export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
