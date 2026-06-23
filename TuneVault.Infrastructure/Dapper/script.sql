-- DATABASE NAME: TuneVaultDb
-- =======================================
--            TẠO BẢNG
-- =======================================
CREATE TABLE AppUser (
    Id NVARCHAR(450) PRIMARY KEY,
    UserName NVARCHAR(256),
    Email NVARCHAR(256),
    PasswordHash NVARCHAR(MAX),
    DisplayName NVARCHAR(255) NULL,
    Bio NVARCHAR(MAX) NULL,
    AvatarUrl NVARCHAR(MAX) NULL,
    IsArtist BIT DEFAULT 0
);
CREATE TABLE Album (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Title NVARCHAR(255) NOT NULL,
    ReleaseDate DATETIME2 NOT NULL,
    CoverImageUrl NVARCHAR(MAX),
    ArtistId NVARCHAR(450) NOT NULL, -- Đổi kiểu dữ liệu khớp với AppUser
    CONSTRAINT FK_Album_Artist FOREIGN KEY (ArtistId) REFERENCES AppUser(Id)
);

CREATE TABLE MediaItem (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Title NVARCHAR(255) NOT NULL,
    ThumbnailUrl NVARCHAR(MAX) NULL,
    Description NVARCHAR(MAX) NULL,
    Type NVARCHAR(50) NOT NULL,
    Duration INT NOT NULL,
    FilePath NVARCHAR(MAX) NOT NULL,
    AlbumId UNIQUEIDENTIFIER NULL,
    OwnerId NVARCHAR(450) NOT NULL,
    CONSTRAINT FK_MediaItem_Album FOREIGN KEY (AlbumId) REFERENCES Album(Id),
    CONSTRAINT FK_MediaItem_Owner FOREIGN KEY (OwnerId) REFERENCES AppUser(Id)
);

CREATE TABLE Playlist (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(255) NOT NULL,
    IsPublic BIT DEFAULT 0,
    CoverImageUrl NVARCHAR(MAX) NULL,
    OwnerId NVARCHAR(450) NOT NULL,
    CONSTRAINT FK_Playlist_Owner FOREIGN KEY (OwnerId) REFERENCES AppUser(Id)
);

CREATE TABLE PlaylistTrack (
    PlaylistId UNIQUEIDENTIFIER NOT NULL,
    MediaItemId UNIQUEIDENTIFIER NOT NULL,
    AddedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (PlaylistId, MediaItemId),
    CONSTRAINT FK_PlaylistTrack_Playlist FOREIGN KEY (PlaylistId) REFERENCES Playlist(Id),
    CONSTRAINT FK_PlaylistTrack_MediaItem FOREIGN KEY (MediaItemId) REFERENCES MediaItem(Id)
);

CREATE TABLE MediaShare (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    SenderId NVARCHAR(450) NOT NULL,
    ReceiverId NVARCHAR(450) NOT NULL,
    MediaItemId UNIQUEIDENTIFIER NULL,
    PlaylistId UNIQUEIDENTIFIER NULL,
    SharedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_MediaShare_Sender FOREIGN KEY (SenderId) REFERENCES AppUser(Id),
    CONSTRAINT FK_MediaShare_Receiver FOREIGN KEY (ReceiverId) REFERENCES AppUser(Id),
    CONSTRAINT FK_MediaShare_MediaItem FOREIGN KEY (MediaItemId) REFERENCES MediaItem(Id),
    CONSTRAINT FK_MediaShare_Playlist FOREIGN KEY (PlaylistId) REFERENCES Playlist(Id)
);

CREATE TABLE Notification (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId NVARCHAR(450) NOT NULL,
    Type NVARCHAR(100) NOT NULL,
    PayloadJson NVARCHAR(MAX) NOT NULL,
    IsRead BIT DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Notification_User FOREIGN KEY (UserId) REFERENCES AppUser(Id)
);

CREATE TABLE Favorite (
    UserId NVARCHAR(450) NOT NULL,
    MediaItemId UNIQUEIDENTIFIER NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (UserId, MediaItemId),
    CONSTRAINT FK_Favorite_User FOREIGN KEY (UserId) REFERENCES AppUser(Id),
    CONSTRAINT FK_Favorite_MediaItem FOREIGN KEY (MediaItemId) REFERENCES MediaItem(Id)
);

