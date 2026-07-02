import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Bell, CheckCircle, Briefcase, Trophy, Newspaper, Info, Trash2, CheckCheck, BookOpen } from "lucide-react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  type NotificationItem
} from "@/lib/api";

export default function AlumniNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchNotifications();
  }, []);

  async function fetchNotifications() {
    setLoading(true);
    const response = await getNotifications();
    if (response.success) {
      setNotifications(response.data || []);
    }
    setLoading(false);
  }

  const unreadCount = notifications.filter((n) => n.is_read === 0).length;

  const handleMarkRead = async (id: number) => {
    const response = await markNotificationRead(id);
    if (response.success) {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: 1 } : n)
      );
      window.dispatchEvent(new Event("notifications_updated"));
    }
  };

  const getRedirectPath = (type: string) => {
    switch (type) {
      case "job":
        return "/alumni/jobs";
      case "achievement":
        return "/alumni/achievements";
      case "gurupadigam":
        return "/alumni/messages";
      case "newsletter":
        return "/alumni/newsletter";
      case "mentorship":
        return "/alumni/community?tab=mentorship";
      default:
        return null;
    }
  };

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (notification.is_read === 0) {
      await handleMarkRead(notification.id);
    }
    const redirectPath = getRedirectPath(notification.type);
    if (redirectPath) {
      navigate(redirectPath);
    }
  };

  const handleMarkAllRead = async () => {
    const response = await markAllNotificationsRead();
    if (response.success) {
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: 1 }))
      );
      window.dispatchEvent(new Event("notifications_updated"));
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const response = await deleteNotification(id);
    if (response.success) {
      setNotifications(prev => prev.filter(n => n.id !== id));
      window.dispatchEvent(new Event("notifications_updated"));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "job":
        return <Briefcase className="w-5 h-5 text-[#0A66C2]" />;
      case "achievement":
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case "gurupadigam":
        return <Bell className="w-5 h-5 text-indigo-500" />;
      case "newsletter":
        return <Newspaper className="w-5 h-5 text-green-500" />;
      case "mentorship":
        return <BookOpen className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case "job":
        return "bg-blue-50";
      case "achievement":
        return "bg-amber-50";
      case "gurupadigam":
        return "bg-indigo-50";
      case "newsletter":
        return "bg-green-50";
      case "mentorship":
        return "bg-purple-50";
      default:
        return "bg-gray-50";
    }
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Notifications</h3>
          <p className="text-gray-600">Stay updated with your community activity</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <>
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#0A66C2] hover:bg-blue-100/50 rounded-xl font-medium text-sm transition-all"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </button>
              <div className="px-4 py-2 bg-blue-100 text-[#0A66C2] rounded-xl font-medium text-sm">
                {unreadCount} Unread
              </div>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-[#0A66C2] mx-auto"></div>
          <p className="text-gray-500 mt-4 font-medium">Loading notifications...</p>
        </div>
      ) : notifications.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200 overflow-hidden shadow-sm">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-5 hover:bg-gray-50/80 transition-colors cursor-pointer relative group ${
                notification.is_read === 0 ? "bg-blue-50/20" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${getNotificationBg(notification.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className={`font-semibold ${notification.is_read === 0 ? "text-gray-900" : "text-gray-700"}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {notification.is_read === 0 && (
                        <div className="w-2.5 h-2.5 bg-[#0A66C2] rounded-full flex-shrink-0"></div>
                      )}
                      <button
                        onClick={(e) => handleDelete(notification.id, e)}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                  <p className="text-xs text-gray-400 font-medium">{formatTime(notification.created_at)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Notifications</h3>
          <p className="text-gray-600">You're all caught up!</p>
        </div>
      )}
    </div>
  );
}
