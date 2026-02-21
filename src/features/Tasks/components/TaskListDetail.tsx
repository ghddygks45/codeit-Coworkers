import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import Dropdown from "@/components/common/Dropdown/Dropdown";
import {
  useCreateTaskComment,
  useDeleteTask,
  useDeleteTaskComment,
  useGetTask,
  useGetTaskComment,
  useGetUser,
  useUpdateTaskComment,
  useUpdateTaskListDone,
} from "@/api/tasklistDetail";
import getDateTime from "@/utils/dateTime";

import CloseIcon from "@/assets/close.svg";
import UserIcon from "@/assets/user.svg";
import DateIcon from "@/assets/calendar.svg";
import RepeatIcon from "@/assets/repeat.svg";
import CheckBlue from "@/assets/check.svg";
import CheckWhite from "@/assets/check-white.svg";
import Enter from "@/features/Boards/assets/enter.svg";
import Modal from "@/components/common/Modal/Modal";
import TaskDangerModal from "@/components/common/Modal/Contents/TaskDeleteModal";
import TaskReplyDangerModal from "@/components/common/Modal/Contents/TaskReplyDeleteModal";

/**
 * 특정 시간(createdAt)이 현재로부터 며칠 전인지 계산합니다.
 *
 * @param {string} createdAt - ISO 문자열 형태의 생성 시각
 * @returns {number} 현재 기준으로 경과한 일 수 (정수)
 *
 * @example
 * daysAgo("2026-02-01T10:00:00.000Z") // 11
 */
