import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EnvProvider } from "./env.provider";
import { BridgeService } from "./bridge.service";

@Module({
    controllers: [AppController],
    providers: [EnvProvider, BridgeService, AppService],
})
export class AppModule {}
