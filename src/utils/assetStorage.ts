import { Asset } from 'expo-asset';
import { Directory, File, Paths } from 'expo-file-system';

/**
 * All persistent media (story covers, audio, comic pages, family photos)
 * lives under documentDirectory/media/<subdir>/. Files here survive app
 * restarts and are not cleared by the OS, unlike cache/picker temp files.
 */
const mediaRoot = new Directory(Paths.document, 'media');

function getMediaSubdirectory(subdir: string): Directory {
  const directory = new Directory(mediaRoot, subdir);

  if (!directory.exists) {
    directory.create({ intermediates: true, idempotent: true });
  }

  return directory;
}

/**
 * Copies a bundled asset (referenced via `require(...)`) into persistent
 * storage. Used for seeding the built-in sample stories/comics so they go
 * through the exact same storage path as content added later via Admin.
 *
 * Idempotent: if the destination file already exists, it is reused as-is.
 */
export async function copyBundledAssetToStorage(
  moduleId: number,
  subdir: string,
  fileName: string,
): Promise<string> {
  const directory = getMediaSubdirectory(subdir);
  const destination = new File(directory, fileName);

  if (destination.exists) {
    return destination.uri;
  }

  const asset = Asset.fromModule(moduleId);
  await asset.downloadAsync();

  if (!asset.localUri) {
    throw new Error(`Bundled asset could not be resolved: ${fileName}`);
  }

  const source = new File(asset.localUri);
  await source.copy(destination);

  return destination.uri;
}

/**
 * Copies a file from an external URI (e.g. an ImagePicker result, which
 * lives in a temporary cache location) into persistent storage.
 * Will be used by the Admin screens in the next phase.
 */
export async function copyExternalUriToStorage(
  uri: string,
  subdir: string,
  fileName: string,
): Promise<string> {
  const directory = getMediaSubdirectory(subdir);
  const destination = new File(directory, fileName);
  const source = new File(uri);

  await source.copy(destination, { overwrite: true });

  return destination.uri;
}

/**
 * Deletes a previously stored media file, if it exists. Safe to call on
 * paths that are no longer on disk.
 */
export function deleteStoredFile(uri: string): void {
  const file = new File(uri);

  if (file.exists) {
    file.delete();
  }
}
