import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/Home/homePage";
import PostListPage from "../pages/Posts/PostListPage";
import PostDetail from "../pages/Posts/PostDetail";
import PostNew from "../pages/Posts/PostNew";
import PostEdit from "../pages/Posts/PostEdit";
import ProfileEdit from "../pages/Profile/ProfileEdit";
import ProfilePage from "../pages/Profile/ProfilePage";
import SearchPage from "../pages/Search/SearchPage";
import NotificationsPage from "../pages/Notifications/NotificationsPage";
import LoginPage from "../pages/Users/LoginPage";
import SignupPage from "../pages/Users/SignupPage";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/posts" element={<PostListPage />} />
      <Route path="/posts/:id" element={<PostDetail />} />
      <Route path="/posts/new" element={<PostNew />} />
      <Route path="/posts/edit/:id" element={<PostEdit />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/edit/:id" element={<ProfileEdit />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/users/login" element={<LoginPage />} />
      <Route path="/users/signup" element={<SignupPage />} />
      <Route path="*" element={<Navigate replace to={"/"}></Navigate>} />
    </Routes>
  );
};

export default Router;
