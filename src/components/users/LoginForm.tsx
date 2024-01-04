import {
  GithubAuthProvider,
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { app } from "../../firebaseApp";

const LoginForm = () => {
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
      toast.success("성공적으로 로그인 되었습니다.");
    } catch (err: any) {
      console.log(err.code);
      toast.error("로그인 에러");
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") {
      setEmail(value);
      const validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      if (!value?.match(validRegex)) {
        setError("이메일 형식이 올바르지 않습니다.");
      } else {
        setError("");
      }
    }

    if (name === "password") {
      setPassword(value);
      setError("");
      if (value?.length < 8) {
        setError("비밀번호는 8자리 이상 입력해주세요");
      }
    }
  };

  const onClickSocialLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = e.target as HTMLButtonElement;

    const auth = getAuth(app);

    let provider;

    if (name === "google") {
      provider = new GoogleAuthProvider();
    }

    if (name === "github") {
      provider = new GithubAuthProvider();
    }

    await signInWithPopup(
      auth,
      provider as GithubAuthProvider | GoogleAuthProvider
    )
      .then((res) => {
        toast.success("로그인 되었습니다.");
      })
      .catch((err: Error) => {
        console.log(err);
        const errMessage = err?.message;
        toast.error(errMessage);
      });
  };
  return (
    <form className="form form-lg" onSubmit={onSubmit}>
      <div className="form_title">로그인</div>
      <div className="form_block">
        <label htmlFor="email">이메일</label>
        <input
          type="text"
          name="email"
          id="email"
          required
          onChange={onChange}
        />
      </div>
      <div className="form_block">
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          onChange={onChange}
        />
      </div>

      {error && error?.length > 0 && (
        <div className="form_block">
          <div className="form_error">{error}</div>
        </div>
      )}
      <div className="form_block">
        계정이 없으신가요?
        <Link to="/users/signup" className="form_link">
          회원가입 하기
        </Link>
      </div>
      <div className="form_block-lg">
        <button type="submit" className="form_btn-submit">
          로그인
        </button>
      </div>
      <div className="form_block-lg">
        <button
          type="button"
          name="google"
          className="form_btn-google"
          onClick={onClickSocialLogin}
        >
          Google로 로그인
        </button>
      </div>
      <div className="form_block-lg">
        <button
          type="button"
          className="form_btn-github"
          name="github"
          onClick={onClickSocialLogin}
        >
          Github로 로그인
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
