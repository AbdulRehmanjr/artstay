
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { registerRouter } from "~/server/api/routers/registration";
import { craftRouter } from "~/server/api/routers/craft";
import { artisanRouter } from "~/server/api/routers/artisan";
import { safariRouter } from "./routers/safari";



export const appRouter = createTRPCRouter({
  register:registerRouter,
  craft: craftRouter,
  artisan: artisanRouter,
  safari:safariRouter
});


export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
