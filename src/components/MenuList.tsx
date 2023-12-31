import { useNavigate } from "react-router-dom";
import { BsHouse } from "react-icons/bs";
import { MdLogout, MdLogin } from "react-icons/md";
import { BiUserCircle } from "react-icons/bi";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../firebaseApp";
import { toast } from "react-toastify";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdNotifications } from "react-icons/io";
import useTranslation from "../hooks/useTranslation";

const MenuList = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const t = useTranslation();

  const auth = getAuth(app);

  const logout = async () => {
    await signOut(auth);
    toast.success("로그아웃 되었습니다.");
  };

  return (
    <div className="footer">
      <div className="footer_grid">
        <button type="button" onClick={() => navigate("/")}>
          <BsHouse />

          <span className="footer_grid-text">{t("MENU_HOME")}</span>
        </button>
        <button type="button" onClick={() => navigate("/profile")}>
          <BiUserCircle />
          <span className="footer_grid-text">{t("MENU_PROFILE")}</span>
        </button>
        <button type="button" onClick={() => navigate("/search ")}>
          <AiOutlineSearch />
          <span className="footer_grid-text">{t("MENU_SEARCH")}</span>
        </button>
        <button type="button" onClick={() => navigate("/notifications ")}>
          <IoMdNotifications />
          <span className="footer_grid-text">{t("MENU_NOTICE")}</span>
        </button>
        {user === null ? (
          <button type="button" onClick={() => navigate("/")}>
            <MdLogin />
            <span className="footer_grid-text">{t("MENU_LOGIN")}</span>
          </button>
        ) : (
          <button type="button" onClick={logout}>
            <MdLogout />
            <span className="footer_grid-text">{t("MENU_LOGOUT")}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuList;
