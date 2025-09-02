import { Module } from '@nestjs/common';
import { BitcoinRpcService } from './bitcoin-rpc/bitcoin-rpc.service';
import { BlockProcessorService } from './block-processor/block-processor.service';

@Module({
  providers: [BitcoinRpcService, BlockProcessorService]
})
export class BlockchainModule {}
