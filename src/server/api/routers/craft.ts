import { TRPCClientError } from "@trpc/client";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";
import axios, { AxiosError } from "axios";
import { z } from "zod";

export const craftRouter = createTRPCRouter({

    getAllCrafts: publicProcedure
        .query(async () => {
            try {
                const response = await axios.get<ApiResponseProps<CraftProps[]>>(`${env.API_URL}/craft`);
                return response.data.data
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new TRPCError({
                        message: error.message,
                        code: 'NOT_FOUND'
                    })
                }
                else if (error instanceof AxiosError) {
                    console.error(error.message)
                    throw new TRPCError({
                        message: error.message,
                        code: 'BAD_REQUEST'
                    })
                }
                console.error(error)
                throw new TRPCError({
                    message: 'Something went wrong',
                    code: 'INTERNAL_SERVER_ERROR'
                })
            }
        }),

    getSubCraftsByCraftId: publicProcedure

        .input(z.object({ craftId: z.string() }))
        .query(async ({ input }) => {
            try {
                const response = await axios.get<ApiResponseProps<SubCraftProps[]>>(`${env.API_URL}/craft/sub-craft/${input.craftId}`);
                return response.data.data
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    console.error(error.message)
                    throw new TRPCError({
                        message: error.message,
                        code: 'NOT_FOUND'
                    })
                }
                else if (error instanceof AxiosError) {
                    console.error(error.message)
                    throw new TRPCError({
                        message: error.message,
                        code: 'BAD_REQUEST'
                    })
                }
                console.error(error)
                throw new TRPCError({
                    message: 'Something went wrong',
                    code: 'INTERNAL_SERVER_ERROR'
                })
            }
        }),

})