/* Dedupe:
 * Ensures that the same event id is not handled twice. Every
 * event based system should try to ensure delivery once AND ONLY ONCE.
 *
 * CACHE_SIZE = determines how many events we must handle until the
 * same event id is accepted again.
 */

const CACHE_SIZE = 512;

// Dedupe cache
let cache = [];

// Returns true if event is new, false if seen before
export default (id) => {
  if (cache.indexOf(id) < 0) {
    cache = [ id, ...cache.slice(0, CACHE_SIZE) ]
    return true;
  }
  return false;
}
