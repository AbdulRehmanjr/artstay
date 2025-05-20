// trpc/craft-documentor-router.ts
import { TRPCClientError } from "@trpc/client";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";
import axios, { AxiosError } from "axios";
import { z } from "zod";

export const craftDocumentorRouter = createTRPCRouter({
  getApplicationStatus: protectedProcedure.query(async ({ ctx }) => {
    try {
      const response = await axios.get<ApiResponseProps<CraftDocumentorProps>>(
        `${env.API_URL}/craft-documentor/application-status/${ctx.session.user.id}`,
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

  createProfile: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        profileImage: z.string().optional(),
        bio: z.string(),
        expertise: z.array(z.string()),
        location: z.string(),
        equipment: z.array(z.string()),
        yearsOfExperience: z.number(),
        documentationStyle: z.array(z.string()),
        mediaTypes: z.array(z.string()),
        portfolioLinks: z.array(z.string()).optional(),
        documentedCrafts: z.array(
          z.object({
            craftName: z.string(),
            region: z.string(),
            description: z.string(),
            mediaUrls: z.array(z.string()).optional(),
          })
        ).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await axios.post<ApiResponseProps<{ documentorId: string }>>(
          `${env.API_URL}/craft-documentor/create-profile`,
          {
            ...input,
            accountId: ctx.session.user.id,
          },
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
              typeof (error.response?.data as { errors: string[] }).errors[0] === "string"
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
