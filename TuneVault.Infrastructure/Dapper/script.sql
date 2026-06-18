-- =======================================
-- 		   TẠO BẢNG
-- =======================================
CREATE TABLE AppUser (
    Id NVARCHAR(450) PRIMARY KEY,
    UserName NVARCHAR(256),
    Email NVARCHAR(256),
    PasswordHash NVARCHAR(MAX),
    Bio NVARCHAR(MAX) NULL,
    AvatarUrl NVARCHAR(MAX) NULL
);

CREATE TABLE Artist (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(255) NOT NULL,
    AvatarUrl NVARCHAR(MAX) NULL,
    Bio NVARCHAR(MAX) NULL
);


CREATE TABLE Album (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Title NVARCHAR(255) NOT NULL,
    ReleaseDate DATETIME2 NOT NULL,
    CoverImageUrl NVARCHAR(MAX),
    ArtistId UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT FK_Album_Artist FOREIGN KEY (ArtistId) REFERENCES Artist(Id)
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
    FolloweeId NVARCHAR(450) NULL,
    ArtistId UNIQUEIDENTIFIER NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Follow_Follower FOREIGN KEY (FollowerId) REFERENCES AppUser(Id),
    CONSTRAINT FK_Follow_Followee FOREIGN KEY (FolloweeId) REFERENCES AppUser(Id),
    CONSTRAINT FK_Follow_Artist FOREIGN KEY (ArtistId) REFERENCES Artist(Id)
);

CREATE TABLE MediaArtist (
    MediaItemId UNIQUEIDENTIFIER NOT NULL,
    ArtistId UNIQUEIDENTIFIER NOT NULL,
    PRIMARY KEY (MediaItemId, ArtistId),
    CONSTRAINT FK_MediaArtist_MediaItem FOREIGN KEY (MediaItemId) REFERENCES MediaItem(Id),
    CONSTRAINT FK_MediaArtist_Artist FOREIGN KEY (ArtistId) REFERENCES Artist(Id)
);


-- ====================================================
--                 LẤY DỮ LIỆU BẢNG
-- ====================================================
select * from Album
select * from AppUser
select * from Artist
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
DELETE FROM Artist;

-- Cuối cùng mới xóa bảng cha
DELETE FROM AppUser;


-- ===================================================
--                  INSERT USER MẪU
-- ===================================================
INSERT INTO AppUser (Id, UserName, Email, PasswordHash, Bio, AvatarUrl) VALUES
('U001', N'user1', 'user1@gmail.com', 'AQAAAAIAAYagAAAAEHYouyDaVG3LkMiXKuZxki9rkECFJc88PvZgTUAo6Ho8JFhf9x6xQ+mbJ5WnDwADXQ==', N'Bio user 1', 'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781688873/user1_ps4dz8.jpg'),
('U002', N'user2', 'user2@gmail.com', 'AQAAAAIAAYagAAAAEK45kDwV/h8yRB1C4Ato1rVs68eNArzNH8Zj9/M6e38eC/Shyo9i8HQwciUjN88XtA==', N'Bio user 2', 'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781689880/user2_uuspy3.jpg'),
('U003', N'test', 'test@gmail.com', 'AQAAAAIAAYagAAAAEAScNcWEVKN+jINrr5y4yWwqXCDmvl+JO5xbOO8xtZz4XlSzPiLU/caDy7l50MiCaw==', N'Bio test user', 'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781689338/tunevault/images/Mahiru_Pout_t6cn0f.png');


-- ===================================================
--                 INSERT ARTIST MẪU
-- ===================================================
-- 1. Khai báo các biến Id cho nghệ sĩ (để lát nữa dùng lại cho Album và MediaItem)
DECLARE @Artist1 UNIQUEIDENTIFIER = NEWID();
DECLARE @Artist2 UNIQUEIDENTIFIER = NEWID();
DECLARE @Artist3 UNIQUEIDENTIFIER = NEWID();
DECLARE @Artist4 UNIQUEIDENTIFIER = NEWID();

