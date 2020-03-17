import CfgBuilder from "../../gelfjs/lib/CfgBuilder";
import AdrNull from "../../gelfjs/lib/AdrNull";

test('provide default presets', () => {
  const config = new CfgBuilder(new AdrNull()).build();
  expect(config.adapter()).toBeInstanceOf(AdrNull);
  expect(config.fields()).toHaveLength(0);
  expect(config.filters()).toHaveLength(0);
  expect(config.transformers()).toHaveLength(1);
});
