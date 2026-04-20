import React from 'react';

interface RoadmapConnectorProps {
  active?: boolean;
}

const RoadmapConnector: React.FC<RoadmapConnectorProps> = ({ active = false }) => {
  return (
    <div className="flex justify-center w-full h-8 -my-1">
      <div 
        className={`w-0.5 h-full ${
          active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-zinc-800'
        } transition-all duration-500`}
      />
    </div>
  );
};

export default RoadmapConnector;
