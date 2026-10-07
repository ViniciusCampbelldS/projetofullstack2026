import { Module } from '@nestjs/common';
import { RegraAvisoController } from '../controller/regra-aviso.controller';
import { RegraAvisoRepository } from '../repository/regra-aviso.repository';
import { RegraAvisoService } from '../service/regra-aviso.service';
import { JavaApiClientService } from '../service/java-api-client.service';

@Module({
    controllers: [RegraAvisoController],
    providers: [RegraAvisoService, RegraAvisoRepository, JavaApiClientService],
    exports: [RegraAvisoService, JavaApiClientService],
})
export class RegraAvisoModule {}