CREATE TABLE PlayHistory (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId NVARCHAR(450) NOT NULL,
    MediaItemId UNIQUEIDENTIFIER NOT NULL,
    PlayedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_PlayHistory_User FOREIGN KEY (UserId) REFERENCES AppUser(Id),
    CONSTRAINT FK_PlayHistory_MediaItem FOREIGN KEY (MediaItemId) REFERENCES MediaItem(Id)
);

CREATE TABLE Follow (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    FollowerId NVARCHAR(450) NOT NULL,
    FolloweeId NVARCHAR(450) NOT NULL, -- Đổi thành NOT NULL, dùng chung cho cả việc follow user hay artist
    -- Đã xóa ArtistId
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Follow_Follower FOREIGN KEY (FollowerId) REFERENCES AppUser(Id),
    CONSTRAINT FK_Follow_Followee FOREIGN KEY (FolloweeId) REFERENCES AppUser(Id)
);

CREATE TABLE MediaArtist (
    MediaItemId UNIQUEIDENTIFIER NOT NULL,
    ArtistId NVARCHAR(450) NOT NULL, -- Đổi kiểu dữ liệu khớp với AppUser
    PRIMARY KEY (MediaItemId, ArtistId),
    CONSTRAINT FK_MediaArtist_MediaItem FOREIGN KEY (MediaItemId) REFERENCES MediaItem(Id),
    CONSTRAINT FK_MediaArtist_Artist FOREIGN KEY (ArtistId) REFERENCES AppUser(Id)
);

-- ====================================================
--                 LẤY DỮ LIỆU BẢNG
-- ====================================================
select * from Album
select * from AppUser
select * from Favorite
select * from Follow
select * from MediaArtist
select * from MediaItem
select * from MediaShare
select * from Notification
select * from PlayHistory
select * from Playlist
select * from PlaylistTrack

-- ===================================================
--            XÓA HẾT TẤT CẢ DỮ LIỆU BẢNG
-- ===================================================
-- Xóa bảng con trước
DELETE FROM PlaylistTrack;
DELETE FROM MediaShare;
DELETE FROM PlayHistory;
DELETE FROM Favorite;
DELETE FROM Notification;
DELETE FROM MediaArtist;
DELETE FROM Follow;

-- Xóa bảng trung gian
DELETE FROM Playlist;
DELETE FROM MediaItem;
DELETE FROM Album;

-- Cuối cùng mới xóa bảng cha
DELETE FROM AppUser;


-- ===================================================
--    INSERT USER & ARTIST MẪU (GỘP CHUNG VÀO APPUSER)
-- ===================================================
INSERT INTO AppUser (Id, UserName, Email, PasswordHash, DisplayName, Bio, AvatarUrl, IsArtist) VALUES
-- 1. Người dùng bình thường (IsArtist = 0)
(
    'U001', 
    N'user1', 
    'user1@gmail.com', 
    'AQAAAAIAAYagAAAAEHYouyDaVG3LkMiXKuZxki9rkECFJc88PvZgTUAo6Ho8JFhf9x6xQ+mbJ5WnDwADXQ==', 
    N'Người dùng 1',
    N'Bio user 1', 
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781688873/user1_ps4dz8.jpg',
    0
),
(
    'U002', 
    N'user2', 
    'user2@gmail.com', 
    'AQAAAAIAAYagAAAAEK45kDwV/h8yRB1C4Ato1rVs68eNArzNH8Zj9/M6e38eC/Shyo9i8HQwciUjN88XtA==', 
    N'Người dùng 2',
    N'Bio user 2', 
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781689880/user2_uuspy3.jpg',
    0
),
(
    'U003', 
    N'test', 
    'test@gmail.com', 
    'AQAAAAIAAYagAAAAEAScNcWEVKN+jINrr5y4yWwqXCDmvl+JO5xbOO8xtZz4XlSzPiLU/caDy7l50MiCaw==', 
    N'Tài khoản Test',
    N'Bio test user', 
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781689338/tunevault/images/Mahiru_Pout_t6cn0f.png',
    0
),