-- 2. Thêm dữ liệu vào bảng Artist kèm link Cloudinary
INSERT INTO Artist (Id, Name, AvatarUrl, Bio) VALUES
(
    @Artist1, 
    N'Sơn Tùng M-TP', 
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781690268/SonTungMTP_fccntg.jpg',
    N'Nam ca sĩ, nhạc sĩ người Việt Nam...'
),
(
    @Artist2, 
    N'The Weeknd', 
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781690270/TheWeeknd_kyl73f.jpg', 
    N'The Weeknd Bio'
),
(
    @Artist3, 
    N'Đen Vâu', 
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781690267/DenVau_x9q5yi.jpg', 
    N'Rapper với những bản hit mộc mạc...'
),
(
    @Artist4, 
    N'Justin Bieber', 
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781690269/JustinBieber_uifdqd.jpg', 
    N'Justin Bieber Bio'
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
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781692239/SonTungAlbum_iwks7k.jpg', -- Dán link ảnh bìa Album
    @Artist1 -- Thuộc về Sơn Tùng M-TP
),
(
    @Album2, 
    N'Tuyển tập The Weeknd', 
    '2020-03-20', 
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781692240/TheWeekndAlbum_u1ummw.jpg', 
    @Artist2 -- Thuộc về The Weeknd
),
(
    @Album3, 
    N'Tuyển tập Đen Vâu', 
    '2026-01-01', 
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781692236/DenVauAlbum_wzsbyj.jpg', 
    @Artist3 -- Thuộc về Đen Vâu (ví dụ)
),
(
    @Album4, 
    N'Tuyển tập Justin Bieber', 
    '2020-03-20', 
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781692238/JustinBieberAlbum_ixxmp0.jpg', 
    @Artist2 -- Thuộc về Justin Bieber
);

-- =======================================================
--    THÊM DỮ LIỆU BẢNG MEDIAITEM (BÀI HÁT & VIDEO)
-- =======================================================
-- Khai báo biến cho MediaItem (để sau này nếu làm PlaylistTrack có thể tái sử dụng)
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
    'U001'
),

