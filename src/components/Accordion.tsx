import React, { ReactNode, useState } from "react";

interface AccordionProps {
    isOpen: boolean;
    toggleAccordion: () => void;
    header: React.ReactNode;
    content: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({
    content,
    header,
    isOpen,
    toggleAccordion,
}) => {
    return (
        <div>
            <div onClick={toggleAccordion}>{header}</div>
            {isOpen && <div>{content}</div>}
        </div>
    );
};

export default Accordion;
