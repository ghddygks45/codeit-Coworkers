// ========================================
// Image API
// Swagger: image
// ========================================

import { BASE_URL } from "./config";

// 이미지 업로드 응답
interface ImageUploadResponse {
  url: string;
}

/**
 * 이미지 업로드
 *
 * @description
 * 프로젝트에 저장하는 이미지들은 이 엔드포인트를 통해 업로드한 후
 * URL을 획득하여 사용합니다. 최대 용량 10MB.
 *
 * @param file - 업로드할 이미지 파일
 * @returns 업로드된 이미지 URL
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${BASE_URL}/images/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`이미지 업로드 실패: ${response.status}`);
  }

  const data: ImageUploadResponse = await response.json();
  return data.url;
}
