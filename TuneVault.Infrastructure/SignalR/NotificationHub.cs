using Microsoft.AspNetCore.SignalR;

namespace TuneVault.Infrastructure.SignalR;

/// <summary>
/// SignalR Hub để xử lý real-time notifications
/// </summary>
public class NotificationHub : Hub
{
    private static readonly Dictionary<string, string> UserConnections = new();

    public override async Task OnConnectedAsync()
    {
        var connectionId = Context.ConnectionId;
        Console.WriteLine($"[SignalR] Client connected: {connectionId}");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var connectionId = Context.ConnectionId;

        var userIdToRemove = UserConnections
            .FirstOrDefault(x => x.Value == connectionId).Key;

        if (userIdToRemove != null)
        {
            UserConnections.Remove(userIdToRemove);
            Console.WriteLine($"[SignalR] User disconnected: {userIdToRemove}");
        }

        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinUserGroup(string userId)
    {
        var connectionId = Context.ConnectionId;
        var groupName = $"user_{userId}";

        UserConnections[userId] = connectionId;
        await Groups.AddToGroupAsync(connectionId, groupName);

        Console.WriteLine($"[SignalR] User {userId} joined group {groupName}");

        await Clients.Client(connectionId).SendAsync("UserOnline", new { userId, timestamp = DateTime.UtcNow });
    }

    public async Task LeaveUserGroup(string userId)
    {
        var connectionId = Context.ConnectionId;
        var groupName = $"user_{userId}";

        if (UserConnections.ContainsKey(userId))
        {
            UserConnections.Remove(userId);
        }

        await Groups.RemoveFromGroupAsync(connectionId, groupName);

        Console.WriteLine($"[SignalR] User {userId} left group {groupName}");

        await Clients.Client(connectionId).SendAsync("UserOffline", new { userId, timestamp = DateTime.UtcNow });
    }

    public async Task Ping()
    {
        await Clients.Caller.SendAsync("Pong", new { timestamp = DateTime.UtcNow });
    }
}
