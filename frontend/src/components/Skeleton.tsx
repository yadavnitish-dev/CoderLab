import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular";
  width?: string | number;
  height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "rectangular",
  width,
  height,
}) => {
  const baseStyles = "bg-zinc-900 relative overflow-hidden";

  const variantStyles = {
    text: "h-4 rounded-none",
    rectangular: "rounded-none",
    circular: "rounded-none",
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{ width, height }}
    >
      <div className="absolute inset-0 skeleton-shimmer" />
    </div>
  );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = "",
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? "60%" : "100%"}
          height={12}
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`border border-zinc-800 p-6 ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" width="40%" height={12} />
          <Skeleton variant="text" width="25%" height={10} />
        </div>
      </div>
      <Skeleton variant="text" height={10} />
      <Skeleton variant="text" height={10} width="80%" className="mt-2" />
    </div>
  );
};

export const SkeletonTable: React.FC<{
  rows?: number;
  cols?: number;
  className?: string;
}> = ({ rows = 5, cols = 4, className = "" }) => {
  return (
    <div className={`space-y-0 ${className}`}>
      <div className="flex border-b border-zinc-800">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="flex-1 p-3">
            <Skeleton variant="text" width="60%" height={10} />
          </div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex border-b border-zinc-800/50 hover:bg-zinc-900/30"
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1 p-3">
              <Skeleton
                variant="text"
                width={colIndex === 0 ? "70%" : "50%"}
                height={10}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const SkeletonButton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex gap-3 ${className}`}>
      <Skeleton width={100} height={36} />
      <Skeleton width={100} height={36} />
      <Skeleton width={100} height={36} />
    </div>
  );
};

export const SkeletonWorkspace: React.FC = () => {
  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r border-zinc-800 p-4 space-y-4">
        <Skeleton height={24} width="60%" />
        <Skeleton height={16} width="40%" />
        <div className="pt-4 space-y-2">
          <Skeleton height={12} />
          <Skeleton height={12} width="80%" />
          <Skeleton height={12} width="60%" />
        </div>
      </div>
      <div className="flex-1 p-4 space-y-4">
        <div className="flex justify-between">
          <Skeleton height={32} width={150} />
          <Skeleton height={32} width={100} />
        </div>
        <Skeleton height="100%" />
      </div>
    </div>
  );
};

export default Skeleton;