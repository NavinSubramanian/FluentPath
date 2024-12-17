import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
const UploadExcel = () => {
  const [file, setFile] = useState(null);
  const [bannerLink, setBannerLink] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [message, setMessage] = useState("");
  // const isAdmin=Cookies.get('isAdmin')
  const navigate = useNavigate();
  useEffect(() => {
    const isAdmin = Cookies.get("isAdmin");
    if (isAdmin !== "true") {
      navigate("/"); // Redirect to the homepage if not admin
    }
  }, [navigate]);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleBannerLinkChange = (e) => {
    setBannerLink(e.target.value);
  };

  const handleCourseTitleChange = (e) => {
    setCourseTitle(e.target.value);
  };

  const handleCourseDescriptionChange = (e) => {
    setCourseDescription(e.target.value);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    if (!courseTitle.trim()) {
      setMessage("Please enter the course title.");
      return;
    }

    if (!courseDescription.trim()) {
      setMessage("Please enter the course description.");
      return;
    }

    if (!bannerLink.trim()) {
      setMessage("Please enter a banner image link.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bannerImage", bannerLink); // Add the banner link to the form data
    formData.append("title", courseTitle); // Add course title
    formData.append("description", courseDescription); // Add course description

    try {
      const response = await axios.post(
        "https://fluent-path.vercel.app/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage("Failed to upload file.");
    }
  };

  return (
    <div>
      <h1>Upload Grammar Excel</h1>
      <form onSubmit={handleUpload}>
        <div>
          <label>Course Title:</label>
          <input
            type="text"
            value={courseTitle}
            onChange={handleCourseTitleChange}
            placeholder="Enter course title"
          />
        </div>
        <div>
          <label>Course Description:</label>
          <textarea
            value={courseDescription}
            onChange={handleCourseDescriptionChange}
            placeholder="Enter course description"
          />
        </div>
        <div>
          <label>Banner Image Link:</label>
          <input
            type="text"
            value={bannerLink}
            onChange={handleBannerLinkChange}
            placeholder="Enter banner image URL"
          />
        </div>
        <div>
          <label>Excel File:</label>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        </div>
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadExcel;
