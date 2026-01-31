/**
 * Task: T033
 * Spec: 010-ai-chatbot/spec.md - Chat Interface Tests
 *
 * Unit tests for the ChatInterface component to verify the complete user flow
 * for the AI chatbot functionality.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useAuth } from '@/context/auth-context';
import { apiClient } from '@/lib/api';
import ChatInterface from '@/components/ChatInterface';

// Mock the dependencies
jest.mock('@/context/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/lib/api', () => ({
  apiClient: {
    sendMessage: jest.fn(),
    getConversationHistory: jest.fn(),
    listConversations: jest.fn(),
  },
}));

// Mock the AuthGuard component
jest.mock('@/components/AuthGuard', () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock the LoadingSpinner component
jest.mock('@/components/LoadingSpinner', () => ({
  LoadingSpinner: () => <div>Loading...</div>,
}));

describe('ChatInterface', () => {
  const mockUser = {
    id: 'user123',
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockToken = 'mock-jwt-token';

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      token: mockToken,
      isLoading: false,
    });

    jest.clearAllMocks();
  });

  it('renders the chat interface with welcome message when no messages exist', () => {
    render(<ChatInterface />);

    expect(screen.getByText('AI Task Assistant')).toBeInTheDocument();
    expect(screen.getByText('Welcome to AI Task Assistant')).toBeInTheDocument();
    expect(screen.getByText('Add a task to buy groceries')).toBeInTheDocument();
    expect(screen.getByText('Message AI Task Assistant...')).toBeInTheDocument();
  });

  it('allows user to type and submit a message', async () => {
    // Mock the API response for sending a message
    const mockApiResponse = {
      conversation_id: 'conv123',
      response: 'I have added the task "Buy groceries" to your list.',
      tool_calls: [{ name: 'add_task', arguments: { title: 'Buy groceries' } }],
    };

    (apiClient.sendMessage as jest.Mock).mockResolvedValue(mockApiResponse);

    render(<ChatInterface />);

    // Find the textarea and type a message
    const textarea = screen.getByPlaceholderText('Message AI Task Assistant...');
    fireEvent.change(textarea, { target: { value: 'Add a task to buy groceries' } });

    // Submit the message
    const sendButton = screen.getByRole('button', { name: '' }); // The send button with SVG
    fireEvent.click(sendButton);

    // Wait for the API call to complete
    await waitFor(() => {
      expect(apiClient.sendMessage).toHaveBeenCalledWith(null, 'Add a task to buy groceries');
    });

    // Check that the response is displayed
    await waitFor(() => {
      expect(screen.getByText('I have added the task "Buy groceries" to your list.')).toBeInTheDocument();
    });
  });

  it('loads conversation history when conversationId is provided', async () => {
    const initialConversationId = 'conv456';

    const mockHistoryResponse = {
      conversation_id: initialConversationId,
      history: [
        {
          role: 'user',
          content: 'Hello',
          timestamp: new Date().toISOString(),
        },
        {
          role: 'assistant',
          content: 'Hi there! How can I help you?',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    (apiClient.getConversationHistory as jest.Mock).mockResolvedValue(mockHistoryResponse);

    render(<ChatInterface initialConversationId={initialConversationId} />);

    // Wait for the history to load
    await waitFor(() => {
      expect(apiClient.getConversationHistory).toHaveBeenCalledWith(initialConversationId);
    });

    // Check that the history messages are displayed
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there! How can I help you?')).toBeInTheDocument();
  });

  it('shows loading state when submitting a message', async () => {
    // Mock a delayed API response to test loading state
    (apiClient.sendMessage as jest.Mock).mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            conversation_id: 'conv123',
            response: 'Test response',
            tool_calls: [],
          });
        }, 100);
      });
    });

    render(<ChatInterface />);

    // Type and submit a message
    const textarea = screen.getByPlaceholderText('Message AI Task Assistant...');
    fireEvent.change(textarea, { target: { value: 'Test message' } });

    const sendButton = screen.getByRole('button', { name: '' });
    fireEvent.click(sendButton);

    // Check that loading indicator appears
    expect(screen.getByText(/animate-bounce/)).toBeInTheDocument();

    // Wait for the response to complete
    await waitFor(() => {
      expect(screen.getByText('Test response')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock an API error
    (apiClient.sendMessage as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<ChatInterface />);

    // Type and submit a message
    const textarea = screen.getByPlaceholderText('Message AI Task Assistant...');
    fireEvent.change(textarea, { target: { value: 'Test message' } });

    const sendButton = screen.getByRole('button', { name: '' });
    fireEvent.click(sendButton);

    // Wait for the error handling
    await waitFor(() => {
      expect(screen.getByText('Sorry, I encountered an error processing your request. Please try again.')).toBeInTheDocument();
    });
  });

  it('starts a new conversation when new chat button is clicked', () => {
    render(<ChatInterface />);

    // Initially, there should be welcome content
    expect(screen.getByText('Welcome to AI Task Assistant')).toBeInTheDocument();

    // Add a message to the chat
    const textarea = screen.getByPlaceholderText('Message AI Task Assistant...');
    fireEvent.change(textarea, { target: { value: 'Test message' } });

    // Click the new chat button
    const newChatButton = screen.getByText('+ New Chat');
    fireEvent.click(newChatButton);

    // After clicking new chat, the messages should be cleared
    expect(screen.getByPlaceholderText('Message AI Task Assistant...')).toHaveValue('');
  });

  it('disables input when user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      token: null,
      isLoading: false,
    });

    render(<ChatInterface />);

    const textarea = screen.getByPlaceholderText('Message AI Task Assistant...');
    expect(textarea).toBeDisabled();
  });

  it('shows proper user identification', () => {
    render(<ChatInterface />);

    expect(screen.getByText('You are logged in')).toBeInTheDocument();
  });
});