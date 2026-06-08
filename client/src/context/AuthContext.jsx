// context/AuthContext.jsx
//
// Context = กล่องข้อมูลกลาง ที่ทุก component เข้าถึงได้โดยไม่ต้อง prop drilling
//
// เก็บ: user state + login/logout/register functions
// ทุก component ที่ต้องการรู้ว่า login อยู่ไหม → useAuth() แทน

import { createContext, useState, useEffect, useCallback } from "react";
import API from "../api.js";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // null = ยังไม่รู้, false = ไม่ได้ login, object = login แล้ว
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  // เช็คว่า login อยู่ไหมตอน app โหลด (cookie ยังอยู่ไหม)
  // เรียก /api/v1/words แบบ HEAD หรือทำ endpoint /me ก็ได้
  // แต่เราใช้วิธีง่ายกว่า: เก็บ user ใน localStorage เป็น cache เบาๆ
  useEffect(() => {
    const cached = localStorage.getItem("vocablist_user");
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {
        localStorage.removeItem("vocablist_user");
      }
    }
    setLoading(false);
  }, []);

  const register = useCallback(async (email, password) => {
    const res = await fetch(`${API}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ส่ง/รับ cookie
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    setUser(data.data);
    localStorage.setItem("vocablist_user", JSON.stringify(data.data));
    return data.data;
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    setUser(data.data);
    localStorage.setItem("vocablist_user", JSON.stringify(data.data));
    return data.data;
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${API}/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    localStorage.removeItem("vocablist_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
