import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiUploadCloud, FiLock, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext'; // <-- Import thêm AuthContext

const UploadMedia = () => {
    // Lấy thông tin user hiện tại
    const { user } = useAuth(); 

    const [title, setTitle] = useState('');
    const [type, setType] = useState('Audio'); 
    const [duration, setDuration] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // --- PHÂN QUYỀN: KIỂM TRA ĐĂNG NHẬP VÀ QUYỀN NGHỆ SĨ ---
    if (!user) {
        return (
            <div className="flex items-center justify-center h-[60vh] text-spotify-subtext">
                Vui lòng đăng nhập để sử dụng tính năng này.
            </div>
        );
    }

    if (!user.isArtist) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4 animate-fade-in">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 text-spotify-subtext shadow-lg">
                    <FiLock size={40} />
                </div>
                <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Tính năng dành riêng cho Nghệ sĩ</h2>
                <p className="text-spotify-subtext max-w-md mb-8 leading-relaxed">
                    Bạn cần xác nhận quyền Nghệ sĩ để có thể đăng tải, quản lý bài hát và video của riêng mình trên hệ thống TuneVault.
                </p>
                <Link 
                    to={`/profile/${user.id}`} 
                    className="flex items-center gap-2 bg-[#1ed760] text-black font-bold px-8 py-3.5 rounded-full hover:scale-105 hover:bg-[#1fdf64] transition-all"
                >
                    <FiStar size={18} /> Đi đến Hồ sơ để Xác nhận ngay
                </Link>
            </div>
        );
    }
    // --------------------------------------------------------

    // --- LOGIC UPLOAD HIỆN TẠI CỦA BẠN ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            toast.error('Vui lòng chọn file!');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('Title', title);
        formData.append('Type', type);
        formData.append('Duration', duration);
        formData.append('File', file);

        try {
            const response = await api.post('/media/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const result = response.data;
            if (result.success) {
                toast.success('Tải lên thành công!');
                setTitle('');
                setDuration('');
                setFile(null);
            } else {
                toast.error(result.message || 'Lỗi khi tải lên');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Không thể kết nối đến server!');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="p-8 text-white max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <FiUploadCloud /> Tải nhạc lên TuneVault
            </h1>
            
            <form onSubmit={handleSubmit} className="bg-spotify-base p-6 rounded-lg space-y-5">
                <div>
                    <label className="block text-sm font-semibold mb-2 text-spotify-subtext">Tên bài hát</label>
                    <input 
                        type="text" 
                        required 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-white/10 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-white"
                        placeholder="Nhập tên bài hát..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-spotify-subtext">Thể loại</label>
                        <select 
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-white/10 p-3 rounded text-white focus:outline-none"
                        >
                            <option value="Audio" className="text-black">Bài hát (Audio)</option>
                            <option value="Video" className="text-black">MV (Video)</option>
                            <option value="Podcast" className="text-black">Podcast</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-spotify-subtext">Thời lượng (giây)</label>
                        <input 
                            type="number" 
                            required 
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full bg-white/10 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-white"
                            placeholder="Ví dụ: 180"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2 text-spotify-subtext">Chọn File (.mp3, .mp4, .wav)</label>
                    <input 
                        type="file" 
                        required 
                        accept=".mp3,.wav,.mp4"
                        onChange={handleFileChange}
                        className="w-full text-spotify-subtext file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200 cursor-pointer"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isUploading}
                    className={`w-full py-3 mt-4 rounded-full font-bold transition-colors ${isUploading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#1ed760] text-black hover:bg-[#1fdf64] scale-100 hover:scale-[1.02]'}`}
                >
                    {isUploading ? 'Đang xử lý...' : 'Xác nhận tải lên'}
                </button>
            </form>
        </div>
    );
};

export default UploadMedia;