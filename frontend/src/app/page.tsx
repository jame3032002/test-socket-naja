"use client";
import Image from "next/image";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

interface InterfaceMe {
  name: string;
}
interface InterfaceNotification {
  isNotification: boolean;
  isUnread: number;
  messages: { type: string; message: string }[];
}
export default function Home() {
  const [notification, setNotification] =
    useState<InterfaceNotification | null>(null);
  const [me, setMe] = useState<InterfaceMe | null>(null);
  const inputRef: any = useRef(null);

  const connectSocket = async (me: InterfaceMe) => {
    const socket = await io("http://localhost:2000", {
      query: me,
    });

    setTimeout(() => {
      const socketId = socket.id;
      console.log(socketId);
      socket.on(`${socketId}/notification`, (message: any) => {
        console.log(message);
        setNotification(message);
      });
    }, 500);
  };

  useEffect(() => {
    if (me) {
      connectSocket(me);
    }
  }, [me]);

  const handleLogin = () => {
    setMe({ name: inputRef.current.value });
    setNotification({ isNotification: false, isUnread: 0, messages: [] });
  };

  const handleLogout = () => {
    setMe(null);
  };

  return (
    <main>
      {me ? (
        <div>
          <h1>{me.name}</h1>
          <h2>Notification</h2>
          <div>{JSON.stringify(notification)}</div>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <>
          <input type="text" ref={inputRef} />
          <button type="button" onClick={handleLogin}>
            Login
          </button>
        </>
      )}
    </main>
  );
}
