import Menu from './Menu';
import Body from './Body';
import Footer from './Footer';
import '../css/Main.css';

export const MainComponent = () => {
  return (
    <div className="content">
      <Menu />
      <Body />
      <Footer />
    </div>
  );
};
