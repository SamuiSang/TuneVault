import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { toast } from 'react-toastify';

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

        // ---> ĐÃ THÊM: Gắn "vòi" để lắng nghe sự kiện từ Backend <---
        newConnection.on('ReceiveNotification', (payload) => {
            console.log('Có thông báo SignalR về nè:', payload);
            
            // Bật Toast nhảy lên màn hình
            toast.success('🎵 Có người vừa chia sẻ bài hát cho bạn!', {
                position: "top-right",
                autoClose: 5000,
            });
        });

        setConnection(newConnection);

        // Bắt đầu kết nối
        newConnection.start()
            .then(() => console.log('SignalR Connected!'))
            .catch(err => console.error('SignalR Connection Error: ', err));

        // Cleanup function: Ngắt kết nối khi component bị unmount
        return () => {
            if (newConnection) {
                // Xóa luôn bộ lắng nghe trước khi ngắt kết nối cho sạch bộ nhớ
                newConnection.off('ReceiveNotification'); 
                newConnection.stop();
            }
        };
    }, [hubUrl, token]);

    return connection;
};