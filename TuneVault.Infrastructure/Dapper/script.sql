
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

-- 1. Thêm 2 User
INSERT INTO AppUser (Id, UserName, Email, PasswordHash, Bio, AvatarUrl) VALUES
('U001', 'nguyenvana', 'vana@example.com', 'hashed_password_1', N'Music lover', 'avatar1.png'),
('U002', 'tranthib', 'thib@example.com', 'hashed_password_2', N'Video creator', 'avatar2.png');

-- 2. Thêm 2 Artist
DECLARE @Artist1 UNIQUEIDENTIFIER = NEWID();
DECLARE @Artist2 UNIQUEIDENTIFIER = NEWID();
INSERT INTO Artist (Id, Name, Bio) VALUES
(@Artist1, N'Sơn Tùng M-TP', N'V-Pop Singer'),
(@Artist2, N'Hà Anh Tuấn', N'Pop/R&B Singer');

-- 3. Thêm 2 Album
DECLARE @Album1 UNIQUEIDENTIFIER = NEWID();
DECLARE @Album2 UNIQUEIDENTIFIER = NEWID();
INSERT INTO Album (Id, Title, ReleaseDate, ArtistId) VALUES
(@Album1, N'Chúng Ta Của Hiện Tại', '2020-12-20', @Artist1),
(@Album2, N'Truyện Ngắn', '2019-10-01', @Artist2);

-- 4. Thêm 10 Media Items (Mix Audio & Video)
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

INSERT INTO MediaItem (Id, Title, Type, Duration, FilePath, AlbumId, OwnerId) VALUES
(@Media1, N'Chúng Ta Của Hiện Tại (Audio)', 'Audio', 300, '/files/audio1.mp3', @Album1, 'U001'),
(@Media2, N'Chắc Ai Đó Sẽ Về (Audio)', 'Audio', 250, '/files/audio2.mp3', @Album1, 'U001'),
(@Media3, N'Tháng Tư Là Lời Nói Dối Của Em (Audio)', 'Audio', 320, '/files/audio3.mp3', @Album2, 'U002'),
(@Media4, N'Có Chàng Trai Viết Lên Cây (Audio)', 'Audio', 310, '/files/audio4.mp3', @Album2, 'U002'),
(@Media5, N'Lofi Chill 1 (Audio)', 'Audio', 180, '/files/audio5.mp3', NULL, 'U001'),
(@Media6, N'Lofi Chill 2 (Audio)', 'Audio', 190, '/files/audio6.mp3', NULL, 'U002'),
(@Media7, N'Chúng Ta Của Hiện Tại (Official MV)', 'Video', 900, '/files/video1.mp4', @Album1, 'U001'),
(@Media8, N'Live Concert Hà Anh Tuấn', 'Video', 3600, '/files/video2.mp4', @Album2, 'U002'),
(@Media9, N'Hướng dẫn chơi Guitar (Video)', 'Video', 1200, '/files/video3.mp4', NULL, 'U001'),
(@Media10, N'Cover Nhạc Acoustic (Video)', 'Video', 400, '/files/video4.mp4', NULL, 'U002');

-- 5. Thêm 2 Playlist
DECLARE @Playlist1 UNIQUEIDENTIFIER = NEWID();
DECLARE @Playlist2 UNIQUEIDENTIFIER = NEWID();

INSERT INTO Playlist (Id, Name, IsPublic, OwnerId) VALUES
(@Playlist1, N'Nhạc Trẻ Sôi Động', 1, 'U001'),
(@Playlist2, N'Chill Cuối Tuần', 0, 'U002');

-- 6. Thêm bài hát vào Playlist (PlaylistTrack)
INSERT INTO PlaylistTrack (PlaylistId, MediaItemId) VALUES
(@Playlist1, @Media1),
(@Playlist1, @Media2),
(@Playlist2, @Media3),
(@Playlist2, @Media5);

