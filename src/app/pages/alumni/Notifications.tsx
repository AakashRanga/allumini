import { Bell, CheckCircle, Heart, MessageCircle, Briefcase, Trophy } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "like",
    title: "Sarah Johnson liked your post",
    message: "Your post about the new AI project received a like",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "comment",
    title: "New comment on your achievement",
    message: "Michael Chen commented: 'Congratulations! Well deserved!'",
    time: "15 minutes ago",
    read: false,
  },
  {
    id: 3,
    type: "approval",
    title: "Your post has been approved",
    message: "Your recent post is now visible to all alumni",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 4,
    type: "job",
    title: "New job opportunity posted",
    message: "Google posted a Senior Software Engineer position",
    time: "2 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "achievement",
    title: "Emily Davis posted a new achievement",
    message: "Check out their latest milestone",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 6,
    type: "message",
    title: "New Gurupadigam Message",
    message: "Annual Reunion 2026 - Save the Date",
    time: "1 day ago",
    read: true,
  },
];

export default function AlumniNotifications() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-5 h-5 text-red-500" />;
      case "comment":
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "approval":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "job":
        return <Briefcase className="w-5 h-5 text-purple-500" />;
      case "achievement":
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case "message":
        return <Bell className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case "like":
        return "bg-red-50";
      case "comment":
        return "bg-blue-50";
      case "approval":
        return "bg-green-50";
      case "job":
        return "bg-purple-50";
      case "achievement":
        return "bg-amber-50";
      case "message":
        return "bg-blue-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">Stay updated with your community activity</p>
        </div>
        {unreadCount > 0 && (
          <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-medium">
            {unreadCount} Unread
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-5 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-blue-50/30" : ""
              }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 ${getNotificationBg(notification.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h3 className={`font-semibold ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                <p className="text-xs text-gray-500">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Notifications</h3>
          <p className="text-gray-600">You're all caught up!</p>
        </div>
      )}
    </div>
  );
}
