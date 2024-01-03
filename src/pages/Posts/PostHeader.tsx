import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const PostHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="post_header">
      <button type="button" onClick={() => navigate(-1)}>
        <IoIosArrowBack />
      </button>
    </div>
  );
};

export default PostHeader;
