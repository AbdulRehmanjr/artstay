import { TRPCClientError } from "@trpc/client";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";
import axios, { AxiosError } from "axios";
import { z } from "zod";

export const safariRouter = createTRPCRouter({

    getApplicationStatus: publicProcedure
        .query(async ({ctx}) => {
            try {
                const response = await axios.get<ApiResponseProps<SafariProps>>(`${env.API_URL}/safari/application-status/${ctx.session?.user.id}`);
                
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
                    const axiosError = error as AxiosError<{ errors: string[] }>;
                    console.error(axiosError.response?.data.errors)
                    throw new TRPCError({
                        message: Array.isArray((error.response?.data as { errors: string[] }).errors) && typeof (error.response?.data as { errors: string[] }).errors[0] === 'string' ? (error.response?.data as { errors: string[] }).errors[0] : 'Unknown error',
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

    getAllSafaris: publicProcedure
        .input(
            z.object({
            limit: z.number().min(1).max(100),
            cursor: z.number().nullish(),
        }))
        .query(async ({ input }) => {
            try {
                const response = await axios.get<ApiResponseProps<SafariPaginationProps>>(`${env.API_URL}/safari/all?limit=${input.limit}&cursor=${input.cursor ?? 0}`);
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
                    const axiosError = error as AxiosError<{ errors: string[] }>;
                    console.error(axiosError.response?.data.errors)
                    throw new TRPCError({
                        message: Array.isArray((error.response?.data as { errors: string[] }).errors) && typeof (error.response?.data as { errors: string[] }).errors[0] === 'string' ? (error.response?.data as { errors: string[] }).errors[0] : 'Unknown error',
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

    getSafariDetail: publicProcedure
        .input(z.object({ safariId: z.string() }))
        .query(async ({ input }) => {
            try {
                const response = await axios.get<ApiResponseProps<SafariDetailProps>>(`${env.API_URL}/safari/${input.safariId}`);
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
                    const axiosError = error as AxiosError<{ errors: string[] }>;
                    console.error(axiosError.response?.data.errors)
                    throw new TRPCError({
                        message: Array.isArray((error.response?.data as { errors: string[] }).errors) && typeof (error.response?.data as { errors: string[] }).errors[0] === 'string' ? (error.response?.data as { errors: string[] }).errors[0] : 'Unknown error',
                        code: 'BAD_REQUEST'
                    })
                }
                console.error(error)
                throw new TRPCError({
                    message: 'Something went wrong',
                    code: 'INTERNAL_SERVER_ERROR'
                })
            }
        })
})