interface MetaMaskProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, handler: (accounts: string[]) => void) => void;
  removeListener: (event: string, handler: (accounts: string[]) => void) => void;
  isConnected: () => boolean;
  selectedAddress: string | null;
  chainId: string;
  networkVersion: string;
  enable: () => Promise<string[]>;
  send: (method: string, params?: any[]) => Promise<any>;
}

declare global {
  interface Window {
    ethereum: MetaMaskProvider;
  }
} 