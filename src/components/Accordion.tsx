import React, { ReactNode, useState } from "react";

interface AccordionProps {
  header: React.ReactNode;
  content: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ content, header }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleAccordion = () => setIsOpen((pre) => !pre);

  return (
    <div>
      <div
        className="item"
        style={{
          backgroundColor: isOpen ? "#0784b5" : "#414c50",
        }}
        onClick={toggleAccordion}
      >
        {header}
      </div>
      {isOpen && <div>{content}</div>}
    </div>
  );
};

export default Accordion;
