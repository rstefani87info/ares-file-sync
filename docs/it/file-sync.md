# Documentazione @ares/file-sync

## Scopo

Sincronizza i file tra directories o per singolo file link

## Installazione

```bash
yarn add @ares/file-sync
```

In un monorepo Yarn Workspaces:

```bash
yarn workspace <app> add @ares/file-sync
```

## Quickstart

Esempio minimale:

```js
import * as mod from "@ares/file-sync";
```

## API pubbliche (exports)

Questa sezione documenta la superficie pubblica reale a livello di entrypoint e simboli principali.

Entrypoint root:

- `@ares/file-sync`

File principali nel root del package (indicativi):

- `index.js`

Export individuati in `index.*`:

- `sync`

## Configurazione (appSetup / config / policies)

Questo modulo può leggere configurazioni da `appSetup`, `config` o `policies` a seconda del tipo. Documenta qui le chiavi effettivamente consumate quando stabilizzi il contract.

## Test

Esecuzione test del modulo (se presenti):

```bash
yarn workspace @ares/file-sync test
```

## Note

- Questo documento è mantenuto in parallelo ai ticket del modulo.

## Appendice (contenuto precedente)

## Descrizione

Il modulo `@ares/file-sync` fornisce funzionalità avanzate per la sincronizzazione di file e directory in tempo reale, con supporto per il monitoraggio delle modifiche e sincronizzazione bidirezionale.

## Installazione

```bash
npm install @ares/file-sync
```

## Caratteristiche Principali

### Sincronizzazione File e Directory
- Sincronizzazione automatica tra sorgente e destinazione
- Supporto per file singoli e directory complete
- Monitoraggio in tempo reale delle modifiche
- Sincronizzazione bidirezionale opzionale
- Gestione intelligente dei conflitti

### Funzioni Principali

#### `sync(source, target, options, parentDirSync)`
Funzione principale per avviare la sincronizzazione tra sorgente e destinazione.

**Parametri:**
- `source` (string) - Percorso sorgente (file o directory)
- `target` (string) - Percorso destinazione
- `options` (object) - Opzioni di configurazione
- `parentDirSync` (object) - Configurazione directory padre

**Ritorna:** Oggetto di controllo della sincronizzazione

#### `processDirectoryFiles(source, target, options, parentDirSync)`
Processa i file di una directory per la sincronizzazione.

**Parametri:**
- `source` (string) - Directory sorgente
- `target` (string) - Directory destinazione
- `options` (object) - Opzioni di sincronizzazione
- `parentDirSync` (object) - Configurazione directory padre

**Ritorna:** Array di sincronizzazioni dei file

## Utilizzo

### Sincronizzazione Base

```javascript
import { sync } from '@ares/file-sync';

// Sincronizzazione di un file singolo
const fileSync = sync('./source/file.txt', './target/file.txt');

// Sincronizzazione di una directory
const dirSync = sync('./source-dir', './target-dir');
```

### Sincronizzazione con Opzioni

```javascript
import { sync } from '@ares/file-sync';

const options = {
    bidirectional: true,        // Sincronizzazione bidirezionale
    watchChanges: true,         // Monitora modifiche in tempo reale
    ignorePatterns: ['*.tmp'],  // Pattern di file da ignorare
    conflictResolution: 'newer' // Risoluzione conflitti
};

const syncControl = sync('./source', './target', options);
```

### Gestione della Sincronizzazione

```javascript
import { sync } from '@ares/file-sync';

try {
    const syncControl = sync('./source', './target');
    
    // La sincronizzazione è attiva
    console.log('Sincronizzazione avviata');
    
    // Per fermare la sincronizzazione (se implementato)
    // syncControl.stop();
    
} catch (error) {
    if (error.message.includes('Already syncing')) {
        console.log('Sincronizzazione già in corso per questo percorso');
    } else {
        console.error('Errore durante la sincronizzazione:', error.message);
    }
}
```

### Sincronizzazione Directory con Filtri

```javascript
import { sync } from '@ares/file-sync';

const parentDirSync = {
    ignore: ['node_modules', '.git', '*.log'],
    path: './source'
};

const options = {
    recursive: true,
    preserveTimestamps: true
};

const dirSync = sync('./source', './backup', options, parentDirSync);
```

## Caratteristiche Avanzate

### Monitoraggio in Tempo Reale
Utilizza la libreria `chokidar` per il monitoraggio efficiente delle modifiche ai file:

```javascript
// Il monitoraggio è automatico quando si avvia la sincronizzazione
const syncControl = sync('./watched-dir', './synced-dir', {
    watchChanges: true
});
```

### Gestione Hash MD5
Utilizza hash MD5 per rilevare modifiche e evitare sincronizzazioni non necessarie:

```javascript
// Gli hash vengono calcolati automaticamente per ogni file
// per determinare se è necessaria la sincronizzazione
```

### Prevenzione Sincronizzazioni Duplicate
Il sistema previene automaticamente sincronizzazioni duplicate dello stesso percorso:

```javascript
// Prima sincronizzazione - OK
const sync1 = sync('./source', './target1');

// Seconda sincronizzazione dello stesso source - Errore
try {
    const sync2 = sync('./source', './target2');
} catch (error) {
    console.log('Sincronizzazione già attiva per questo percorso');
}
```

## Gestione Errori

### Errori Comuni

```javascript
try {
    const syncControl = sync('./source', './target');
} catch (error) {
    switch (true) {
        case error.message.includes('Already syncing'):
            console.log('Sincronizzazione già in corso');
            break;
        case error.message.includes('ENOENT'):
            console.log('File o directory sorgente non trovata');
            break;
        case error.message.includes('EACCES'):
            console.log('Permessi insufficienti');
            break;
        default:
            console.error('Errore generico:', error.message);
    }
}
```

## Integrazione con Altri Moduli aReS

### Utilizzo con @ares/core
```javascript
import { getMD5Hash } from '@ares/core/crypto';
import { sync } from '@ares/file-sync';

// Gli hash MD5 vengono utilizzati internamente per il rilevamento modifiche
```

### Utilizzo con @ares/files
```javascript
import { getAbsolutePath, createDirectoryIfNotExists } from '@ares/files';
import { sync } from '@ares/file-sync';

// Le utilità di @ares/files vengono utilizzate internamente
```

## Dipendenze

- `@ares/core` - Framework principale aReS
- `@ares/files` - Gestione file
- `chokidar` - Monitoraggio filesystem

## Licenza

MIT

## Autore

Roberto Stefani

## Repository

[GitHub - ares-file-sync](https://github.com/rstefani87info/ares-file-sync)

## Note

Questo modulo è progettato per scenari di sviluppo e backup dove è necessaria la sincronizzazione automatica di file e directory. È particolarmente utile per:

- Backup automatici
- Sincronizzazione tra ambienti di sviluppo
- Distribuzione automatica di file
- Monitoraggio modifiche in tempo reale
