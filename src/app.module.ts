import { Module } from "@nestjs/common";
import { BridgeModule } from "./bridge/bridge.module";
import { ConfigModule } from "./config/config.module";

@Module({
    imports: [BridgeModule, ConfigModule],
})
export class AppModule {}
