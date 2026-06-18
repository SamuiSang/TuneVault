import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

export const useSignalR = (hubUrl: string, token: string) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    useEffect(() => {
        // Khởi tạo kết nối tới Backend
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, {
                // Truyền JWT token để Backend biết ai đang kết nối
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect() // Tự động kết nối lại nếu mạng chập chờn
            .build();

        // ---> ĐÃ GỠ BỎ: Gắn "vòi" lắng nghe toast ở đây, để hook tái sử dụng linh hoạt hơn <---
        // (Logic lắng nghe Toast Pop-up đã được chuyển qua MainLayout)

        setConnection(newConnection);

        // Bắt đầu kết nối
        newConnection.start()
            .then(() => console.log('SignalR Connected!'))
            .catch(err => console.error('SignalR Connection Error: ', err));

        // Cleanup function: Ngắt kết nối khi component bị unmount
        return () => {
            if (newConnection) {
                newConnection.stop();
            }
        };
    }, [hubUrl, token]);

    return connection;
};