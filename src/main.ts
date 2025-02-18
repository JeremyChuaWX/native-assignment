import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import type { Config } from "src/config/config.provider";
import { CONFIG_PROVIDER } from "src/config/config.provider";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix("/api");
    const config: Config = app.get(CONFIG_PROVIDER);
    await app.listen(config.SERVER_PORT, () => {
        console.log(`listening on port ${config.SERVER_PORT}`);
    });
}

bootstrap();
