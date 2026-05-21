"use client";

import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import * as motion from "motion/react-client";

interface Message {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  createdAt: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/admin/messages");
      setMessages(response.data?.messages || []);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          return;
        }
      }
      console.error("Failed to fetch messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await axios.patch(`/api/admin/messages/${messageId}`);
      
      // Remove message from list
      setMessages(messages.filter(msg => msg._id !== messageId));
      
      // Close modal if it's the selected message
      if (selectedMessage?._id === messageId) {
        setSelectedMessage(null);
      }
      
      toast.success("Message deleted successfully");
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error("Failed to delete message");
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const truncateMessage = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="w-full">
      {/* Bell Icon Button */}
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="relative p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition"
        >
          <span className="text-2xl">🔔</span>
        </button>

        {/* Dropdown Messages List */}
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-12 right-0 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : messages.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No messages yet</div>
            ) : (
              <div className="divide-y">
                {messages.map((msg) => (
                  <button
                    key={msg._id}
                    onClick={() => {
                      setSelectedMessage(msg);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left p-3 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-700 text-sm">{msg.customerName}</div>
                        <div className="text-xs text-gray-500">{msg.customerEmail}</div>
                        <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {truncateMessage(msg.message, 60)}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl rounded-lg border border-gray-300 bg-white p-6"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-700">{selectedMessage.customerName}</h2>
                <p className="text-gray-600">{selectedMessage.customerEmail}</p>
                <p className="text-gray-600">{selectedMessage.customerPhone}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="my-4 border-t border-gray-200 pt-4">
              <div className="text-gray-700 whitespace-pre-wrap break-words">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 mt-6 border-t border-gray-200 pt-4">
              <button
                onClick={() => markAsRead(selectedMessage._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer hover:bg-red-700 transition"
              >
                Delete Message
              </button>
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
