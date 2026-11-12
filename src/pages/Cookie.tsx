import { Link } from "react-router"

import { LegalPage } from "@/components/sections/LegalPage"
import { useMeta } from "@/hooks/useMeta"
import { business, mailto } from "@/lib/content"
import { LEGAL_UPDATED } from "@/lib/site"

/* Testo scritto da Altalogik sulla base di ciò che il nuovo sito usa davvero. Da far verificare al cliente. */
export default function Cookie() {
  useMeta("Cookie Policy | GAV SRLS")
  return (
    <LegalPage title="Cookie Policy" updated={LEGAL_UPDATED} crumb={{ to: "/cookie", label: "Cookie Policy" }}>
      <p>
        Questa pagina descrive i cookie e le tecnologie simili usati da questo sito, gestito da {business.name} (P.IVA{" "}
        {business.vat}).
      </p>

      <h2>In breve</h2>
      <ul>
        <li>Il sito non usa cookie di profilazione né cookie pubblicitari.</li>
        <li>Il sito non usa strumenti di statistica (ad esempio Google Analytics).</li>
        <li>Il sito non salva informazioni nel Suo browser durante la normale navigazione.</li>
        <li>Per questo non è necessario un banner di consenso.</li>
      </ul>

      <h2>Contenuti esterni caricati solo su Sua richiesta</h2>
      <p>
        Nella pagina <Link to="/contatti">Contatti</Link> è disponibile una mappa fornita da OpenStreetMap. La mappa non viene caricata
        automaticamente: compare solo dopo il clic sul pulsante “Mostra la mappa”. Da quel momento il Suo browser si collega ai server
        della OpenStreetMap Foundation, che riceve il Suo indirizzo IP e può utilizzare tecnologie proprie secondo la sua{" "}
        <a href="https://osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener noreferrer">
          informativa sulla privacy
        </a>
        .
      </p>

      <h2>Come gestire i cookie dal browser</h2>
      <p>
        Può in ogni momento cancellare o bloccare cookie e dati dei siti dalle impostazioni del Suo browser. Il blocco non impedisce
        l’uso di questo sito.
      </p>

      <h2>Contatti</h2>
      <p>
        Per qualsiasi domanda può scrivere a <a href={mailto}>{business.email}</a>. Per il trattamento dei dati personali si veda la{" "}
        <Link to="/privacy">Privacy Policy</Link>.
      </p>
    </LegalPage>
  )
}
