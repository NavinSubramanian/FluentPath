import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Footer from './Footer';
import axios from 'axios';
import Cookies from 'js-cookie';

const CourseModule = () => {
    const navigate = useNavigate();
    const { id: courseId, moduleid: moduleId } = useParams();
    const [module, setModule] = useState(null);
    const [activeSection, setActiveSection] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDeclarationChecked, setIsDeclarationChecked] = useState(false); // Checkbox state
    const email = Cookies.get('email'); // Get user email from cookies

    // Fetch module data from the backend
    useEffect(() => {
        const fetchModuleData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/course/${courseId}/module/${moduleId}`,
                    { params: { email: email } } // Include email for enrollment check
                );

                const submodule = response.data.submodule;
                console.log(submodule)
                // Add a declaration section at the end of the submodule
                const sectionsWithDeclaration = [
                    ...submodule.sections,
                    {
                        _id: 'declaration', // Unique ID for declaration
                        title: 'Declaration',
                        content: 'I declare that I have completed this submodule.',
                        isDeclaration: true, // Special flag for declaration
                        locked: false, // Declaration should never be locked
                        completed: false, // Initial state
                    },
                ];

                setModule({ ...submodule, sections: sectionsWithDeclaration });
                setLoading(false);
            } catch (err) {
                console.error('Error fetching module data:', err);
                setError(err.response?.data?.message || 'Failed to load module data');
                setLoading(false);
            }
        };
        fetchModuleData();
    }, [courseId, moduleId]);

    // Handle section completion
    // const handleCompletion = async (sectionIndex) => {
    //     const isDeclaration = module.sections[sectionIndex]?.isDeclaration;

    //     try {
    //         const response = await axios.post(
    //             `http://localhost:5000/api/course/${courseId}/module/${moduleId}/complete`,
    //             {
    //                 sectionId: module.sections[sectionIndex]._id,
    //                 isDeclaration,
    //                 email,
    //             }
    //         );

    //         setModule(response.data.module); // Update module data after completion
    //         if (!isDeclaration) {
    //             setActiveSection(sectionIndex + 1); // Move to the next section if available
    //         } else {
    //             alert('Submodule completed successfully!');
    //         }
    //     } catch (err) {
    //         console.error('Error updating section completion:', err);
    //     }
    // };
    const handleCompletion = async (sectionIndex) => {
        const isDeclaration = module.sections[sectionIndex]?.isDeclaration;
    
        try {
            // Update module status in the course completion schema
            const response = await axios.post(
                `http://localhost:5000/api/course/${courseId}/module/${moduleId}/complete`,
                {
                    email,
                    moduleName: module.title,
                    courseTitle: module.courseTitle,
                }
            );
    
            console.log('Completion updated:', response.data);
    
            if (isDeclaration) {
                alert('Submodule completed successfully!');
                navigate(`/learn/${courseId}/home`)
            } else {
                setActiveSection(sectionIndex + 1); // Move to the next section
            }
        } catch (err) {
            console.error('Error updating module completion:', err);
        }
    };
    
    // Render content based on section type
    const renderContent = (section) => {
        if (!section) return null;

        return (
            <>
                {section.content && <p dangerouslySetInnerHTML={{ __html: section.content }} className='mainContentCourseHomePage'/>}
                {section.videoLink && (
                    <iframe
                        src={section.videoLink}
                        title="Video Content"
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                )}
                {section.example && <p><strong>Example:</strong> {section.example}</p>}
                {section.image && (
                    <img
                        src={section.image}
                        alt="Reference"
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                )}
            </>
        );
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const sections = module?.sections || []; // Directly use sections from module

    return (
        <>
            <nav className="courseHomeNav">
                <div>
                    <h1 onClick={() => navigate('/')}>FLUENT PATH</h1>
                    <h3 onClick={() => navigate('/course')}>Courses</h3>
                </div>
                <div className="profileDiv" onClick={()=>{navigate('/enrolledcourse')}}>
                    <FontAwesomeIcon icon={faUser} />
                    <h2>PROFILE</h2>
                </div>
            </nav>

            <div className="modulePage">
                <div className="moduleSidebar">
                    <h2>{module.title}</h2>
                    <ul>
                        {sections.map((section, index) => (
                            <li key={section._id} className={activeSection === index ? 'active' : ''}>
                                <button
                                    onClick={() => {
                                        setActiveSection(index);
                                        setIsDeclarationChecked(false); // Reset checkbox state
                                    }}
                                    disabled={section.locked}
                                >
                                    {section.title}
                                </button>
                                {section.completed && <span className="completed">✔</span>}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="moduleContent">
                    <h3>{sections[activeSection]?.title || ""}</h3>
                    <div className="contentSection">
                        {renderContent(sections[activeSection])}
                    </div>
                    {sections[activeSection]?.isDeclaration && !sections[activeSection]?.completed && (
                        <div style={{ marginTop: "-197px" }} className='courseDeclarationDiv'>
                            <input
                                type="checkbox"
                                id="completed"
                                checked={isDeclarationChecked}
                                onChange={(e) => setIsDeclarationChecked(e.target.checked)}
                            />
                            <label htmlFor="completed">
                                I declare that I have completed this submodule.
                            </label>
                            <button className='enroll-btn'
                                onClick={() => handleCompletion(activeSection)}
                                disabled={!isDeclarationChecked}
                            >
                                Submit
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default CourseModule;
