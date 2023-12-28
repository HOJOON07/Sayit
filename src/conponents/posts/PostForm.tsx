import React from "react";
import { FiImage } from "react-icons/fi";

const PostForm = () => {
  const handleFileUpload = () => {};
  return (
    <form className="post-form">
      <textarea
        className="post-form_textarea"
        id="content"
        name="content"
        placeholder="what is happening?"
        required
      ></textarea>
      <div className="post-form_submit-area">
        <label htmlFor="file-input" className="post-form-file">
          <FiImage className="post-form_file-icon"></FiImage>
        </label>
        <input
          type="file"
          name="file-input"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <input type="submit" value="Tweet" className="post-form_submit-btn" />
      </div>
    </form>
  );
};

export default PostForm;
