# @ares/file-sync Documentation

## Purpose

Sincronizza i file tra directories o per singolo file link

## Installation

```bash
yarn add @ares/file-sync
```

In a Yarn Workspaces monorepo:

```bash
yarn workspace <app> add @ares/file-sync
```

## Quickstart

Minimal example:

```js
import * as mod from "@ares/file-sync";
```

## Public API (exports)

This section documents the actual public surface at entrypoint level and main exported symbols.

Root entrypoint:

- `@ares/file-sync`

Main files at package root (indicative):

- `index.js`

Exports detected in `index.*`:

- `sync`

## Configuration (appSetup / config / policies)

This module may read configuration from `appSetup`, `config`, or `policies` depending on the type. Document the actually consumed keys as you stabilize the contract.

## Test

Run module tests (if present):

```bash
yarn workspace @ares/file-sync test
```

## Notes

- This document is maintained alongside the module tickets.

## Appendix (previous content)

## Description

The `@ares/file-sync` module provides advanced functionality for real-time file and directory synchronization, with support for change monitoring and bidirectional synchronization.

## Installation

```bash
npm install @ares/file-sync
```

## Key Features

### File and Directory Synchronization
- Automatic synchronization between source and destination
- Support for single files and complete directories
- Real-time change monitoring
- Optional bidirectional synchronization
- Intelligent conflict management

### Main Functions

#### `sync(source, target, options, parentDirSync)`
Main function to start synchronization between source and destination.

**Parameters:**
- `source` (string) - Source path (file or directory)
- `target` (string) - Destination path
- `options` (object) - Configuration options
- `parentDirSync` (object) - Parent directory configuration

**Returns:** Synchronization control object

#### `processDirectoryFiles(source, target, options, parentDirSync)`
Processes directory files for synchronization.

**Parameters:**
- `source` (string) - Source directory
- `target` (string) - Destination directory
- `options` (object) - Synchronization options
- `parentDirSync` (object) - Parent directory configuration

**Returns:** Array of file synchronizations

## Usage

### Basic Synchronization

```javascript
import { sync } from '@ares/file-sync';

// Synchronize a single file
const fileSync = sync('./source/file.txt', './target/file.txt');

// Synchronize a directory
const dirSync = sync('./source-dir', './target-dir');
```

### Synchronization with Options

```javascript
import { sync } from '@ares/file-sync';

const options = {
    bidirectional: true,        // Bidirectional synchronization
    watchChanges: true,         // Monitor changes in real-time
    ignorePatterns: ['*.tmp'],  // File patterns to ignore
    conflictResolution: 'newer' // Conflict resolution
};

const syncControl = sync('./source', './target', options);
```

### Synchronization Management

```javascript
import { sync } from '@ares/file-sync';

try {
    const syncControl = sync('./source', './target');
    
    // Synchronization is active
    console.log('Synchronization started');
    
    // To stop synchronization (if implemented)
    // syncControl.stop();
    
} catch (error) {
    if (error.message.includes('Already syncing')) {
        console.log('Synchronization already in progress for this path');
    } else {
        console.error('Error during synchronization:', error.message);
    }
}
```

### Directory Synchronization with Filters

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

## Advanced Features

### Real-time Monitoring
Uses the `chokidar` library for efficient file change monitoring:

```javascript
// Monitoring is automatic when starting synchronization
const syncControl = sync('./watched-dir', './synced-dir', {
    watchChanges: true
});
```

### MD5 Hash Management
Uses MD5 hashes to detect changes and avoid unnecessary synchronizations:

```javascript
// Hashes are automatically calculated for each file
// to determine if synchronization is needed
```

### Duplicate Synchronization Prevention
The system automatically prevents duplicate synchronizations of the same path:

```javascript
// First synchronization - OK
const sync1 = sync('./source', './target1');

// Second synchronization of same source - Error
try {
    const sync2 = sync('./source', './target2');
} catch (error) {
    console.log('Synchronization already active for this path');
}
```

## Error Handling

### Common Errors

```javascript
try {
    const syncControl = sync('./source', './target');
} catch (error) {
    switch (true) {
        case error.message.includes('Already syncing'):
            console.log('Synchronization already in progress');
            break;
        case error.message.includes('ENOENT'):
            console.log('Source file or directory not found');
            break;
        case error.message.includes('EACCES'):
            console.log('Insufficient permissions');
            break;
        default:
            console.error('Generic error:', error.message);
    }
}
```

## Integration with Other aReS Modules

### Usage with @ares/core
```javascript
import { getMD5Hash } from '@ares/core/crypto';
import { sync } from '@ares/file-sync';

// MD5 hashes are used internally for change detection
```

### Usage with @ares/files
```javascript
import { getAbsolutePath, createDirectoryIfNotExists } from '@ares/files';
import { sync } from '@ares/file-sync';

// @ares/files utilities are used internally
```

## Dependencies

- `@ares/core` - Main aReS framework
- `@ares/files` - File management
- `chokidar` - Filesystem monitoring

## License

MIT

## Author

Roberto Stefani

## Repository

[GitHub - ares-file-sync](https://github.com/rstefani87info/ares-file-sync)

## Notes

This module is designed for development and backup scenarios where automatic file and directory synchronization is needed. It's particularly useful for:

- Automatic backups
- Synchronization between development environments
- Automatic file distribution
- Real-time change monitoring
