import React, { useState } from 'react';
import './App.css';

function App() {
  const [inCaricamento, setInCaricamento] = useState(false);
  const [inPartita, setInPartita] = useState(false);
  const [logIn, setLogin] = useState(false);

  const [partita, setPartita] = useState(null);
  const [risultato, setRisultato] = useState(null);

  const [nome, setNome] = useState('');
  const [tentativo, setTentativo] = useState('');

  function gestisciNome(e){
    setNome(e.target.value);
  }
  
  function iniziaPartita(){
    setInCaricamento(true);
    setTentativo('');
    setRisultato(null);
    setInCaricamento(false);
    setLogin(true);
  }

  function fermaPartita(){
    setInPartita(false);
  }

  async function confermaTentativo(){
    const response = await fetch(`http://localhost:8080/partita/${partita.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ numero: tentativo }),
    });
    const data = await response.json();
    setRisultato(data)
    setPartita(partitaPrecedente => ({ ...partitaPrecedente, tentativi: data.tentativi }));
  }

  async function inserimentoNome(){
    const response = await fetch('http://localhost:8080/partita', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({nome: nome})
    });
    const dati = await response.json();
    setPartita(dati);
    setLogin(false);
    setInPartita(true);
  }
  return (
    <div className="App">
      <h1>Indovina il numero!!</h1>
      { 
      /*La partita è in caricamento*/
      inCaricamento ?
        <span>In caricamento...</span> 
      
      : 

      /* Inserimento dei dati utente */
      logIn ? (
        <div>
          <label>Nome: </label>
          <input type='text' onChange={gestisciNome} value={nome} placeholder="inserisci il nome"></input>
          <button onClick={inserimentoNome}>Conferma</button>
        </div>
      )

      : 
      
      inPartita ? (
        <div>
          {partita.id} - {partita.nome} - {partita.numero}
          <br />
          {/* Inserimento del tentativo*/}
          <input type="number" min="1" max="100" value={tentativo} onChange={e => setTentativo(e.target.value)} />
          <button onClick={confermaTentativo}>Conferma</button>

          {/*Risultati del tentativo*/} 
          {risultato && risultato.risultato === 0 && <p>Hai indovinato -- Tentativi: {partita.tentativi}</p>}
          {risultato && risultato.risultato === 0 && fermaPartita() }
          {risultato && risultato.risultato === -1 && <p>Numero troppo piccolo -- Tentativi: {partita.tentativi}</p> }
          {risultato && risultato.risultato === 1 && <p>Numero troppo grande -- Tentativi: {partita.tentativi}</p>}
          {risultato && partita.tentativi === 6 && risultato.risultato !== 0 && fermaPartita() }
        </div>
        )

        :

        /* Buttone per iniziare la partita */
        (
          <div>
          <h3>Inizia la partita cliccando</h3>
          <button onClick={iniziaPartita}>Qui</button>
          </div>
        )
      }
    </div>
  );
}

export default App;
