import React, { useEffect, useState } from "react";
import axios from "axios";

interface ContactCard {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

const Support = () => {
  const [cardsData, setCardsData] = useState<ContactCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ContactCard[]>(
          "http://localhost:3000/api/v1/contact"
        );
        setCardsData(response.data);
      } catch (error) {
        console.error("Error fetching contact requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-white mt-10">
        Loading contact requests...
      </div>
    );
  }

  const handleSendReply = async (card: ContactCard) => {
    if (!replyMessage.trim()) return;
    try {
      await axios.post(
        `http://localhost:3000/api/v1/contact/reply/${card._id}`,
        { message: replyMessage }
      );
      setCardsData((prev) => prev.filter((c) => c._id !== card._id));
      alert(`Reply sent to ${card.name}`);
      setReplyMessage("");
      setReplyingToId(null);
    } catch (err) {
      console.error("Error sending reply:", err);
      alert("Failed to send reply");
    }
  };

  return (
    <div className="bg-slate-600 rounded-3xl p-8 text-white max-w-6xl mx-auto mt-10">
      <h1 className="text-3xl font-semibold text-center mb-10">
        Contact Support
      </h1>

      <div className="flex flex-wrap justify-center gap-6">
        {cardsData.map((card) => (
          <div
            key={card._id}
            className="bg-white text-gray-800 rounded-2xl p-6 w-72 shadow-lg transform hover:scale-105 transition-transform"
          >
            <h3 className="font-medium text-lg mb-2">{card.name}</h3>
            <p className="text-gray-500 text-sm mb-2">{card.email}</p>
            <p className="text-gray-700 text-sm">{card.message}</p>
            <p className="text-xs text-gray-400 mt-2">
              Submitted: {new Date(card.createdAt).toLocaleString()}
            </p>

            {replyingToId !== card._id && (
              <button
                className="mt-3 px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                onClick={() => setReplyingToId(card._id)}
              >
                Reply
              </button>
            )}

            {replyingToId === card._id && (
              <div className="mt-3">
                <textarea
                  className="w-full border rounded p-2 text-gray-800"
                  placeholder="Type your reply here..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    className="px-4 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                    onClick={() => {
                      setReplyingToId(null);
                      setReplyMessage("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => handleSendReply(card)}
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Support;
