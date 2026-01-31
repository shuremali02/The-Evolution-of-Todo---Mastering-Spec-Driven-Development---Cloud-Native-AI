/**
 * Task: T030, T024, T025, T026, T027, T028, T029, T065
 * Spec: Enhanced Chatbot UI with Floating Icon - Enhanced ChatInterface with quick suggestions and MCP error handling
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext'; // Auth context with named export
import { apiClient } from '@/lib/api'; // Using the main API client
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
  const [showHistory, setShowHistory] = useState(false); // For mobile view
  const [showSidebar, setShowSidebar] = useState(true); // For desktop sidebar toggle
  const { user, token } = useAuth(); // Assuming auth context provides user and token
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
          // Use the actual API endpoint to fetch conversation list
          const response = await apiClient.listConversations();

          // Process conversations to generate titles if needed
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
        id: Math.random().toString(36).substr(2, 9), // Generate temporary ID
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.timestamp || Date.now()),
        tool_calls: msg.tool_calls,
      }));

      setMessages(history);
      setConversationId(convId);

      // Update the conversation in the list if it exists
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

  // Function to generate conversation title based on first message
  const generateConversationTitle = (firstMessage: string): string => {
    // Take first 30 characters of the first message and append "..." if longer
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
        id: Math.random().toString(36).substr(2, 9), // Generate temporary ID
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.timestamp || Date.now()),
        tool_calls: msg.tool_calls,
      }));

      setMessages(history);
    } catch (error) {
      console.error('Error loading conversation history:', error);
      // Show user-friendly error message
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

    // Add user message to UI immediately
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
      // Send message to backend
      const response = await apiClient.sendMessage(conversationId, inputValue);

      const aiMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        tool_calls: response.tool_calls,
      };

      // Update conversation ID if it's the first message
      if (!conversationId) {
        setConversationId(response.conversation_id);
        // Update the conversation list with the new conversation
        const newConv = {
          id: response.conversation_id,
          title: inputValue ? generateConversationTitle(inputValue) : 'New Conversation',
          first_message: inputValue,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setConversations(prev => [newConv, ...prev]);
      } else {
        // Update the existing conversation's updated_at time
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

      // Handle different types of errors with user-friendly messages
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

      // Add error message to UI
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
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[500px] max-h-[80vh] md:max-h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">AI Task Assistant</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowHistory(true)}
              className="px-3 py-1 text-sm bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-md transition-all duration-200 md:hidden"
              title="View chat history"
            >
              📋
            </button>
            <button
              onClick={startNewConversation}
              className="px-3 py-1 text-sm bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-md transition-all duration-200"
              title="Start new conversation"
            >
              + New Chat
            </button>
            {showSidebar && (
              <button
                onClick={() => setShowSidebar(false)}
                className="px-3 py-1 text-sm bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-md transition-all duration-200 hidden md:block"
                title="Hide sidebar"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area - Split between history and messages */}
      <div className="flex flex-1 overflow-hidden">
        {/* Conversation History Sidebar - Collapsible */}
        {showSidebar && (
          <div className={`border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto ${showHistory ? 'block w-64' : 'hidden md:block w-64'}`}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-800 dark:text-white">Recent Chats</h3>
                {showHistory && (
                  <button
                    onClick={() => setShowHistory(false)}
                    className="md:hidden text-gray-500 hover:text-gray-700"
                    title="Close chat history"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {conversations.length > 0 ? (
                  conversations.map((conv: any) => (
                    <button
                      key={conv.id}
                      onClick={() => {
                        loadConversation(conv.id);
                        if (window.innerWidth < 768) {
                          setShowHistory(false);
                        }
                      }}
                      className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 truncate"
                      title={conv.title || (conv.first_message ? generateConversationTitle(conv.first_message) : 'Untitled conversation')}
                    >
                      <div className="font-medium truncate">
                        {conv.title || (conv.first_message ? generateConversationTitle(conv.first_message) : 'Untitled conversation')}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(conv.updated_at || conv.created_at).toLocaleDateString()}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-sm text-gray-600 dark:text-gray-400 italic p-2">
                    No conversations yet
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Toggle button for sidebar when hidden */}
        {!showSidebar && (
          <div className="absolute left-0 top-1/2 z-20">
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 bg-blue-500 text-white rounded-r-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Show recent chats"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[40vh] md:max-h-[50vh] bg-gray-50 dark:bg-gray-800">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
            <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">Welcome to AI Task Assistant</h3>
            <p className="max-w-md mb-4">
              I can help you manage your tasks using natural language. Try saying things like:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-lg">
              <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow text-sm">
                "Add a task to buy groceries"
              </div>
              <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow text-sm">
                "Show me all my tasks"
              </div>
              <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow text-sm">
                "Mark task 3 as complete"
              </div>
              <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow text-sm">
                "Delete the meeting task"
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="whitespace-pre-wrap break-words">{message.content}</div>
                {message.tool_calls && message.tool_calls.length > 0 && (
                  <div className="mt-2 text-xs opacity-75">
                    <details className="text-xs">
                      <summary className="cursor-pointer hover:underline text-blue-600 dark:text-blue-400">
                        Show technical details
                      </summary>
                      <div className="mt-2 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <p className="text-xs mb-1 font-medium text-gray-600 dark:text-gray-300">Tool Activity:</p>
                        <pre className="text-xs bg-black bg-opacity-10 dark:bg-white dark:bg-opacity-10 p-2 rounded overflow-x-auto whitespace-pre-wrap">
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
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl px-4 py-3 max-w-[85%] border border-gray-200 dark:border-gray-600 rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>

    {/* Input Area */}
    <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message AI Task Assistant..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white max-h-32"
            rows={2}
            disabled={isLoading || !user?.id}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading || !user?.id}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </form>

        {/* Quick Suggestions */}
        {user?.id && (
          <QuickSuggestions onSelectSuggestion={handleSuggestionClick} />
        )}

        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
          <span>{user ? 'You are logged in' : 'Please log in to use the chatbot'}</span>
          <span>AI Assistant</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;