import { createBrowserRouter } from "react-router";
import LandingPage from "./pages/LandingPage";
import AuthLogin from "./pages/auth/AuthLogin";
import AlumniRegister from "./pages/auth/AlumniRegister";
import WaitingApproval from "./pages/auth/WaitingApproval";
import ApprovalSuccess from "./pages/auth/ApprovalSuccess";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AlumniManagement from "./pages/admin/AlumniManagement";
import VerificationRequests from "./pages/admin/VerificationRequests";
import PostsManagement from "./pages/admin/PostsManagement";
import JobsManagement from "./pages/admin/JobsManagement";
import GurupadigamMessages from "./pages/admin/GurupadigamMessages";
import AdminNotifications from "./pages/admin/Notifications";

import AlumniLayout from "./layouts/AlumniLayout";
import AlumniHome from "./pages/alumni/Home";
import CreatePost from "./pages/alumni/CreatePost";
import ViewAchievements from "./pages/alumni/Achievements";
import ViewJobs from "./pages/alumni/Jobs";
import Messages from "./pages/alumni/Messages";
import Profile from "./pages/alumni/Profile";
import AlumniNotifications from "./pages/alumni/Notifications";

import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/auth/login",
    Component: AuthLogin,
  },
  {
    path: "/auth/admin",
    Component: AuthLogin,
  },
  {
    path: "/auth/alumni",
    Component: AuthLogin,
  },
  {
    path: "/auth/register",
    Component: AlumniRegister,
  },
  {
    path: "/auth/waiting",
    Component: WaitingApproval,
  },
  {
    path: "/auth/approved",
    Component: ApprovalSuccess,
  },
  {
    path: "/auth/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/auth/reset-password",
    Component: ResetPassword,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "alumni-management", Component: AlumniManagement },
      { path: "verification", Component: VerificationRequests },
      { path: "posts", Component: PostsManagement },
      { path: "jobs", Component: JobsManagement },
      { path: "messages", Component: GurupadigamMessages },
      { path: "notifications", Component: AdminNotifications },
    ],
  },
  {
    path: "/alumni",
    Component: AlumniLayout,
    children: [
      { index: true, Component: AlumniHome },
      { path: "post", Component: CreatePost },
      { path: "achievements", Component: ViewAchievements },
      { path: "jobs", Component: ViewJobs },
      { path: "messages", Component: Messages },
      { path: "profile", Component: Profile },
      { path: "notifications", Component: AlumniNotifications },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
