import React from 'react';

interface RoadmapConnectorProps {
  active?: boolean;
}

const RoadmapConnector: React.FC<RoadmapConnectorProps> = ({ active = false }) => {
  return (
    <div className="flex justify-center w-full h-8 -my-1">
      <div 
        className={`w-0.5 h-full ${
          active ? 'bg-emerald-500' : 'bg-zinc-800'
        } transition-all duration-500`}
      />
    </div>
  );
};

export default RoadmapConnector;
