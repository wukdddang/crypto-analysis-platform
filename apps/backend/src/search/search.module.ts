import { Module } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch/elasticsearch.service';

@Module({
  providers: [ElasticsearchService]
})
export class SearchModule {}