const daysAgo = (createdAt: string) => {
  const created = new Date(createdAt).getTime();
  const diffMs = Date.now() - created;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Task 상세 페이지 컴포넌트
 *
 * ## 역할
 * - URL params(groupId, taskListId, taskId)를 기반으로 Task 단건 정보를 조회하여 표시합니다.
 * - Task 완료/완료 취소(done 상태)를 토글할 수 있습니다.
 * - 댓글 목록을 조회하고, 댓글 작성/수정/삭제를 제공합니다.
 *
 * ## 데이터 흐름(React Query)
 * - 사용자 정보: `useGetUser()`
 * - Task 단건: `useGetTask(groupId, taskListId, taskId)`
 * - 댓글 목록: `useGetTaskComment(taskId)`
 * - 완료 상태 변경: `useUpdateTaskListDone(...)`
 * - 댓글 작성: `useCreateTaskComment(taskId)`
 * - 댓글 수정: `useUpdateTaskComment(taskId)`
 * - 댓글 삭제: `useDeleteTaskComment(taskId)`
 *
 * ## 주요 UI/동작
 * - 완료 상태에 따라 제목 스트라이크 및 "완료" 뱃지 표시
 * - "완료 하기 / 완료 취소하기" 버튼으로 done 상태 변경
 * - 케밥 메뉴(`Dropdown optionsKey="edit"`)로 댓글 수정/삭제 트리거
 * - 댓글 작성 인풋에서 Enter 아이콘 버튼으로 작성 요청
 * - 댓글 수정 모드에서는 인라인 편집 입력 + 저장/취소 버튼 제공
 *
 * ## 주의사항
 * - URL params는 string이므로 API 훅 호출 전에 `Number(...)`로 변환합니다.
 * - `taskData`/`commentData`는 비동기 데이터이므로 optional chaining(`?.`)을 사용합니다.
 */
export default function TaskListDetail() {
  const queryClient = useQueryClient();

  const { teamId, listId, taskId } = useParams<{
    teamId: string;
    listId: string;
    taskId?: string;
  }>();
  const navigate = useNavigate();

  const groupIdNum = Number(teamId);
  const listIdNum = Number(listId);
  const taskIdNum = Number(taskId);

  const [isOpen, setIsOpen] = useState<"taskDelete" | "replyDelete" | null>(
    null,
  );
  const [pendingReplyId, setPendingReplyId] = useState<number | null>(null);

  /** 모달 열기, 닫기 */
  const openTaskDeleteModal = () => setIsOpen("taskDelete");
  const openReplyDeleteModal = () => setIsOpen("replyDelete");
  const closeModal = () => {
    setIsOpen(null);
    setPendingReplyId(null);
  };

  /** 현재 로그인 사용자 정보 */
  const { data: user } = useGetUser();

  /** Task 단건 데이터 */
  const { data: taskData } = useGetTask(groupIdNum, listIdNum, taskIdNum);

  /** Task 완료 여부 */
  const isDone = !!taskData?.doneAt;

  /** done 상태 변경 mutation */
  const { mutate: setDone } = useUpdateTaskListDone(
    groupIdNum,
    listIdNum,
    taskIdNum,
  );

  // ListPage에 즉시 반영시키는 공통 invalidate
  const invalidateListPage = () => {
    // 현재 리스트의 tasks(날짜 상관 없이) 전부 갱신
    queryClient.invalidateQueries({
      predicate: (q) => {
        const key = q.queryKey as unknown[];
        return key?.[0] === "tasks" && key?.[1] === listIdNum;
      },
    });

    // 사이드바 목록도 갱신
    queryClient.invalidateQueries({ queryKey: ["taskLists", groupIdNum] });
  };

  /** Task 완료 처리 */
  const handleDone = () => {
    setDone(true, {
      onSuccess: invalidateListPage,
    });
  };

  /** Task 완료 취소 처리 */
  const handleUndoDone = () => {
    setDone(false, {
      onSuccess: invalidateListPage,
    });
  };

  /** Task 삭제 mutation */
  const { mutate: deleteTask } = useDeleteTask(
    groupIdNum,
    listIdNum,
    taskIdNum,
  );

  /** Task 삭제 모달 오픈 */
  const handleTaskDelete = (option: { value: string }) => {
    if (option.value !== "삭제하기") return;
    openTaskDeleteModal();
  };

  /** 댓글 삭제시 해당 댓글 ID를 저장, 삭제후 모달 오픈 */
  const handleReplyDelete = (option: { value: string }, commentId: number) => {
    if (option.value === "삭제하기") {
      setPendingReplyId(commentId);
      openReplyDeleteModal();
    }
  };

  /** 할 일 삭제 후 모달 닫기 */
  const handleConfirmTaskDelete = () => {
    // 삭제 성공 시 리스트 갱신 + 패널 닫기(라우팅)
    deleteTask(undefined as never, {
      onSuccess: () => {
        invalidateListPage();
        closeModal();
        navigate(`/team/${teamId}/tasklists/${listId}`);
      },
      onError: () => {
        closeModal();
      },
    });
  };

  /** 댓글 목록 데이터 */
  const { data: commentData } = useGetTaskComment(taskIdNum);

  /** 댓글 삭제 mutation */
  const { mutate: deleteComment } = useDeleteTaskComment(taskIdNum);

  /** 댓글 삭제하고 모달 닫기 */
  const handleConfirmReplyDelete = () => {
    if (pendingReplyId === null) return;
    deleteComment(pendingReplyId, {
      onSuccess: closeModal,
      onError: closeModal,
    });
  };

  /**
   * 시작 날짜 텍스트
   * * - recurring.startDate가 있으면 유틸로 날짜/시간 문자열로 변환
   * - 없으면 "-" 표시
   */
  const startDate = taskData?.recurring?.startDate;
  const startDateText = startDate
    ? (() => {
        const { dateString, timeString } = getDateTime(new Date(startDate));
        return `${dateString} ${timeString}`;
      })()
    : "-";

  /**
   * 반복 타입을 UI 라벨(한글)로 변환합니다.
   * @param {"ONCE" | "DAILY" | "WEEKLY" | "MONTHLY" | undefined} type - 반복 타입
   * @returns {"한 번" | "매일" | "주 반복" | "월 반복" | undefined} 라벨
   */
  const freqLabel = (type?: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY") => {
    switch (type) {
      case "ONCE":
        return "한 번";
      case "DAILY":
        return "매일";
      case "WEEKLY":
        return "주 반복";
      case "MONTHLY":
        return "월 반복";
    }
  };

  /** 댓글 입력값(작성용) */
  const [comment, setComment] = useState("");

  /** 댓글 생성 mutation + pending 상태 */
  const { mutate: createComment, isPending } = useCreateTaskComment(taskIdNum);

  /** 댓글 생성 요청 */
  const handleCreateComment = () => {
    if (!comment.trim()) return;
    createComment(comment, {
      onSuccess: () => setComment(""),
    });
  };

  /** 현재 수정 중인 댓글 ID (없으면 null) */
  const [editCommentId, setEditCommentId] = useState<number | null>(null);

  /** 수정 중인 댓글 입력값 */
  const [editComment, setEditComment] = useState("");

  /** 댓글 편집 시작 */
  const startEdit = (commentId: number, currentComment: string) => {
    setEditCommentId(commentId);
    setEditComment(currentComment);
  };

  /** 댓글 편집 취소 */
  const cancelEditComment = () => {
    setEditCommentId(null);
    setEditComment("");
  };

  /** 댓글 수정 mutation */
  const { mutate: updateComment } = useUpdateTaskComment(taskIdNum);

  /** 댓글 수정 저장 */
  const saveEdit = (id: number) => {
    if (!editComment.trim()) return;
    updateComment(
      { commentId: id, content: editComment },
      {
        onSuccess: () => {
          setEditCommentId(null);
          setEditComment("");
        },
      },
    );
  };

  /** 댓글 목록 최신순 정렬(createdAt 내림차순) */
  const sortedComments = useMemo(() => {
    if (!commentData) return [];
    return [...commentData].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [commentData]);

  return (
    <>
      <div className="bg-background-primary flex flex-col gap-4 px-4 pt-3 pb-4 md:px-7 md:pt-11 lg:px-10">
        <CloseIcon
          className="cursor-pointer"
          onClick={() => navigate(`/team/${teamId}/tasklists/${listId}`)}
        />

        <div className="mt-4 flex flex-row justify-between md:mt-12">
          {isDone ? (
            <div className="flex h-[24px] flex-row items-center gap-2 md:h-[28px]">
              <div className="text-xl-b md:text-2xl-b text-color-default line-through">
                {taskData?.name}
              </div>
              <div className="text-md-b text-brand-primary bg-brand-secondary flex h-[29px] w-[45px] items-center justify-center rounded-[8px]">
                완료
              </div>
            </div>
          ) : (
            <div className="text-xl-b md:text-2xl-b text-color-primary">
              {taskData?.name}
            </div>
          )}

          <Dropdown
            trigger="kebab"
            optionsKey="edit"
            listAlign="center"
            listClassName="absolute right-4 md:right-6 lg:right-10"
            keepSelected={false}
            onSelect={handleTaskDelete}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-row items-center gap-3">
            {user?.image ? (
              <img
                src={user?.image}
                alt="프로필이미지"
                className="h-[32px] w-[32px] rounded-[8px]"
              />
            ) : (
              <UserIcon />
            )}
            <p className="text-md-m">{user?.nickname ?? "-"}</p>
          </div>

          <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row">
                <div className="flex flex-row gap-1">
                  <DateIcon className="h-4 w-4" />
                  <p className="text-xs-r text-color-default w-[60px]">
                    시작 날짜
                  </p>
                </div>
                <p className="text-xs-r text-color-primary">{startDateText}</p>
              </div>

              <div className="flex flex-row">
                <div className="flex flex-row gap-1">
                  <RepeatIcon className="h-4 w-4" />
                  <p className="text-xs-r text-color-default w-[60px]">
                    반복 설정
                  </p>
                </div>
                <p className="text-xs-r text-color-primary">
                  {freqLabel(taskData?.recurring?.frequencyType)}
                </p>
              </div>
            </div>

            {isDone ? (
              <button
                onClick={handleUndoDone}
                className="border-brand-primary text-brand-primary text-md-sb fixed right-5 bottom-7 flex h-[40px] items-center justify-center gap-1 rounded-[40px] border-1 px-4 md:relative md:right-0 md:bottom-0"
              >
                <CheckBlue />
                완료 취소하기
              </button>
            ) : (
              <button
                onClick={handleDone}
                className="bg-brand-primary text-color-inverse text-md-sb fixed right-5 bottom-7 flex h-[40px] items-center justify-center gap-1 rounded-[40px] px-4 md:relative md:right-0 md:bottom-0"
              >
                <CheckWhite />
                완료 하기
              </button>
            )}
          </div>

          <hr className="bg-border-primary h-[1px] border-0" />

          <div>
            <p className="text-md-r text-color-primary">
              {taskData?.description}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <p className="text-lg-b md:text-2lg-b text-color-primary flex gap-1">
            댓글
            <span className="text-brand-primary">{taskData?.commentCount}</span>
          </p>

          <div className="flex flex-row items-center gap-[10px]">
            {user?.image ? (
              <img
                src={user?.image}
                alt="프로필이미지"
                className="h-[38px] w-[38px] rounded-[8px]"
              />
            ) : (
              <UserIcon />
            )}

            <div className="border-border-primary relative flex h-12 w-full justify-center border-t-1 border-b-1">
              <input
                type="text"
                placeholder="댓글을 달아주세요"
                className="text-md-r w-full px-3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button onClick={handleCreateComment} disabled={isPending}>
                <Enter className="absolute top-[calc(50%-12px)] right-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background-primary pb-10">
        {sortedComments?.map((item) => {
          const isEditing = editCommentId === item.id;

          return (
            <div
              key={item.id}
              className={
                isEditing
                  ? "bg-icon-inverse flex flex-row gap-4 px-4 py-3 md:px-7 lg:px-10"
                  : "border-border-primary mx-2 flex flex-row gap-4 border-b-1 px-2 py-3 last:border-b-0 md:mx-7 md:px-0 lg:mx-10"
              }
            >
              {item.user.image ? (
                <img
                  src={item.user.image}
                  alt="프로필이미지"
                  className="h-[38px] w-[38px] rounded-[8px]"
                />
              ) : (
                <UserIcon />
              )}

              <div className="flex w-full flex-col gap-1">
                <div className="flex flex-row justify-between">
                  <p className="text-color-primary text-md-b">
                    {item.user.nickname}
                  </p>

                  {!isEditing && (
                    <Dropdown
                      trigger="kebabSmall"
                      optionsKey="edit"
                      listAlign="center"
                      listClassName="absolute right-4 md:right-6 lg:right-10"
                      keepSelected={false}
                      onSelect={(option) => {
                        if (option.value === "수정하기") {
                          startEdit(item.id, item.content);
                        }
                        handleReplyDelete(option, item.id);
                      }}
                    />
                  )}
                </div>

                {isEditing ? (
                  <input
                    type="text"
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="text-color-primary text-md-r"
                  />
                ) : (
                  <>
                    <p className="text-color-primary text-md-r">
                      {item.content}
                    </p>
                    <p className="text-md-r text-color-disabled">
                      {`${daysAgo(item.createdAt)}일 전`}
                    </p>
                  </>
                )}

                {isEditing && (
                  <div className="flex flex-row justify-end gap-2 pt-2">
                    <button
                      onClick={cancelEditComment}
                      className="text-color-default text-md-sb flex h-[33px] w-[53px] items-center justify-center"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => saveEdit(item.id)}
                      className="text-brand-primary text-md-r border-brand-primary flex h-[33px] w-[73px] items-center justify-center rounded-[8px] border-1"
                    >
                      저장
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isOpen !== null} onClose={closeModal}>
        {isOpen === "taskDelete" && (
          <TaskDangerModal
            onClose={closeModal}
            onDelete={handleConfirmTaskDelete}
          />
        )}

        {isOpen === "replyDelete" && (
          <TaskReplyDangerModal
            onClose={closeModal}
            onDelete={handleConfirmReplyDelete}
          />
        )}
      </Modal>
    </>
  );
}
