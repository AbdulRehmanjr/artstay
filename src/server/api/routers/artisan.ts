import { TRPCClientError } from "@trpc/client";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";
import axios, { AxiosError } from "axios";
import { z } from "zod";

export const artisanRouter = createTRPCRouter({

    createArtisan: publicProcedure
        .input(z.object({
            firstName: z.string(),
            lastName: z.string(),
            address: z.string(),
            description: z.string(),
            experience: z.string(),
            education: z.string(),
            training: z.string(),
            certificate: z.string(),
            recognition: z.string(),
            craftId: z.string(),
            subCraftId: z.string(),
            email: z.string(),
            password: z.string(),
            dp: z.string(),
        }))
        .mutation(async ({ input }) => {
            try {
                await axios.post<ApiResponseProps<null>>(`${env.API_URL}/api/v1/artisan/create`, { ...input });

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

    getAllArtisans: publicProcedure
        .input(z.object({
            limit: z.number().min(1).max(100),
            cursor: z.number().nullish(),
        }))
        .query(async ({ input }) => {
            try {
                const response = await axios.get<ApiResponseProps<ArtisanPaginationProps>>(`${env.API_URL}/api/v1/artisan/all?limit=${input.limit}&cursor=${input.cursor ?? 0}`);
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

    getArtisanDetail: publicProcedure
        .input(z.object({ artisanId: z.string() }))
        .query(async ({ input }) => {
            try {
                const response = await axios.get<ApiResponseProps<ArtisanPortolioProps>>(`${env.API_URL}/api/v1/artisan/${input.artisanId}`);
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