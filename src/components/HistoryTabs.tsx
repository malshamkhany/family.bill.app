import React, { useState } from 'react';

interface HistoryTabsProps {
  onTabChange?: (tab: "list" | "graph") => void;
  selected?: "list" | "graph"
}

const HistoryTabs = ({ onTabChange, selected }: HistoryTabsProps) => {
  const [selectedState, setSelectedState] = useState(selected);
  const handleTabChange = (tab: "list" | "graph") => {
    setSelectedState(tab)
    onTabChange(tab);
  };

  return (
    <div className="relative w-fit flex p-1 bg-[#192428] rounded-lg">
      <input
        type="radio"
        name="tab"
        id="tab1"
        checked={selectedState === "list"}
        className="tab tab--1 opacity-0 absolute"
        onChange={() => handleTabChange('list')}
      />
      <label htmlFor="tab1" className="relative z-[999] flex items-center justify-center w-32 h-7 border-0 text-md opacity-90 cursor-pointer">
        List View
      </label>

      <input
        type="radio"
        name="tab"
        id="tab2"
        checked={selectedState === "graph"}
        className="tab tab--2 opacity-0 absolute"
        onChange={() => handleTabChange('graph')}
      />
      <label htmlFor="tab2" className="relative z-[999] flex items-center justify-center w-32 h-7 border-0 text-md opacity-90 cursor-pointer">
        Graph View
      </label>

      <div className="absolute top-1 left-[0.75rem] z-10 w-28 h-7 bg-[#0784b5] rounded-lg shadow-md transition-all duration-200 ease-out indicator"></div>
    </div>
  );
};

export default HistoryTabs;
