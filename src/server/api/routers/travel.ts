import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import axios, { AxiosError } from "axios";
import { env } from "process";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const travelRouter = createTRPCRouter({
  getApplicationStatus: protectedProcedure.query(async ({ ctx }) => {
    try {
      const response = await axios.get<ApiResponseProps<TravelPlanerProps>>(
        `${env.API_URL}/travel/application-status/${ctx.session.user.id}`,
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
  getAllTravelPlanners: publicProcedure.query(async () => {
    try {
      const response = await axios.get<ApiResponseProps<TravelPlanerProps[]>>(
        `${env.API_URL}/travel/all`,
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
  getTravelPlannerFilterOptions: publicProcedure.query(async () => {
    try {
      const response = await axios.get<
        ApiResponseProps<TravelPlannerFilterOptions>
      >(`${env.API_URL}/travel/filters`);
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
  // getTravelPlannerById: publicProcedure
  //   .input(z.object({ travelPlanerId: z.string() }))
  //   .query(async ({ input }) => {
  //     try {
  //       const response = await axios.get<ApiResponseProps<TravelPlanerProps>>(
  //         `${env.API_URL}/travel/detail/${input.travelPlanerId}`,
  //       );
  //       return response.data.data;
  //     } catch (error) {
  //       if (error instanceof TRPCClientError) {
  //         console.error(error.message);
  //         throw new TRPCError({
  //           message: error.message,
  //           code: "NOT_FOUND",
  //         });
  //       } else if (error instanceof AxiosError) {
  //         const axiosError = error as AxiosError<{ errors: string[] }>;
  //         console.error(axiosError.response?.data.errors);
  //         throw new TRPCError({
  //           message:
  //             Array.isArray(
  //               (error.response?.data as { errors: string[] }).errors,
  //             ) &&
  //             typeof (error.response?.data as { errors: string[] })
  //               .errors[0] === "string"
  //               ? (error.response?.data as { errors: string[] }).errors[0]
  //               : "Unknown error",
  //           code: "BAD_REQUEST",
  //         });
  //       }
  //       console.error(error);
  //       throw new TRPCError({
  //         message: "Something went wrong",
  //         code: "INTERNAL_SERVER_ERROR",
  //       });
  //     }
  //   }),
   createBooking: publicProcedure
    .input(
      z.object({
        travelPlanerId: z.string(),
        tourId: z.string(),
        startDate: z.string(),
        endDate: z.string().nullish(),
        numberOfPeople: z.number().min(1),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        phone: z.string(),
        additionalRequests: z.string().optional(),
        totalAmount: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        // Format the data for the API request
        const bookingData = {
          travelPlanerId: input.travelPlanerId,
          tourId: input.tourId,
          startDate: input.startDate,
          endDate: input.endDate ?? input.startDate,
          numberOfPeople: input.numberOfPeople,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          additionalNote: input.additionalRequests ?? "",
          totalAmount: input.totalAmount
        };
        
        await axios.post<ApiResponseProps<{ bookingId: string }>>(
          `${env.API_URL}/travel/create-booking`,
          bookingData
        );
        
       
      } catch (error) {
        if (error instanceof AxiosError) {
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
                : "Failed to create booking",
            code: "BAD_REQUEST",
          });
        }
        
        console.error(error);
        throw new TRPCError({
          message: "Something went wrong with the booking process",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  getTravelPlannerDetailById: publicProcedure
    .input(z.object({ travelPlannerId: z.string() }))
    .query(async ({ input }) => {
      try {
        const response = await axios.get<ApiResponseProps<TravelPlanerDetailProps>>(
          `${env.API_URL}/travel/detail/${input.travelPlannerId}`,
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
});
