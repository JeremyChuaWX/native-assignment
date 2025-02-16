import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { EnvProvider } from "./env.provider";
import { BridgeService } from "./bridge.service";

@Module({
    controllers: [AppController],
    providers: [EnvProvider, BridgeService],
})
export class AppModule {}
