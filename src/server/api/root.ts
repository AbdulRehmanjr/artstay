
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { registerRouter } from "~/server/api/routers/registration";
import { craftRouter } from "~/server/api/routers/craft";
import { artisanRouter } from "~/server/api/routers/artisan";
import { safariRouter } from "~/server/api/routers/safari";
import { fairRouter } from "~/server/api/routers/fair";
import { shopRouter } from "~/server/api/routers/shop";
import { diningRouter } from "~/server/api/routers/dining"; 

export const appRouter = createTRPCRouter({
  register:registerRouter,
  craft: craftRouter,
  artisan: artisanRouter,
  safari:safariRouter,
  fair:fairRouter,
  shop:shopRouter,
  dining:diningRouter
});


export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
