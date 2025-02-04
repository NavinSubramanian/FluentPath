import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header'; // Header component
import study from './assets/images/study.png';
import bell from './assets/images/bell.png';
import boy from './assets/images/boy.png';
import coinIcon from './assets/images/star.png';
import clockIcon from './assets/images/clock.png';
import bookIcon from './assets/images/chapter.png';

const email = Cookies.get('email');
const isAdmin = Cookies.get('isAdmin') === 'true';
let email2 = '';
if (email) {
  email2 = email.split('@')[0];
}

const CourseCard = ({ id, image, title, time, chapters }) => {
  const navigate = useNavigate()
  const email = Cookies.get('email')
  console.log(id)
  const handleEnroll = async () => {
    if (!email) {
      alert('Please log in to enroll in the course.');
      return;
    }


    try {
      const response = await axios.post('https://fluent-path.vercel.app/api/enroll/enrollcourse', { email, moduleId: id });
      alert(response.data.message);
      if (response.data.message === 'Successfully enrolled in course') {
        navigate(`/course/${id}`)
      }

    } catch (error) {
      alert(error.response?.data?.message || 'Failed to enroll in course');
    }
  };

  return (
    <div className="course-card">
      <img src={image} alt={title} className="course-image" />
      <div className="course-info">
        <h3>{title}</h3>
        <div className="course-details">
          <span>
            <img src={bookIcon} alt="book" className="icon" /> {chapters} chapters
          </span>
        </div>
        <Link to={`/course/${id}`} className="course-link">Check it Out ➔</Link>
      </div>
    </div>
  );
};

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const email = Cookies.get('email')
    const fetchCourses = async () => {
      try {
        // Fetch all available courses
        const courseResponse = await axios.get('https://fluent-path.vercel.app/api/upload/courses');
        setCourses(courseResponse.data.courses || []);

        // Fetch enrolled courses for the user
        const enrolledResponse = await axios.get('https://fluent-path.vercel.app/api/enroll/getenrolledcourses', {
          params: { email },
        });

        setEnrolledCourses(enrolledResponse.data.enrolledCourses || []);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.log('No enrolled courses found');
          // If 404, assume no enrolled courses
          setEnrolledCourses([]);
        } else {
          setError('Failed to fetch courses');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  console.log(enrolledCourses)
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  const availableCourses = enrolledCourses.length
    ? courses.filter((course) => !enrolledCourses.some((enrolled) => enrolled.courseId === course.id))
    : courses;
  return (
    <div className="course-list">
      {enrolledCourses.map((course) => (
        <CourseCard
          key={course.courseId}
          id={course.courseId}
          image={course.image}
          title={course.title}
          time={course.time}
          chapters={course.modules.length}
        />
      ))}
    </div>
  );
};
const Course = () => {
  const email = Cookies.get('email');
  const isAdmin = Cookies.get('isAdmin') === 'true';
  let email2 = '';
  if (email) {
    email2 = email.split('@')[0];
  }
  return (
    <div>
      <Header />
      <div className="course-header">
        <div className="profile-section">
          <img src={boy} alt="profile" className="profile-image" />
          <div className="profile-text">
            <h1>
              Welcome, <span className="username">User</span>
            </h1>
            <p>E-mail: {email || ""}</p>
          </div>
        </div>
        <div className="notification-section">
          {/* <img src={bell} alt="notify" className="notification-icon" />
          <div className="coins">
            <img src={coinIcon} alt="coin" className="coin-image" />
            <span className="coin-amount">3500</span>
          </div> */}
        </div>
      </div>
      <div className="course-layout">
        <div className="course-head">
          <h1>Enrolled Courses</h1>
        </div>
        <CourseList />
      </div>
    </div>
  );
};

export default Course;
