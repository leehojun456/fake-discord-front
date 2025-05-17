import { useEffect, useRef, useState } from "react";
import logo from "../../assets/phoneChangeLogo.svg";
import Papa from "papaparse";
import { drop, set } from "lodash";
import { getChosung } from "../../utils/dateFormat";

const PhoneAuth = () => {
  const [countryCode, setCountryCode] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCodeList, setCountryCodeList] = useState([]);
  const [dropdown, setDropdown] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchData = async () => {
    const response = await fetch("/assets/country_code.csv");
    const csvText = await response.text();
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });
    setCountryCodeList(
      parsed.data.sort((a, b) => {
        if (a.한국어 < b.한국어) return -1;
        if (a.한국어 > b.한국어) return 1;
        return 0;
      })
    );
    setCountryCode(parsed.data[0]["국제전화 국가번호"]);
    console.log(parsed.data);
  };

  const handleSearchCountry = (e) => {
    const searchValue = e.target.value;
    if (searchValue === "") {
      fetchData();
      return;
    }

    const searchChosung = getChosung(searchValue);

    const filteredList = countryCodeList.filter((item) => {
      const countryName = item.한국어;
      return (
        countryName.includes(searchValue) ||
        getChosung(countryName).includes(searchChosung)
      );
    });

    setCountryCodeList(filteredList);
  };

  return (
    <>
      <div className="w-[474px] flex flex-col gap-4 text-zinc-200 relative">
        <div className="relative flex justify-center">
          <img src={logo} className="absolute left-50% -top-[220px]" />
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-white">전화번호 입력하기</div>
          <div>인증 코드가 적힌 문자 메시지를 받을 거예요.</div>
        </div>
        <div className="text-center">
          전화번호는 한번에 Discord 계정 하나를 인증하는데 사용되며 인증과
          로그인용으로만 사용됩니다.
        </div>
        <div
          className="flex w-full h-[40px] rounded-md overflow-hidden"
          ref={dropdownRef}
        >
          <div className="p-1 bg-zinc-800">
            <button
              className="w-[60px] h-full cursor-pointer bg-zinc-700/70 rounded-md relative"
              onClick={() => {
                setDropdown(!dropdown);
              }}
            >
              {countryCode}
            </button>
          </div>
          <input
            type="tel"
            className=" bg-zinc-800 w-full px-2 focus:outline-none"
          />
          <div className="p-1 bg-zinc-800">
            <button className="w-[60px] h-full px-2 cursor-pointer bg-indigo-500 rounded-md relative">
              보내기
            </button>
          </div>
          {dropdown && (
            <div className="absolute left-0 top-[190px] z-50 flex flex-col bg-zinc-800 w-[240px] h-[250px]  p-4 rounded-md gap-4 shadow-lg border-1 border-zinc-700">
              <div>
                <input
                  className="bg-zinc-900 rounded-md px-2 py-1 w-full"
                  placeholder="국가 검색하기"
                  onChange={handleSearchCountry}
                />
              </div>
              <div className="border-b-1 border-zinc-700" />

              <div className="overflow-hidden overflow-y-scroll flex flex-col gap-2">
                {countryCodeList.length === 0 && (
                  <div
                    type="button"
                    className="text-left w-full flex justify-between items-center"
                  >
                    <div className="text-ellipsis text-nowrap overflow-hidden">
                      없음
                    </div>
                  </div>
                )}
                {countryCodeList.map((item, index) => {
                  return (
                    <button
                      type="button"
                      className="text-left cursor-pointer w-full flex justify-between items-center pr-1"
                      onClick={() => {
                        setCountryCode(item["국제전화 국가번호"]);
                        setDropdown(false);
                      }}
                    >
                      <div className="text-sm text-ellipsis text-nowrap overflow-hidden">
                        {item["한국어"]}
                      </div>
                      <div>{item["국제전화 국가번호"]}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {/* Dropdown List */}
      </div>
    </>
  );
};

export default PhoneAuth;
