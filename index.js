/**
 * @author Roberto Stefani
 * @description Sincronizza i file tra directories o per singolo file link
 **/
import { getMD5Hash } from "@ares/core/crypto";
import { getAbsolutePath, createDirectoryIfNotExists, copyFile , getFileContent} from "@ares/files";


import chokidar from "chokidar";

const syncMap = {};

export function sync(source, target, options = {}, parentDirSync = {ignore:[]}) {

  source = getAbsolutePath(source);
  target = getAbsolutePath(target);
  const key = getMD5Hash(source + target);
  if (syncMap[key]) {
    throw new Error(
      `Already syncing ${source}: stop the existing sync to generate a new one`
    );
  }
  try {
    const sourceStat = fs.statSync(source);
    if (sourceStat.isDirectory()) {
      syncMap[key] = syncDirectory(source, target, options, parentDirSync);
    } else {
      syncMap[key] = syncFile(source, target, options);
    }
    return syncMap[key];
  } catch (error) {
    console.error(`Error syncing ${source} to ${target}: ${error.message}`);
  }
}
/**
 * Processa i file di una directory per la sincronizzazione
 * @param {string} source - Directory sorgente
 * @param {string} target - Directory destinazione
 * @param {Object} options - Opzioni di sincronizzazione
 * @param {Object} parentDirSync - Configurazione directory padre
 * @returns {Array} Array di sincronizzazioni dei file
 */
function processDirectoryFiles(source, target, options, parentDirSync) {
  const files = getFiles(source);
  // non deve andare proprio così
  parentDirSync.path = parentDirSync.path || source;
  return files.map((file) => 
    processSingleDirectoryFile(`${source}/${file}`, `${target}/${file}`, options, parentDirSync)
  ).filter(item => item !== null);
}

function processSingleDirectoryFile(source, target, options, parentDirSync) {
    if(options.useGitSettings){
        const gitIgnore = getFileContent(`${parentDirSync.path}/.gitignore`);
        if(gitIgnore){
            parentDirSync.ignore.push(...gitIgnore.split("\n").filter(item => item !== ""));
        }
    }
    const matchesSearchPattern = parentDirSync.ignore.find(item => matchSearchPathPattern(source, item));
    const matchesSearchRegex = parentDirSync.ignore.find(item => matchSearchPathRegex(source, item));
  if(parentDirSync.ignore.includes(source) || matchesSearchPattern || matchesSearchRegex) return null;
  return sync(source, target, options, parentDirSync);
}

function syncDirectory(source, target, options = {}, parentDirSync = {ignore:[]}) {
  try {
    createDirectoryIfNotExists(target, true);
    const subSync = processDirectoryFiles(source, target, options, parentDirSync);
    return {
      source,
      target,
      options,
      type: "directory",
      subSync,
    };
  } catch (error) {
    console.error(
      `Error syncing directory ${source} to ${target}: ${error.message}`
    );
  }
}
function syncFile(source, target, options = {}) {
  try {
    const watcher = chokidar.watch(source, {
      persistent: true,
    });
    watcher.on("change", (path) => {
      console.log(`📝 Modified File : ${path}`);
      copyFile(path, target);
    });
    if (options.bidirectional) {
      const bidirectionalWatcher = chokidar.watch(target, {
        persistent: true,
      });
      bidirectionalWatcher.on("change", (path) => {
        const sourceContent = getFileContent(path);
        const targetContent = getFileContent(source);
        if (!sourceContent.equals(targetContent)) {
          console.log(`📝 Modified File : ${path}`);
          copyFile(path, source);
        }
      });
    }
    return {
      source,
      target,
      options,
      type: "file",
      watcher,
      bidirectionalWatcher,
    };
  } catch (error) {
    console.error(
      `Error syncing file ${source} to ${target}: ${error.message}`
    );
  }
}
