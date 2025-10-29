import React, { useRef, useState, useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const audioContextRef = useRef(null);
  const isTypingRef = useRef(false);

  const { sendMessage, selectedUser } = useChatStore();
  const { emitTyping, emitStopTyping } = useAuthStore();

  // Initialize Audio Context for keyboard sound
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play keyboard pop sound
  const playKeySound = () => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Create a pleasant "pop" sound
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  };

  // Play message send sound
  const playSendSound = () => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Pleasant "whoosh" send sound
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  };

  const handleTyping = () => {
    if (!selectedUser) return;

    // Play keyboard sound
    playKeySound();

    // Emit typing event
    if (!isTypingRef.current) {
      emitTyping(selectedUser._id);
      isTypingRef.current = true;
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping(selectedUser._id);
      isTypingRef.current = false;
    }, 2000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    // Prevent double sending
    if (isSending) return;

    // Stop typing indicator
    if (isTypingRef.current) {
      emitStopTyping(selectedUser._id);
      isTypingRef.current = false;
    }

    // Store message data before clearing
    const messageData = {
      text: text.trim(),
      image: imagePreview
    };

    // Clear form IMMEDIATELY (optimistic UI)
    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Set sending state
    setIsSending(true);

    try {
      await sendMessage(messageData);

      // Play send sound after successful send
      playSendSound();

      // // Re-focus input after sending
      // setTimeout(() => {
      //   textInputRef.current?.focus();
      // }, 0);
    } catch (err) {
      console.log(`Failed To Send Messages`, err);
      toast.error("Failed to send message");

      // Restore message on error (optional)
      setText(messageData.text);
      setImagePreview(messageData.image);
    } finally {
      setIsSending(false);
    }
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingRef.current && selectedUser) {
        emitStopTyping(selectedUser._id);
      }
    };
  }, [selectedUser]);
return (
  <div className="p-1 py-4 w-full border-t border-base-300 bg-base-100">
    {imagePreview && (
      <div className="mb-3 flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
        <div className="relative group">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-xl border-2 border-primary/30 shadow-lg ring-2 ring-primary/10"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-error text-error-content
              flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    )}

    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
      <div className="flex-1 relative">
        <input
          type="text"
          className="w-full input input-bordered rounded-2xl input-md bg-base-200
            border-2 border-base-300 focus:border-primary focus:outline-none
            transition-all duration-200 pr-4 pl-4 py-3
            placeholder:text-base-content/50"
          placeholder="Type a message..."
          value={text}
          ref={textInputRef}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          disabled={isSending}
        />
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageChange}
      />

      <button
        type="button"
        className={`btn btn-circle btn-md border-2 transition-all duration-200
          ${imagePreview
            ? "bg-success/20 border-success text-success hover:bg-success hover:text-success-content"
            : "bg-base-200 border-base-300 text-base-content/60 hover:border-primary hover:text-primary"
          }`}
        onClick={() => fileInputRef.current?.click()}
        disabled={isSending}
      >
        <Image size={20} />
      </button>

      <button
        type="submit"
        className={`btn btn-circle btn-md transition-all duration-200
          ${(!text.trim() && !imagePreview) || isSending
            ? "bg-base-200 border-2 border-base-300 text-base-content/40"
            : "bg-primary border-2 border-primary text-primary-content hover:scale-105 shadow-lg shadow-primary/30"
          }`}
        disabled={(!text.trim() && !imagePreview) || isSending}
      >
        {isSending ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          <Send size={20} />
        )}
      </button>
    </form>
  </div>
);
};

export default MessageInput;