import { NavLink } from "react-router-dom";
import axios from "../../axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const PersonalChannels = () => {
  const [personalChannels, setPersonalChannels] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/personalchannels");
      const filtered = response.map((group) => ({
        ...group,
        members: group.members.filter((member) => member.id !== user.id),
      }));
      setPersonalChannels(filtered);
    };
    if (user) fetchData();
  }, [user]);

  return (
    <>
      <div className="flex flex-col mx-2 py-2 text-zinc-400  gap-2 h-full">
        {personalChannels?.map((channel) => (
          <NavLink
            key={channel.id}
            to={`/channels/@me/${channel.id}`}
            className={({ isActive }) =>
              `h-[48px] flex items-center cursor-pointer hover:bg-zinc-700 hover:text-white rounded-lg gap-3 px-2 ${
                isActive && "bg-zinc-700 text-white"
              } `
            }
          >
            {channel.members.map((m) => (
              <div key={m.userId}>{m.name}</div>
            ))}
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default PersonalChannels;
