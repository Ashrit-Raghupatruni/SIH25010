import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, X, Mic, Send, Volume2, MicOff, VolumeX } from 'lucide-react';
import axios from 'axios';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const API_URL = "http://localhost:8000";

const AgriBot = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'bot' | 'user', text: string }[]>([
    { sender: 'bot', text: 'Hello! I am your AgriBot. How can I assist you with your crops today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle SpeechRecognition transcript updates
  useEffect(() => {
    if (transcript && !listening) {
      setInputText(transcript);
    } else if (transcript && listening) {
      setInputText(transcript);
    }
  }, [transcript, listening]);

  // Update greeting when language changes
  useEffect(() => {
    let greeting = "Hello! I am your AgriBot. How can I assist you with your crops today?";
    if (i18n.language === 'te') greeting = "నమస్కారం! నేను మీ అగ్రిబాట్. ఈరోజు మీ పంటల విషయంలో నేను ఎలా సహాయపడగలను?";
    if (i18n.language === 'hi') greeting = "नमस्ते! मैं आपका एग्रीबॉट हूँ। आज मैं आपकी फसलों में कैसे मदद कर सकता हूँ?";

    setMessages([{ sender: 'bot', text: greeting }]);
  }, [i18n.language]);

  const speakText = (text: string, langCode: string) => {
    if (!autoSpeak) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // map i18n codes to SpeechSynthesis codes
    const voiceLangMap: Record<string, string> = {
      'en': 'en-IN',
      'te': 'te-IN',
      'hi': 'hi-IN'
    };

    utterance.lang = voiceLangMap[langCode] || 'en-US';
    utterance.rate = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    const textToSend = inputText.trim();
    if (!textToSend) return;

    // Reset speech recognition stuff
    resetTranscript();
    setInputText('');
    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);

    try {
      // Get context from local storage if available (mocked for now, assumes other components save it)
      const recentSoil = localStorage.getItem('recentSoilResult') || '';
      const recentDisease = localStorage.getItem('recentDiseaseResult') || '';
      const contextStr = `Soil context: ${recentSoil}. Disease context: ${recentDisease}`;

      const response = await axios.post(`${API_URL}/api/chat/`, {
        message: textToSend,
        language: i18n.language || 'en',
        context: contextStr
      });

      const botReply = response.data.response;
      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);

      speakText(botReply, i18n.language || 'en');
    } catch (error) {
      console.error("Chatbot error", error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am having trouble connecting to the server.' }]);
    }
  };

  const toggleListen = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      // Map locales
      const voiceLangMap: Record<string, string> = { 'en': 'en-IN', 'te': 'te-IN', 'hi': 'hi-IN' };
      SpeechRecognition.startListening({
        continuous: true,
        language: voiceLangMap[i18n.language || 'en'] || 'en-US'
      });
    }
  };

  // Toggle voice response output
  const toggleSpeaker = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setAutoSpeak(!autoSpeak);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`${isOpen ? 'hidden' : 'flex'} fixed bottom-6 right-6 bg-krishi-green text-red-500 p-4 rounded-full shadow-xl hover:bg-krishi-darkGreen transition-all z-50 animate-bounce items-center justify-center`}
      >
        <Bot size={28} />
      </button>

      {/* Chat Window */}
      <div className={`${isOpen ? 'flex' : 'hidden'} fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex-col overflow-hidden z-50 border border-gray-100 h-[500px] transition-all duration-300 ease-in-out`}>
        {/* Header */}
        <div className="bg-krishi-green text-black p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bot size={24} />
            <h3 className="font-semibold text-lg">AgriBot Assistant</h3>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={toggleSpeaker} className="text-black/80 hover:text-black transition-colors" title="Toggle Auto-Voice">
              {autoSpeak ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button onClick={() => setIsOpen(false)} className="text-black/80 hover:text-black transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'user' ? 'bg-krishi-green text-black rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isSpeaking && (
            <div className="flex justify-start">
              <div className="bg-krishi-green/10 text-krishi-green p-2 rounded-2xl text-xs flex items-center shadow-sm">
                <Volume2 size={14} className="mr-1 animate-pulse" /> Speaking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200">
            {browserSupportsSpeechRecognition && (
              <button
                onClick={toggleListen}
                className={`p-2 rounded-lg transition-colors ${listening ? 'bg-red-100 text-red-500 animate-pulse' : 'text-gray-500 hover:bg-gray-200'}`}
              >
                {listening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            )}

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about crops, soil, weather..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-3 text-gray-700 outline-none"
            />

            <button
              onClick={handleSend}
              disabled={!inputText.trim() && !listening}
              className="p-2 bg-krishi-green text-black rounded-lg hover:bg-krishi-darkGreen transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
          {listening && <p className="text-xs text-center text-krishi-green mt-2 animate-pulse font-medium">Listening...</p>}
        </div>
      </div>
    </>
  );
};

export default AgriBot;
