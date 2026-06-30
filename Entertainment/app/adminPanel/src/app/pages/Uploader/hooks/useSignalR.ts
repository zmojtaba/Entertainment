// src/hooks/useSignalR.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel, HubConnectionState } from '@microsoft/signalr';

interface UseSignalROptions {
  hubUrl: string;
  autoConnect?: boolean;
}

export const useSignalR = (options: UseSignalROptions) => {
  const { hubUrl, autoConnect = true } = options;

  const connectionRef = useRef<HubConnection | null>(null);
  const [connectionState, setConnectionState] = useState<HubConnectionState>(HubConnectionState.Disconnected);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [errorTxt, setErrorTxt] = useState<string>('');

  const startConnection = useCallback(async (): Promise<void> => {
    if (connectionRef.current?.state === HubConnectionState.Connected) return;

    setIsConnecting(true);
    setErrorTxt('')

    try {
      const connection = new HubConnectionBuilder()
        .withUrl(hubUrl)
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      connectionRef.current = connection;

      connection.onreconnecting(() => setConnectionState(HubConnectionState.Reconnecting));
      connection.onreconnected(() => setConnectionState(HubConnectionState.Connected));
      connection.onclose(() => setConnectionState(HubConnectionState.Disconnected));

      await connection.start();
      setConnectionState(HubConnectionState.Connected);
      // console.log("✅ SignalR متصل شد");
    } catch (error: any) {
      const errorMessage = error?.message
        ?? (typeof error === 'string' ? error : 'Error connect to server');
      setErrorTxt(errorMessage)
      setConnectionState(HubConnectionState.Disconnected);
    } finally {
      setIsConnecting(false);
    }
  }, [hubUrl]);

  const sendMessage = useCallback(async (methodName: string, ...args: any[]): Promise<void> => {
    if (connectionRef.current?.state !== HubConnectionState.Connected) {
      // console.warn("⚠️ SignalR هنوز متصل نیست");
      return;
    }
    await connectionRef.current.invoke(methodName, ...args);
  }, []);

  const on = useCallback((methodName: string, callback: (...args: any[]) => void) => {
    connectionRef.current?.on(methodName, callback);
  }, []);

  const off = useCallback((methodName: string, callback?: (...args: any[]) => void) => {
    const conn = connectionRef.current;
    if (!conn) return;

    if (callback) {
      conn.off(methodName, callback);
    } else {
      conn.off(methodName);
    }
  }, []);

  const stopConnection = useCallback(async (): Promise<void> => {
    if (connectionRef.current) {
      await connectionRef.current.stop();
      setConnectionState(HubConnectionState.Disconnected);
    }
  }, []);

  useEffect(() => {
    if (autoConnect) {
      startConnection();
    }

    return () => {
      stopConnection();
    };
  }, [startConnection, stopConnection, autoConnect]);

  return {
    connectionState,
    isConnecting,
    isConnected: connectionState === HubConnectionState.Connected,
    startConnection,
    stopConnection,
    sendMessage,
    errorTxt,
    on,
    off,
  } as const;
};