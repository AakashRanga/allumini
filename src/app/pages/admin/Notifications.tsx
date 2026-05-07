import { Bell, CheckCircle, AlertCircle, Info, Clock } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "new_registration",
    title: "New Alumni Registration",
    message: "Alex Thompson has submitted a registration request",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "post_pending",
    title: "Post Pending Approval",
    message: "Sarah Johnson posted a new achievement",
    time: "15 minutes ago",
    read: false,
  },
  {
    id: 3,
    type: "job_posted",
    title: "New Job Posted",
    message: "Successfully posted Software Engineer position at Google",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 4,
    type: "verification",
    title: "Alumni Verified",
    message: "Emily Davis has been successfully verified",
    time: "2 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "message_sent",
    title: "Gurupadigam Message Sent",
    message: "Annual Reunion message sent to 1,248 alumni",
    time: "1 day ago",
    read: true,
  },
];

export default function AdminNotifications() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_registration":
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case "post_pending":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "job_posted":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "verification":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "message_sent":
        return <Info className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case "new_registration":
        return "bg-amber-50";
      case "post_pending":
        return "bg-blue-50";
      case "job_posted":
        return "bg-green-50";
      case "verification":
        return "bg-green-50";
      case "message_sent":
        return "bg-purple-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">Stay updated with platform activities</p>
        </div>
        {unreadCount > 0 && (
          <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-medium">
            {unreadCount} Unread
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-5 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-purple-50/30" : ""
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
                    <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-2"></div>
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
