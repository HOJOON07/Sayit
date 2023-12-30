import { useNavigate } from "react-router-dom";
import { BsHouse } from "react-icons/bs";
import { MdLogout, MdLogin } from "react-icons/md";
import { BiUserCircle } from "react-icons/bi";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../firebaseApp";
import { toast } from "react-toastify";

const MenuList = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

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
          Home
        </button>
        <button type="button" onClick={() => navigate("/profile")}>
          <BiUserCircle />
          Profile
        </button>
        {user === null ? (
          <button type="button" onClick={() => navigate("/")}>
            <MdLogin />
            Login
          </button>
        ) : (
          <button type="button" onClick={logout}>
            <MdLogout />
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuList;
