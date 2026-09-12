export const R6_PHASE: "CH-001R-r6";
export const SANDBOX_LAUNCH_OPTIONS: Readonly<{ headless: true; chromiumSandbox: true }>;

export interface ManagedBrowserResolution {
  path: string;
  requested_path: string;
  browsers_root: string;
  relative_path: string;
  revision: string;
  platform_directory: string;
  filename: string;
  sha256: string;
  mode: string;
  uid: number | null;
  gid: number | null;
  size_bytes: number;
}

export function resolveManagedBrowserExecutable(options: {
  playwrightExecutablePath: string;
  selectedExecutablePath?: string;
  browsersPath?: string;
  cwd?: string;
}): Promise<ManagedBrowserResolution>;

export function assertManagedBrowserIdentity(options: {
  resolution: ManagedBrowserResolution;
  playwrightExecutablePath: string;
  selectedExecutablePath?: string;
  browsersPath?: string;
  cwd?: string;
}): Promise<ManagedBrowserResolution>;
