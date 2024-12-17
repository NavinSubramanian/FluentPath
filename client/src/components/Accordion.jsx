import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Accordion = (props) => {
    const [activeIndex, setActiveIndex] = useState(null);
    const navigate = useNavigate();

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="accordion">
            {props.modules.map((module, index) => (
                <div key={module._id} className="accordionItem">
                    <div
                        className={`accordionHeader 
                            ${module.locked ? "lockedmod" : 
                            module.completion ? "completedmod" : "unlockedmod"
                        }`} 
                        onClick={() => toggleAccordion(index)}
                    >
                        <h2>{module.title}</h2>
                        <span>{activeIndex === index ? '-' : '+'}</span>
                    </div>
                    {activeIndex === index && (
                        <div className="accordionContent">
                            {module.locked ? (
                                <>
                                    <p><strong>Status:</strong> Locked</p>
                                    <p><strong>Module:</strong> {module.title}</p>
                                </>
                            ) : module.completion ? (
                                <>
                                    <p><strong>Status:</strong> Completed</p>
                                    
                                    <button
                                        className="resumeBtn"
                                        onClick={() => {navigate(`/learn/${props.courseid}/home/module/${module.moduleId}`)}}>
                                        Learn Module Again
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p><strong>Status:</strong> Ongoing</p>
                                    <button
                                        className="resumeBtn"
                                        onClick={() => {navigate(`/learn/${props.courseid}/home/module/${module.moduleId}`)}}>
                                        Resume
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Accordion;
