import { Test, TestingModule } from '@nestjs/testing';
import { BlockProcessorService } from './block-processor.service';

describe('BlockProcessorService', () => {
  let service: BlockProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockProcessorService],
    }).compile();

    service = module.get<BlockProcessorService>(BlockProcessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
