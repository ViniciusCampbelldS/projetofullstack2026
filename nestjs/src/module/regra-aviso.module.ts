import { Module } from '@nestjs/common';
import { RegraAvisoController } from '../controller/regra-aviso.controller';
import { RegraAvisoRepository } from '../repository/regra-aviso.repository';
import { RegraAvisoService } from '../service/regra-aviso.service';

@Module({
    controllers: [RegraAvisoController],
    providers: [RegraAvisoService, RegraAvisoRepository],
    exports: [RegraAvisoService],
})
export class RegraAvisoModule {}