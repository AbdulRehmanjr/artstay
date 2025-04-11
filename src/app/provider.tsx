'use client'

import { SessionProvider } from "next-auth/react"
import { TRPCReactProvider } from "~/trpc/react"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "~/app/api/uploadthing/core";

export default function Provider({children}: {children: React.ReactNode}) {
    return (
        <SessionProvider>
            <TRPCReactProvider>
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
                {children}
            </TRPCReactProvider>
        </SessionProvider>
    )
}
