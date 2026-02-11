export default function getDateTime(today = new Date()) {
  const year = today.getFullYear();
  const month = ("0" + (today.getMonth() + 1)).slice(-2);
  const day = ("0" + today.getDate()).slice(-2);
  const dateString = year + "년 " + month + "월 " + day + "일";

  const hours24 = today.getHours();
  const minutes = ("0" + today.getMinutes()).slice(-2);
  const period = hours24 < 12 ? "오전" : "오후";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const timeString = `${period} ${hours12}:${minutes}`;

  return { dateString, timeString };
}
