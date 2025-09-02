export interface BlockchainDataSource {
  getBlock(height: number): Promise<Block>;
  getTransaction(txid: string): Promise<Transaction>;
  getAddressInfo(address: string): Promise<AddressInfo>;
  getCurrentBlockHeight(): Promise<number>;
}
