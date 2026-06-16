using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using TuneVault.Application.Common.Interfaces;
using TuneVault.Infrastructure.Configuration;

namespace TuneVault.Infrastructure.Services
{
    public class CloudinaryService : ICloudStorageService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(IOptions<CloudinarySettings> config)
        {
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(account);
        }

        public async Task<string> UploadAudioVideoAsync(Stream fileStream, string fileName, CancellationToken cancellationToken = default)
        {
            var uploadParams = new VideoUploadParams()
            {
                File = new FileDescription(fileName, fileStream),
                Folder = "tunevault/media",
                UseFilename = true,
                UniqueFilename = true,
                Overwrite = false
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams, cancellationToken);
            
            if (uploadResult.Error != null)
            {
                throw new Exception($"Cloudinary upload error: {uploadResult.Error.Message}");
            }

            return uploadResult.SecureUrl.AbsoluteUri;
        }

        public async Task<string> UploadImageAsync(Stream fileStream, string fileName, CancellationToken cancellationToken = default)
        {
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(fileName, fileStream),
                Folder = "tunevault/images",
                UseFilename = true,
                UniqueFilename = true,
                Overwrite = false
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams, cancellationToken);

            if (uploadResult.Error != null)
            {
                throw new Exception($"Cloudinary upload error: {uploadResult.Error.Message}");
            }

            return uploadResult.SecureUrl.AbsoluteUri;
        }

        public async Task<bool> DeleteFileAsync(string publicId, string resourceType, CancellationToken cancellationToken = default)
        {
            var deleteParams = new DeletionParams(publicId)
            {
                ResourceType = resourceType == "video" ? ResourceType.Video : ResourceType.Image
            };

            var result = await _cloudinary.DestroyAsync(deleteParams);
            return result.Result == "ok";
        }
    }
}
