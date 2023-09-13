import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [tooted, setTooted] = useState([]);
  const idRef = useRef();
  const nameRef = useRef();
  const priceRef = useRef();
  const isActiveRef = useRef();


  useEffect(() => {
    fetch("https://localhost:7193/api/tooted")
      .then(res => res.json())
      .then(json => setTooted(json));
  }, []);

  function kustuta(index) {
    fetch("https://localhost:7193/api/tooted/kustuta/" + index, {"method": "DELETE"})
      .then(res => res.json())
      .then(json => setTooted(json));
  }

  ////////////////////////
  function lisa() {
    const uusToode = {
      "id": Number(idRef.current.value),
      "name": nameRef.current.value,
      "price": Number(priceRef.current.value),
      "isActive": isActiveRef.current.checked
    }
    fetch("https://localhost:7193/api/tooted/lisa", {"method": "POST", "body": JSON.stringify(uusToode)})
      .then(res => res.json())
      .then(json => setTooted(json));
  }
  ////////////////////////

  function dollariteks() {
    const kurss = 1.1;
    fetch("https://localhost:7193/api/tooted/hind-dollaritesse/" + kurss, {"method": "PATCH"})
      .then(res => res.json())
      .then(json => setTooted(json));
  }

  async function makePayment(sum) {
    try {
      const response = await fetch(`https://localhost:7193/api/Payment/${sum}`);
      if (response.ok) {
        let paymentLink = await response.text();
        paymentLink = paymentLink.replace(/^"|"$/g, '');
        console.log('Payment Link:', paymentLink);
        window.open(paymentLink, '_blank');
      } else {
        console.error('Payment failed.');
      }
    } catch (error) {
      console.error('Error making payment:', error);
    }
  }

  return (
    <div className="App">
      <label>ID</label> <br />
      <input ref={idRef} type="number" /> <br />
      <label>Nimi</label> <br />
      <input ref={nameRef} type="text" /> <br />
      <label>Hind</label> <br />
      <input ref={priceRef} type="number" /> <br />
      <label>Aktiivne</label> <br />
      <input ref={isActiveRef} type="checkbox" /> <br />
      <button onClick={() => lisa()}>Lisa</button>
      {tooted.map((toode, index) => 
        <div>
          <div>{toode.id}</div>
          <div>{toode.name}</div>
          <div>{toode.price}</div>
          <button onClick={() => kustuta(index)}>x</button>
          <button onClick={() => makePayment(toode.price)}>Make Payment</button>
        </div>)}
      <button onClick={() => dollariteks()}>Muuda dollariteks</button>
    </div>
  );
}

export default App;