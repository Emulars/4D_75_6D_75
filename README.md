# Quiz Exam website

Il sito web Quiz Exam è una piattaforma progettata per offrire agli utenti un modo interattivo e coinvolgente per mettere alla prova le proprie conoscenze su diverse materie. Il sito propone un'ampia gamma di quiz su vari argomenti, consentendo agli utenti di mettersi alla prova e migliorare la comprensione del materiale.

Il sito dovrà proporre una logica a quiz, per cui l'utente sceglierà una materia e successivamente l'utente potrà svolgere un quiz su tutti gli argomenti insieme, oppure scegliere un argomento specificio e svolgere un quiz su quell'argomento. Al termine del quiz, l'utente riceverà un punteggio ed un report per migliorare la propria comprensione.
Le domande dovranno essere riordinate ogni volta che si svolge un quiz, in modo da rendere l'esperienza più dinamica e stimolante.

Ogni volta che l'utente conferma la selezione della risposta alla domanda, il sito fornirà un feedback immediato, indicando se la risposta è corretta o errata. In caso di risposta errata, il sito mostrerà la risposta corretta e una breve spiegazione per aiutare l'utente a comprendere meglio l'argomento.

Le domande saranno fornite al progetto come file JSON, che conterrà tutte le informazioni necessarie per la creazione dei quiz, come le domande, le opzioni di risposta e le risposte corrette. Esempio:

```json
{
  "materia": "Matematica",
  "argomenti": [
    {
      "argomento": "Algebra",
      "domande": [
        {
          "testo": "Qual è la soluzione dell'equazione x + 2 = 5?",
          "opzioni": ["x = 1", "x = 2", "x = 3", "x = 4"],
          "risposta_corretta": "x = 3"
        },
        {
          "testo": "Qual è il risultato di (2 + 3) * 4?",
          "opzioni": ["20", "25", "30", "35"],
          "risposta_corretta": "20"
        }
      ]
    },
    {
      "argomento": "Geometria",
      "domande": [
        {
          "testo": "Qual è la formula per calcolare l'area di un cerchio?",
          "opzioni": ["A = πr^2", "A = 2πr", "A = πd", "A = r^2"],
          "risposta_corretta": "A = πr^2"
        },
        {
          "testo": "Qual è la somma degli angoli interni di un triangolo?",
          "opzioni": ["180 gradi", "360 gradi", "90 gradi", "270 gradi"],
          "risposta_corretta": "180 gradi"
        }
      ]
    }
  ]
}
```

Il sito deve funzionare su Git Pages, quindi è necessario che sia sviluppato utilizzando solo HTML, CSS e JavaScript, senza l'uso di framework o librerie esterne. Il sito deve essere responsive, in modo da garantire una buona esperienza utente su dispositivi di diverse dimensioni, come smartphone, tablet e desktop.

# Setup locale
Per eseguire il sito web Quiz Exam in locale, è necessario seguire questi passaggi:

1. Apri un terminale nella cartella progetto.
2. Esegui: python -m http.server 8000
3. Apri un browser web e vai all'indirizzo: http://localhost:8000