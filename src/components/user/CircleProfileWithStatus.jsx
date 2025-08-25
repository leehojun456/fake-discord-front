import { useQuery } from "@tanstack/react-query";
import axios from "../../axios";

const CircleProfileWithStatus = ({
  user,
  height,
  width,
  position,
  border,
  left,
  top,
}) => {
  const userId = user?.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["avatar", userId],
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
    queryFn: async () => {
      const response = await axios.get(`/user/${userId}/avatar`);
      return response;
    },
  });

  if (!userId) return null; // user 없으면 렌더링하지 않음

  return (
    <div
      style={{ width: width, height: height, top: top, left: left }}
      className={`bg-amber-300 rounded-full ${position} flex items-center justify-center overflow-hidden border-${border} border-zinc-800`}
    >
      {data && <img src={data.avatar} alt="avatar" />}
    </div>
  );
};

export default CircleProfileWithStatus;
