// hooks/useAuth.js
//
// Custom hook = wrapper ที่ทำให้เรียก context ง่ายขึ้น
// แทนที่จะ import { useContext, AuthContext } ทุกไฟล์
// แค่ import useAuth แล้วเรียก useAuth() ได้เลย
//
// โบนัส: เช็คว่าใช้นอก AuthProvider ไหม → error message ชัดเจน

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

export default useAuth;
