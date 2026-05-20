interface LpImageUploadProps {
  previewUrl: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function LpImageUpload({ previewUrl, fileInputRef, onFileChange }: LpImageUploadProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-[#888]">LP 이미지</label>
      <div
        className="relative w-full aspect-square max-w-[200px] mx-auto rounded-full overflow-hidden border-2 border-dashed border-[#333] cursor-pointer hover:border-[#555] transition-colors flex items-center justify-center bg-[#1a1a1a]"
        onClick={() => fileInputRef.current?.click()}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <span className="text-[#555] text-sm">클릭하여 이미지 선택</span>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
      <p className="text-xs text-[#555] text-center">JPG, PNG, GIF 등 이미지 파일</p>
    </div>
  );
}
