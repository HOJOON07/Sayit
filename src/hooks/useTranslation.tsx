import { useRecoilValue } from "recoil";
import { languageState } from "../atom";
import TRANSLATIONS from "../constants /language";

const useTranslation = () => {
  const lang = useRecoilValue(languageState);
  return (key: keyof typeof TRANSLATIONS) => {
    return TRANSLATIONS[key][lang];
  };
};

export default useTranslation;