-- 2. Nghệ sĩ (IsArtist = 1)
(
    'A001', 
    N'sontungmtp', 
    'sontungmtp@gmail.com', 
    'AQAAAAIAAYagAAAAEFlBqetVfCYcNS1wnmiKtaDx3woIuvfS/6Dprqh8yC8mpdRr9wLgYcUD07XmYJ3EFQ==', 
    N'Sơn Tùng M-TP',
    N'Nam ca sĩ, nhạc sĩ người Việt Nam...', 
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781690268/SonTungMTP_fccntg.jpg',
    1
),
(
    'A002', 
    N'theweeknd', 
    'theweeknd@gmail.com', 
    'AQAAAAIAAYagAAAAECZYH9JW69CJyZL4OGWsJtOzyUi07H2Gh+fKnyx+RSnbWxXXHvxLYa10ctQA+KIn7Q==', 
    N'The Weeknd',
    N'The Weeknd Bio', 
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781690270/TheWeeknd_kyl73f.jpg',
    1
),
(
    'A003', 
    N'denvau', 
    'denvau@gmail.com', 
    'AQAAAAIAAYagAAAAEJrMJPpEC0dQGNvrPb8zt4TTTt29b1L550hJ8U/p+FVYANIRrHNYO1iq0lX8tuqBQQ==', 
    N'Đen Vâu',
    N'Rapper với những bản hit mộc mạc...', 
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781690267/DenVau_x9q5yi.jpg',
    1
),
(
    'A004', 
    N'justinbieber', 
    'justinbieber@gmail.com', 
    'AQAAAAIAAYagAAAAEGqPOqgILcsBouthR5EuMVwmEMU2+YC1WSPuIeDIrWvLUhrT0DoQY6itg2gErJ1V+w==', 
    N'Justin Bieber',
    N'Justin Bieber Bio', 
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781690269/JustinBieber_uifdqd.jpg',
    1
);


-- ===================================================
--                 INSERT ALBUM MẪU
-- ===================================================
-- Khai báo biến Id cho Album để lát nữa thêm Bài hát vào đúng Album
DECLARE @Album1 UNIQUEIDENTIFIER = NEWID();
DECLARE @Album2 UNIQUEIDENTIFIER = NEWID();
DECLARE @Album3 UNIQUEIDENTIFIER = NEWID();
DECLARE @Album4 UNIQUEIDENTIFIER = NEWID();

INSERT INTO Album (Id, Title, ReleaseDate, CoverImageUrl, ArtistId) VALUES
(
    @Album1, 
    N'Tuyển tập Sơn Tùng M-TP', 
    '2020-12-20', 
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781692239/SonTungAlbum_iwks7k.jpg', 
    'A001' -- Sơn Tùng M-TP
),
(
    @Album2, 
    N'Tuyển tập The Weeknd', 
    '2020-03-20', 
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781692240/TheWeekndAlbum_u1ummw.jpg', 
    'A002' -- The Weeknd
),
(
    @Album3, 
    N'Tuyển tập Đen Vâu', 
    '2026-01-01', 
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781692236/DenVauAlbum_wzsbyj.jpg', 
    'A003' -- Đen Vâu
),
(
    @Album4, 
    N'Tuyển tập Justin Bieber', 
    '2020-03-20', 
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781692238/JustinBieberAlbum_ixxmp0.jpg', 
    'A004' -- Justin Bieber
);

