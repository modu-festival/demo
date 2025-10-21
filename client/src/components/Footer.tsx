import logo from "@assets/icon.svg";
import { EXTERNAL_LINKS } from "../constants/links";

const Footer = () => {
  const list = {
    companyInfo: [
      { label: "대표", value: "김승연" },
      { label: "이메일", value: "modufestival@gmail.com" },
    ],
    legalInfo: EXTERNAL_LINKS.filter((link) =>
      ["개인정보처리방침", "이용약관"].includes(link.label)
    ),
  } as const;

  return (
    <footer className="grid grid-rows-2 p-8 bg-gray-200 gap-3">
      {/* 로고 섹션 */}
      <div>
        <img
          src={logo}
          alt="Confeti 로고"
          className="w-[6rem] object-contain"
        />
      </div>

      {/* 텍스트 섹션 */}
      <div className="flex justify-between items-end w-full text-gray-500">
        <ul className="flex flex-col gap-[0.4rem] text-[11px] font-medium">
          {list.companyInfo.map((item, index) => (
            <li key={index}>
              {item.label} | {item.value}
            </li>
          ))}
        </ul>

        <ul className="flex gap-[1.2rem] mb-[0.2rem] text-[10px] font-bold">
          {list.legalInfo.map((item, index) => (
            <li key={index}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
