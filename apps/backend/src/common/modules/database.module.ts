import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),

        // 엔티티 자동 로드
        entities: [__dirname + '/**/*.entity{.ts,.js}'],

        // 마이그레이션 설정
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        migrationsRun: false, // 수동으로 마이그레이션 실행

        // 개발 환경 설정
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',

        // 연결 풀 설정 (블록체인 대용량 데이터 처리)
        extra: {
          max: 20,
          min: 5,
          acquire: 60000,
          idle: 10000,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
