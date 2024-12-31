# Next.js Chatbot with MySQL and OpenAI

Un'applicazione chatbot moderna costruita con Next.js, che utilizza MySQL per la persistenza dei dati e l'API di OpenAI per generare risposte intelligenti.

## Caratteristiche

- 🎨 Interfaccia utente moderna e reattiva con Tailwind CSS
- 💬 Chat in tempo reale con risposte AI
- 📚 Cronologia delle chat salvata in MySQL
- 🤖 Integrazione con OpenAI GPT-3.5
- 📱 Design responsive
- 🔄 Supporto per conversazioni multiple

## Tecnologie Utilizzate

- Next.js 13+ (App Router)
- TypeScript
- MySQL
- Prisma ORM
- OpenAI API
- Tailwind CSS

## Prerequisiti

- Node.js 16.8 o superiore
- MySQL (XAMPP o server MySQL standalone)
- Account OpenAI con API key

## Installazione

1. Clona il repository:
```bash
git clone https://github.com/justweb-s/next-chatbot-fullstack.git
cd next-chatbot-fullstack
```

2. Installa le dipendenze:
```bash
npm install
```

3. Crea un file `.env` nella root del progetto:
```env
DATABASE_URL="mysql://root:@localhost:3306/chat_db2"
OPENAI_API_KEY="your-openai-api-key"
```

4. Inizializza il database:
```bash
npx prisma generate
npx prisma db push
```

5. Avvia il server di sviluppo:
```bash
npm run dev
```

L'applicazione sarà disponibile all'indirizzo `http://localhost:3000`

## Struttura del Progetto

```
src/
├── app/                    # App Router di Next.js
│   ├── api/               # API Routes
│   ├── layout.tsx         # Layout principale
│   └── page.tsx           # Pagina principale
├── components/            # Componenti React
│   ├── ChatContainer.tsx  # Contenitore principale della chat
│   ├── ChatInput.tsx      # Input per i messaggi
│   ├── ChatList.tsx       # Lista delle chat
│   └── ChatMessage.tsx    # Componente messaggio
├── lib/                   # Utility e configurazioni
│   ├── prisma.ts         # Client Prisma
│   └── openai.ts         # Configurazione OpenAI
└── styles/               # Stili globali
    └── globals.css       # CSS globale con Tailwind
```

## Funzionalità

- **Chat Multiple**: Possibilità di avere multiple conversazioni
- **Persistenza**: Tutti i messaggi vengono salvati nel database MySQL
- **Risposte AI**: Integrazione con OpenAI per risposte intelligenti
- **UI Moderna**: Interface utente pulita e moderna con Tailwind CSS
- **Responsive**: Funziona su desktop e dispositivi mobili

## Licenza

MIT

## Autore

[justweb-s](https://github.com/justweb-s)
