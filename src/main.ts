import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import type { Env } from "./env.provider";
import { ENV_PROVIDER } from "./env.provider";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix("/api");
    const env: Env = app.get(ENV_PROVIDER);
    await app.listen(env.SERVER_PORT, () => {
        console.log(`listening on port ${env.SERVER_PORT}`);
    });
}

bootstrap();
