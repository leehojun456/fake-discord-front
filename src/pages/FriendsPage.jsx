import {
  faBolt,
  faComment,
  faCube,
  faMagnifyingGlass,
  faShop,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HeaderMessageContext } from "../contexts/HeaderMessageContext";
import { useContext, useEffect, useState } from "react";
import FriendsList from "../components/friends/FriendsList";
import FriendsAdd from "../components/friends/FriendsAdd";

const FriendsPage = () => {
  const [page, setPage] = useState("Onlinefriends");

  const { setHeaderMessage, setHeaderIcon } = useContext(HeaderMessageContext);
  useEffect(() => {
    setHeaderMessage("친구");
    setHeaderIcon(faUser);
  }, []);

  const handlePageChange = (newPage) => {
    console.log(newPage);
    setPage(newPage);
  };

  return (
    <>
      <div className="flex flex-col h-full w-full bg-zinc-700/30">
        <div className="flex min-h-[50px] border-b-1 border-zinc-700 text-white items-center justify-between px-8 py-2 gap-6">
          <div className="flex gap-4 items-center h-full">
            <div className="flex gap-2 justify-center items-center">
              <FontAwesomeIcon icon={faUser} />
              친구
            </div>
            <div className="h-[4px] w-[4px] bg-zinc-700 rounded-full" />
            <div
              className={`flex gap-2 justify-center items-center cursor-pointer px-3 ${
                page === "Onlinefriends" &&
                "bg-zinc-700 brightness-100 rounded-lg h-full"
              }`}
              onClick={() => handlePageChange("Onlinefriends")}
            >
              온라인
            </div>
            <div
              className={`flex gap-2 justify-center items-center cursor-pointer px-3 ${
                page === "Allfriends" &&
                "bg-zinc-700 brightness-100 rounded-lg h-full"
              }`}
              onClick={() => handlePageChange("Allfriends")}
            >
              모두
            </div>
            <div
              className="flex gap-2 justify-center items-center bg-indigo-500 rounded-lg h-full px-3 cursor-pointer hover:bg-indigo-500"
              onClick={() => handlePageChange("Addfriends")}
            >
              친구 추가하기
            </div>
          </div>

          <FontAwesomeIcon icon={faComment} className="cursor-pointer" />
        </div>
        {page !== "Addfriends" ? <FriendsList /> : <FriendsAdd />}
      </div>
    </>
  );
};

export default FriendsPage;
