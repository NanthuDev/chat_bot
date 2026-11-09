import { prisma } from "../../config/database.js";

export async function createConversation(userId: string, title?: string) {
  return prisma.conversation.create({
    data: {
      userId,
      title: title ?? "New conversation",
    },
  });
}

export async function getUserConversations(userId: string) {
  return prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getConversation(userId: string, conversationId: string) {
  return prisma.conversation.findFirst({
    where: {
      id: conversationId,
      userId,
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function renameConversation(
  userId: string,
  conversationId: string,
  title: string,
) {
  const result = await prisma.conversation.updateMany({
    where: {
      id: conversationId,
      userId,
    },
    data: { title },
  });

  if (result.count === 0) {
    return null;
  }

  return prisma.conversation.findFirst({
    where: {
      id: conversationId,
      userId,
    },
  });
}

export async function deleteConversation(
  userId: string,
  conversationId: string,
) {
  const result = await prisma.conversation.deleteMany({
    where: {
      id: conversationId,
      userId,
    },
  });

  return result.count > 0;
}

export async function createUserMessage(
  userId: string,
  conversationId: string,
  content: string,
) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      userId,
    },
    select: { id: true },
  });

  if (!conversation) {
    return null;
  }

  return prisma.message.create({
    data: {
      conversationId,
      role: "USER",
      content,
    },
  });
}
