import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../css/Home.css'; // Make sure to create an appropriate CSS file for styling
import { useNavigate } from 'react-router-dom';
import i18n from '../translations/i18n';
import start_en from '../assets/Home/start_click.png';
import start_click_en from '../assets/Home/start.png';
import start_vn from '../assets/Home/vn/start.png';
import start_click_vn from '../assets/Home/vn/start_click.png';
import start_kr from '../assets/Home/kr/start.png';
import start_click_kr from '../assets/Home/kr/start_click.png';

function App() {
  const [language, setLanguage] = useState('en');
  const [displayLanguage, setDisplayLanguage] = useState('English'); // Add other languages here
  const [showLangOption, setShowLangOption] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [buttonBackground, setButtonBackground] = useState(start_en);

  useEffect(() => {
    setLanguage('en');
    sessionStorage.setItem('language', 'en');
    i18n.changeLanguage('en');
    setDisplayLanguage(t(`language.en`));
  }, [t]);

  const handleChangeLanguage = (value) => {
    const selectedLanguage = value;
    setLanguage(selectedLanguage);
    sessionStorage.setItem('language', selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
    setDisplayLanguage(t(`language.${selectedLanguage}`));

    changeButtonBackground(selectedLanguage);
  };

  const toggleShowLangOption = () => {
    setShowLangOption(!showLangOption);
  };

  const changeButtonBackground = (lang) => {
    if (lang === 'en') {
      setButtonBackground(buttonBackground === start_en ? start_click_en : start_en);
    } else if (lang === 'vi') {
      setButtonBackground(buttonBackground === start_vn ? start_click_vn : start_vn);
    } else if (lang === 'ko') {
      setButtonBackground(buttonBackground === start_kr ? start_click_kr : start_kr);
    }
  }

  return (
    <div className='home-container'>
      <div className="language-selector" onClick={toggleShowLangOption}>
        <div className="language-selector-text">{displayLanguage}</div>
        {showLangOption &&
          <div className='language-options'>
            <p className='language-text' onClick={() => handleChangeLanguage('en')}>{t('language.en')}</p>
            <p className='language-text' onClick={() => handleChangeLanguage('ko')}>{t('language.ko')}</p>
            <p className='language-text' onClick={() => handleChangeLanguage('vi')}>{t('language.vi')}</p>
          </div>
        }
      </div>
      <div className="start-button" style={{ backgroundImage: `url(${buttonBackground})` }} onMouseEnter={() => changeButtonBackground(language)} onMouseLeave={() => changeButtonBackground(language)} onClick={() => navigate('/frame')}></div>
    </div>
  );
}

export default App;
