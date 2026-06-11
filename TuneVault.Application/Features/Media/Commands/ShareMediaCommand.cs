using MediatR;
using System;

namespace TuneVault.Application.Features.Media.Commands
{
    public class ShareMediaCommand : IRequest<Guid>
    {
        public string SenderId { get; set; } = string.Empty;
        public string ReceiverId { get; set; } = string.Empty;
        public Guid? MediaItemId { get; set; }
        public Guid? PlaylistId { get; set; }
    }
}