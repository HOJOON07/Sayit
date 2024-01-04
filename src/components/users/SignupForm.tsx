import {
  GithubAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithPopup,
} from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../../firebaseApp";
import { toast } from "react-toastify";

const SignupForm = () => {
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
      toast.success("성공적으로 회원가입이 되었습니다.");
    } catch (err: any) {
      console.log(err.code);
      toast.error("회원가입 에러");
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

      if (value?.length < 8) {
        setError("비밀번호는 8자리 이상 입력해주세요");
      } else if (value !== passwordConfirmation) {
        setError("비밀번호와 비밀번호 확인 값이 다릅니다.");
      } else {
        setError("");
      }
    }

    if (name === "password_confirmation") {
      setPasswordConfirmation(value);
      if (value?.length < 8) {
        setError("비밀번호는 8자리 이상 입력해주세요");
      } else if (value !== password) {
        setError("비밀번호와 비밀번호 확인 값이 다릅니다.");
      } else {
        setError("");
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
      <div className="form_title">회원가입</div>
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
      <div className="form_block">
        <label htmlFor="password_confirmation">비밀번호 확인</label>
        <input
          type="password"
          name="password_confirmation"
          id="password_confirmation"
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
        계정이 있으신가요?
        <Link to="/users/login" className="form_link">
          로그인하기
        </Link>
      </div>
      <div className="form_block-lg">
        <button type="submit" className="form_btn-submit">
          회원가입
        </button>
      </div>
      <div className="form_block-lg">
        <button
          type="button"
          name="google"
          className="form_btn-google"
          onClick={onClickSocialLogin}
        >
          Google로 회원가입
        </button>
      </div>
      <div className="form_block-lg">
        <button
          type="button"
          className="form_btn-github"
          name="github"
          onClick={onClickSocialLogin}
        >
          Github로 회원가입
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
