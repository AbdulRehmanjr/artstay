import axios, { AxiosError } from "axios";
import { publicProcedure, createTRPCRouter } from "../trpc";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";
import { z } from "zod";


export const diningRouter = createTRPCRouter({
    getAllRestaurants: publicProcedure
        .input(z.object({
            limit: z.number().min(1).max(100),
            cursor: z.number().nullish(),
        }))
        .query(async ({ input }) => {
            try {
                const response = await axios.get<ApiResponseProps<RestaurantPaginationProps>>(`${env.API_URL}/api/v1/dining/all?limit=${input.limit}&cursor=${input.cursor ?? 0}`);
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

    getRestaurantDetail: publicProcedure
        .input(z.object({ restaurantId: z.string() }))
        .query(async ({ input }) => {
            try {
                const response = await axios.get<ApiResponseProps<RestaurantDetailProps>>(`${env.API_URL}/api/v1/dining/detail/${input.restaurantId}`);
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
});

