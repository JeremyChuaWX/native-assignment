import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import type { Env } from "./env.provider";
import { ENV_PROVIDER } from "./env.provider";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const env: Env = app.get(ENV_PROVIDER);
    await app.listen(env.port);
}

bootstrap();
