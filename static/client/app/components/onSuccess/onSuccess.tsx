export const OnSuccess = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="flex flex-col justify-center w-full items-center bg-[#0f0f0f]">
      <h4 className="text-4xl mb-5">Спасибо!</h4>
      <p className="mb-10">Ваше бронирование отправлено менеджеру.</p>
      <button
        className="md:block px-[9px] text-[12px] py-[6px] flex justify-center cursor-pointer items-center bg-(--red) sm:py-4 sm:px-6 sm:text-[18px] text-white rounded-sm sm:rounded-lg"
        onClick={onClose}
      >
        Отлично
      </button>
    </div>
  );
};
