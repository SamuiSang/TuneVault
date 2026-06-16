using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace TuneVault.Application.Common.Interfaces
{
    public interface ICloudStorageService
    {
        Task<string> UploadAudioVideoAsync(Stream fileStream, string fileName, CancellationToken cancellationToken = default);
        Task<string> UploadImageAsync(Stream fileStream, string fileName, CancellationToken cancellationToken = default);
        Task<bool> DeleteFileAsync(string publicId, string resourceType, CancellationToken cancellationToken = default);
    }
}
