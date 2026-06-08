-- Giai đoạn 7: dữ liệu test cố định (chạy sau script.sql chính)
-- Dùng user U001/U002 đã có trong seed gốc

IF NOT EXISTS (SELECT 1 FROM AppUser WHERE Id = 'U001')
BEGIN
    INSERT INTO AppUser (Id, UserName, Email, PasswordHash, Bio, AvatarUrl)
    VALUES ('U001', 'nguyenvana', 'vana@example.com', 'hashed_password_1', N'Music lover', 'avatar1.png');
END

IF NOT EXISTS (SELECT 1 FROM AppUser WHERE Id = 'U002')
BEGIN
    INSERT INTO AppUser (Id, UserName, Email, PasswordHash, Bio, AvatarUrl)
    VALUES ('U002', 'tranthib', 'thib@example.com', 'hashed_password_2', N'Video creator', 'avatar2.png');
END

IF NOT EXISTS (SELECT 1 FROM MediaItem WHERE Id = '11111111-1111-1111-1111-111111111111')
BEGIN
    INSERT INTO MediaItem (Id, Title, Type, Duration, FilePath, AlbumId, OwnerId)
    VALUES (
        '11111111-1111-1111-1111-111111111111',
        N'Test Stream Audio',
        'Audio',
        180,
        'D:\các môn học\C#\TuneVault\TuneVault.API\wwwroot\test-media\sample.txt',
        NULL,
        'U001'
    );
END

GO
