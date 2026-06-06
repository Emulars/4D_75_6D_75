# Auguri di Compleanno per Mumu 🌻

Questo è un sito web statico, interattivo, romantico e **completamente sicuro/crittografato** creato per il compleanno della tua ragazza Mumu. 

Ogni componente multimediale privatissimo e dedica romantica è protetto tramite **crittografia simmetrica forte AES (Advanced Encryption Standard)** a 256 bit direttamente all'interno delle pagine lato client. Nessun estraneo, analizzando il codice sorgente o intercettando il traffico web, può recuperare la foto o il testo speciale senza inserire il passcode corretto.

---

## 📂 Come organizzare i file sul tuo Computer (per Netlify)

Per pubblicare con successo il sito su Netlify tramite caricamento manuale (Drag-and-Drop), devi ricreare la seguente struttura esatta sul tuo computer:

```text
📁 compleanno-mumu/          <-- Questa è la cartella principale da trascinare su Netlify
│
├── 📄 index.html             <-- Il file del sito web (generato da questo progetto)
│
└── 📁 assets/                <-- Cartella creata da te per i contenuti multimediali
    ├── 📸 foto-inizio.jpg    <-- Foto per la prima pagina (Polaroid nel lockscreen)
    └── 🎬 video-amore.mp4    <-- Il tuo video/foto privata decifrata (opzionale)
```

**⚠️ Regola d'oro sui percorsi (Attenzione a Netlify!):** 
Assicurati di usare percorsi relativi privi di punti iniziali nel nome della cartella. La tua cartella delle immagini **DEVE** chiamarsi esattamente `assets` (e non `.assets`, poiché Netlify ed altri sistemi web ignorano, cancellano o nascondono in automatico qualsiasi cartella che inizi con un punto). All'interno del generatore scrivi ad esempio `assets/foto-inizio.jpg` o `assets/video-amore.mp4`.

---

## 🔑 Informazioni di Sblocco
*   **Passcode impostato:** `081025` (6 cifre - data importante del vostro anniversario).
*   Inserendo questo codice sul tastierino sul sito, la libreria `CryptoJS` decifrerà istantaneamente i segreti d'amore inseriti nel codice e caricherà in memoria la tua dedica e la foto privata protetta.

---

## 🔐 Come personalizzare/cambiare i contenuti cifrati in futuro?

Abbiamo integrato uno speciale **Generatore Automatico Segreto** direttamente nel codice del sito. 

1. Apri il sito sul tuo computer o apri il link una volta pubblicato.
2. Aggiungi all'indirizzo url la stringa `?admin=true` (esempio: `http://localhost:3000/?admin=true` o `https://tuosito.netlify.app/?admin=true`).
3. Apparirà un pannello amministratore privato per inserire il passcode, cambiare foto, caricare video locali (es. `assets/video-amore.mp4`), scrivere lettere d'amore personali e premere il pulsante per cifrare.
4. Copia la stringa verde generata e incollala in `index.html` sostituendo il valore attuale di `const encryptedSecretPayload = "..."`.

---

## 🚀 Pubblicazione su Netlify (Drag-and-Drop)
1. Vai su [Netlify Drop](https://app.netlify.com/drop).
2. Trascina la cartella `compleanno-mumu` (contenente il file `index.html` e la sottocartella `assets` con le tue immagini locali).
3. Il sito sarà online in meno di 10 secondi e accessibile in modo sicuro da qualsiasi smartphone o computer!
