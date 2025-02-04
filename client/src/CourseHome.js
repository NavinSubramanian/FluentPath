import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import Cookies from 'js-cookie';
import Accordion from './components/Accordion';

const CourseHome = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [section, setSection] = useState(1);
    const email = Cookies.get('email'); // Get email from cookies
    const [courseData, setCourseData] = useState(null); // Stores course data
    const [loading, setLoading] = useState(true); // Loading state
    const modules = [
        {
            name: 'Introduction',
            time: '1hr',
            status: 'Completed',
            quiz: 'Not Taken',
        },
        {
            name: 'Getting Started',
            time: '1hr',
            status: 'Ongoing',
            quiz: 'Not Taken',
        },
        {
            name: 'Advanced Concepts',
            time: '1hr',
            status: 'Locked',
            quiz: 'Not Taken',
        },
        {
            name: 'Final Project',
            time: '1hr',
            status: 'Locked',
            quiz: 'Not Taken',
        }
    ];
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await axios.get(`https://fluent-path.vercel.app/api/course/${id}`, {
                    params: { email },
                });
                console.log(response.data)
                setCourseData(response.data.courseData);
            } catch (error) {
                console.error('Error fetching course data:', error);
                alert('Failed to load course data. Redirecting...');
                navigate('/course');
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [id, email, navigate]);

    if (loading) {
        return <div className="loading">Loading course details...</div>;
    }

    if (!courseData) {
        return <div className="error">Course not found or user not enrolled.</div>;
    }



    return (
        <>
            <nav className="courseHomeNav">
                <div>
                    <h1 onClick={() => { navigate('/') }}>FLUENTPATH</h1>
                    <h3 onClick={() => { navigate('/course') }}>Courses</h3>
                </div>
                <div className="profileDiv" >
                    <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                    <h2 onClick={() => { navigate('/enrolledcourse') }}>PROFILE</h2>
                </div>
            </nav>
            <div className="courseHomeMain">
                <div className="leftCourseHome">
                    <h2>{courseData.title}</h2>
                    <hr />
                    <p onClick={() => setSection(1)} className={`list-elements ${section === 1 ? 'activeEle' : ''}`}>Course Overview</p>
                    <p onClick={() => setSection(2)} className={`list-elements ${section === 2 ? 'activeEle' : ''}`}>Practice Test</p>
                </div>

                <div className="rightCourseHome">
                    {section === 1 ? (
                        <>
                            <div className="topRightCourseHome">
                                <img src="https://img.freepik.com/free-vector/online-tutorials-concept_52683-37481.jpg?w=740" alt="Course Overview" />
                                <div>
                                    <h3>{courseData.title}</h3>
                                    <h4 style={{ fontWeight: '200' }}><strong>ID</strong>: {courseData.courseId}</h4>
                                </div>
                            </div>
                            <p className="borderBox">
                                This course will provide a solid understanding of {courseData.title},
                                in a interactive and fun to learn way!
                            </p>
                            <div className="borderBox">
                                <h2>Modules</h2>
                                <Accordion modules={courseData.modules} courseid={id} />
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 style={{marginBottom:'20px'}}>Practice Test</h1>
                            <p style={{marginBottom:'20px'}}><b>Remainder:</b> This test can only be taken once after which the test page will not show, however you can download your test performance</p>
                            <a className='enroll-btn' href={`${courseData.testLink}`}>Start Test</a>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CourseHome;
// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import Cookies from 'js-cookie';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUser, faCheckCircle, faPlayCircle, faLock } from '@fortawesome/free-solid-svg-icons';

// import Accordion from './components/Accordion';

// const CourseHome = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [section, setSection] = useState(1); // Handles navigation (Course Overview / Resources)
//     const [courseData, setCourseData] = useState(null); // Stores course data
//     const [loading, setLoading] = useState(true); // Loading state

//     const email = Cookies.get('email'); // Get email from cookies

//     useEffect(() => {
//         const fetchCourseData = async () => {
//             try {
//                 const response = await axios.get(`https://fluent-path.vercel.app/api/course/${id}`, {
//                     params: { email },
//                 });
//                 console.log(response.data)
//                 setCourseData(response.data.courseData);
//             } catch (error) {
//                 console.error('Error fetching course data:', error);
//                 alert('Failed to load course data. Redirecting...');
//                 navigate('/course');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCourseData();
//     }, [id, email, navigate]);

//     if (loading) {
//         return <div className="loading">Loading course details...</div>;
//     }

//     if (!courseData) {
//         return <div className="error">Course not found or user not enrolled.</div>;
//     }

//     return (
//         <>
//             <nav className="courseHomeNav">
//                 <div>
//                     <h1 onClick={() => navigate('/')}>FLUENTPATH</h1>
//                     <h3 onClick={() => navigate('/course')}>Courses</h3>
//                 </div>
//                 <div className="profileDiv">
//                     <FontAwesomeIcon icon={faUser} />
//                     <h2>PROFILE</h2>
//                 </div>
//             </nav>
//             <div className="courseHomeMain">
//                 <div className="leftCourseHome">
//                     <h2>{courseData.title}</h2>
//                     <hr />
//                     <p onClick={() => setSection(1)} className={`list-elements ${section === 1 ? 'activeEle' : ''}`}>Course Overview</p>
//                     <p onClick={() => setSection(2)} className={`list-elements ${section === 2 ? 'activeEle' : ''}`}>Resources</p>
//                 </div>

//                 <div className="rightCourseHome">
//                     {section === 1 ? (
//                         <>
//                             <div className="topRightCourseHome">
//                                 <img src="https://img.freepik.com/free-vector/online-tutorials-concept_52683-37481.jpg?w=740" alt="Course Overview" />
//                                 <div>
//                                     <h3>{courseData.title}</h3>
//                                     <h4><strong>Total Time:</strong> {courseData.totalTime}</h4>
//                                     <h4><strong>Quizzes:</strong> {courseData.quizCount}</h4>
//                                 </div>
//                             </div>
//                             <p className="borderBox">{courseData.description}</p>
//                             <div className="borderBox">
//                                 <h2>Modules</h2>
//                                 <div className="lesson-list">
//                                     {courseData.modules.map((module, index) => (
//                                         <div key={module._id} className={`lesson-item ${module.locked ? 'locked' : ''}`}>
//                                             <div className="lesson-info">
//                                                 <span className="lesson-index">{String(index + 1).padStart(2, '0')}</span>
//                                                 <span className="lesson-title">{module.title}</span>
//                                             </div>
//                                             <div className="lesson-icon">
//                                                 {module.completion && (
//                                                     <>
//                                                         <p>COMPLETED</p>
//                                                         <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} />
//                                                     </>
//                                                 )}
//                                                 {!module.completion && !module.locked && (
//                                                     <>
//                                                         <p>ONGOING</p>
//                                                         <FontAwesomeIcon icon={faPlayCircle} style={{ color: 'purple' }} />
//                                                     </>
//                                                 )}
//                                                 {module.locked && (
//                                                     <FontAwesomeIcon icon={faLock} style={{ color: 'gray' }} />
//                                                 )}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </>
//                     ) : (
//                         <h1>Resources</h1>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default CourseHome;
