export function addsDefault<Config>(
  config: Partial<Config>,
  defaults: Config,
): Config {
  return { ...config, ...defaults };
}
