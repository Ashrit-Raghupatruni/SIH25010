import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "bot";
  content: string;
}

const AgriAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hello! I am AgriBot, your agricultural assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/chat/", {
        message: userMessage,
        language: language,
        context: ""
      });

      setMessages(prev => [...prev, { role: "bot", content: response.data.response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "bot", content: "Sorry, I am having trouble connecting to the server. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center mb-6 pt-4">
        <h1 className="text-3xl font-bold text-green-700 flex items-center gap-2">
          <Bot className="w-8 h-8" /> Agri Assistant
        </h1>
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-700 font-medium"
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Telugu">Telugu</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 p-4 mb-4 flex flex-col gap-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 flex gap-3 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-green-600 text-white rounded-br-sm' 
                : 'bg-white text-gray-800 border border-green-100 rounded-bl-sm'
            }`}>
              {msg.role === 'bot' && (
                <div className="shrink-0 mt-0.5">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              )}
              
              <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="shrink-0 mt-0.5">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] bg-white rounded-2xl rounded-bl-sm p-4 flex gap-3 items-center border border-green-100 shadow-sm">
               <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-green-600" />
               </div>
               <div className="flex gap-2 items-center">
                 <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                 <span className="text-gray-500 text-sm font-medium">Generating response...</span>
               </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 flex items-center gap-2 shrink-0">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask your farming questions here..."
          className="flex-1 resize-none bg-transparent p-3 outline-none max-h-32 min-h-[50px] text-[15px] text-gray-700"
          rows={1}
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="bg-green-600 text-white p-3 md:px-6 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
        >
          <Send className="w-5 h-5" />
          <span className="hidden md:inline font-semibold">Send Message</span>
        </button>
      </div>
    </div>
  );
};

export default AgriAssistant;