export function addDefaults<Config>(
  config: Partial<Config>,
  defaults: Config,
): Config {
  return { ...defaults, config };
}
