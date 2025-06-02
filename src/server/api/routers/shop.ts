import { TRPCError } from "@trpc/server";
import axios, { AxiosError } from "axios";
import { TRPCClientError } from "@trpc/client";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { env } from "~/env";

export const shopRouter = createTRPCRouter({
  getApplicationStatus: protectedProcedure.query(async ({ ctx }) => {
    try {
      const response = await axios.get<ApiResponseProps<ShopProps>>(
        `${env.API_URL}/shop/application-status/${ctx.session.user.id}`,
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
  getAllShopsWithPagination: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await axios.get<ApiResponseProps<ShopPaginationProps>>(
          `${env.API_URL}/shop/all?limit=${input.limit}&cursor=${input.cursor ?? 0}`,
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
  getFilterOptions: publicProcedure.query(async () => {
    try {
      const response = await axios.get<
        ApiResponseProps<ShopFilterOptionsProps>
      >(`${env.API_URL}/shop/filters`);
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
  getAllShops: publicProcedure.query(async () => {
    try {
      const response = await axios.get<ApiResponseProps<ShopProps[]>>(
        `${env.API_URL}/shop/all`,
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
  getShopDetail: publicProcedure
    .input(
      z.object({
        shopId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await axios.get<ApiResponseProps<ShopDetailProps>>(
          `${env.API_URL}/shop/${input.shopId}`,
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
  createShopOrder: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(2),
        lastName: z.string().min(2),
        email: z.string().email(),
        phone: z.string().min(10),
        address: z.string().min(5),
        city: z.string().min(2),
        additionalNote: z.string().optional(),
        subtotal: z.number(),
        tax: z.number(),
        shipping: z.number(),
        total: z.number(),
        shopId: z.string(),
        items: z.array(
          z.object({
            productId: z.string(),
            quantity: z.number().min(1),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        await axios.post<ApiResponseProps<null>>(
          `${env.API_URL}/shop/create-order`,
          input,
        );
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
});
