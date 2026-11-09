import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";

import {
  createConversationHandler,
  getConversationsHandler,
  getConversationHandler,
  renameConversationHandler,
  deleteConversationHandler,
  createMessageHandler,
} from "./conversation.controller.js";

const router = Router();

router.use(authenticate);

// Create a conversation
router.post("/", createConversationHandler);

// List all conversations
router.get("/", getConversationsHandler);

// Get one conversation with its messages
router.get("/:id", getConversationHandler);

// Rename a conversation
router.patch("/:id", renameConversationHandler);

// Delete a conversation
router.delete("/:id", deleteConversationHandler);

// Save a user message
router.post("/:id/messages", createMessageHandler);

export default router;
