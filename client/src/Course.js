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
export const courses1 = [
  {
    id: 1,
    image: 'https://img.freepik.com/free-vector/online-tutorials-concept_52683-37481.jpg?w=740',
    title: 'Learn Basic HTML',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    time: '2h 30min',
    chapters: '15 Chapters',
    topic: 'Grammar',
    mentor: 'xyz',
    level: 'Basic',
  },
  {
    id: 2,
    image: 'https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg?w=740',
    title: 'Learn CSS Basics',
    time: '3h 15min',
    chapters: '18 Chapters',
    topic: 'Grammar',
    mentor: 'xyz',
    level: 'Basic',
  },
  {
    id: 3,
    image: 'https://img.freepik.com/free-vector/building-websites-concept-illustration_114360-1524.jpg?w=740',
    title: 'Introduction to JavaScript',
    time: '4h 00min',
    chapters: '20 Chapters',
    topic: 'Grammar',
    mentor: 'xyz',
    level: 'Basic',
  },
  {
    id: 4,
    image: 'https://img.freepik.com/free-vector/coding-concept-illustration_114360-1081.jpg?w=740',
    title: 'Advanced React.js Concepts',
    time: '5h 30min',
    chapters: '25 Chapters',
    topic: 'Grammar',
    mentor: 'xyz',
    level: 'Basic',
  },
  {
    id: 5,
    image: 'https://img.freepik.com/free-vector/developer-concept-illustration_114360-1990.jpg?w=740',
    title: 'Mastering Node.js',
    time: '6h 45min',
    chapters: '30 Chapters',
    topic: 'Grammar',
    mentor: 'xyz',
    level: 'Basic',
  }
];
const CourseCard = ({ id, image, title, time, chapters }) => {
  const navigate = useNavigate()
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
            <img src={clockIcon} alt="clock" className="icon" /> {time} mins
          </span>
          <span> | </span>
          <span>
            <img src={bookIcon} alt="book" className="icon" /> {chapters} chapters
          </span>
        </div>
        <Link to={`/course/${id}`} className="course-link">Check it Out ➔</Link>
        {/* <button onClick={handleEnroll} className="enroll-button">Enroll</button> */}
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
      {availableCourses.map((course) => (
        <CourseCard
          key={course.id}
          id={course.id}
          image={course.image}
          title={course.title}
          time={course.time}
          chapters={course.chapters}
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
        {email ?
          <div className="notification-section">

          </div>
          : <>
          </>}
      </div>
      <div className="course-wrapper">
        <div className="course-intro">
          <h1>Investing in Knowledge and Your Future</h1>
          <p>
            Ready to take your skills to the next level? Why settle for average when you can learn from the very best?
            <br />
            Our courses are designed by leading experts, ensuring you get top-notch training that’s relevant, up-to-date, and
            <br />
            highly effective.
          </p>
        </div>
        <div className="course-image">
          <img src={study} alt="Students learning" />
        </div>
      </div>
      <div className="course-layout">
        <div className="course-head">
          <h1>Basic Courses</h1>
        </div>
      </div>
      <CourseList />
    </div>
  );
};

export default Course;
