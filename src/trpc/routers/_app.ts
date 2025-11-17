import { inngest } from "@/inngest/client";
import { protectedProcedure, createTRPCRouter } from "../init";
import prisma from "@/lib/db";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export const appRouter = createTRPCRouter({
  testAi: protectedProcedure.mutation(async ({ ctx }) => {
    const response = await inngest.send({
      name: "execute/ai",
    });
    return {
      success: true,
      message: "Job queued",
    };
  }),
  getWorkflows: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await inngest.send({
        name: "test/hello.world",
        data: {
          email: ctx.auth.user.email,
        },
      });
      return {
        success: true,
        message: "Job queued",
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
