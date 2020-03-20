/**
 * Licensed under the MIT License.
 *
 * @author  Kanstantsin Kamkou (2ka.by)
 * @link    https://github.com/kkamkou/gelfjs
 * @license https://opensource.org/licenses/MIT
 */

import GfCollection from "./GfCollection";

export default interface GfcTransform {
  transform(collection: GfCollection): GfCollection;
}