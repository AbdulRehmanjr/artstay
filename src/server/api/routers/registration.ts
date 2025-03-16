import { TRPCClientError } from "@trpc/client";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";
import axios, { AxiosError } from "axios";
import { z } from "zod";

export const registerRouter = createTRPCRouter({

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
                await axios.post<ApiResponseProps<null>>(`${env.API_URL}/api/v1/register/artisan`, { ...input });

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

    createSafari: publicProcedure
        .input(z.object({
            firstName: z.string(),
            lastName: z.string(),
            address: z.string(),
            description: z.string(),
            email: z.string(),
            password: z.string(),
            dp: z.string(),
        }))
        .mutation(async ({ input }) => {
            try {
                await axios.post<ApiResponseProps<null>>(`${env.API_URL}/api/v1/register/safari`, { ...input });

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

    createFair: publicProcedure
        .input(z.object({
            firstName: z.string(),
            lastName: z.string(),
            address: z.string(),
            description: z.string(),
            email: z.string(),
            password: z.string(),
            dp: z.string(),
        }))
        .mutation(async ({ input }) => {
            try {
                await axios.post<ApiResponseProps<null>>(`${env.API_URL}/api/v1/register/fair`, { ...input });

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
        createShop: publicProcedure
        .input(z.object({
            shopName: z.string(),
            address: z.string(),
            description: z.string(),
            shopTiming: z.string(),
            workingDays: z.array(z.string()),
            dp: z.string(),
            email: z.string(),
            password: z.string(),
        }))
        .mutation(async ({input})=>{
           try {
             
            await axios.post<ApiResponseProps<null>>(`${env.API_URL}/api/v1/register/shop`, { ...input });
            
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