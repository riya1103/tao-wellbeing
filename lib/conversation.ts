// Conversation manager — stores chat history in localStorage.

export interface Message {
  role: "user" | "assistant";
  content: string;
  principle?: string;
  engine?: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "tao-conversations";
const MAX_CONVERSATIONS = 20;
const MAX_MESSAGES_PER_CONVERSATION = 50;

/**
 * Generate a simple ID.
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/**
 * Get all conversations.
 */
export function getConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save conversations to localStorage.
 */
function saveConversations(conversations: Conversation[]): void {
  if (typeof window === "undefined") return;
  // Keep only the most recent
  const trimmed = conversations.slice(-MAX_CONVERSATIONS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

/**
 * Create a new conversation.
 */
export function createConversation(): Conversation {
  const conv: Conversation = {
    id: generateId(),
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const conversations = getConversations();
  conversations.push(conv);
  saveConversations(conversations);
  return conv;
}

/**
 * Get a conversation by ID.
 */
export function getConversation(id: string): Conversation | null {
  return getConversations().find((c) => c.id === id) || null;
}

/**
 * Add a message to a conversation.
 */
export function addMessage(
  conversationId: string,
  message: Omit<Message, "timestamp">,
): Conversation | null {
  const conversations = getConversations();
  const conv = conversations.find((c) => c.id === conversationId);
  if (!conv) return null;

  conv.messages.push({ ...message, timestamp: Date.now() });

  // Trim if too long
  if (conv.messages.length > MAX_MESSAGES_PER_CONVERSATION) {
    conv.messages = conv.messages.slice(-MAX_MESSAGES_PER_CONVERSATION);
  }

  conv.updatedAt = Date.now();
  saveConversations(conversations);
  return conv;
}

/**
 * Get the message history for sending to the AI.
 * Returns just role/content pairs (no metadata).
 */
export function getMessagesForAI(
  conversationId: string,
): { role: string; content: string }[] {
  const conv = getConversation(conversationId);
  if (!conv) return [];
  return conv.messages.map((m) => ({ role: m.role, content: m.content }));
}

/**
 * Delete a conversation.
 */
export function deleteConversation(id: string): void {
  const conversations = getConversations().filter((c) => c.id !== id);
  saveConversations(conversations);
}

/**
 * Get the most recent conversation.
 */
export function getLatestConversation(): Conversation | null {
  const conversations = getConversations();
  return conversations.length > 0 ? conversations[conversations.length - 1] : null;
}
