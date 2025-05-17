import { useEffect, useState } from "react";
import axios from "../../axios";
import CircleProfileWithStatus from "./CircleProfileWithStatus";

const BigProfileCard = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (userId) {
      fetchData();
    }
  }, [userId]);

  return (
    <>
      <div className="min-w-[340px] flex flex-col justify-between bg-zinc-700">
        <div className="relative">
          <img src={user?.banner} className="w-full h-[120px] object-cover " />
          <CircleProfileWithStatus
            user={user}
            width={"80px"}
            height={"80px"}
            position={"relative"}
          />
        </div>
        <button className="w-[374px] h-[44px] border-t-1 text-zinc-300 border-zinc-600 cursor-pointer">
          전체 프로필 보기
        </button>
      </div>
    </>
  );
};

export default BigProfileCard;
