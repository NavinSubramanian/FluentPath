import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import boy from '../assets/images/boy.png';
import bell from '../assets/images/bell.png';
import coinIcon from '../assets/images/star.png';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faPlayCircle, faLock } from '@fortawesome/free-solid-svg-icons';

const Courseoverview = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const email = Cookies.get('email'); // Get user email from cookies

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://fluent-path.vercel.app/api/course/${id}`, {
        params: { email },
      });
      const { course, isEnrolled, courseData } = response.data;
      setCourse(course);
      setIsEnrolled(isEnrolled);
      setCourseData(courseData);
    } catch (error) {
      console.error('Failed to fetch course details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [id, email]);

  const handleEnroll = async () => {
    try {
      const response = await axios.post('https://fluent-path.vercel.app/api/enroll/enrollcourse', {
        email,
        moduleId: id,
      });
      alert(response.data.message);
      setIsEnrolled(true);
      fetchCourseDetails(); // Refetch course details after enrollment
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to enroll in course');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <>
      <Header />
      <div className="course-header">
        <div className="profile-section">
          <img src={boy} alt="profile" className="profile-image" />
          <div className="profile-text">
            <h1>
              Welcome, <span className="username">User</span>
            </h1>
            <p>E-mail: {email}</p>
          </div>
        </div>
        <div className="notification-section">
          <img src={bell} alt="notify" className="notification-icon" />
          <div className="coins">
            <img src={coinIcon} alt="coin" className="coin-image" />
            <span className="coin-amount">3500</span>
          </div>
        </div>
      </div>

      <div className="course-detail-container">
        <div className="course-info">
          <h1>{course.title}</h1>
          <div className="course-meta">
            <span className="course-tag">{course.moduleId || 'General'}</span>
          </div>
          <img src={course.bannerImage} alt="Course" className="course-image" />
          <h2>Description</h2>
          <p>{course.description}</p>
        </div>

        <div className="course-sidebar">
          {!isEnrolled ? (
            <>
              <div className='course-sidebar-main-details'>
                <h3>Total Modules: <span>{course.totalSubmodules}</span></h3>
                <h3>Time: <span>{course.totalTime}</span></h3>
              </div>
              <div className="course-enroll">
                <span className="course-price">Free</span>
                <button className="enroll-button" onClick={handleEnroll}>
                  Enroll Now
                </button>
              </div>
              <div>
                <h1>Chapters</h1>
                <div className="lesson-list" style={{ marginTop: '10px' }}>
                  {course.submodules.map((chapter, index) => (
                    <div
                      key={chapter._id}
                      className="lesson-item  locked"
                    >
                      <div className="lesson-info">
                        <span className="lesson-index">{String(index + 1).padStart(2, '0')}</span>
                        <span className="lesson-title">{chapter.title}</span>
                      </div>
                      <div className="lesson-icon">
                        <FontAwesomeIcon icon={faLock} style={{ color: 'gray' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div>
              <h1>Chapters</h1>
              <p>
                {course.totalSubmodules} chapter(s) - time to complete: {course.totalTime} mins
              </p>
              <div className="lesson-list">
                {courseData?.modules?.map((chapter, index) => (
                  <div
                    key={chapter._id}
                    className={`lesson-item ${chapter.locked ? 'locked' : ''}`}
                    onClick={() => {
                      if (!chapter.locked) {
                        navigate(`/learn/${id}/home`);
                      } else {
                        alert('This module is locked!');
                      }
                    }}
                  >
                    <div className="lesson-info">
                      <span className="lesson-index">{String(index + 1).padStart(2, '0')}</span>
                      <span className="lesson-title">{chapter.title}</span>
                    </div>
                    <div className="lesson-icon">
                      {chapter.completion && (
                        <>
                          <p>COMPLETED</p>
                          <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} />
                        </>
                      )}
                      {!chapter.completion && !chapter.locked && (
                        <>
                          <p>ONGOING</p>
                          <FontAwesomeIcon icon={faPlayCircle} style={{ color: 'purple' }} />
                        </>
                      )}
                      {chapter.locked && (
                        <FontAwesomeIcon icon={faLock} style={{ color: 'gray' }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Courseoverview;
