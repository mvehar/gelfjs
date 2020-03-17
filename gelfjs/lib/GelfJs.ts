/**
 * Licensed under the MIT License.
 *
 * @author  Kanstantsin Kamkou (2ka.by)
 * @link    https://github.com/kkamkou/gelfjs
 * @license https://opensource.org/licenses/MIT
 */

import { forEach } from "lodash";

import Adapter from "./Adapter";
import CfgBuilder from "./CfgBuilder";
import CfgConfig from "./CfgConfig";
import GfcField, { TypeFieldValue } from "./GfcField";
import GfCollection from "./GfCollection";
import GfMessage from "./GfMessage";

export default class GelfJs {
  constructor(private readonly config: CfgConfig) {}

  send(message: GfMessage): Promise<unknown> {
    return this.config.adapter().send(message);
  }

  static Smart = class {
    private gelfJs: GelfJs;

    constructor(adapter: Adapter) {
      const config = new CfgBuilder(adapter).build();
      forEach(config.verbosity().levels(), (lvl, lvlName) => {
        (this as any)[lvlName] = (message: string, extra: {[k: string]: TypeFieldValue}):
          Promise<unknown> => this.message(message, lvl, extra)
      });
      forEach(config.verbosity().aliases(), (lvlName, alias) => {
        (this as any)[alias] = (this as any)[lvlName];
      });
      this.gelfJs = new GelfJs(config);
    }

    async message(
      message: string, level: number, extra: {[k: string]: TypeFieldValue}
    ): Promise<unknown> {
      let fields = GfCollection.fromObject(extra)
        .addAll(this.gelfJs.config.fields())
        .add(new GfcField('level', level))
        .add(new GfcField('short_message', message));

      try {
        for (const transformer of this.gelfJs.config.transformers()) {
          fields = await transformer.transform(fields);
        }
        await Promise.all(this.gelfJs.config.filters().map(filter => filter.accept(fields)));
      } catch (e) {
        return Promise.reject(e);
      }

      return this.gelfJs.send(new GfMessage(fields));
    }
  }
}
