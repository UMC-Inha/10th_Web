const CommentSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <div className="w-24 h-4 bg-gray-200 rounded" />
      </div>
      <div className="w-full h-4 bg-gray-200 rounded" />
      <div className="w-3/4 h-4 bg-gray-200 rounded" />
    </div>
  );
};

export default CommentSkeleton;