-- =======================================================
--    THÊM DỮ LIỆU BẢNG MEDIAITEM (BÀI HÁT & VIDEO)
-- =======================================================
DECLARE @Media1 UNIQUEIDENTIFIER = NEWID();
DECLARE @Media2 UNIQUEIDENTIFIER = NEWID();
DECLARE @Media3 UNIQUEIDENTIFIER = NEWID();
DECLARE @Media4 UNIQUEIDENTIFIER = NEWID();
DECLARE @Media5 UNIQUEIDENTIFIER = NEWID();
DECLARE @Media6 UNIQUEIDENTIFIER = NEWID();
DECLARE @Media7 UNIQUEIDENTIFIER = NEWID();
DECLARE @Media8 UNIQUEIDENTIFIER = NEWID();
DECLARE @Media9 UNIQUEIDENTIFIER = NEWID();
DECLARE @Media10 UNIQUEIDENTIFIER = NEWID();
DECLARE @Media11 UNIQUEIDENTIFIER = NEWID();
DECLARE @Media12 UNIQUEIDENTIFIER = NEWID();
DECLARE @Media13 UNIQUEIDENTIFIER = NEWID();
DECLARE @Media14 UNIQUEIDENTIFIER = NEWID();
DECLARE @Media15 UNIQUEIDENTIFIER = NEWID();
DECLARE @Media16 UNIQUEIDENTIFIER = NEWID();
DECLARE @Media17 UNIQUEIDENTIFIER = NEWID();
DECLARE @Media18 UNIQUEIDENTIFIER = NEWID();
DECLARE @Media19 UNIQUEIDENTIFIER = NEWID();
DECLARE @Media20 UNIQUEIDENTIFIER = NEWID();

