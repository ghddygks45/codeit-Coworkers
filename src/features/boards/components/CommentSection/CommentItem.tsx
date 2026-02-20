import { useState } from "react";
import Modal from "@/components/common/Modal/Modal";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import ProfileIcon from "@/assets/icon.svg";
import AlertIcon from "@/assets/alert.svg";
import { formatDate } from "@/utils/format";
import {
  useUpdateArticleComment,
  useDeleteArticleComment,
} from "@/api/articleComment";
import type { ArticleComment } from "@/types/articleComment";

interface CommentItemProps {
  comment: ArticleComment;
  articleId: number;
  metaSize: string;
  commentTextSize: string;
  commentGap: string;
}

export default function CommentItem({
  comment,
  articleId,
  metaSize,
  commentTextSize,
  commentGap,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const updateComment = useUpdateArticleComment(articleId);
  const deleteComment = useDeleteArticleComment(articleId);

  const handleUpdate = () => {
    if (!editContent.trim() || updateComment.isPending) return;
    updateComment.mutate(
      { commentId: comment.id, content: editContent.trim() },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleDeleteConfirm = () => {
    deleteComment.mutate(comment.id, {
      onSuccess: () => setIsDeleteModalOpen(false),
    });
  };

  const kebabOptions = [
    {
      label: "수정하기",
      value: "edit",
      action: () => {
        setEditContent(comment.content);
        setIsEditing(true);
      },
    },
    {
      label: "삭제하기",
      value: "delete",
      action: () => setIsDeleteModalOpen(true),
    },
  ];

  return (
    <>
      <div className={`flex gap-3 ${commentGap}`}>
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-200">
          {comment.writer.image ? (
            <img
              src={comment.writer.image}
              alt={comment.writer.nickname}
              className="h-8 w-8 rounded-lg object-cover"
            />
          ) : (
            <ProfileIcon className="h-5 w-5" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className={`${metaSize} font-medium text-slate-800`}>
              {comment.writer.nickname}
            </span>
            <Dropdown
              trigger="kebab"
              options={kebabOptions}
              keepSelected={false}
              listAlign="center"
            />
          </div>

          {isEditing ? (
            <div className="mt-1 flex items-center gap-2">
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                className={`${commentTextSize} flex-1 rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none`}
                autoFocus
              />
              <button
                type="button"
                onClick={handleUpdate}
                disabled={updateComment.isPending}
                className="text-sm-m text-brand-primary hover:text-interaction-hover"
              >
                저장
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-sm-m text-color-default"
              >
                취소
              </button>
            </div>
          ) : (
            <p className={`${commentTextSize} mt-1 leading-5 text-slate-800`}>
              {comment.content}
            </p>
          )}

          <span className={`${metaSize} mt-2 block text-slate-400`}>
            {formatDate(comment.createdAt)}
          </span>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="p-5">
          <div className="mt-2 mb-5 flex w-full justify-center">
            <AlertIcon />
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <h2 className="text-lg-m text-color-primary">
              댓글을 삭제하시겠어요?
            </h2>
            <p className="text-md-r text-color-primary mb-7">
              삭제된 댓글은 복구할 수 없습니다.
            </p>
          </div>
          <div className="flex flex-row justify-center gap-2">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="text-lg-b text-color-default border-border-secondary h-[48px] w-[135px] rounded-[12px] border-[1px] border-solid text-center"
            >
              닫기
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={deleteComment.isPending}
              className="bg-status-danger text-lg-b text-color-inverse h-[48px] w-[135px] rounded-[12px] text-center disabled:opacity-50"
            >
              {deleteComment.isPending ? "삭제 중..." : "삭제하기"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
