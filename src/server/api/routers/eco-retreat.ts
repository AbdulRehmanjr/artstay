import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCClientError } from "@trpc/client";
import axios, { AxiosError } from "axios";
import { env } from "~/env";
import { z } from "zod";

export const ecoretreactRouter = createTRPCRouter({
  getAllHotels: publicProcedure.query(async () => {
    try {
      const response = await axios.get<ApiResponseProps<HotelProps[]>>(
        `${env.API_URL}/property/all`,
      );
      return response.data.data;
    } catch (error) {
      if (error instanceof TRPCClientError) {
        console.error(error.message);
        throw new TRPCError({
          message: error.message,
          code: "NOT_FOUND",
        });
      } else if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<{ errors: string[] }>;
        console.error(axiosError.response?.data.errors);
        throw new TRPCError({
          message:
            Array.isArray(
              (error.response?.data as { errors: string[] }).errors,
            ) &&
            typeof (error.response?.data as { errors: string[] }).errors[0] ===
              "string"
              ? (error.response?.data as { errors: string[] }).errors[0]
              : "Unknown error",
          code: "BAD_REQUEST",
        });
      }
      console.error(error);
      throw new TRPCError({
        message: "Something went wrong",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),
  getAllRoomsByHotelId: publicProcedure
    .input(z.object({ hotelId: z.string() }))
    .query(async ({ input }) => {
      try {
        const response = await axios.get<ApiResponseProps<RoomProps[]>>(
          `${env.API_URL}/property/rooms-hotel/${input.hotelId}`,
        );
        return response.data.data;
      } catch (error) {
        if (error instanceof TRPCClientError) {
          console.error(error.message);
          throw new TRPCError({
            message: error.message,
            code: "NOT_FOUND",
          });
        } else if (error instanceof AxiosError) {
          const axiosError = error as AxiosError<{ errors: string[] }>;
          console.error(axiosError.response?.data.errors);
          throw new TRPCError({
            message:
              Array.isArray(
                (error.response?.data as { errors: string[] }).errors,
              ) &&
              typeof (error.response?.data as { errors: string[] })
                .errors[0] === "string"
                ? (error.response?.data as { errors: string[] }).errors[0]
                : "Unknown error",
            code: "BAD_REQUEST",
          });
        }
        console.error(error);
        throw new TRPCError({
          message: "Something went wrong",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
    getBlockDatesByRoomId : publicProcedure
    .input(z.object({roomId:z.string()}))
    .query(async (input)=>{
       try {
        const response = await axios.get<ApiResponseProps<RoomProps[]>>(
          `${env.API_URL}/property/rooms-hotel/${input.hotelId}`,
        );
        return response.data.data;
      } catch (error) {
        if (error instanceof TRPCClientError) {
          console.error(error.message);
          throw new TRPCError({
            message: error.message,
            code: "NOT_FOUND",
          });
        } else if (error instanceof AxiosError) {
          const axiosError = error as AxiosError<{ errors: string[] }>;
          console.error(axiosError.response?.data.errors);
          throw new TRPCError({
            message:
              Array.isArray(
                (error.response?.data as { errors: string[] }).errors,
              ) &&
              typeof (error.response?.data as { errors: string[] })
                .errors[0] === "string"
                ? (error.response?.data as { errors: string[] }).errors[0]
                : "Unknown error",
            code: "BAD_REQUEST",
          });
        }
        console.error(error);
        throw new TRPCError({
          message: "Something went wrong",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    })
});
