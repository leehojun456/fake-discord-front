const ChatDeleteDialog = ({ children, setClose, onDelete }) => {
  return (
    <>
      <div className="min-w-[440px] gap-4 flex flex-col">
        <div className="">
          <div className="text-2xl font-bold">메시지 삭제하기</div>
          <div className="text-md">정말 이 메시지를 삭제할까요?</div>
        </div>
        <div className="p-3 rounded-md shadow-md border-zinc-800 border-1 bg-zinc-800/20">
          {children}
        </div>
        <div className="text-sm">
          <div className="text-green-200">참고:</div>
          <div>
            메시지 삭제를 Shift 버튼과 함께 누르시면 이 확인 창을 건너뛰실 수
            있어요.
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="w-[96px] h-[38px] bg-zinc-600 rounded-md cursor-pointer"
            onClick={() => {
              setClose(false);
            }}
          >
            취소
          </button>
          <button
            type="button"
            className="w-[96px] h-[38px] bg-red-500 rounded-md cursor-pointer"
            onClick={() => {
              onDelete();
            }}
          >
            삭제
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatDeleteDialog;
