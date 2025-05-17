import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import axios from "../../axios";

import { useEffect, useState } from "react";
import { WebSocketContext } from "../../contexts/WebSocketContext";
import { useNavigate } from "react-router-dom";

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const socket = useContext(WebSocketContext);
  const navigator = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/friends");
      setFriends(response);
      //ConnectWS(data.data);
    };
    fetchData();
  }, []);

  const handleClick = async (friendId) => {
    const response = await axios.post("/personalchannels", {
      userId: [friendId],
    });
    navigator(`${response.channelId}`);
  };

  // const ConnectWS = (data) => {
  //   data.forEach((friend) => {
  //     socket.emit("connectFriend", {
  //       friendId: friend.id,
  //     });
  //   });
  // };

  return (
    <>
      <div className="flex flex-col w-full h-full px-7 py-3 gap-6">
        <div className="w-full flex relative items-center">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute right-4"
            color="gray"
          />
          <input
            className=" bg-zinc-800 p-2 text-zinc-500 border-1 border-zinc-700 rounded-lg flex items-center gap-2 w-full"
            placeholder="검색하기"
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-zinc-300">
            모든 친구 - {friends?.length || 0}명
          </div>
          <div>
            {friends &&
              friends.map((friend, index) => (
                <div
                  key={index}
                  className="h-[60px] border-t-1 border-zinc-700 flex flex-col justify-center text-white hover:bg-zinc-600/20 transition-all"
                  onClick={() => {
                    handleClick(friend.id);
                  }}
                >
                  <div>{friend.name}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FriendsList;
