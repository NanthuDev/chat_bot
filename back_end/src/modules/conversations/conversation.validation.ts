import { z } from "zod";

export const createConversationSchema = z.object({
  title: z.string().trim().min(1).max(150).optional(),
});

export const updateConversationSchema = z.object({
  title: z.string().trim().min(1).max(150),
});

export const createMessageSchema = z.object({
  content: z.string().trim().min(1).max(20000),
});

export const conversationIdSchema = z.object({
  id: z.string().uuid(),
});
