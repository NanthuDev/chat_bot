import type { Request, Response, NextFunction } from "express";

import {
  createConversation,
  getUserConversations,
  getConversation,
  renameConversation,
  deleteConversation,
  createUserMessage,
} from "./conversation.service.js";

import {
  createConversationSchema,
  updateConversationSchema,
  createMessageSchema,
  conversationIdSchema,
} from "./conversation.validation.js";

import { AppError } from "../../shared/errors/app-error.js";

function getUserId(req: Request): string {
  if (!req.user?.id) {
    throw new AppError(401, "Authentication required");
  }

  return req.user.id;
}

export async function createConversationHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = getUserId(req);
    const input = createConversationSchema.parse(req.body);

    const conversation = await createConversation(userId, input.title);

    res.status(201).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
}

export async function getConversationsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = getUserId(req);

    const conversations = await getUserConversations(userId);

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
}

export async function getConversationHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = getUserId(req);
    const { id } = conversationIdSchema.parse(req.params);

    const conversation = await getConversation(userId, id);

    if (!conversation) {
      throw new AppError(404, "Conversation not found");
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
}

export async function renameConversationHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = getUserId(req);
    const { id } = conversationIdSchema.parse(req.params);
    const input = updateConversationSchema.parse(req.body);

    const conversation = await renameConversation(userId, id, input.title);

    if (!conversation) {
      throw new AppError(404, "Conversation not found");
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteConversationHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = getUserId(req);
    const { id } = conversationIdSchema.parse(req.params);

    const deleted = await deleteConversation(userId, id);

    if (!deleted) {
      throw new AppError(404, "Conversation not found");
    }

    res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function createMessageHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = getUserId(req);
    const { id } = conversationIdSchema.parse(req.params);
    const input = createMessageSchema.parse(req.body);

    const message = await createUserMessage(userId, id, input.content);

    if (!message) {
      throw new AppError(404, "Conversation not found");
    }

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
}
