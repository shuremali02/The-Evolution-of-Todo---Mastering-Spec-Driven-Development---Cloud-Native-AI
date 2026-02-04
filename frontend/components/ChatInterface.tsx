/**
 * Task: T033, T034, T035, T036
 * Spec: 012-AI-Powered UI Enhancements
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiZap, FiBook, FiInfo, FiArrowRight, FiPlus, FiX, FiChevronLeft } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api';
import { QuickSuggestions } from './QuickSuggestions';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tool_calls?: any[];
}

interface ChatProps {
  initialConversationId?: string;
}

const ChatInterface: React.FC<ChatProps> = ({ initialConversationId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(initialConversationId || null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(true); // Show history by default (mobile-like behavior)
  const [showSidebar, setShowSidebar] = useState(false); // Hide sidebar initially, will be controlled by showHistory
  const [showInstructions, setShowInstructions] = useState(false); // Don't show instructions initially
  const { user, token } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load conversation history if conversationId is provided
  useEffect(() => {
    if (conversationId && user?.id) {
      loadConversationHistory();
    }
  }, [conversationId, user?.id]);

  // Load conversation list
  useEffect(() => {
    const fetchConversations = async () => {
      if (user?.id && token) {
        try {
          const response = await apiClient.listConversations();

          const processedConversations = response.conversations?.map((conv: any) => ({
            ...conv,
            title: conv.title || (conv.first_message ? generateConversationTitle(conv.first_message) : 'Untitled conversation')
          })) || [];

          setConversations(processedConversations);
        } catch (error) {
          console.error('Error loading conversation list:', error);
        }
      }
    };

    fetchConversations();
  }, [user?.id, token]);

  const loadConversation = async (convId: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.getConversationHistory(convId);

      const history = response.history.map((msg: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.timestamp || Date.now()),
        tool_calls: msg.tool_calls,
      }));

      setMessages(history);
      setConversationId(convId);

      if (history.length > 0) {
        const firstMessage = history.find((msg: any) => msg.role === 'user');
        if (firstMessage) {
          setConversations(prev =>
            prev.map(conv =>
              conv.id === convId
                ? {...conv, title: generateConversationTitle(firstMessage.content)}
                : conv
            )
          );
        }
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateConversationTitle = (firstMessage: string): string => {
    if (firstMessage.length > 30) {
      return firstMessage.substring(0, 30) + '...';
    }
    return firstMessage;
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversationHistory = async () => {
    if (!conversationId || !user?.id || !token) return;

    try {
      setIsLoading(true);
      const response = await apiClient.getConversationHistory(conversationId);

      const history = response.history.map((msg: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.timestamp || Date.now()),
        tool_calls: msg.tool_calls,
      }));

      setMessages(history);
    } catch (error) {
      console.error('Error loading conversation history:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          role: 'assistant',
          content: 'Unable to load conversation history. Starting a new conversation.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !user?.id || !token) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await apiClient.sendMessage(conversationId, inputValue);

      const aiMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        tool_calls: response.tool_calls,
      };

      if (!conversationId) {
        setConversationId(response.conversation_id);
        const newConv = {
          id: response.conversation_id,
          title: inputValue ? generateConversationTitle(inputValue) : 'New Conversation',
          first_message: inputValue,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setConversations(prev => [newConv, ...prev]);
      } else {
        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? {...conv, updated_at: new Date().toISOString()}
              : conv
          )
        );
      }

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      let errorMessage = 'Sorry, I encountered an error processing your request. Please try again.';

      if (error instanceof Error) {
        if (error.message.includes('MCP')) {
          errorMessage = 'The AI assistant is temporarily unavailable. Please try again in a moment.';
        } else if (error.message.includes('401') || error.message.includes('unauthorized')) {
          errorMessage = 'Your session has expired. Please log in again.';
        } else if (error.message.includes('network') || error.message.includes('500')) {
          errorMessage = 'Service is temporarily unavailable. Please try again in a moment.';
        }
      }

      const errorMsg: Message = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setConversationId(null);
    setInputValue('');
    setShowInstructions(true); // Show instructions for new conversation
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Pro Tips for AI usage
  const proTips = [
    "Be specific with your requests (e.g., 'Add a task to buy groceries by tomorrow evening')",
    "Use natural language like 'Show me urgent tasks due this week'",
    "Ask for summaries: 'Give me a weekly overview of my tasks'",
    "Combine multiple requests: 'Create a task and set a reminder'"
  ];

  return (
    <div className="flex flex-col h-full min-h-[500px] max-h-[80vh] md:max-h-[600px] bg-gradient-ai rounded-lg shadow-xl overflow-hidden border border-white/20 backdrop-blur-sm">
      {/* Header with AI-themed styling */}
      <div className="bg-gradient-ai p-4 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FiMessageSquare className="text-xl" />
            <h2 className="text-xl font-semibold">AI Task Assistant</h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-md transition-all duration-200 flex items-center gap-1"
              title={showHistory ? "Hide chat history" : "View chat history"}
            >
              <FiBook />
              <span className="ml-1">{showHistory ? "Hide" : "History"}</span>
            </button>
            <button
              onClick={startNewConversation}
              className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-md transition-all duration-200 flex items-center gap-1"
              title="Start new conversation"
            >
              <FiPlus />
              <span className="ml-1">New Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - With history sidebar always visible */}
      <div className="flex flex-1 overflow-hidden">
        {/* Conversation History Sidebar - Always shown like mobile */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: showHistory ? '16rem' : '0', opacity: showHistory ? 1 : 0 }}
          className={`border-r border-white/20 bg-white/10 backdrop-blur-md overflow-y-auto ${showHistory ? 'block w-64' : 'hidden'}`}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-white flex items-center gap-1">
                <FiBook className="mr-1" /> Recent Chats
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-white/80 hover:text-white"
                title="Close chat history"
              >
                <FiX />
              </button>
            </div>
            <div className="space-y-2">
              {conversations.length > 0 ? (
                conversations.map((conv: any) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      loadConversation(conv.id);
                      // On desktop, keep history open after selecting a conversation
                    }}
                    className="w-full text-left p-2 rounded hover:bg-white/10 text-sm text-white/90 truncate"
                    title={conv.title || (conv.first_message ? generateConversationTitle(conv.first_message) : 'Untitled conversation')}
                  >
                    <div className="font-medium truncate">
                      {conv.title || (conv.first_message ? generateConversationTitle(conv.first_message) : 'Untitled conversation')}
                    </div>
                    <div className="text-xs text-white/70">
                      {new Date(conv.updated_at || conv.created_at).toLocaleDateString()}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-sm text-white/60 italic p-2">
                  No conversations yet
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Messages Container */}
        <div className={`${showHistory ? 'flex-1' : 'flex-1'} overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[40vh] md:max-h-[50vh] bg-black/10 backdrop-blur-sm`}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-white/90">
              {showInstructions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-lg"
                >
                  <div className="mb-6 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                    <div className="flex items-center gap-2 mb-3">
                      <FiMessageSquare className="text-xl text-blue-300" />
                      <h3 className="text-lg font-semibold">Welcome to AI Task Assistant</h3>
                    </div>
                    <p className="mb-4">
                      I'm your AI-powered task management assistant. I can help you create, manage, and organize your tasks using natural language.
                    </p>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2 flex items-center gap-1">
                        <FiArrowRight className="text-blue-300" /> How to use me:
                      </h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-start">
                          <span className="text-blue-300 mr-2">•</span>
                          <span>Add tasks: "Add a task to buy groceries"</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-300 mr-2">•</span>
                          <span>View tasks: "Show me all my tasks"</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-300 mr-2">•</span>
                          <span>Update tasks: "Mark task 3 as complete"</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-300 mr-2">•</span>
                          <span>Delete tasks: "Delete the meeting task"</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2 flex items-center gap-1">
                        <FiInfo className="text-yellow-300" /> Pro Tips:
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {proTips.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-yellow-300 mr-2">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-xs text-white/70">
                      <button
                        onClick={() => setShowInstructions(false)}
                        className="text-blue-300 hover:text-blue-200 underline"
                      >
                        Hide instructions
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-lg">
                    {[
                      "Add a task to buy groceries",
                      "Show me all my tasks",
                      "Mark task 3 as complete",
                      "Delete the meeting task"
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-lg border border-white/20 text-left text-sm transition-all duration-200"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {!showInstructions && (
                <div className="flex flex-col items-center justify-center h-full text-center text-white/70">
                  <div className="mb-4 p-3 bg-white/10 backdrop-blur-md rounded-full">
                    <FiMessageSquare className="h-12 w-12 text-blue-300 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                  <p>Send a message to begin interacting with your AI assistant</p>
                </div>
              )}
            </div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-[hsl(217,91%,60%)] to-[hsl(280,65%,60%)] text-white rounded-br-none'
                      : 'bg-white/10 text-white backdrop-blur-md rounded-bl-none border border-white/20'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  {message.tool_calls && message.tool_calls.length > 0 && (
                    <div className="mt-2 text-xs opacity-75">
                      <details className="text-xs">
                        <summary className="cursor-pointer hover:underline text-blue-300">
                          Show technical details
                        </summary>
                        <div className="mt-2 bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                          <p className="text-xs mb-1 font-medium text-blue-200">Tool Activity:</p>
                          <pre className="text-xs bg-black/20 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(message.tool_calls, null, 2)}
                          </pre>
                        </div>
                      </details>
                    </div>
                  )}
                  <div className="text-xs opacity-75 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))
          )}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/10 text-white backdrop-blur-md rounded-2xl px-4 py-3 max-w-[85%] border border-white/20 rounded-bl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-white/20 p-4 bg-black/10 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message AI Task Assistant..."
            className="flex-1 border border-white/20 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/10 text-white placeholder-white/50 max-h-32 backdrop-blur-md"
            rows={2}
            disabled={isLoading || !user?.id}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading || !user?.id}
            className="px-4 py-2 bg-gradient-ai hover:from-[hsl(217,91%,50%)] hover:to-[hsl(280,65%,50%)] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
          >
            <FiArrowRight className="h-5 w-5" />
          </button>
        </form>

        {/* Quick Suggestions */}
        {user?.id && (
          <QuickSuggestions onSelectSuggestion={handleSuggestionClick} />
        )}

        <div className="mt-2 text-xs text-white/70 flex justify-between">
          <span>{user ? '🔒 Secure AI Session Active' : '🔐 Please log in to use the chatbot'}</span>
          <span className="flex items-center gap-1">
            <FiMessageSquare className="text-blue-300" /> AI Assistant
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;