-- Dòng 2: Dành cho bản MV (MP4)
(
    @Media2, 
    N'Đen - hai triệu năm ft. Biên (M/V)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703155/hai-trieu-nam-mp4_dlbjsg.webp',
    N'Bản MV đầy đủ hình ảnh', 
    'Video',
    217, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781690968/hai-trieu-nam_vbmfpd.mp4', 
    @Album3, -- Thuộc Album Đen Vâu
    'U001'
),
(
    @Media3, 
    N'Đen - Mang Tiền Về Cho Mẹ ft. Nguyên Thảo (MP3)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703158/mang-tien-ve-cho-me-mp3_k9qczt.webp',
    N'Bản chỉ có tiếng', 
    'Audio',
    401, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781692062/mang-tien-ve-cho-me_jmp48m.mp3', 
    @Album3, -- Thuộc Album Đen Vâu
    'U001'
),
(
    @Media4, 
    N'Đen - Mang Tiền Về Cho Mẹ ft. Nguyên Thảo (M/V)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703159/mang-tien-ve-cho-me-mp4_tzo26v.webp',
    N'Bản MV đầy đủ hình ảnh', 
    'Video',
    401, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781690866/mang-tien-ve-cho-me_msd2md.mp4', 
    @Album3, -- Thuộc Album Đen Vâu
    'U001'
),
(
    @Media5, 
    N'Đen - Trốn Tìm ft. MTV band (MP3)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703162/tron-tim-mp3_vhpqun.webp',
    N'Bản chỉ có tiếng', 
    'Audio',
    252, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781692074/tron-tim_fqhvel.mp3', 
    @Album3, -- Thuộc Album Đen Vâu
    'U001'
),
(
    @Media6, 
    N'Đen - Trốn Tìm ft. MTV band (M/V)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703163/tron-tim-mp4_ntdzqk.webp',
    N'Bản MV đầy đủ hình ảnh', 
    'Video',
    252, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781690911/tron-tim_ty7sj8.mp4', 
    @Album3, -- Thuộc Album Đen Vâu
    'U001'
),
(
    @Media7, 
    N'SƠN TÙNG M-TP | CÓ CHẮC YÊU LÀ ĐÂY | (MP3)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703149/co-chac-yeu-la-day-mp3_mkrubr.webp',
    N'Bản chỉ có tiếng', 
    'Audio',
    215, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781692063/co-chac-yeu-la-day_e75vpv.mp3', 
    @Album1, -- Thuộc Album Sơn Tùng
    'U001'
),
(
    @Media8, 
    N'SƠN TÙNG M-TP | CÓ CHẮC YÊU LÀ ĐÂY | (M/V)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703150/co-chac-yeu-la-day-mp4_krapeb.webp',
    N'Bản MV đầy đủ hình ảnh', 
    'Video',
    215, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781690858/co-chac-yeu-la-day_o6vips.mp4', 
    @Album1, -- Thuộc Album Sơn Tùng
    'U001'
),
(
    @Media9, 
    N'SON TUNG M-TP x TYGA | COME MY WAY | (MP3)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703150/come-my-way-mp3_pudbcv.webp',
    N'Bản chỉ có tiếng', 
    'Audio',
    234, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781692067/come-my-way_tvgnof.mp3', 
    @Album1, -- Thuộc Album Sơn Tùng
    'U001'
),
(
    @Media10, 
    N'SON TUNG M-TP x TYGA | COME MY WAY | (M/V)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703151/come-my-way-mp4_yu0nxx.webp',
    N'Bản MV đầy đủ hình ảnh', 
    'Video',
    234, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781690912/come-my-way_snxjig.mp4', 
    @Album1, -- Thuộc Album Sơn Tùng
    'U001'
),
(
    @Media11, 
    N'CHẠY NGAY ĐI | RUN NOW | SƠN TÙNG M-TP | (MP3)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703152/chay-ngay-di-mp3_gxbhef.webp',
    N'Bản chỉ có tiếng', 
    'Audio',
    273, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781692057/chay-ngay-di_qomjtn.mp3', 
    @Album1, -- Thuộc Album Sơn Tùng
    'U001'
),
(
    @Media12, 
    N'CHẠY NGAY ĐI | RUN NOW | SƠN TÙNG M-TP | (M/V)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703153/chay-ngay-di-mp4_xvbkc0.webp',
    N'Bản MV đầy đủ hình ảnh', 
    'Video',
    273, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781690888/chay-ngay-di_sgnfph.mp4', 
    @Album1, -- Thuộc Album Sơn Tùng
    'U001'
),
(
    @Media13, 
    N'LẠC TRÔI | SƠN TÙNG M-TP | (MP3)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703156/lac-troi-mp3_y79mwf.webp',
    N'Bản chỉ có tiếng', 
    'Audio',
    272, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781692068/lac-troi_dygsfm.mp3', 
    @Album1, -- Thuộc Album Sơn Tùng
    'U001'
),
(
    @Media14, 
    N'LẠC TRÔI | SƠN TÙNG M-TP | (M/V)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703157/lac-troi-mp4_sxd3sv.webp',
    N'Bản MV đầy đủ hình ảnh', 
    'Video',
    272, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781690970/lac-troi_ycg5hw.mp4', 
    @Album1, -- Thuộc Album Sơn Tùng
    'U001'
),
(
    @Media15, 
    N'Justin Bieber - Baby ft. Ludacris (MP3)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703146/baby-mp3_y06rzb.webp',
    N'Bản chỉ có tiếng', 
    'Audio',
    219, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781692056/baby_ddj9ob.mp3', 
    @Album4, -- Thuộc Album Justin Bieber
    'U002'
),
(
    @Media16, 
    N'Justin Bieber - Baby ft. Ludacris (M/V)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703147/baby-mp4_srxg4d.webp',
    N'Bản MV đầy đủ hình ảnh', 
    'Video',
    219, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781690943/baby_bvnawx.mp4', 
    @Album4, -- Thuộc Album Justin Bieber
    'U002'
),
(
    @Media17, 
    N'Justin Bieber - Sorry (PURPOSE : The Movement) (MP3)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703160/sorry-mp3_mjxbo6.webp',
    N'Bản chỉ có tiếng', 
    'Audio',
    205, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781692062/sorry_gv30v6.mp3', 
    @Album4, -- Thuộc Album Justin Bieber
    'U002'
),
(
    @Media18, 
    N'Justin Bieber - Sorry (PURPOSE : The Movement) (M/V)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703161/sorry-mp4_fvivdr.webp',
    N'Bản MV đầy đủ hình ảnh', 
    'Video',
    205, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781690908/sorry_jhbqcs.mp4', 
    @Album4, -- Thuộc Album Justin Bieber
    'U002'
),
(
    @Media19, 
    N'The Weeknd - Blinding Lights (MP3)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703147/blinding-lights-mp3_vddkvy.webp',
    N'Bản chỉ có tiếng', 
    'Audio',
    262, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781692056/blinding-lights_oehkrw.mp3', 
    @Album2, -- Thuộc Album The Weeknd
    'U002'
),
(
    @Media20, 
    N'The Weeknd - Blinding Lights (M/V)',
    'https://res.cloudinary.com/dgwvj1a0i/image/upload/v1781703148/blinding-lights-mp4_i5xnvr.webp',
    N'Bản MV đầy đủ hình ảnh', 
    'Video',
    262, 
    'https://res.cloudinary.com/dgwvj1a0i/video/upload/v1781690894/blinding-lights_nypdxd.mp4', 
    @Album2, -- Thuộc Album The Weeknd
    'U002'
);