INSERT INTO MediaItem(Id, Title, ThumbnailUrl, Description, Type, Duration, FilePath, AlbumId, OwnerId) VALUES
-- Dòng 1: Dành cho bản Audio (MP3)
(
    @Media1, 
    N'Đen - hai triệu năm ft. Biên (MP3)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703155/hai-trieu-nam-mp3_vwa48r.jpg',
    N'Bản chỉ có tiếng', 
    'Audio',
    217, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781692071/hai-trieu-nam_bnqgnf.mp3', 
    @Album3, -- Thuộc Album Đen Vâu
    'A003'
),
(
    @Media2, 
    N'Đen - hai triệu năm ft. Biên (M/V)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703155/hai-trieu-nam-mp4_dlbjsg.webp',
    N'Bản MV đầy đủ hình ảnh', 
    'Video',
    217, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781690968/hai-trieu-nam_vbmfpd.mp4', 
    @Album3,
    'A003'
),
(
    @Media3, 
    N'Đen - Mang Tiền Về Cho Mẹ ft. Nguyên Thảo (MP3)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703158/mang-tien-ve-cho-me-mp3_k9qczt.webp',
    N'Bản chỉ có tiếng', 
    'Audio',
    401, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781692062/mang-tien-ve-cho-me_jmp48m.mp3', 
    @Album3,
    'A003'
),
(
    @Media4, 
    N'Đen - Mang Tiền Về Cho Mẹ ft. Nguyên Thảo (M/V)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703159/mang-tien-ve-cho-me-mp4_tzo26v.webp',
    N'Bản MV đầy đủ hình ảnh', 
    'Video',
    401, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781690866/mang-tien-ve-cho-me_msd2md.mp4', 
    @Album3,
    'A003'
),
(
    @Media5, 
    N'Đen - Trốn Tìm ft. MTV band (MP3)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703162/tron-tim-mp3_vhpqun.webp',
    N'Bản chỉ có tiếng', 
    'Audio',
    252, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781692074/tron-tim_fqhvel.mp3', 
    @Album3,
    'A003'
),
(
    @Media6, 
    N'Đen - Trốn Tìm ft. MTV band (M/V)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703163/tron-tim-mp4_ntdzqk.webp',
    N'Bản MV đầy đủ hình ảnh', 
    'Video',
    252, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781690911/tron-tim_ty7sj8.mp4', 
    @Album3,
    'A003'
),
(
    @Media7, 
    N'SƠN TÙNG M-TP | CÓ CHẮC YÊU LÀ ĐÂY | (MP3)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703149/co-chac-yeu-la-day-mp3_mkrubr.webp',
    N'Bản chỉ có tiếng', 
    'Audio',
    215, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781692063/co-chac-yeu-la-day_e75vpv.mp3', 
    @Album1,
    'A001'
),
(
    @Media8, 
    N'SƠN TÙNG M-TP | CÓ CHẮC YÊU LÀ ĐÂY | (M/V)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703150/co-chac-yeu-la-day-mp4_krapeb.webp',
    N'Bản MV đầy hình ảnh', 
    'Video',
    215, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781690858/co-chac-yeu-la-day_o6vips.mp4', 
    @Album1,
    'A001'
),
(
    @Media9, 
    N'SON TUNG M-TP x TYGA | COME MY WAY | (MP3)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703150/come-my-way-mp3_pudbcv.webp',
    N'Bản chỉ có tiếng', 
    'Audio',
    234, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781692067/come-my-way_tvgnof.mp3', 
    @Album1,
    'A001'
),
(
    @Media10, 
    N'SON TUNG M-TP x TYGA | COME MY WAY | (M/V)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703151/come-my-way-mp4_yu0nxx.webp',
    N'Bản MV đầy đủ hình ảnh', 
    'Video',
    234, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781690912/come-my-way_snxjig.mp4', 
    @Album1,
    'A001'
),
(
    @Media11, 
    N'CHẠY NGAY ĐI | RUN NOW | SƠN TÙNG M-TP | (MP3)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703152/chay-ngay-di-mp3_gxbhef.webp',
    N'Bản chỉ có tiếng', 
    'Audio',
    273, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781692057/chay-ngay-di_qomjtn.mp3', 
    @Album1,
    'A001'
),
(
    @Media12, 
    N'CHẠY NGAY ĐI | RUN NOW | SƠN TÙNG M-TP | (M/V)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703153/chay-ngay-di-mp4_xvbkc0.webp',
    N'Bản MV đầy đủ hình ảnh', 
    'Video',
    273, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781690888/chay-ngay-di_sgnfph.mp4', 
    @Album1,
    'A001'
),
(
    @Media13, 
    N'LẠC TRÔI | SƠN TÙNG M-TP | (MP3)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703156/lac-troi-mp3_y79mwf.webp',
    N'Bản chỉ có tiếng', 
    'Audio',
    272, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781692068/lac-troi_dygsfm.mp3', 
    @Album1,
    'A001'
),
(
    @Media14, 
    N'LẠC TRÔI | SƠN TÙNG M-TP | (M/V)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703157/lac-troi-mp4_sxd3sv.webp',
    N'Bản MV đầy đủ hình ảnh', 
    'Video',
    272, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781690970/lac-troi_ycg5hw.mp4', 
    @Album1,
    'A001'
),
(
    @Media15, 
    N'Justin Bieber - Baby ft. Ludacris (MP3)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703146/baby-mp3_y06rzb.webp',
    N'Bản chỉ có tiếng', 
    'Audio',
    219, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781692056/baby_ddj9ob.mp3', 
    @Album4,
    'A004'
),
(
    @Media16, 
    N'Justin Bieber - Baby ft. Ludacris (M/V)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703147/baby-mp4_srxg4d.webp',
    N'Bản MV đầy đủ hình ảnh', 
    'Video',
    219, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781690943/baby_bvnawx.mp4', 
    @Album4,
    'A004'
),
(
    @Media17, 
    N'Justin Bieber - Sorry (PURPOSE : The Movement) (MP3)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703160/sorry-mp3_mjxbo6.webp',
    N'Bản chỉ có tiếng', 
    'Audio',
    205, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781692062/sorry_gv30v6.mp3', 
    @Album4,
    'A004'
),
(
    @Media18, 
    N'Justin Bieber - Sorry (PURPOSE : The Movement) (M/V)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703161/sorry-mp4_fvivdr.webp',
    N'Bản MV đầy đủ hình ảnh', 
    'Video',
    205, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781690908/sorry_jhbqcs.mp4', 
    @Album4,
    'A004'
),
(
    @Media19, 
    N'The Weeknd - Blinding Lights (MP3)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703147/blinding-lights-mp3_vddkvy.webp',
    N'Bản chỉ có tiếng', 
    'Audio',
    262, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781692056/blinding-lights_oehkrw.mp3', 
    @Album2,
    'A002'
),
(
    @Media20, 
    N'The Weeknd - Blinding Lights (M/V)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703148/blinding-lights-mp4_i5xnvr.webp',
    N'Bản MV đầy đủ hình ảnh', 
    'Video',
    262, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781690894/blinding-lights_nypdxd.mp4', 
    @Album2,
    'A002'
);