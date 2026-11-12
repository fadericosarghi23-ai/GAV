import { Link } from "react-router"

import { LegalPage } from "@/components/sections/LegalPage"
import { useMeta } from "@/hooks/useMeta"
import { business, mailto } from "@/lib/content"
import { LEGAL_UPDATED } from "@/lib/site"

/*
  Testo scritto da Altalogik sulla base di ciò che il nuovo sito usa davvero.
  DA FAR VERIFICARE AL CLIENTE: manca la sede legale di GAV SRLS (non presente sul vecchio sito).
*/
export default function Privacy() {
  useMeta("Privacy Policy | GAV SRLS")
  return (
    <LegalPage title="Privacy Policy" updated={LEGAL_UPDATED} crumb={{ to: "/privacy", label: "Privacy Policy" }}>
      <p>
        Questa informativa spiega, ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679 (GDPR), come vengono trattati i
        dati personali di chi visita questo sito e di chi ci contatta tramite il modulo di richiesta preventivo.
      </p>

      <h2>Titolare del trattamento</h2>
      <p>
        {business.name}, P.IVA {business.vat}, con attività in {business.area}. Email: <a href={mailto}>{business.email}</a>.
        Telefono: <a href={`tel:${business.phone}`}>{business.phoneDisplay}</a>.
      </p>

      <h2>Quali dati trattiamo</h2>
      <h3>Dati di navigazione</h3>
      <p>
        Come ogni sito web, il server che ospita il sito registra in modo automatico alcuni dati tecnici necessari al suo
        funzionamento e alla sua sicurezza (ad esempio indirizzo IP, data e ora della richiesta, pagina visitata, tipo di browser).
        Questi dati non vengono usati per identificare gli utenti né per profilarli.
      </p>
      <h3>Dati inviati con il modulo</h3>
      <p>
        Se compila il modulo di richiesta preventivo ci comunica nome, cognome, email, eventualmente il numero di telefono, e il
        contenuto del messaggio. Le chiediamo di non inserire nel messaggio dati non necessari alla richiesta.
      </p>

      <h2>Perché li trattiamo e su quale base</h2>
      <ul>
        <li>Rispondere alla Sua richiesta e preparare un preventivo: misure precontrattuali adottate su Sua richiesta (art. 6.1.b GDPR).</li>
        <li>Garantire il funzionamento e la sicurezza del sito: legittimo interesse del Titolare (art. 6.1.f GDPR).</li>
        <li>Adempiere a eventuali obblighi di legge, ad esempio fiscali, se alla richiesta segue un incarico (art. 6.1.c GDPR).</li>
      </ul>
      <p>Il conferimento dei dati del modulo è facoltativo, ma senza di essi non possiamo rispondere alla richiesta.</p>

      <h2>Chi tratta i dati per nostro conto</h2>
      <p>
        Il sito è ospitato da Netlify, Inc. (Stati Uniti), che riceve anche i messaggi inviati con il modulo e agisce come
        responsabile del trattamento. Il trasferimento dei dati verso gli Stati Uniti avviene sulla base delle garanzie previste dal
        GDPR (EU-US Data Privacy Framework o clausole contrattuali standard approvate dalla Commissione europea). I dati non vengono
        diffusi né venduti a terzi.
      </p>

      <h2>Servizi esterni</h2>
      <p>
        I caratteri tipografici sono ospitati sullo stesso server del sito: la navigazione non comporta collegamenti a Google Fonts.
        La mappa nella pagina Contatti è fornita da OpenStreetMap e viene caricata solo se Lei sceglie di visualizzarla. Maggiori
        dettagli nella <Link to="/cookie">Cookie Policy</Link>.
      </p>

      <h2>Per quanto tempo conserviamo i dati</h2>
      <p>
        I dati del modulo sono conservati per il tempo necessario a gestire la richiesta e l’eventuale rapporto che ne segue, e
        successivamente per il periodo previsto dagli obblighi di legge. I dati di navigazione sono conservati dal fornitore di
        hosting per il tempo strettamente necessario a finalità tecniche e di sicurezza.
      </p>

      <h2>I Suoi diritti</h2>
      <p>
        In ogni momento può chiedere l’accesso ai Suoi dati, la rettifica, la cancellazione, la limitazione del trattamento, la
        portabilità e opporsi al trattamento (articoli da 15 a 22 GDPR), scrivendo a <a href={mailto}>{business.email}</a>. Ha inoltre
        il diritto di proporre reclamo al Garante per la protezione dei dati personali (
        <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">www.garanteprivacy.it</a>).
      </p>

      <h2>Aggiornamenti</h2>
      <p>Questa informativa può essere aggiornata: la data dell’ultima modifica è indicata in cima alla pagina.</p>
    </LegalPage>
  )
}
