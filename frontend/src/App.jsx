import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import Home from './screens/Home';
import Frame from './screens/Frame/Frame';
import Background from './screens/Frame/Background';
import Layout from './screens/Frame/Layout';
import Payment from './screens/Payment/Payment';
import Cash from './screens/Payment/Cash';
import {QR_Momo} from './screens/Payment/QR_Momo';
import {QR_Zalopay} from './screens/Payment/QR_Zalopay';
import Promo from './screens/Payment/Promo';
import Result from './screens/Payment/Result';
import Photo from './screens/Photo/Photo';
import Choose from './screens/Photo/Choose';
import Filter from './screens/Filter';
import Sticker from './screens/Sticker';
import Print from './screens/Print';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/frame" element={<Frame />} />
        <Route path="/background" element={<Background />} />
        <Route path="/layout" element={<Layout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-result" element={<Result />} />
        <Route path="/payment-cash" element={<Cash />} />
        <Route path="/payment-momo" element={<QR_Momo />} />
        <Route path="/payment-zalopay" element={<QR_Zalopay />} />
        <Route path="/payment-promo" element={<Promo />} />
        <Route path="/photo" element={<Photo />} />
        <Route path="/photo-choose" element={<Choose />} />
        <Route path="/filter" element={<Filter />} />
        <Route path="/sticker" element={<Sticker />} />
        <Route path="/print" element={<Print />} />
      </Routes>
    </Router>
  );
}

export default App;
