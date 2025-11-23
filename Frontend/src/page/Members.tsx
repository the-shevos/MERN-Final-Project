import React, { useEffect, useState } from "react";
import axios from "axios";

type Member = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  provider: string;
  createdAt: string;
  isBlocked: boolean;
};

type FilterType = "all" | "email" | "google" | "blocked";

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  const loadMembers = async () => {
    try {
      const emailRes = await axios.get(
        "http://localhost:3000/api/v1/user/verified-users"
      );
      const emailUsers = emailRes.data.users.map((u: any) => ({
        id: u._id,
        name: u.userName,
        email: u.userEmail,
        avatar: null,
        provider: "Email & Password",
        createdAt: u.createdAt,
        isBlocked: u.isBlocked,
      }));

      const googleRes = await axios.get(
        "http://localhost:3000/api/get-google-users"
      );
      const googleUsers = googleRes.data.users.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        avatar: u.avatar,
        provider: "Google",
        createdAt: u.createdAt,
        isBlocked: u.isBlocked,
      }));

      setMembers([...emailUsers, ...googleUsers]);
    } catch (err) {
      console.error("Error loading members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const toggleBlockUser = async (member: Member) => {
    try {
      if (member.provider === "Email & Password") {
        await axios.patch(
          `http://localhost:3000/api/v1/user/${
            member.isBlocked ? "unblock-user" : "block-user"
          }/${member.id}`
        );
      } else if (member.provider === "Google") {
        await axios.patch(
          `http://localhost:3000/api/${
            member.isBlocked ? "unblock" : "block"
          }/${member.id}`
        );
      }
      loadMembers();
    } catch (err) {
      console.error(err);
      alert("Error updating user status");
    }
  };

  const filteredMembers = members.filter((m) => {
    if (filter === "email") return m.provider === "Email & Password";
    if (filter === "google") return m.provider === "Google";
    if (filter === "blocked") return m.isBlocked;
    return true;
  });

  if (loading)
    return <div className="text-center mt-10 text-xl">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Registered Members
      </h1>
      <div className="flex justify-center gap-4 mb-6">
        {(["all", "email", "google", "blocked"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded ${
              filter === f
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {f === "all"
              ? "All"
              : f === "email"
              ? "Email/Password"
              : f === "google"
              ? "Google"
              : "Blocked"}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredMembers.map((m) => (
          <div
            key={m.id}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow"
          >
            {m.avatar ? (
              <img
                src={m.avatar}
                className="w-16 h-16 rounded-full mb-4"
                alt=""
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 mb-4"></div>
            )}
            <h2 className="text-xl font-bold text-purple-700">{m.name}</h2>
            <p className="text-gray-500">{m.email}</p>
            <p className="mt-2 text-sm text-gray-600 font-medium">
              Sign with: {m.provider}
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Joined: {new Date(m.createdAt).toLocaleDateString()}
            </p>
            <button
              onClick={() => toggleBlockUser(m)}
              className={`mt-4 px-4 py-2 rounded text-white ${
                m.isBlocked
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {m.isBlocked ? "Unblock User" : "Block User"}
            </button>
            {m.isBlocked && (
              <span className="mt-2 ml-2 text-red-600 font-semibold">
                Blocked
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Members;
